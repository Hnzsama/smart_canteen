<?php

namespace App\Http\Controllers\Tenant;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class DashboardController extends Controller
{
    /**
     * Display the Tenant stand operational dashboard with real database metrics & charts.
     */
    public function index(Request $request): Response
    {
        try {
            $user = $request->user();
            $tenantId = $user->tenant_id ?? Tenant::query()->value('id');
            $tenant = Tenant::query()->find($tenantId) ?? Tenant::query()->first();

            $baseOrderQuery = Order::query()->where('tenant_id', $tenantId);

            $todayRevenue = (float) (clone $baseOrderQuery)
                ->where('payment_status', PaymentStatus::Paid)
                ->whereDate('created_at', today())
                ->sum('subtotal_amount');

            $completedToday = (clone $baseOrderQuery)
                ->where('status', OrderStatus::Completed)
                ->whereDate('created_at', today())
                ->count();

            $pendingOrders = (clone $baseOrderQuery)->where('status', OrderStatus::Pending)->count();
            $processingOrders = (clone $baseOrderQuery)->where('status', OrderStatus::Processing)->count();
            $readyOrders = (clone $baseOrderQuery)->where('status', OrderStatus::Ready)->count();

            $activeMenuCount = Menu::query()->where('tenant_id', $tenantId)->where('is_available', true)->count();
            $totalMenuCount = Menu::query()->where('tenant_id', $tenantId)->count();

            $cashlessOrders = (clone $baseOrderQuery)->where('payment_method', PaymentMethod::Cashless)->count();
            $cashOrders = (clone $baseOrderQuery)->where('payment_method', PaymentMethod::Cash)->count();
            $cashlessRevenue = (float) (clone $baseOrderQuery)
                ->where('payment_method', PaymentMethod::Cashless)
                ->where('payment_status', PaymentStatus::Paid)
                ->sum('subtotal_amount');
            $cashRevenue = (float) (clone $baseOrderQuery)
                ->where('payment_method', PaymentMethod::Cash)
                ->where('payment_status', PaymentStatus::Paid)
                ->sum('subtotal_amount');

            // 7 Days Revenue Trend
            $revenueTrend = [];
            for ($i = 6; $i >= 0; $i--) {
                $date = now()->subDays($i);
                $dateStr = $date->format('Y-m-d');
                $label = $date->format('d M');

                $dayOrders = (clone $baseOrderQuery)
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

            // Payment Ratio Distribution
            $paymentDistribution = [
                [
                    'method' => 'cashless',
                    'label' => 'Cashless (QRIS)',
                    'count' => $cashlessOrders,
                    'amount' => $cashlessRevenue,
                    'fill' => 'var(--chart-1, #10b981)',
                ],
                [
                    'method' => 'cash',
                    'label' => 'Tunai Stand',
                    'count' => $cashOrders,
                    'amount' => $cashRevenue,
                    'fill' => 'var(--chart-2, #f59e0b)',
                ],
            ];

            // Top Selling Menu Items
            $topSellingMenus = OrderItem::query()
                ->whereHas('order', function ($q) use ($tenantId) {
                    $q->where('tenant_id', $tenantId)
                        ->where('payment_status', PaymentStatus::Paid);
                })
                ->select(
                    'menu_name as name',
                    DB::raw('SUM(quantity) as total_sold'),
                    DB::raw('SUM(subtotal) as revenue')
                )
                ->groupBy('menu_name')
                ->orderByDesc('total_sold')
                ->take(5)
                ->get()
                ->map(fn ($item) => [
                    'name' => $item->name,
                    'total_sold' => (int) $item->total_sold,
                    'revenue' => (float) $item->revenue,
                ])
                ->values()
                ->all();

            // Recent Kitchen Orders Stream
            $recentOrders = (clone $baseOrderQuery)
                ->with(['user:id,name', 'items'])
                ->latest('id')
                ->take(5)
                ->get()
                ->map(function (Order $order) {
                    $itemsSummary = $order->items
                        ->map(fn ($it) => "{$it->menu_name} x{$it->quantity}")
                        ->join(', ');

                    return [
                        'id' => $order->id,
                        'order_number' => $order->order_number,
                        'pickup_code' => $order->pickup_code,
                        'qr_md5' => md5("CANTEEN:{$order->order_number}:{$order->pickup_code}"),
                        'customer_name' => $order->user?->name ?? 'Mahasiswa FEB',
                        'customer_phone' => null,
                        'total_amount' => (float) $order->total_amount,
                        'payment_method' => $order->payment_method->value,
                        'payment_method_label' => $order->payment_method->label(),
                        'payment_status' => $order->payment_status->value,
                        'payment_status_label' => $order->payment_status->label(),
                        'status' => $order->status->value,
                        'status_label' => $order->status->label(),
                        'items_count' => $order->items->sum('quantity'),
                        'items_summary' => $itemsSummary,
                        'created_at' => $order->created_at?->diffForHumans() ?? $order->created_at?->format('d M H:i'),
                    ];
                })
                ->values()
                ->all();

            return Inertia::render('tenant/dashboard', [
                'tenant' => [
                    'id' => $tenant->id,
                    'name' => $tenant->name,
                    'slug' => $tenant->slug,
                    'is_active' => (bool) $tenant->is_active,
                    'category' => 'Makanan & Minuman',
                ],
                'metrics' => [
                    'pending_orders' => $pendingOrders,
                    'processing_orders' => $processingOrders,
                    'ready_orders' => $readyOrders,
                    'completed_today' => $completedToday,
                    'today_revenue' => $todayRevenue,
                    'active_menu_count' => $activeMenuCount,
                    'total_menu_count' => $totalMenuCount,
                    'is_stand_active' => (bool) $tenant->is_active,
                    'cashless_orders' => $cashlessOrders,
                    'cash_orders' => $cashOrders,
                    'cashless_revenue' => $cashlessRevenue,
                    'cash_revenue' => $cashRevenue,
                ],
                'revenueTrend' => $revenueTrend,
                'paymentDistribution' => $paymentDistribution,
                'topSellingMenus' => $topSellingMenus,
                'orders' => $recentOrders,
            ]);
        } catch (Throwable $e) {
            Log::error('Gagal memuat data dashboard tenant: '.$e->getMessage(), [
                'exception' => $e,
            ]);

            return Inertia::render('tenant/dashboard', [
                'tenant' => [
                    'id' => 1,
                    'name' => 'Stand Kantin FEB',
                    'slug' => 'stand-kantin',
                    'is_active' => true,
                    'category' => 'Makanan & Minuman',
                ],
                'metrics' => [
                    'pending_orders' => 0,
                    'processing_orders' => 0,
                    'ready_orders' => 0,
                    'completed_today' => 0,
                    'today_revenue' => 0,
                    'active_menu_count' => 0,
                    'total_menu_count' => 0,
                    'is_stand_active' => true,
                ],
                'revenueTrend' => [],
                'paymentDistribution' => [],
                'topSellingMenus' => [],
                'orders' => [],
            ]);
        }
    }
}
