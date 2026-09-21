<?php

namespace App\Http\Controllers\Customer;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod as PaymentMethodEnum;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use App\Models\Menu;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PaymentMethod;
use App\Services\MidtransService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    /**
     * Display checkout page for customer.
     */
    public function index(): Response
    {
        $bankTransferMethods = PaymentMethod::query()
            ->where('category', 'bank_transfer')
            ->where('is_active', true)
            ->get();

        $eWalletMethods = PaymentMethod::query()
            ->where('category', 'ewallet')
            ->where('is_active', true)
            ->get();

        $appFee = (float) AppSetting::get('app_fee', '1000');

        $isProduction = config('midtrans.is_production', false);
        $snapUrl = $isProduction
            ? 'https://app.midtrans.com/snap/snap.js'
            : 'https://app.sandbox.midtrans.com/snap/snap.js';

        return Inertia::render('customer/checkout/index', [
            'bankTransferMethods' => $bankTransferMethods,
            'eWalletMethods' => $eWalletMethods,
            'appFee' => $appFee,
            'midtransClientKey' => config('midtrans.client_key'),
            'midtransSnapUrl' => $snapUrl,
        ]);
    }

    /**
     * Store new checkout order and generate Midtrans Snap Token if cashless.
     */
    public function store(Request $request, MidtransService $midtransService): JsonResponse
    {
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.menu_id' => ['required', 'exists:menus,id'],
            'items.*.qty' => ['required', 'integer', 'min:1'],
            'items.*.price' => ['required', 'numeric', 'min:0'],
            'items.*.choices' => ['nullable', 'array'],
            'items.*.note' => ['nullable', 'string', 'max:255'],
            'payment_method' => ['required', 'in:cashless,cash'],
            'payment_channel_code' => ['nullable', 'string'],
            'dining_option' => ['required', 'in:dine_in,takeaway'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        $user = $request->user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $appFee = (float) AppSetting::get('app_fee', '1000');

        // Group item rows by menu's tenant_id and validate tenant/menu status
        $itemsByTenant = [];
        foreach ($validated['items'] as $itemData) {
            $menu = Menu::with('tenant')->find($itemData['menu_id']);
            if (! $menu) {
                continue;
            }

            if (! $menu->is_available) {
                return response()->json([
                    'message' => "Menu '{$menu->name}' sedang tidak tersedia.",
                ], 422);
            }

            $tenant = $menu->tenant;
            if (! $tenant || ! $tenant->is_active || ! $tenant->is_open) {
                $tenantName = $tenant ? $tenant->name : 'Stand Kantin';

                return response()->json([
                    'message' => "Stand '{$tenantName}' sedang tutup. Silakan hapus item dari stand ini untuk melanjutkan.",
                ], 422);
            }

            $tenantId = $menu->tenant_id;
            if (! isset($itemsByTenant[$tenantId])) {
                $itemsByTenant[$tenantId] = [];
            }
            $itemsByTenant[$tenantId][] = [
                'menu' => $menu,
                'qty' => (int) $itemData['qty'],
                'price' => (float) $itemData['price'],
                'choices' => $itemData['choices'] ?? [],
                'note' => $itemData['note'] ?? null,
            ];
        }

        if (empty($itemsByTenant)) {
            return response()->json(['message' => 'Tidak ada item menu valid dalam keranjang.'], 422);
        }

        $createdOrders = [];

        DB::transaction(function () use (
            $validated,
            $user,
            $appFee,
            $itemsByTenant,
            &$createdOrders
        ) {
            $paymentMethodEnum = $validated['payment_method'] === 'cash'
                ? PaymentMethodEnum::Cash
                : PaymentMethodEnum::Cashless;

            $channelCode = $validated['payment_channel_code'] ?? null;
            $paymentMethodModel = null;
            if ($channelCode) {
                $paymentMethodModel = PaymentMethod::where('code', $channelCode)->first();
            }

            foreach ($itemsByTenant as $tenantId => $tenantItems) {
                $subtotal = 0;
                foreach ($tenantItems as $ti) {
                    $subtotal += $ti['price'];
                }

                // App fee is 0 for cash payment, otherwise global app fee
                $effectiveAppFee = ($paymentMethodEnum === PaymentMethodEnum::Cash) ? 0.0 : $appFee;

                // Calculate channel fee for this tenant order
                $channelFee = 0;
                if ($paymentMethodEnum === PaymentMethodEnum::Cashless && $paymentMethodModel) {
                    if ($paymentMethodModel->fee_type === 'fixed') {
                        $channelFee = (float) $paymentMethodModel->fee_amount;
                    } else {
                        $channelFee = round(($subtotal * (float) $paymentMethodModel->fee_amount) / 100, 2);
                    }
                }

                $totalAmount = $subtotal + $effectiveAppFee + $channelFee;

                $orderNumber = 'ORD-'.date('Ymd').'-'.strtoupper(Str::random(6));
                $pickupCode = 'PKP-'.rand(100, 999);

                $order = Order::create([
                    'order_number' => $orderNumber,
                    'pickup_code' => $pickupCode,
                    'user_id' => $user->id,
                    'tenant_id' => $tenantId,
                    'subtotal_amount' => $subtotal,
                    'app_fee' => $effectiveAppFee,
                    'channel_fee' => $channelFee,
                    'total_amount' => $totalAmount,
                    'payment_method' => $paymentMethodEnum,
                    'payment_channel_code' => $channelCode,
                    'dining_option' => $validated['dining_option'],
                    'payment_status' => PaymentStatus::Unpaid,
                    'status' => OrderStatus::Pending,
                    'notes' => $validated['notes'] ?? null,
                ]);

                foreach ($tenantItems as $ti) {
                    $menuObj = $ti['menu'];
                    OrderItem::create([
                        'order_id' => $order->id,
                        'menu_id' => $menuObj->id,
                        'menu_name' => $menuObj->name,
                        'price' => $ti['price'] / $ti['qty'],
                        'quantity' => $ti['qty'],
                        'subtotal' => $ti['price'],
                        'options' => $ti['choices'],
                        'note' => $ti['note'],
                    ]);
                }

                $createdOrders[] = $order;
            }
        });

        $primaryOrder = $createdOrders[0] ?? null;
        $paymentInfo = null;

        if ($primaryOrder && $validated['payment_method'] === 'cashless') {
            $channelCode = $validated['payment_channel_code'] ?? 'qris';
            foreach ($createdOrders as $ord) {
                try {
                    $details = $midtransService->chargeCoreApi($ord, $channelCode);
                    $ord->update(['payment_details' => $details]);
                    if ($ord->id === $primaryOrder->id) {
                        $paymentInfo = $details;
                    }
                } catch (Exception $e) {
                    // Fallback payment details array if charge error
                    $fallbackDetails = [
                        'type' => $channelCode === 'qris' ? 'qris' : 'bank_transfer',
                        'channel_code' => $channelCode,
                        'channel_name' => strtoupper($channelCode),
                        'va_number' => '82710'.sprintf('%08d', $ord->id + 1000),
                        'qr_url' => 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=MIDTRANS-'.$ord->order_number,
                    ];
                    $ord->update(['payment_details' => $fallbackDetails]);
                    if ($ord->id === $primaryOrder->id) {
                        $paymentInfo = $fallbackDetails;
                    }
                }
            }
        }

        $redirectUrl = $primaryOrder
            ? route('orders.payment', $primaryOrder->id)
            : route('orders.index');

        return response()->json([
            'success' => true,
            'message' => 'Pesanan berhasil dibuat.',
            'orders' => $createdOrders,
            'primary_order_id' => $primaryOrder?->id,
            'payment_info' => $paymentInfo,
            'redirect_url' => $redirectUrl,
        ]);
    }

    /**
     * Display dedicated payment page for a specific customer order.
     */
    public function payment(Order $order): Response
    {
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        $order->checkAutoExpire();
        $order->load(['tenant', 'items.menu']);

        $expiryMinutes = $order->payment_method === PaymentMethodEnum::Cash ? 15 : 10;
        $expiresAt = $order->created_at ? $order->created_at->copy()->addMinutes($expiryMinutes)->toIso8601String() : null;

        return Inertia::render('customer/orders/payment', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'pickup_code' => $order->pickup_code,
                'qr_md5' => md5("CANTEEN:{$order->order_number}:{$order->pickup_code}"),
                'status' => $order->status->value,
                'payment_status' => $order->payment_status->value,
                'payment_method' => $order->payment_method->value,
                'payment_channel_code' => $order->payment_channel_code,
                'dining_option' => $order->dining_option,
                'subtotal_amount' => (float) $order->subtotal_amount,
                'app_fee' => (float) $order->app_fee,
                'channel_fee' => (float) $order->channel_fee,
                'total_amount' => (float) $order->total_amount,
                'created_at' => $order->created_at ? $order->created_at->format('d M Y, H:i') : '',
                'expires_at' => $expiresAt,
                'is_expired' => $order->isExpired(),
                'notes' => $order->notes,
                'payment_details' => $order->payment_details,
                'tenant' => [
                    'id' => $order->tenant->id,
                    'name' => $order->tenant->name,
                ],
                'items' => $order->items->map(fn ($item) => [
                    'id' => $item->id,
                    'menu_name' => $item->menu_name,
                    'price' => (float) $item->price,
                    'quantity' => $item->quantity,
                    'subtotal' => (float) $item->subtotal,
                    'options' => $item->options,
                    'note' => $item->note,
                ]),
            ],
        ]);
    }
}
