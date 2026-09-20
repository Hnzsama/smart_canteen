import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Head, router } from '@inertiajs/react';
import { ChefHat, Kanban, LayoutList, Radio, Volume2, VolumeX } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { orders as tenantOrdersRoute } from '@/routes/tenant';
import { updateStatus as updateOrderStatusRoute } from '@/routes/tenant/orders';
import { TenantKitchenKanbanBoard } from './components/orders/tenant-kitchen-kanban-board';
import { getTenantOrderColumns } from './components/orders/tenant-order-columns';
import { TenantOrderDetailDialog, type TenantOrderDetailItem } from './components/orders/tenant-order-detail-dialog';
import { TenantOrderFilters } from './components/orders/tenant-order-filters';
import { TenantOrderSummaryCards } from './components/orders/tenant-order-summary-cards';
import { TenantPageHeader } from './components/tenant-page-header';

type Props = {
    orders?: TenantOrderDetailItem[];
    counts?: {
        total: number;
        pending: number;
        processing: number;
        ready: number;
        completed: number;
    };
    filters?: {
        status?: string;
        search?: string;
    };
    error?: string;
};

const playOrderNotificationSound = () => {
    try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();

        const now = ctx.currentTime;

        // Tone 1: G5 (783.99 Hz)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(783.99, now);
        gain1.gain.setValueAtTime(0.35, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.35);

        // Tone 2: C6 (1046.50 Hz)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1046.50, now + 0.12);
        gain2.gain.setValueAtTime(0.45, now + 0.12);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.12);
        osc2.stop(now + 0.6);
    } catch (err) {
        console.error('Sound notification error:', err);
    }
};

export default function TenantOrders({
    orders = [],
    counts = {
        total: 0,
        pending: 0,
        processing: 0,
        ready: 0,
        completed: 0,
    },
    filters = {
        status: 'all',
        search: '',
    },
    error,
}: Props) {
    const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
    const [activeTab, setActiveTab] = useState<string>(filters.status || 'all');
    const [searchQuery, setSearchQuery] = useState<string>(filters.search || '');
    const [isSearching, setIsSearching] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<TenantOrderDetailItem | null>(null);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const previousOrdersRef = useRef<Set<number> | null>(null);

    // Auto-polling for new incoming kitchen orders every 4 seconds
    useEffect(() => {
        const pollInterval = setInterval(() => {
            router.reload({ only: ['orders', 'counts'] });
        }, 4000);

        return () => clearInterval(pollInterval);
    }, []);

    // Detect new incoming order and play notification chime
    useEffect(() => {
        if (previousOrdersRef.current === null) {
            previousOrdersRef.current = new Set(orders.map((o) => o.id));
            return;
        }

        const currentOrderIds = new Set(orders.map((o) => o.id));
        const newOrders = orders.filter((o) => !previousOrdersRef.current?.has(o.id));

        if (newOrders.length > 0) {
            if (soundEnabled) {
                playOrderNotificationSound();
            }
        }

        previousOrdersRef.current = currentOrderIds;
    }, [orders, soundEnabled]);

    // Live debounced server-side search effect (350ms)
    useEffect(() => {
        if (searchQuery === (filters.search || '')) {
            return;
        }

        setIsSearching(true);
        const timer = setTimeout(() => {
            applyFilters(activeTab, searchQuery, () => setIsSearching(false));
        }, 350);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSearchSubmit = (e: FormEvent) => {
        e.preventDefault();
        applyFilters(activeTab, searchQuery);
    };

    const handleTabChange = (status: string) => {
        setActiveTab(status);
        applyFilters(status, searchQuery);
    };

    const applyFilters = (status: string, search: string, onFinish?: () => void) => {
        const queryParams: Record<string, any> = {};
        if (status && status !== 'all') queryParams.status = status;
        if (search.trim()) queryParams.search = search.trim();

        router.get(tenantOrdersRoute.url(), queryParams, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
            onFinish: () => onFinish?.(),
        });
    };

    const handleResetFilter = () => {
        setActiveTab('all');
        setSearchQuery('');
        setIsSearching(true);
        router.get(
            tenantOrdersRoute.url(),
            {},
            {
                preserveState: true,
                replace: true,
                preserveScroll: true,
                onFinish: () => setIsSearching(false),
            }
        );
    };

    const handleUpdateStatus = (orderId: number, nextStatus: TenantOrderDetailItem['status']) => {
        router.patch(
            updateOrderStatusRoute({ order: orderId }).url,
            { status: nextStatus },
            {
                preserveScroll: true,
                onSuccess: () => {
                    if (selectedOrder?.id === orderId) {
                        setSelectedOrder(null);
                    }
                },
            }
        );
    };

    const tableColumns = useMemo(
        () => getTenantOrderColumns((ord: TenantOrderDetailItem) => setSelectedOrder(ord)),
        []
    );

    return (
        <>
            <Head title="Order Board Dapur - Smart Canteen FEB" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <TenantPageHeader
                    icon={ChefHat}
                    iconVariant="primary"
                    title="Antrean Pesanan Dapur"
                    description="Kelola alur dapur realtime: Pesanan Masuk → Dimasak → Siap Diambil."
                    badges={
                        <>
                            <Badge className="bg-amber-500 text-white font-bold text-xs px-2 py-0.5 border-none">
                                {counts.pending + counts.processing + counts.ready} Antrean
                            </Badge>
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[11px] font-bold gap-1 px-2">
                                <Radio className="size-3 animate-pulse text-emerald-500" />
                                Live
                            </Badge>
                        </>
                    }
                    actions={
                        <>
                            {/* Sound controls */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={playOrderNotificationSound}
                                className="h-8 gap-1.5 text-xs font-bold rounded-xl border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 active:scale-95 transition-all"
                            >
                                <Volume2 className="h-3.5 w-3.5 text-amber-500" />
                                <span className="hidden xs:inline">Tes Suara</span>
                            </Button>

                            <Button
                                variant={soundEnabled ? 'secondary' : 'outline'}
                                size="sm"
                                onClick={() => setSoundEnabled(!soundEnabled)}
                                className="h-8 gap-1.5 text-xs font-bold rounded-xl active:scale-95 transition-all"
                            >
                                {soundEnabled ? (
                                    <>
                                        <Volume2 className="h-3.5 w-3.5 text-emerald-500" />
                                        <span className="hidden sm:inline">Suara Aktif</span>
                                    </>
                                ) : (
                                    <>
                                        <VolumeX className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="hidden sm:inline">Mute</span>
                                    </>
                                )}
                            </Button>

                            {/* View toggle */}
                            <div className="flex items-center gap-0.5 bg-muted/60 p-0.5 rounded-xl border border-border/70">
                                <Button
                                    variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('kanban')}
                                    className="h-7 gap-1.5 text-xs font-semibold px-3 rounded-lg"
                                >
                                    <Kanban className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">Kanban</span>
                                </Button>
                                <Button
                                    variant={viewMode === 'table' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('table')}
                                    className="h-7 gap-1.5 text-xs font-semibold px-3 rounded-lg"
                                >
                                    <LayoutList className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">Tabel</span>
                                </Button>
                            </div>
                        </>
                    }
                />

                {/* Summary Cards */}
                <TenantOrderSummaryCards
                    counts={counts}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                />

                {/* Search & Filter Bar */}
                <TenantOrderFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onSearchSubmit={handleSearchSubmit}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    onResetFilter={handleResetFilter}
                    isSearching={isSearching}
                />

                {/* Display Content: Kanban or Table */}
                {viewMode === 'kanban' ? (
                    <TenantKitchenKanbanBoard
                        orders={orders}
                        onSelectOrder={(ord: TenantOrderDetailItem) => setSelectedOrder(ord)}
                        onUpdateStatus={handleUpdateStatus}
                    />
                ) : (
                    <div className="rounded-xl border border-border/70 bg-card p-4 shadow-xs">
                        <DataTable columns={tableColumns} data={orders} />
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            <TenantOrderDetailDialog
                order={selectedOrder}
                isOpen={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                onUpdateStatus={handleUpdateStatus}
            />
        </>
    );
}

TenantOrders.layout = {
    breadcrumbs: [
        {
            title: 'Tenant Dashboard',
            href: '/tenant/dashboard',
        },
        {
            title: 'Antrean Pesanan Dapur',
            href: '/tenant/orders',
        },
    ],
};

