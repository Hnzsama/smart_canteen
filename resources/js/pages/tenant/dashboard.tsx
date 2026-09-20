import { Head } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Store, Utensils } from 'lucide-react';
import { TenantMetricCards } from './components/dashboard/tenant-metric-cards';
import { TenantOrderBoardPreview } from './components/dashboard/tenant-order-board-preview';
import { TenantPaymentChart } from './components/dashboard/tenant-payment-chart';
import { TenantQuickActions } from './components/dashboard/tenant-quick-actions';
import { TenantRevenueChart } from './components/dashboard/tenant-revenue-chart';
import { TenantTopMenusChart } from './components/dashboard/tenant-top-menus-chart';
import { TenantPageHeader } from './components/tenant-page-header';
import type { TenantDashboardProps } from './types';

export default function TenantDashboard({
    tenant = {
        id: 1,
        name: 'Mitra Stand Kantin FEB',
        slug: 'stand-kantin-feb',
        is_active: true,
        category: 'Makanan & Minuman',
    },
    metrics = {
        pending_orders: 0,
        processing_orders: 0,
        ready_orders: 0,
        completed_today: 0,
        today_revenue: 0,
        active_menu_count: 0,
        total_menu_count: 0,
        is_stand_active: true,
    },
    revenueTrend = [],
    paymentDistribution = [],
    topSellingMenus = [],
    orders = [],
}: TenantDashboardProps) {
    return (
        <>
            <Head title="Tenant Dashboard - Smart Canteen FEB" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <TenantPageHeader
                    icon={Store}
                    iconVariant="primary"
                    title={tenant.name}
                    description="Pengelolaan operasional dapur, verifikasi tunai, dan katalog menu mitra."
                    badges={
                        <>
                            <Badge
                                variant={tenant.is_active ? 'secondary' : 'outline'}
                                className={`text-xs gap-1 py-0.5 px-2 ${
                                    tenant.is_active
                                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                                        : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-800'
                                }`}
                            >
                                <span className={`h-1.5 w-1.5 rounded-full ${tenant.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                {tenant.is_active ? 'Stand Buka' : 'Stand Tutup'}
                            </Badge>
                            {tenant.category && (
                                <span className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-0.5 rounded-md font-medium text-foreground">
                                    <Utensils className="h-3 w-3" />
                                    {tenant.category}
                                </span>
                            )}
                        </>
                    }
                />

                {/* Top Metrics Summary Cards */}
                <TenantMetricCards metrics={metrics} />

                {/* Analytics Charts Section 1: Revenue Trend & Payment Ratio */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Daily Revenue Area Trend */}
                    <TenantRevenueChart revenueTrend={revenueTrend} />

                    {/* Payment Ratio Donut Chart */}
                    <TenantPaymentChart metrics={metrics} />
                </div>

                {/* Analytics Charts Section 2: Top Selling Menu Items */}
                <TenantTopMenusChart topSellingMenus={topSellingMenus} />

                {/* Quick Action Navigation Grid */}
                <TenantQuickActions />

                {/* Kitchen Order Stream Board */}
                <TenantOrderBoardPreview orders={orders} />
            </div>
        </>
    );
}

TenantDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Tenant Dashboard',
            href: '/tenant/dashboard',
        },
        {
            title: 'Operasional Stand',
            href: '/tenant/dashboard',
        },
    ],
};
