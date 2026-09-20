import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Utensils } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { menus as menusRoute } from '@/routes/tenant';
import {
    create as createMenuRoute,
    restore as restoreMenuRoute,
    toggleAvailability as toggleAvailabilityRoute,
    toggleRecommendation as toggleRecommendationRoute,
} from '@/routes/tenant/menus';
import type { TenantMenuItem } from './types';
import { getMenuColumns } from './components/menus/menu-columns';
import { MenuDeleteDialog } from './components/menus/menu-delete-dialog';
import { MenuFilters } from './components/menus/menu-filters';
import { MenuSummaryCards } from './components/menus/menu-summary-cards';
import { TenantPageHeader } from './components/tenant-page-header';

type Props = {
    menus?: TenantMenuItem[];
    categories?: { id: number; name: string }[];
    pagination?: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    } | null;
    filters?: {
        status?: string;
        category_id?: string;
        recommended?: string;
        search?: string;
    };
    counts?: {
        all: number;
        available: number;
        unavailable: number;
        recommended?: number;
        trashed: number;
    };
    error?: string;
};

export default function TenantMenus({
    menus = [],
    categories = [],
    pagination,
    filters = {
        status: 'all',
        category_id: 'all',
        recommended: 'all',
        search: '',
    },
    counts = {
        all: 0,
        available: 0,
        unavailable: 0,
        recommended: 0,
        trashed: 0,
    },
    error,
}: Props) {
    const [searchQuery, setSearchQuery] = useState<string>(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState<string>(filters.status || 'all');
    const [selectedCategory, setSelectedCategory] = useState<string>(filters.category_id || 'all');
    const [isSearching, setIsSearching] = useState(false);

    const [deletingMenu, setDeletingMenu] = useState<TenantMenuItem | null>(null);
    const [togglingId, setTogglingId] = useState<number | null>(null);
    const [togglingRecId, setTogglingRecId] = useState<number | null>(null);
    const [restoringId, setRestoringId] = useState<number | null>(null);

    // Live debounced server-side search (350ms)
    useEffect(() => {
        if (searchQuery === (filters.search || '')) {
            return;
        }

        setIsSearching(true);
        const timer = setTimeout(() => {
            applyFilters(selectedStatus, selectedCategory, searchQuery, 1, () => setIsSearching(false));
        }, 350);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSearchSubmit = (e: FormEvent) => {
        e.preventDefault();
        applyFilters(selectedStatus, selectedCategory, searchQuery, 1);
    };

    const handleStatusChange = (status: string) => {
        setSelectedStatus(status);
        applyFilters(status, selectedCategory, searchQuery, 1);
    };

    const handleCategoryChange = (catId: string) => {
        setSelectedCategory(catId);
        applyFilters(selectedStatus, catId, searchQuery, 1);
    };

    const handlePageChange = (newPage: number) => {
        applyFilters(selectedStatus, selectedCategory, searchQuery, newPage);
    };

    const applyFilters = (
        status: string,
        catId: string,
        search: string,
        page: number = 1,
        onFinish?: () => void
    ) => {
        const queryParams: Record<string, any> = {};
        if (status && status !== 'all') queryParams.status = status;
        if (catId && catId !== 'all') queryParams.category_id = catId;
        if (search.trim()) queryParams.search = search.trim();
        if (page > 1) queryParams.page = page;

        router.get(menusRoute.url(), queryParams, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
            onFinish: () => onFinish?.(),
        });
    };

    const handleResetFilter = () => {
        setSelectedStatus('all');
        setSelectedCategory('all');
        setSearchQuery('');
        setIsSearching(true);
        router.get(
            menusRoute.url(),
            {},
            {
                preserveState: true,
                replace: true,
                preserveScroll: true,
                onFinish: () => setIsSearching(false),
            }
        );
    };

    const handleToggleAvailability = (menu: TenantMenuItem) => {
        setTogglingId(menu.id);
        router.patch(
            toggleAvailabilityRoute.url(menu.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => setTogglingId(null),
            }
        );
    };

    const handleToggleRecommendation = (menu: TenantMenuItem) => {
        setTogglingRecId(menu.id);
        router.patch(
            toggleRecommendationRoute.url(menu.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => setTogglingRecId(null),
            }
        );
    };

    const handleRestore = (menu: TenantMenuItem) => {
        setRestoringId(menu.id);
        router.post(
            restoreMenuRoute.url(menu.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => setRestoringId(null),
            }
        );
    };

    const columns = useMemo(
        () =>
            getMenuColumns({
                onDelete: (m) => setDeletingMenu(m),
                onToggleAvailability: (m) => handleToggleAvailability(m),
                onToggleRecommendation: (m) => handleToggleRecommendation(m),
                onRestore: (m) => handleRestore(m),
                togglingId,
                togglingRecId,
                restoringId,
            }),
        [togglingId, togglingRecId, restoringId]
    );

    return (
        <>
            <Head title="Kelola Katalog Menu Stand - Smart Canteen FEB" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <TenantPageHeader
                    icon={Utensils}
                    iconVariant="primary"
                    title="Katalog & Kelola Menu Stand"
                    description="Atur daftar menu, harga, diskon, toggle stok, dan arsip menu."
                    actions={
                        <Link href={createMenuRoute.url()}>
                            <Button size="sm" className="gap-1.5 text-xs font-semibold h-8">
                                <Plus className="h-3.5 w-3.5" />
                                <span>Tambah Menu</span>
                            </Button>
                        </Link>
                    }
                />

                {/* Summary Metric Cards */}
                <MenuSummaryCards counts={counts} />

                {/* Search & Filter Bar */}
                <MenuFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onSearchSubmit={handleSearchSubmit}
                    selectedStatus={selectedStatus}
                    onStatusChange={handleStatusChange}
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                    categories={categories}
                    onResetFilter={handleResetFilter}
                    isSearching={isSearching}
                />

                {/* Data Table */}
                <div className="rounded-xl border border-border/70 bg-card p-4 shadow-xs">
                    <DataTable columns={columns} data={menus} />

                    {/* Pagination Bar */}
                    {pagination && pagination.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-border/50 pt-4 mt-4 text-xs text-muted-foreground">
                            <div>
                                Menampilkan <span className="font-semibold text-foreground">{pagination.from}</span> -{' '}
                                <span className="font-semibold text-foreground">{pagination.to}</span> dari{' '}
                                <span className="font-semibold text-foreground">{pagination.total}</span> menu
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={pagination.current_page === 1}
                                    onClick={() => handlePageChange(pagination.current_page - 1)}
                                    className="h-8 px-2.5 text-xs font-medium"
                                >
                                    Sebelumnya
                                </Button>

                                {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((p) => (
                                    <Button
                                        key={p}
                                        variant={pagination.current_page === p ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => handlePageChange(p)}
                                        className="h-8 w-8 p-0 text-xs font-semibold"
                                    >
                                        {p}
                                    </Button>
                                ))}

                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={pagination.current_page === pagination.last_page}
                                    onClick={() => handlePageChange(pagination.current_page + 1)}
                                    className="h-8 px-2.5 text-xs font-medium"
                                >
                                    Selanjutnya
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Modal */}
            <MenuDeleteDialog
                menu={deletingMenu}
                isOpen={!!deletingMenu}
                onClose={() => setDeletingMenu(null)}
            />
        </>
    );
}

TenantMenus.layout = {
    breadcrumbs: [
        {
            title: 'Tenant Dashboard',
            href: '/tenant/dashboard',
        },
        {
            title: 'Kelola Menu Stand',
            href: '/tenant/menus',
        },
    ],
};
