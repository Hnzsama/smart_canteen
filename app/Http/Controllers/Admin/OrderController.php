<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Tenant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class OrderController extends Controller
{
    /**
     * Display a listing of all canteen orders with filters, audit totals, and item details.
     */
    public function index(Request $request): Response
    {
        try {
            $search = $request->query('search');
            $tenantId = $request->query('tenant_id', 'all');
            $status = $request->query('status', 'all');
            $paymentStatus = $request->query('payment_status', 'all');
            $paymentMethod = $request->query('payment_method', 'all');
            $dateRange = $request->query('date', 'all');

            $query = Order::query()
                ->with([
                    'user:id,name,email',
                    'tenant:id,name,slug',
                    'items:id,order_id,menu_name,price,quantity,subtotal',
                ])
                ->latest('id');

            // Search filter
            if (! empty($search)) {
                $query->where(function ($q) use ($search) {
                    $q->where('order_number', 'like', "%{$search}%")
                        ->orWhere('pickup_code', 'like', "%{$search}%")
                        ->orWhereHas('user', fn ($u) => $u->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%"))
                        ->orWhereHas('tenant', fn ($t) => $t->where('name', 'like', "%{$search}%"));
                });
            }

            // Tenant filter
            if ($tenantId !== 'all' && is_numeric($tenantId)) {
                $query->where('tenant_id', (int) $tenantId);
            }

            // Order Status filter
            if ($status !== 'all' && OrderStatus::tryFrom($status)) {
                $query->where('status', $status);
            }

            // Payment Status filter
            if ($paymentStatus !== 'all' && PaymentStatus::tryFrom($paymentStatus)) {
                $query->where('payment_status', $paymentStatus);
            }

            // Payment Method filter
            if ($paymentMethod !== 'all' && PaymentMethod::tryFrom($paymentMethod)) {
                $query->where('payment_method', $paymentMethod);
            }

            // Date Range filter
            if ($dateRange === 'today') {
                $query->whereDate('created_at', Carbon::today());
            } elseif ($dateRange === 'week') {
                $query->whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]);
            } elseif ($dateRange === 'month') {
                $query->whereMonth('created_at', Carbon::now()->month)
                    ->whereYear('created_at', Carbon::now()->year);
            }

            // Metrics calculation on filtered query
            $baseQuery = clone $query;
            $orders = $query->paginate(20)->withQueryString();

            $totalRevenue = (float) (clone $baseQuery)->where('payment_status', PaymentStatus::Paid)->sum('subtotal_amount');
            $cashlessRevenue = (float) (clone $baseQuery)
                ->where('payment_method', PaymentMethod::Cashless)
                ->where('payment_status', PaymentStatus::Paid)
                ->sum('subtotal_amount');
            $cashRevenue = (float) (clone $baseQuery)
                ->where('payment_method', PaymentMethod::Cash)
                ->where('payment_status', PaymentStatus::Paid)
                ->sum('subtotal_amount');

            $mappedOrders = collect($orders->items())->map(function (Order $order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'pickup_code' => $order->pickup_code,
                    'customer_name' => $order->user?->name ?? 'Mahasiswa',
                    'customer_email' => $order->user?->email ?? '-',
                    'tenant_id' => $order->tenant_id,
                    'tenant_name' => $order->tenant?->name ?? 'Stand Kantin',
                    'total_amount' => (float) $order->total_amount,
                    'payment_method' => $order->payment_method->value,
                    'payment_method_label' => $order->payment_method->label(),
                    'payment_status' => $order->payment_status->value,
                    'payment_status_label' => $order->payment_status->label(),
                    'status' => $order->status->value,
                    'status_label' => $order->status->label(),
                    'paid_at' => $order->paid_at?->format('d M Y H:i'),
                    'processing_at' => $order->processing_at?->format('d M Y H:i'),
                    'ready_at' => $order->ready_at?->format('d M Y H:i'),
                    'completed_at' => $order->completed_at?->format('d M Y H:i'),
                    'created_at' => $order->created_at?->format('d M Y H:i'),
                    'items' => $order->items->map(fn ($item) => [
                        'id' => $item->id,
                        'menu_name' => $item->menu_name,
                        'price' => (float) $item->price,
                        'quantity' => (int) $item->quantity,
                        'subtotal' => (float) $item->subtotal,
                    ])->all(),
                ];
            })->all();

            $tenants = Tenant::select(['id', 'name'])->orderBy('name')->get();

            return Inertia::render('admin/orders', [
                'orders' => [
                    'data' => $mappedOrders,
                    'current_page' => $orders->currentPage(),
                    'last_page' => $orders->lastPage(),
                    'per_page' => $orders->perPage(),
                    'total' => $orders->total(),
                    'from' => $orders->firstItem(),
                    'to' => $orders->lastItem(),
                ],
                'summary' => [
                    'total_orders' => $orders->total(),
                    'total_revenue' => $totalRevenue,
                    'cashless_revenue' => $cashlessRevenue,
                    'cash_revenue' => $cashRevenue,
                ],
                'tenants' => $tenants,
                'filters' => [
                    'search' => $search ?? '',
                    'tenant_id' => $tenantId,
                    'status' => $status,
                    'payment_status' => $paymentStatus,
                    'payment_method' => $paymentMethod,
                    'date' => $dateRange,
                ],
            ]);
        } catch (Throwable $e) {
            Log::error('Gagal memuat daftar audit transaksi admin: '.$e->getMessage(), [
                'exception' => $e,
                'query_params' => $request->all(),
            ]);

            return Inertia::render('admin/orders', [
                'orders' => [
                    'data' => [],
                    'current_page' => 1,
                    'last_page' => 1,
                    'per_page' => 20,
                    'total' => 0,
                    'from' => null,
                    'to' => null,
                ],
                'summary' => [
                    'total_orders' => 0,
                    'total_revenue' => 0,
                    'cashless_revenue' => 0,
                    'cash_revenue' => 0,
                ],
                'tenants' => [],
                'filters' => [
                    'search' => '',
                    'tenant_id' => 'all',
                    'status' => 'all',
                    'payment_status' => 'all',
                    'payment_method' => 'all',
                    'date' => 'all',
                ],
                'error' => 'Gagal memuat data transaksi dari server.',
            ]);
        }
    }

    /**
     * Update order status or payment status via admin audit action.
     */
    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::enum(OrderStatus::class)],
            'payment_status' => ['required', Rule::enum(PaymentStatus::class)],
        ]);

        try {
            DB::transaction(function () use ($validated, $order) {
                $newStatus = OrderStatus::from($validated['status']);
                $newPaymentStatus = PaymentStatus::from($validated['payment_status']);

                $order->status = $newStatus;
                $order->payment_status = $newPaymentStatus;

                // Timestamps audit tracking
                if ($newPaymentStatus === PaymentStatus::Paid && ! $order->paid_at) {
                    $order->paid_at = now();
                }

                if ($newStatus === OrderStatus::Processing && ! $order->processing_at) {
                    $order->processing_at = now();
                }

                if ($newStatus === OrderStatus::Ready && ! $order->ready_at) {
                    $order->ready_at = now();
                }

                if ($newStatus === OrderStatus::Completed && ! $order->completed_at) {
                    $order->completed_at = now();
                }

                $order->save();
            });

            $toast = [
                'type' => 'success',
                'message' => "Status transaksi #{$order->order_number} berhasil diperbarui.",
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        } catch (Throwable $e) {
            Log::error("Gagal memperbarui status transaksi [ID: {$order->id}]: ".$e->getMessage(), [
                'exception' => $e,
                'order_id' => $order->id,
                'request_data' => $validated,
            ]);

            $toast = [
                'type' => 'error',
                'message' => 'Terjadi kesalahan sistem saat memperbarui status transaksi. Silakan coba beberapa saat lagi.',
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        }
    }

    /**
     * Soft delete the specified order.
     */
    public function destroy(Order $order): RedirectResponse
    {
        try {
            DB::transaction(function () use ($order) {
                $order->delete();
            });

            $toast = [
                'type' => 'success',
                'message' => "Pesanan #{$order->order_number} berhasil dipindahkan ke tempat sampah.",
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        } catch (Throwable $e) {
            Log::error("Gagal menghapus pesanan [ID: {$order->id}]: ".$e->getMessage(), [
                'exception' => $e,
                'order_id' => $order->id,
            ]);

            $toast = [
                'type' => 'error',
                'message' => 'Terjadi kesalahan sistem saat menghapus transaksi. Silakan coba beberapa saat lagi.',
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        }
    }
}
