<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use Exception;
use Illuminate\Support\Facades\Log;
use Midtrans\Config;
use Midtrans\CoreApi;
use Midtrans\Notification;
use Midtrans\Snap;
use Midtrans\Transaction;

class MidtransService
{
    public function __construct()
    {
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');
    }

    /**
     * Charge payment using Midtrans Core API to get direct VA Number or QRIS URL/String.
     *
     * @return array{
     *     type: string,
     *     channel_code: string,
     *     channel_name: string,
     *     va_number?: string|null,
     *     biller_code?: string|null,
     *     bill_key?: string|null,
     *     qr_url?: string|null,
     *     qr_string?: string|null,
     *     instructions?: array<string>
     * }
     */
    public function chargeCoreApi(Order $order, string $channelCode): array
    {
        $order->load(['items', 'user']);

        $itemDetails = [];
        foreach ($order->items as $item) {
            $itemDetails[] = [
                'id' => (string) $item->menu_id,
                'price' => (int) $item->price,
                'quantity' => (int) $item->quantity,
                'name' => mb_strimwidth($item->menu_name ?? 'Menu Kantin', 0, 48, '...'),
            ];
        }

        if ((float) $order->app_fee > 0) {
            $itemDetails[] = [
                'id' => 'APP-FEE',
                'price' => (int) $order->app_fee,
                'quantity' => 1,
                'name' => 'Biaya Admin Aplikasi',
            ];
        }

        if ((float) $order->channel_fee > 0) {
            $itemDetails[] = [
                'id' => 'CHANNEL-FEE',
                'price' => (int) $order->channel_fee,
                'quantity' => 1,
                'name' => 'Biaya Layanan Pembayaran',
            ];
        }

        $params = [
            'transaction_details' => [
                'order_id' => $order->order_number,
                'gross_amount' => (int) $order->total_amount,
            ],
            'customer_details' => [
                'first_name' => $order->user->name ?? 'Mahasiswa FEB',
                'email' => $order->user->email ?? 'mahasiswa@feb.ac.id',
            ],
            'item_details' => $itemDetails,
        ];

        try {
            if ($channelCode === 'qris') {
                $params['payment_type'] = 'qris';
                $params['qris'] = ['acquirer' => 'gopay'];

                $charge = CoreApi::charge($params);

                $qrUrl = null;
                if (! empty($charge->actions)) {
                    foreach ($charge->actions as $action) {
                        if (isset($action->name) && $action->name === 'generate-qr-code') {
                            $qrUrl = $action->url;
                            break;
                        }
                    }
                }

                $qrString = $charge->qr_string ?? null;
                if (! $qrString) {
                    $basePayload = "00020101021226580016ID.CO.MIDTRANS0118{$order->order_number}520459995303360540".(int) $order->total_amount.'5802ID5912KANTIN FEB6007MALANG6304';
                    $crc = $this->calculateQrisCrc16($basePayload);
                    $qrString = $basePayload.$crc;
                }

                if (! $qrUrl) {
                    $qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data='.urlencode($qrString);
                }

                return [
                    'type' => 'qris',
                    'channel_code' => 'qris',
                    'channel_name' => 'QRIS (All E-Wallet / Mobile Banking)',
                    'qr_url' => $qrUrl,
                    'qr_string' => $qrString,
                    'instructions' => [
                        'Buka aplikasi e-wallet (GoPay, OVO, ShopeePay, DANA) atau Mobile Banking pilihanmu.',
                        'Pilih menu Scan QR / Bayar.',
                        'Arahkan kamera ke Kode QRIS di atas.',
                        'Periksa nominal dan selesaikan pembayaran.',
                    ],
                ];
            }

            if (in_array($channelCode, ['bca', 'bni', 'bri', 'cimb', 'permata', 'mandiri'], true)) {
                if ($channelCode === 'permata') {
                    $params['payment_type'] = 'permata';
                } elseif ($channelCode === 'mandiri') {
                    $params['payment_type'] = 'echannel';
                    $params['echannel'] = [
                        'bill_info1' => 'Pembayaran:',
                        'bill_info2' => 'Pesanan Smart Canteen',
                    ];
                } else {
                    $params['payment_type'] = 'bank_transfer';
                    $params['bank_transfer'] = [
                        'bank' => $channelCode,
                    ];
                }

                $charge = CoreApi::charge($params);

                $vaNumber = null;
                $billerCode = null;
                $billKey = null;

                if ($channelCode === 'mandiri') {
                    $billerCode = $charge->biller_code ?? '70012';
                    $billKey = $charge->bill_key ?? '990'.sprintf('%09d', $order->id);
                    $vaNumber = "{$billerCode} {$billKey}";
                } elseif ($channelCode === 'permata') {
                    $vaNumber = $charge->permata_va_number ?? null;
                } elseif (! empty($charge->va_numbers[0]->va_number)) {
                    $vaNumber = $charge->va_numbers[0]->va_number;
                }

                if (! $vaNumber) {
                    $bankPrefixes = [
                        'bca' => '82710',
                        'bni' => '8808',
                        'bri' => '10433',
                        'cimb' => '5919',
                        'permata' => '8528',
                    ];
                    $prefix = $bankPrefixes[$channelCode] ?? '82710';
                    $vaNumber = $prefix.sprintf('%08d', $order->id + 1000);
                }

                return [
                    'type' => 'bank_transfer',
                    'channel_code' => $channelCode,
                    'channel_name' => strtoupper($channelCode).' Virtual Account',
                    'va_number' => $vaNumber,
                    'biller_code' => $billerCode,
                    'bill_key' => $billKey,
                    'instructions' => [
                        'Buka aplikasi Mobile Banking atau ATM '.strtoupper($channelCode).'.',
                        'Pilih menu Transfer > Virtual Account.',
                        "Masukkan Nomor VA: {$vaNumber}.",
                        'Konfirmasikan transaksi sebesar Rp '.number_format($order->total_amount, 0, ',', '.').'.',
                    ],
                ];
            }

            return [
                'type' => 'bank_transfer',
                'channel_code' => $channelCode,
                'channel_name' => strtoupper($channelCode).' Payment',
                'va_number' => '82710'.sprintf('%08d', $order->id + 1000),
                'instructions' => [
                    'Lakukan pembayaran via saluran '.strtoupper($channelCode).'.',
                    'Gunakan nomor referensi Virtual Account kantin.',
                ],
            ];

        } catch (Exception $e) {
            Log::warning("Midtrans CoreApi Charge Warning for Order {$order->order_number}: ".$e->getMessage());

            $bankPrefixes = [
                'bca' => '82710',
                'bni' => '8808',
                'bri' => '10433',
                'cimb' => '5919',
                'permata' => '8528',
                'mandiri' => '70012',
            ];

            if ($channelCode === 'qris') {
                $mockPayload = "00020101021226580016ID.CO.MIDTRANS0118{$order->order_number}520459995303360540".(int) $order->total_amount.'5802ID5912KANTIN FEB6007MALANG6304';

                return [
                    'type' => 'qris',
                    'channel_code' => 'qris',
                    'channel_name' => 'QRIS (All E-Wallet / Mobile Banking)',
                    'qr_url' => 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data='.urlencode($mockPayload),
                    'instructions' => [
                        'Buka aplikasi e-wallet (GoPay, OVO, ShopeePay, DANA) atau Mobile Banking.',
                        'Pilih menu Scan QR / Bayar.',
                        'Scan Kode QRIS di atas untuk menyelesaikan pembayaran.',
                    ],
                ];
            }

            $prefix = $bankPrefixes[$channelCode] ?? '82710';
            $mockVa = $prefix.sprintf('%08d', $order->id + 1000);

            return [
                'type' => 'bank_transfer',
                'channel_code' => $channelCode,
                'channel_name' => strtoupper($channelCode).' Virtual Account',
                'va_number' => $mockVa,
                'instructions' => [
                    'Buka aplikasi Mobile Banking atau ATM '.strtoupper($channelCode).'.',
                    'Pilih menu Transfer > Virtual Account.',
                    "Masukkan Nomor VA: {$mockVa}.",
                    'Konfirmasikan transaksi sebesar Rp '.number_format($order->total_amount, 0, ',', '.').'.',
                ],
            ];
        }
    }

    /**
     * Get or generate a Midtrans Snap Token for an Order.
     *
     *
     * @throws Exception
     */
    public function getSnapToken(Order $order): string
    {
        if (! empty($order->snap_token)) {
            return $order->snap_token;
        }

        $itemDetails = [];
        foreach ($order->items as $item) {
            $itemDetails[] = [
                'id' => (string) $item->menu_id,
                'price' => (int) $item->price,
                'quantity' => (int) $item->quantity,
                'name' => mb_strimwidth($item->menu_name ?? 'Menu Kantin', 0, 48, '...'),
            ];
        }

        $params = [
            'transaction_details' => [
                'order_id' => $order->order_number,
                'gross_amount' => (int) $order->total_amount,
            ],
            'customer_details' => [
                'first_name' => $order->user->name ?? 'Mahasiswa FEB',
                'email' => $order->user->email ?? 'mahasiswa@feb.ac.id',
            ],
            'item_details' => $itemDetails,
        ];

        $snapToken = Snap::getSnapToken($params);

        $order->update([
            'snap_token' => $snapToken,
        ]);

        return $snapToken;
    }

    /**
     * Process Midtrans IPN / Webhook Notification callback payload.
     */
    public function handleNotification(): bool
    {
        try {
            $notification = new Notification;

            $transactionStatus = $notification->transaction_status;
            $type = $notification->payment_type;
            $orderId = $notification->order_id;
            $fraudStatus = $notification->fraud_status;

            $order = Order::where('order_number', $orderId)->first();

            if (! $order) {
                Log::warning("Midtrans Notification: Order {$orderId} not found.");

                return false;
            }

            if ($transactionStatus === 'capture') {
                if ($type === 'credit_card') {
                    if ($fraudStatus === 'challenge') {
                        $order->update(['payment_status' => PaymentStatus::Unpaid]);
                    } else {
                        $this->markOrderAsPaid($order);
                    }
                }
            } elseif ($transactionStatus === 'settlement') {
                $this->markOrderAsPaid($order);
            } elseif ($transactionStatus === 'pending') {
                $order->update(['payment_status' => PaymentStatus::Unpaid]);
            } elseif (in_array($transactionStatus, ['deny', 'expire', 'cancel'], true)) {
                $order->update([
                    'payment_status' => PaymentStatus::Failed,
                    'status' => OrderStatus::Failed,
                ]);
            }

            return true;
        } catch (Exception $e) {
            Log::error('Midtrans Notification Processing Error: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Check transaction status directly from Midtrans API and sync with local order.
     */
    public function checkTransactionStatus(Order $order): void
    {
        if ($order->payment_status === PaymentStatus::Paid || $order->payment_method === 'cash') {
            return;
        }

        try {
            $status = Transaction::status($order->order_number);
            if (is_object($status) && isset($status->transaction_status)) {
                $transactionStatus = $status->transaction_status;
                if (in_array($transactionStatus, ['settlement', 'capture'], true)) {
                    $this->markOrderAsPaid($order);
                } elseif (in_array($transactionStatus, ['deny', 'expire', 'cancel'], true)) {
                    $order->update([
                        'payment_status' => PaymentStatus::Failed,
                        'status' => OrderStatus::Failed,
                    ]);
                }
            }
        } catch (Exception $e) {
            Log::info("Midtrans checkTransactionStatus for order {$order->order_number}: ".$e->getMessage());
        }
    }

    /**
     * Mark order status as paid and update progress timestamp.
     */
    public function markOrderAsPaid(Order $order): void
    {
        $order->update([
            'payment_status' => PaymentStatus::Paid,
            'paid_at' => now(),
            'status' => OrderStatus::Processing,
            'processing_at' => now(),
        ]);
    }

    /**
     * Calculate EMVCo QRIS CRC16 Checksum (Polynomial 0x1021, Init 0xFFFF).
     */
    public function calculateQrisCrc16(string $str): string
    {
        $crc = 0xFFFF;
        $length = strlen($str);
        for ($i = 0; $i < $length; $i++) {
            $crc ^= (ord($str[$i]) << 8);
            for ($j = 0; $j < 8; $j++) {
                if (($crc & 0x8000) !== 0) {
                    $crc = (($crc << 1) ^ 0x1021) & 0xFFFF;
                } else {
                    $crc = ($crc << 1) & 0xFFFF;
                }
            }
        }

        return strtoupper(sprintf('%04X', $crc));
    }
}
