<?php

namespace App\Http\Controllers\Tenant;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Tenant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class OrderController extends Controller
{
    /**
     * Display the kitchen order board for the logged-in tenant stand.
     */
    public function index(Request $request): Response
    {
        try {
            $user = $request->user();
            $tenantId = $user->tenant_id ?? Tenant::query()->value('id');

            $statusFilter = $request->query('status', 'all');
            $search = $request->query('search');

            $query = Order::query()
                ->where('tenant_id', $tenantId)
                ->with(['user:id,name,email', 'items']);

            if ($statusFilter !== 'all' && OrderStatus::tryFrom($statusFilter)) {
                $query->where('status', $statusFilter);
            }

            if (! empty($search)) {
                $query->where(function ($q) use ($search) {
                    $q->where('order_number', 'like', "%{$search}%")
                        ->orWhere('pickup_code', 'like', "%{$search}%")
                        ->orWhereHas('user', fn ($uq) => $uq->where('name', 'like', "%{$search}%"));
                });
            }

            $orders = $query->latest('id')->get()->map(function (Order $order) {
                $items = $order->items->map(fn ($item) => [
                    'name' => $item->menu_name,
                    'price' => (float) $item->price,
                    'quantity' => (int) $item->quantity,
                    'notes' => null,
                ])->values()->all();

                $itemsSummary = $order->items
                    ->map(fn ($it) => "{$it->menu_name} x{$it->quantity}")
                    ->join(', ');

                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'pickup_code' => $order->pickup_code,
                    'customer_name' => $order->user?->name ?? 'Mahasiswa FEB',
                    'customer_phone' => null,
                    'items' => $items,
                    'items_count' => $order->items->sum('quantity'),
                    'items_summary' => $itemsSummary,
                    'total_amount' => (float) $order->total_amount,
                    'payment_method' => $order->payment_method->value,
                    'payment_method_label' => $order->payment_method->label(),
                    'payment_status' => $order->payment_status->value,
                    'payment_status_label' => $order->payment_status->label(),
                    'status' => $order->status->value,
                    'status_label' => $order->status->label(),
                    'created_at' => $order->created_at?->diffForHumans() ?? $order->created_at?->format('d M H:i'),
                ];
            })->values()->all();

            $baseTenantQuery = Order::query()->where('tenant_id', $tenantId);
            $counts = [
                'total' => (clone $baseTenantQuery)->count(),
                'pending' => (clone $baseTenantQuery)->where('status', OrderStatus::Pending)->count(),
                'processing' => (clone $baseTenantQuery)->where('status', OrderStatus::Processing)->count(),
                'ready' => (clone $baseTenantQuery)->where('status', OrderStatus::Ready)->count(),
                'completed' => (clone $baseTenantQuery)->where('status', OrderStatus::Completed)->count(),
            ];

            return Inertia::render('tenant/orders', [
                'orders' => $orders,
                'counts' => $counts,
                'filters' => [
                    'status' => $statusFilter,
                    'search' => $search ?? '',
                ],
            ]);
        } catch (Throwable $e) {
            Log::error('Gagal memuat antrean pesanan tenant: '.$e->getMessage(), [
                'exception' => $e,
            ]);

            return Inertia::render('tenant/orders', [
                'orders' => [],
                'counts' => [
                    'total' => 0,
                    'pending' => 0,
                    'processing' => 0,
                    'ready' => 0,
                    'completed' => 0,
                ],
                'filters' => [
                    'status' => 'all',
                    'search' => '',
                ],
                'error' => 'Gagal memuat data antrean dari server.',
            ]);
        }
    }

    /**
     * Update order status in kitchen flow.
     */
    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $user = $request->user();
        $tenantId = $user->tenant_id ?? Tenant::query()->value('id');

        if ((int) $order->tenant_id !== (int) $tenantId) {
            abort(403, 'Anda tidak memiliki hak akses ke pesanan stand ini.');
        }

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:pending,processing,ready,completed,failed'],
        ], [
            'status.required' => 'Status pesanan wajib ditentukan.',
            'status.in' => 'Pilihan status pesanan tidak valid.',
        ]);

        try {
            $newStatus = OrderStatus::from($validated['status']);

            if ($newStatus === OrderStatus::Processing && $order->payment_status !== PaymentStatus::Paid) {
                $toast = [
                    'type' => 'error',
                    'message' => 'Pesanan belum dibayar. Mohon lakukan verifikasi pembayaran tunai atau tunggu konfirmasi pembayaran cashless sebelum memproses pesanan.',
                ];
                Inertia::flash('toast', $toast);

                return back()->with('toast', $toast);
            }

            $updateData = ['status' => $newStatus];

            if ($newStatus === OrderStatus::Processing && ! $order->processing_at) {
                $updateData['processing_at'] = now();
            } elseif ($newStatus === OrderStatus::Ready && ! $order->ready_at) {
                $updateData['ready_at'] = now();
            } elseif ($newStatus === OrderStatus::Completed && ! $order->completed_at) {
                $updateData['completed_at'] = now();
            }

            $order->update($updateData);

            $toast = [
                'type' => 'success',
                'message' => "Status pesanan #{$order->pickup_code} berhasil diperbarui menjadi \"{$newStatus->label()}\".",
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        } catch (Throwable $e) {
            Log::error('Gagal memperbarui status pesanan tenant: '.$e->getMessage(), [
                'exception' => $e,
                'order_id' => $order->id,
            ]);

            $toast = [
                'type' => 'error',
                'message' => 'Gagal memperbarui status pesanan: '.$e->getMessage(),
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        }
    }

    /**
     * Display cash payment verification page.
     */
    public function verifyPaymentIndex(Request $request): Response
    {
        try {
            $user = $request->user();
            $tenantId = $user->tenant_id ?? Tenant::query()->value('id');

            $statusFilter = $request->query('status', 'unpaid');
            $search = $request->query('search');

            $query = Order::query()
                ->where('tenant_id', $tenantId)
                ->where('payment_method', PaymentMethod::Cash)
                ->with(['user:id,name,email', 'items']);

            if ($statusFilter !== 'all' && PaymentStatus::tryFrom($statusFilter)) {
                $query->where('payment_status', $statusFilter);
            }

            if (! empty($search)) {
                $query->where(function ($q) use ($search) {
                    $q->where('order_number', 'like', "%{$search}%")
                        ->orWhere('pickup_code', 'like', "%{$search}%")
                        ->orWhereHas('user', fn ($uq) => $uq->where('name', 'like', "%{$search}%"));
                });
            }

            $orders = $query->latest('id')->get()->map(function (Order $order) {
                $items = $order->items->map(fn ($item) => [
                    'name' => $item->menu_name,
                    'price' => (float) $item->price,
                    'quantity' => (int) $item->quantity,
                    'notes' => null,
                ])->values()->all();

                $itemsSummary = $order->items
                    ->map(fn ($it) => "{$it->menu_name} x{$it->quantity}")
                    ->join(', ');

                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'pickup_code' => $order->pickup_code,
                    'customer_name' => $order->user?->name ?? 'Mahasiswa FEB',
                    'customer_phone' => null,
                    'items' => $items,
                    'items_count' => $order->items->sum('quantity'),
                    'items_summary' => $itemsSummary,
                    'total_amount' => (float) $order->total_amount,
                    'payment_method' => $order->payment_method->value,
                    'payment_method_label' => $order->payment_method->label(),
                    'payment_status' => $order->payment_status->value,
                    'payment_status_label' => $order->payment_status->label(),
                    'status' => $order->status->value,
                    'status_label' => $order->status->label(),
                    'created_at' => $order->created_at?->diffForHumans() ?? $order->created_at?->format('d M H:i'),
                ];
            })->values()->all();

            $baseCashQuery = Order::query()
                ->where('tenant_id', $tenantId)
                ->where('payment_method', PaymentMethod::Cash);

            $counts = [
                'unpaid_count' => (clone $baseCashQuery)->where('payment_status', PaymentStatus::Unpaid)->count(),
                'unpaid_amount' => (float) (clone $baseCashQuery)->where('payment_status', PaymentStatus::Unpaid)->sum('subtotal_amount'),
                'verified_today_count' => (clone $baseCashQuery)->where('payment_status', PaymentStatus::Paid)->whereDate('paid_at', today())->count(),
                'verified_today_amount' => (float) (clone $baseCashQuery)->where('payment_status', PaymentStatus::Paid)->whereDate('paid_at', today())->sum('subtotal_amount'),
            ];

            return Inertia::render('tenant/verify-payment', [
                'orders' => $orders,
                'counts' => $counts,
                'filters' => [
                    'status' => $statusFilter,
                    'search' => $search ?? '',
                ],
            ]);
        } catch (Throwable $e) {
            Log::error('Gagal memuat verifikasi tunai tenant: '.$e->getMessage(), ['exception' => $e]);

            return Inertia::render('tenant/verify-payment', [
                'orders' => [],
                'counts' => [
                    'unpaid_count' => 0,
                    'unpaid_amount' => 0,
                    'verified_today_count' => 0,
                    'verified_today_amount' => 0,
                ],
                'filters' => [
                    'status' => 'unpaid',
                    'search' => '',
                ],
                'error' => 'Gagal memuat data verifikasi tunai.',
            ]);
        }
    }

    /**
     * Confirm cash payment receipt from student at tenant stand.
     */
    public function confirmCashPayment(Request $request, Order $order): RedirectResponse
    {
        $user = $request->user();
        $tenantId = $user->tenant_id ?? Tenant::query()->value('id');

        if ((int) $order->tenant_id !== (int) $tenantId) {
            abort(403, 'Anda tidak memiliki hak akses ke pesanan stand ini.');
        }

        if ($order->payment_method !== PaymentMethod::Cash) {
            $toast = [
                'type' => 'error',
                'message' => 'Pesanan ini bukan pesanan pembayaran tunai.',
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        }

        if ($order->payment_status === PaymentStatus::Paid) {
            $toast = [
                'type' => 'info',
                'message' => "Pembayaran untuk pesanan #{$order->pickup_code} sudah lunas sebelumnya.",
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        }

        try {
            $updateData = [
                'payment_status' => PaymentStatus::Paid,
                'paid_at' => now(),
            ];

            if ($order->status === OrderStatus::Pending) {
                $updateData['status'] = OrderStatus::Processing;
                $updateData['processing_at'] = now();
            }

            $order->update($updateData);

            $formattedTotal = 'Rp '.number_format($order->total_amount, 0, ',', '.');
            $toast = [
                'type' => 'success',
                'message' => "Pembayaran tunai {$formattedTotal} untuk pesanan #{$order->pickup_code} ({$order->user?->name}) berhasil diverifikasi!",
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        } catch (Throwable $e) {
            Log::error('Gagal verifikasi pembayaran tunai: '.$e->getMessage(), ['exception' => $e, 'order_id' => $order->id]);

            $toast = [
                'type' => 'error',
                'message' => 'Gagal verifikasi pembayaran: '.$e->getMessage(),
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        }
    }
}
