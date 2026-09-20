import { useEffect, useMemo, useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { AlertTriangle, Receipt, RefreshCw } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { orders as ordersRoute } from '@/routes/admin';
import { getOrderColumns } from './components/orders/order-columns';
import { OrderDeleteDialog } from './components/orders/order-delete-dialog';
import { OrderFilters } from './components/orders/order-filters';
import { OrderReceiptDialog } from './components/orders/order-receipt-dialog';
import { OrderStatusDialog } from './components/orders/order-status-dialog';
import { OrderSummaryCards } from './components/orders/order-summary-cards';
import type { OrderFilters as OrderFiltersType, OrderItem, OrderPageProps } from './types';

export default function AdminOrders({
    orders,
    summary,
    tenants,
    filters,
    error,
}: OrderPageProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [isSearching, setIsSearching] = useState(false);
    const [tenantFilter, setTenantFilter] = useState(filters.tenant_id || 'all');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState(filters.payment_status || 'all');
    const [paymentMethodFilter, setPaymentMethodFilter] = useState(filters.payment_method || 'all');
    const [dateFilter, setDateFilter] = useState(filters.date || 'all');

    // Dialog state
    const [viewingOrder, setViewingOrder] = useState<OrderItem | null>(null);
    const [editingOrder, setEditingOrder] = useState<OrderItem | null>(null);
    const [deletingOrder, setDeletingOrder] = useState<OrderItem | null>(null);

    const isInitialMount = useRef(true);

    const applyFilters = (newFilters: Partial<OrderFiltersType> = {}) => {
        router.get(
            ordersRoute.url({
                query: {
                    search: newFilters.search ?? searchQuery,
                    tenant_id: newFilters.tenant_id ?? tenantFilter,
                    status: newFilters.status ?? statusFilter,
                    payment_status: newFilters.payment_status ?? paymentStatusFilter,
                    payment_method: newFilters.payment_method ?? paymentMethodFilter,
                    date: newFilters.date ?? dateFilter,
                    page: 1, // Reset page on filter change
                },
            }),
            {},
            { preserveState: true, replace: true, preserveScroll: true }
        );
    };

    // Debounced live search
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        setIsSearching(true);
        const timer = setTimeout(() => {
            router.get(
                ordersRoute.url({
                    query: {
                        search: searchQuery,
                        tenant_id: tenantFilter,
                        status: statusFilter,
                        payment_status: paymentStatusFilter,
                        payment_method: paymentMethodFilter,
                        date: dateFilter,
                        page: 1,
                    },
                }),
                {},
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                    onFinish: () => setIsSearching(false),
                }
            );
        }, 350);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleClearSearch = () => {
        setSearchQuery('');
        setIsSearching(true);
        router.get(
            ordersRoute.url({
                query: {
                    search: '',
                    tenant_id: tenantFilter,
                    status: statusFilter,
                    payment_status: paymentStatusFilter,
                    payment_method: paymentMethodFilter,
                    date: dateFilter,
                    page: 1,
                },
            }),
            {},
            {
                preserveState: true,
                replace: true,
                preserveScroll: true,
                onFinish: () => setIsSearching(false),
            }
        );
    };

    const handleResetFilters = () => {
        setSearchQuery('');
        setTenantFilter('all');
        setStatusFilter('all');
        setPaymentStatusFilter('all');
        setPaymentMethodFilter('all');
        setDateFilter('all');
        router.get(ordersRoute.url(), {}, { preserveState: true, replace: true });
    };

    const handlePageChange = (newPage: number) => {
        router.get(
            ordersRoute.url({
                query: {
                    search: searchQuery,
                    tenant_id: tenantFilter,
                    status: statusFilter,
                    payment_status: paymentStatusFilter,
                    payment_method: paymentMethodFilter,
                    date: dateFilter,
                    page: newPage,
                },
            }),
            {},
            { preserveState: true, replace: true, preserveScroll: true }
        );
    };

    // Data Table Column Definitions
    const columns = useMemo(
        () =>
            getOrderColumns({
                onView: (o) => setViewingOrder(o),
                onEdit: (o) => setEditingOrder(o),
                onDelete: (o) => setDeletingOrder(o),
            }),
        []
    );

    return (
        <>
            <Head title="Audit Semua Transaksi - Admin" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header Banner */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-5">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Receipt className="h-5 w-5" />
                            </div>
                            <h1 className="text-2xl font-black tracking-tight text-foreground">
                                Audit Transaksi Pemesanan FEB
                            </h1>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Pengawasan seluruh transaksi kantin: alur pemrosesan pesanan, verifikasi pembayaran kasir & Midtrans.
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        onClick={handleResetFilters}
                        className="gap-1.5 self-start sm:self-auto shadow-xs text-xs font-semibold"
                    >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Reset Semua Filter
                    </Button>
                </div>

                {/* Dashboard-style Summary Stat Cards */}
                <OrderSummaryCards summary={summary} />

                {/* Error Banner if any */}
                {error && (
                    <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Filter and Live Debounced Search Toolbar */}
                <OrderFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onClearSearch={handleClearSearch}
                    isSearching={isSearching}
                    tenantFilter={tenantFilter}
                    onTenantFilterChange={(val) => {
                        setTenantFilter(val);
                        applyFilters({ tenant_id: val });
                    }}
                    statusFilter={statusFilter}
                    onStatusFilterChange={(val) => {
                        setStatusFilter(val);
                        applyFilters({ status: val });
                    }}
                    paymentStatusFilter={paymentStatusFilter}
                    onPaymentStatusFilterChange={(val) => {
                        setPaymentStatusFilter(val);
                        applyFilters({ payment_status: val });
                    }}
                    dateFilter={dateFilter}
                    onDateFilterChange={(val) => {
                        setDateFilter(val);
                        applyFilters({ date: val });
                    }}
                    tenants={tenants}
                />

                {/* Data Table */}
                <DataTable
                    columns={columns}
                    data={orders.data}
                    showColumnVisibility={true}
                    manualPagination={true}
                    currentPage={orders.current_page}
                    pageCount={orders.last_page}
                    pageSize={orders.per_page}
                    totalRows={orders.total}
                    fromRow={orders.from}
                    toRow={orders.to}
                    onPageChange={handlePageChange}
                    emptyMessage="Tidak ada transaksi pesanan yang sesuai dengan kriteria filter."
                />
            </div>

            {/* Modular Dialogs */}
            <OrderReceiptDialog
                order={viewingOrder}
                onClose={() => setViewingOrder(null)}
            />
            <OrderStatusDialog
                order={editingOrder}
                onClose={() => setEditingOrder(null)}
            />
            <OrderDeleteDialog
                order={deletingOrder}
                onClose={() => setDeletingOrder(null)}
            />
        </>
    );
}

AdminOrders.layout = {
    breadcrumbs: [
        {
            title: 'Admin Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Semua Transaksi',
            href: '/admin/orders',
        },
    ],
};
