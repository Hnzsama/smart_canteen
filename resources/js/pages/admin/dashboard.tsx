import { useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import { LayoutDashboard, Store, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { dashboard as adminDashboard } from '@/routes/admin';
import { DashboardMetricCards } from './components/dashboard/dashboard-metric-cards';
import { DashboardPaymentChart } from './components/dashboard/dashboard-payment-chart';
import { DashboardRecentOrders } from './components/dashboard/dashboard-recent-orders';
import { DashboardRevenueChart } from './components/dashboard/dashboard-revenue-chart';
import { DashboardTenantCombobox } from './components/dashboard/dashboard-tenant-combobox';
import type { DashboardProps } from './types';

export default function AdminDashboard({
    metrics,
    recentOrders = [],
    revenueTrend = [],
    paymentDistribution = [],
    tenants = [],
    selectedTenantId,
}: DashboardProps) {
    const selectedTenant = useMemo(() => {
        if (!selectedTenantId) return null;
        return tenants.find((t) => t.id === selectedTenantId);
    }, [tenants, selectedTenantId]);

    const handleResetFilter = () => {
        router.get(adminDashboard.url(), {}, { preserveState: true, replace: true });
    };

    return (
        <>
            <Head title="Dashboard Supervisi - Smart Canteen FEB" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header & Filter Bar */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-border/50 pb-5">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <LayoutDashboard className="h-5 w-5" />
                            </div>
                            <h1 className="text-2xl font-black tracking-tight text-foreground">
                                Dashboard Supervisi Kantin FEB
                            </h1>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Monitoring analitik operasional, transaksi omset, dan performa mitra stand kantin.
                        </p>
                    </div>

                    {/* Tenant Combobox Filter */}
                    <div className="self-start lg:self-auto">
                        <DashboardTenantCombobox
                            tenants={tenants}
                            selectedTenantId={selectedTenantId}
                        />
                    </div>
                </div>

                {/* Filter Active Notice Banner */}
                {selectedTenant && (
                    <div className="flex items-center justify-between rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 text-sm text-foreground">
                        <div className="flex items-center gap-2">
                            <Store className="h-4 w-4 text-primary shrink-0" />
                            <span>
                                Menampilkan analitik data khusus untuk mitra stand: <b>{selectedTenant.name}</b>
                            </span>
                            <Badge variant={selectedTenant.is_active ? 'secondary' : 'outline'} className="text-[10px] py-0">
                                {selectedTenant.is_active ? 'Stand Buka' : 'Stand Tutup'}
                            </Badge>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleResetFilter}
                            className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-3.5 w-3.5" />
                            Reset Filter
                        </Button>
                    </div>
                )}

                {/* Top Metrics Summary Cards */}
                <DashboardMetricCards metrics={metrics} />

                {/* Analytics Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Daily Revenue Area Trend */}
                    <DashboardRevenueChart revenueTrend={revenueTrend} />

                    {/* Payment Ratio Donut Chart */}
                    <DashboardPaymentChart
                        metrics={metrics}
                        paymentDistribution={paymentDistribution}
                    />
                </div>

                {/* Live Recent Orders Feed */}
                <DashboardRecentOrders recentOrders={recentOrders} />
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Admin Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Supervisi & Analitik',
            href: '/admin/dashboard',
        },
    ],
};
