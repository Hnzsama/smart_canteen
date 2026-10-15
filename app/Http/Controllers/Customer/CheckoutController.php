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
use App\Models\Tenant;
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

        $tenants = Tenant::query()
            ->where('is_active', true)
            ->get(['id', 'name', 'slug', 'is_open', 'is_active', 'midtrans_is_active', 'midtrans_client_key', 'midtrans_server_key', 'midtrans_is_production'])
            ->map(fn ($t) => [
                'id' => $t->id,
                'name' => $t->name,
                'slug' => $t->slug,
                'is_open' => (bool) $t->is_open,
                'has_midtrans' => $t->hasActiveMidtrans(),
                'midtrans_client_key' => $t->midtrans_client_key,
            ]);

        return Inertia::render('customer/checkout/index', [
            'bankTransferMethods' => $bankTransferMethods,
            'eWalletMethods' => $eWalletMethods,
            'appFee' => $appFee,
            'tenants' => $tenants,
        ]);
    }

    /**
     * Store new checkout order with single-tenant enforcement and centralized fee calculation.
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

        // Validate that all items belong to a single tenant
        $tenantIds = [];
        $preparedItems = [];
        $subtotal = 0;

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
                    'message' => "Stand '{$tenantName}' sedang tutup. Silakan periksa kembali keranjang Anda.",
                ], 422);
            }

            $tenantIds[$menu->tenant_id] = true;
            $itemPrice = (float) $itemData['price'];
            $subtotal += $itemPrice;

            $preparedItems[] = [
                'menu' => $menu,
                'qty' => (int) $itemData['qty'],
                'price' => $itemPrice,
                'choices' => $itemData['choices'] ?? [],
                'note' => $itemData['note'] ?? null,
            ];
        }

        if (count($tenantIds) > 1) {
            return response()->json([
                'message' => 'Pesanan hanya dapat memuat menu dari 1 stand kantin per transaksi.',
            ], 422);
        }

        if (empty($preparedItems)) {
            return response()->json(['message' => 'Tidak ada item menu valid dalam keranjang.'], 422);
        }

        $tenantId = array_key_first($tenantIds);
        $tenant = Tenant::findOrFail($tenantId);

        // Enforce payment method compatibility with tenant's Midtrans configuration
        $paymentMethodEnum = $validated['payment_method'] === 'cash'
            ? PaymentMethodEnum::Cash
            : PaymentMethodEnum::Cashless;

        if ($paymentMethodEnum === PaymentMethodEnum::Cashless && ! $tenant->hasActiveMidtrans()) {
            return response()->json([
                'message' => "Stand '{$tenant->name}' saat ini hanya melayani pembayaran Tunai (Cash di Stand).",
            ], 422);
        }

        // Centralized Fee Governance (Admin Controlled)
        $appFee = ($paymentMethodEnum === PaymentMethodEnum::Cash)
            ? 0.0
            : (float) AppSetting::get('app_fee', '1000');

        $channelCode = $validated['payment_channel_code'] ?? null;
        $channelFee = 0.0;

        if ($paymentMethodEnum === PaymentMethodEnum::Cashless && $channelCode) {
            $paymentMethodModel = PaymentMethod::where('code', $channelCode)->where('is_active', true)->first();
            if ($paymentMethodModel) {
                if ($paymentMethodModel->fee_type === 'fixed') {
                    $channelFee = (float) $paymentMethodModel->fee_amount;
                } else {
                    $channelFee = round(($subtotal * (float) $paymentMethodModel->fee_amount) / 100, 2);
                }
            }
        }

        $totalAmount = $subtotal + $appFee + $channelFee;

        $createdOrder = null;

        DB::transaction(function () use (
            $validated,
            $user,
            $tenantId,
            $subtotal,
            $appFee,
            $channelFee,
            $totalAmount,
            $paymentMethodEnum,
            $channelCode,
            $preparedItems,
            &$createdOrder
        ) {
            $orderNumber = 'ORD-'.date('Ymd').'-'.strtoupper(Str::random(6));
            $pickupCode = 'PKP-'.rand(100, 999);

            $order = Order::create([
                'order_number' => $orderNumber,
                'pickup_code' => $pickupCode,
                'user_id' => $user->id,
                'tenant_id' => $tenantId,
                'subtotal_amount' => $subtotal,
                'app_fee' => $appFee,
                'channel_fee' => $channelFee,
                'total_amount' => $totalAmount,
                'payment_method' => $paymentMethodEnum,
                'payment_channel_code' => $channelCode,
                'dining_option' => $validated['dining_option'],
                'payment_status' => PaymentStatus::Unpaid,
                'status' => OrderStatus::Pending,
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($preparedItems as $ti) {
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

            $createdOrder = $order;
        });

        $paymentInfo = null;

        if ($createdOrder && $paymentMethodEnum === PaymentMethodEnum::Cashless) {
            $selectedChannel = $channelCode ?? 'qris';
            try {
                $details = $midtransService->chargeCoreApi($createdOrder, $selectedChannel);
                $createdOrder->update(['payment_details' => $details]);
                $paymentInfo = $details;
            } catch (Exception $e) {
                // Fallback payment details if SDK simulation
                $fallbackDetails = [
                    'type' => $selectedChannel === 'qris' ? 'qris' : 'bank_transfer',
                    'channel_code' => $selectedChannel,
                    'channel_name' => strtoupper($selectedChannel),
                    'va_number' => '82710'.sprintf('%08d', $createdOrder->id + 1000),
                    'qr_url' => 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=MIDTRANS-'.$createdOrder->order_number,
                ];
                $createdOrder->update(['payment_details' => $fallbackDetails]);
                $paymentInfo = $fallbackDetails;
            }
        }

        $redirectUrl = route('orders.payment', $createdOrder->id);

        return response()->json([
            'success' => true,
            'message' => 'Pesanan berhasil dibuat.',
            'orders' => [$createdOrder],
            'primary_order_id' => $createdOrder->id,
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
