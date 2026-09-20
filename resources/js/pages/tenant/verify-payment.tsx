import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Head, router } from '@inertiajs/react';
import { QrCode, Wallet } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { verifyPayment as verifyPaymentRoute } from '@/routes/tenant';
import type { TenantOrderDetailItem } from './types';
import { getVerifyPaymentColumns } from './components/verify-payment/verify-payment-columns';
import { VerifyPaymentDialog } from './components/verify-payment/verify-payment-dialog';
import { VerifyPaymentFilters } from './components/verify-payment/verify-payment-filters';
import { VerifyPaymentSummaryCards } from './components/verify-payment/verify-payment-summary-cards';
import { TenantPageHeader } from './components/tenant-page-header';

type Props = {
    orders?: TenantOrderDetailItem[];
    counts?: {
        unpaid_count: number;
        unpaid_amount: number;
        verified_today_count: number;
        verified_today_amount: number;
    };
    filters?: {
        status?: string;
        search?: string;
    };
    error?: string;
};

export default function TenantVerifyPayment({
    orders = [],
    counts = {
        unpaid_count: 0,
        unpaid_amount: 0,
        verified_today_count: 0,
        verified_today_amount: 0,
    },
    filters = {
        status: 'unpaid',
        search: '',
    },
    error,
}: Props) {
    const [searchQuery, setSearchQuery] = useState<string>(filters.search || '');
    const [activeStatus, setActiveStatus] = useState<string>(filters.status || 'unpaid');
    const [isSearching, setIsSearching] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<TenantOrderDetailItem | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Live debounced server-side search (350ms)
    useEffect(() => {
        if (searchQuery === (filters.search || '')) {
            return;
        }

        setIsSearching(true);
        const timer = setTimeout(() => {
            applyFilters(activeStatus, searchQuery, () => setIsSearching(false));
        }, 350);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSearchSubmit = (e: FormEvent) => {
        e.preventDefault();
        applyFilters(activeStatus, searchQuery);
    };

    const handleStatusChange = (status: string) => {
        setActiveStatus(status);
        applyFilters(status, searchQuery);
    };

    const applyFilters = (status: string, search: string, onFinish?: () => void) => {
        const queryParams: Record<string, any> = {};
        if (status && status !== 'all') queryParams.status = status;
        if (search.trim()) queryParams.search = search.trim();

        router.get(verifyPaymentRoute.url(), queryParams, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
            onFinish: () => onFinish?.(),
        });
    };

    const handleResetFilter = () => {
        setActiveStatus('unpaid');
        setSearchQuery('');
        setIsSearching(true);
        router.get(
            verifyPaymentRoute.url(),
            {},
            {
                preserveState: true,
                replace: true,
                preserveScroll: true,
                onFinish: () => setIsSearching(false),
            }
        );
    };

    const handleOpenOrder = (ord: TenantOrderDetailItem) => {
        setSelectedOrder(ord);
        setIsDialogOpen(true);
    };

    const handleOpenScanner = () => {
        if (orders.length > 0 && !selectedOrder) {
            setSelectedOrder(orders[0]);
        }
        setIsDialogOpen(true);
    };

    const columns = useMemo(
        () => getVerifyPaymentColumns((ord: TenantOrderDetailItem) => handleOpenOrder(ord)),
        []
    );

    return (
        <>
            <Head title="Verifikasi Pembayaran Tunai & QR - Smart Canteen FEB" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <TenantPageHeader
                    icon={Wallet}
                    iconVariant="emerald"
                    title="Verifikasi Pembayaran Tunai"
                    description="Konfirmasi uang tunai mahasiswa via Scan QR Pass / Kode Pickup (FEB-xxxx)."
                />

                {/* Summary Metric Cards */}
                <VerifyPaymentSummaryCards counts={counts} />

                {/* Filters & Live Search Bar */}
                <VerifyPaymentFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onSearchSubmit={handleSearchSubmit}
                    activeStatus={activeStatus}
                    onStatusChange={handleStatusChange}
                    onResetFilter={handleResetFilter}
                    onOpenScanner={handleOpenScanner}
                    isSearching={isSearching}
                />

                {/* Data Table List */}
                <div className="rounded-xl border border-border/70 bg-card p-4 shadow-xs">
                    <DataTable columns={columns} data={orders} />
                </div>
            </div>

            {/* Cash Verification Dialog & Quick Lookup Modal */}
            <VerifyPaymentDialog
                order={selectedOrder}
                orders={orders}
                isOpen={isDialogOpen}
                onClose={() => {
                    setIsDialogOpen(false);
                    setSelectedOrder(null);
                }}
                onSelectOrder={(ord) => setSelectedOrder(ord)}
            />
        </>
    );
}

TenantVerifyPayment.layout = {
    breadcrumbs: [
        {
            title: 'Tenant Dashboard',
            href: '/tenant/dashboard',
        },
        {
            title: 'Verifikasi Kasir Tunai',
            href: '/tenant/verify-payment',
        },
    ],
};
