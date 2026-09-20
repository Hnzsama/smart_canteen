<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class DashboardController extends Controller
{
    /**
     * Display the Admin supervision dashboard with real metrics and chart series.
     */
    public function index(Request $request): Response
    {
        try {
            $selectedTenantId = $request->query('tenant_id') ? (int) $request->query('tenant_id') : null;

            // Base query for orders (filterable by tenant)
            $orderQuery = Order::query();
            if ($selectedTenantId) {
                $orderQuery->where('tenant_id', $selectedTenantId);
            }

            $totalRevenue = (float) (clone $orderQuery)->where('payment_status', PaymentStatus::Paid)->sum('subtotal_amount');
            $totalOrders = (clone $orderQuery)->count();
            $paidOrders = (clone $orderQuery)->where('payment_status', PaymentStatus::Paid)->count();

            $cashlessOrders = (clone $orderQuery)->where('payment_method', PaymentMethod::Cashless)->count();
            $cashOrders = (clone $orderQuery)->where('payment_method', PaymentMethod::Cash)->count();
            $cashlessRevenue = (float) (clone $orderQuery)
                ->where('payment_method', PaymentMethod::Cashless)
                ->where('payment_status', PaymentStatus::Paid)
                ->sum('subtotal_amount');
            $cashRevenue = (float) (clone $orderQuery)
                ->where('payment_method', PaymentMethod::Cash)
                ->where('payment_status', PaymentStatus::Paid)
                ->sum('subtotal_amount');

            $cashlessPercentage = $totalOrders > 0 ? round(($cashlessOrders / $totalOrders) * 100, 1) : 0;
            $cashPercentage = $totalOrders > 0 ? round(($cashOrders / $totalOrders) * 100, 1) : 0;

            $activeTenants = Tenant::where('is_active', true)->count();
            $totalTenants = Tenant::count();

            $totalStudents = User::whereHas('roles', fn ($q) => $q->where('name', UserRole::Mahasiswa->value))->count();
            $totalTenantUsers = User::whereHas('roles', fn ($q) => $q->where('name', UserRole::Tenant->value))->count();

            $statusCounts = [
                'pending' => (clone $orderQuery)->where('status', OrderStatus::Pending)->count(),
                'processing' => (clone $orderQuery)->where('status', OrderStatus::Processing)->count(),
                'ready' => (clone $orderQuery)->where('status', OrderStatus::Ready)->count(),
                'completed' => (clone $orderQuery)->where('status', OrderStatus::Completed)->count(),
                'failed' => (clone $orderQuery)->where('status', OrderStatus::Failed)->count(),
            ];

            // 7 Days Revenue Trend Time-Series for Area/Bar Chart
            $revenueTrend = [];
            for ($i = 6; $i >= 0; $i--) {
                $date = now()->subDays($i);
                $dateStr = $date->format('Y-m-d');
                $label = $date->format('d M');

                $dayOrders = (clone $orderQuery)
                    ->whereDate('created_at', $dateStr)
                    ->where('payment_status', PaymentStatus::Paid)
                    ->get();

                $cashless = (float) $dayOrders->where('payment_method', PaymentMethod::Cashless)->sum('subtotal_amount');
                $cash = (float) $dayOrders->where('payment_method', PaymentMethod::Cash)->sum('subtotal_amount');

                $revenueTrend[] = [
                    'date' => $label,
                    'cashless' => $cashless,
                    'cash' => $cash,
                    'total' => $cashless + $cash,
                    'orders_count' => $dayOrders->count(),
                ];
            }

            // Payment Method Distribution for Donut / Pie Chart
            $paymentDistribution = [
                [
                    'method' => 'cashless',
                    'label' => 'Cashless (Midtrans)',
                    'count' => $cashlessOrders,
                    'amount' => $cashlessRevenue,
                    'fill' => 'var(--color-cashless)',
                ],
                [
                    'method' => 'cash',
                    'label' => 'Tunai Kasir',
                    'count' => $cashOrders,
                    'amount' => $cashRevenue,
                    'fill' => 'var(--color-cash)',
                ],
            ];

            // Tenant Options for Combobox Filter
            $tenants = Tenant::query()
                ->select(['id', 'name', 'slug', 'is_active'])
                ->orderBy('name')
                ->get()
                ->map(fn (Tenant $tenant) => [
                    'id' => $tenant->id,
                    'name' => $tenant->name,
                    'slug' => $tenant->slug,
                    'is_active' => (bool) $tenant->is_active,
                ]);

            // Recent Orders Feed
            $recentOrdersQuery = Order::with(['user:id,name,email', 'tenant:id,name']);
            if ($selectedTenantId) {
                $recentOrdersQuery->where('tenant_id', $selectedTenantId);
            }

            $recentOrders = $recentOrdersQuery
                ->latest('id')
                ->take(6)
                ->get()
                ->map(fn (Order $order) => [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'pickup_code' => $order->pickup_code,
                    'customer_name' => $order->user?->name ?? 'Mahasiswa',
                    'tenant_name' => $order->tenant?->name ?? 'Stand Kantin',
                    'total_amount' => (float) $order->total_amount,
                    'payment_method' => $order->payment_method->value,
                    'payment_method_label' => $order->payment_method->label(),
                    'payment_status' => $order->payment_status->value,
                    'payment_status_label' => $order->payment_status->label(),
                    'status' => $order->status->value,
                    'status_label' => $order->status->label(),
                    'created_at' => $order->created_at?->format('d M Y H:i'),
                ]);

            return Inertia::render('admin/dashboard', [
                'metrics' => [
                    'total_revenue' => $totalRevenue,
                    'total_orders' => $totalOrders,
                    'paid_orders' => $paidOrders,
                    'cashless_orders' => $cashlessOrders,
                    'cash_orders' => $cashOrders,
                    'cashless_revenue' => $cashlessRevenue,
                    'cash_revenue' => $cashRevenue,
                    'cashless_percentage' => $cashlessPercentage,
                    'cash_percentage' => $cashPercentage,
                    'active_tenants' => $activeTenants,
                    'total_tenants' => $totalTenants,
                    'total_students' => $totalStudents,
                    'total_tenant_users' => $totalTenantUsers,
                    'status_counts' => $statusCounts,
                ],
                'recentOrders' => $recentOrders,
                'revenueTrend' => $revenueTrend,
                'paymentDistribution' => $paymentDistribution,
                'tenants' => $tenants,
                'selectedTenantId' => $selectedTenantId,
            ]);
        } catch (Throwable $e) {
            Log::error('Gagal memuat data ringkasan dashboard admin: '.$e->getMessage(), [
                'exception' => $e,
            ]);

            return Inertia::render('admin/dashboard', [
                'metrics' => [
                    'total_revenue' => 0,
                    'total_orders' => 0,
                    'paid_orders' => 0,
                    'cashless_orders' => 0,
                    'cash_orders' => 0,
                    'cashless_revenue' => 0,
                    'cash_revenue' => 0,
                    'cashless_percentage' => 0,
                    'cash_percentage' => 0,
                    'active_tenants' => 0,
                    'total_tenants' => 0,
                    'total_students' => 0,
                    'total_tenant_users' => 0,
                    'status_counts' => [
                        'pending' => 0,
                        'processing' => 0,
                        'ready' => 0,
                        'completed' => 0,
                        'failed' => 0,
                    ],
                ],
                'recentOrders' => [],
                'revenueTrend' => [],
                'paymentDistribution' => [],
                'tenants' => [],
                'selectedTenantId' => null,
            ]);
        }
    }
}
