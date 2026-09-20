<?php

namespace App\Http\Controllers\Customer;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\TenantRating;
use App\Services\MidtransService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * Display active orders for customer.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Auto-expire any unpaid orders older than 10 minutes
        $unpaid = Order::query()
            ->where('user_id', $user->id)
            ->where('payment_status', PaymentStatus::Unpaid)
            ->get();
        foreach ($unpaid as $ord) {
            $ord->checkAutoExpire();
        }

        $orders = Order::query()
            ->where('user_id', $user->id)
            ->whereNotIn('status', [OrderStatus::Completed, OrderStatus::Failed])
            ->latest('id')
            ->with(['tenant', 'items.menu'])
            ->get()
            ->map(function (Order $order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'pickup_code' => $order->pickup_code,
                    'tenant_name' => $order->tenant?->name ?? 'Stand Kantin',
                    'tenant_slug' => $order->tenant?->slug ?? '',
                    'tenant_location' => 'Kantin FEB • Universitas Negeri Surabaya',
                    'created_at' => $order->created_at->format('d M Y, H:i WIB'),
                    'status' => $order->status->value,
                    'status_label' => $order->status->label(),
                    'payment_status' => $order->payment_status->value,
                    'payment_method' => $order->payment_method->value,
                    'payment_method_label' => $order->payment_method->value === 'cash' ? 'Bayar Tunai di Kasir' : 'QRIS / Cashless',
                    'subtotal_amount' => (float) $order->subtotal_amount,
                    'app_fee' => (float) $order->app_fee,
                    'channel_fee' => (float) $order->channel_fee,
                    'total_amount' => (float) $order->total_amount,
                    'estimated_time' => '10 - 15 mnt',
                    'items' => $order->items->map(fn ($item) => [
                        'id' => $item->id,
                        'name' => $item->menu_name,
                        'qty' => $item->quantity,
                        'price' => (float) $item->subtotal,
                        'image' => $item->menu?->image ? asset('storage/'.$item->menu->image) : '/images/food-placeholder.jpg',
                        'choices' => is_array($item->options) ? array_values(array_map(fn ($opt) => is_array($opt) ? ($opt['name'] ?? '') : (string) $opt, $item->options)) : [],
                        'note' => $item->note ?? '',
                    ]),
                ];
            });

        return Inertia::render('orders/index', [
            'activeOrders' => $orders,
        ]);
    }

    /**
     * Display order history for customer.
     */
    public function history(Request $request): Response
    {
        $user = $request->user();

        $orders = Order::query()
            ->where('user_id', $user->id)
            ->whereIn('status', [OrderStatus::Completed, OrderStatus::Failed])
            ->latest('id')
            ->with(['tenant', 'items.menu', 'tenantRating'])
            ->get()
            ->map(function (Order $order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'pickup_code' => $order->pickup_code,
                    'tenant_name' => $order->tenant?->name ?? 'Stand Kantin',
                    'tenant_slug' => $order->tenant?->slug ?? '',
                    'tenant_location' => 'Kantin FEB • Universitas Negeri Surabaya',
                    'date' => $order->created_at->format('d M Y, H:i WIB'),
                    'status' => $order->status->value === 'completed' ? 'Completed' : 'Failed',
                    'status_label' => $order->status->label(),
                    'total_amount' => (float) $order->total_amount,
                    'payment_method' => $order->payment_method->value,
                    'payment_method_label' => $order->payment_method->value === 'cash' ? 'Bayar Tunai di Kasir' : 'QRIS / Cashless',
                    'items' => $order->items->map(fn ($item) => [
                        'id' => $item->id,
                        'name' => $item->menu_name,
                        'qty' => $item->quantity,
                        'price' => (float) $item->subtotal,
                        'image' => $item->menu?->image ? asset('storage/'.$item->menu->image) : '/images/food-placeholder.jpg',
                        'choices' => is_array($item->options) ? array_values(array_map(fn ($opt) => is_array($opt) ? ($opt['name'] ?? '') : (string) $opt, $item->options)) : [],
                        'note' => $item->note ?? '',
                    ]),
                    'rating_given' => $order->tenantRating?->rating,
                ];
            });

        return Inertia::render('orders/history', [
            'orderHistory' => $orders,
        ]);
    }

    /**
     * Display order detail page for customer.
     */
    public function show(Order $order): Response
    {
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        $order->refresh();
        $order->checkAutoExpire();
        $order->load(['tenant', 'items.menu']);

        return Inertia::render('orders/show', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'pickup_code' => $order->pickup_code,
                'tenant_name' => $order->tenant?->name ?? 'Stand Kantin',
                'tenant_slug' => $order->tenant?->slug ?? '',
                'tenant_location' => 'Kantin FEB • Universitas Negeri Surabaya',
                'qr_md5' => md5("CANTEEN:{$order->order_number}:{$order->pickup_code}"),
                'created_at' => $order->created_at->format('d M Y, H:i WIB'),
                'status' => $order->status->value,
                'status_label' => $order->status->label(),
                'payment_status' => $order->payment_status->value,
                'payment_status_label' => $order->payment_status->label(),
                'payment_method' => $order->payment_method->value,
                'payment_method_label' => $order->payment_method->value === 'cash' ? 'Bayar Tunai di Kasir' : 'QRIS / Cashless',
                'subtotal_amount' => (float) $order->subtotal_amount,
                'app_fee' => (float) $order->app_fee,
                'channel_fee' => (float) $order->channel_fee,
                'total_amount' => (float) $order->total_amount,
                'estimated_time' => '10 - 15 mnt',
                'notes' => $order->notes,
                'payment_details' => $order->payment_details,
                'items' => $order->items->map(fn ($item) => [
                    'id' => $item->id,
                    'name' => $item->menu_name,
                    'qty' => $item->quantity,
                    'price' => (float) $item->price,
                    'subtotal' => (float) $item->subtotal,
                    'image' => $item->menu?->image ? asset('storage/'.$item->menu->image) : '/images/food-placeholder.jpg',
                    'choices' => is_array($item->options) ? array_values(array_map(fn ($opt) => is_array($opt) ? ($opt['name'] ?? '') : (string) $opt, $item->options)) : [],
                    'note' => $item->note ?? '',
                ]),
            ],
        ]);
    }

    /**
     * Check order payment status for auto-polling on payment page.
     */
    public function status(Order $order, MidtransService $midtransService): JsonResponse
    {
        if ($order->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $order->checkAutoExpire();

        if ($order->payment_status !== PaymentStatus::Paid && ! $order->isExpired()) {
            $midtransService->checkTransactionStatus($order);
            $order->refresh();
        }

        $isPaid = $order->payment_status === PaymentStatus::Paid || in_array($order->status, [OrderStatus::Paid, OrderStatus::Processing, OrderStatus::Ready, OrderStatus::Completed], true);
        $isExpired = $order->isExpired();

        return response()->json([
            'id' => $order->id,
            'status' => $order->status->value,
            'payment_status' => $order->payment_status->value,
            'is_paid' => $isPaid,
            'is_expired' => $isExpired,
            'success_url' => route('orders.success', $order->id),
        ]);
    }

    /**
     * Display order success page with receipt download option.
     */
    public function success(Order $order): Response
    {
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        $order->load(['tenant', 'items.menu', 'user']);

        return Inertia::render('orders/success', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'pickup_code' => $order->pickup_code,
                'customer_name' => $order->user?->name ?? 'Mahasiswa FEB',
                'customer_email' => $order->user?->email ?? '',
                'tenant_name' => $order->tenant?->name ?? 'Stand Kantin',
                'tenant_slug' => $order->tenant?->slug ?? '',
                'tenant_location' => 'Kantin FEB • Universitas Negeri Surabaya',
                'qr_md5' => md5("CANTEEN:{$order->order_number}:{$order->pickup_code}"),
                'created_at' => $order->created_at->format('d M Y, H:i WIB'),
                'paid_at' => $order->paid_at ? $order->paid_at->format('d M Y, H:i WIB') : $order->created_at->format('d M Y, H:i WIB'),
                'status' => $order->status->value,
                'status_label' => $order->status->label(),
                'payment_status' => $order->payment_status->value,
                'payment_status_label' => $order->payment_status->label(),
                'payment_method' => $order->payment_method->value,
                'payment_method_label' => $order->payment_method->value === 'cash' ? 'Bayar Tunai di Kasir' : 'QRIS / Cashless (Lunas)',
                'dining_option' => $order->dining_option,
                'subtotal_amount' => (float) $order->subtotal_amount,
                'app_fee' => (float) $order->app_fee,
                'channel_fee' => (float) $order->channel_fee,
                'total_amount' => (float) $order->total_amount,
                'notes' => $order->notes,
                'items' => $order->items->map(fn ($item) => [
                    'id' => $item->id,
                    'name' => $item->menu_name,
                    'qty' => $item->quantity,
                    'price' => (float) $item->price,
                    'subtotal' => (float) $item->subtotal,
                    'options' => is_array($item->options) ? array_values(array_map(fn ($opt) => is_array($opt) ? ($opt['name'] ?? '') : (string) $opt, $item->options)) : [],
                    'note' => $item->note ?? '',
                ]),
            ],
        ]);
    }

    /**
     * Submit rating for completed order.
     */
    public function rate(Request $request, Order $order)
    {
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        if ($order->status !== OrderStatus::Completed) {
            return back()->with('error', 'Pesanan belum selesai.');
        }

        $validated = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:500'],
        ]);

        TenantRating::updateOrCreate(
            ['order_id' => $order->id],
            [
                'tenant_id' => $order->tenant_id,
                'user_id' => Auth::id(),
                'rating' => $validated['rating'],
                'comment' => $validated['comment'] ?? null,
            ]
        );

        $tenant = $order->tenant;
        if ($tenant) {
            $avgRating = $tenant->ratings()->avg('rating') ?? 5.0;
            $count = $tenant->ratings()->count();
            $tenant->update([
                'rating' => round((float) $avgRating, 1),
                'reviews_count' => $count,
            ]);
        }

        return back()->with('success', 'Terima kasih atas rating dan ulasan Anda!');
    }
}
