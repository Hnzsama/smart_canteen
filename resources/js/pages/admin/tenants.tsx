import { useEffect, useMemo, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { AlertTriangle, Plus, Store } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { tenants as tenantsRoute } from '@/routes/admin';
import {
    restore as restoreTenant,
    toggleStatus as toggleStatusTenant,
} from '@/routes/admin/tenants';
import { getTenantColumns } from './components/tenants/tenant-columns';
import { TenantCreateDialog } from './components/tenants/tenant-create-dialog';
import { TenantDeleteDialog } from './components/tenants/tenant-delete-dialog';
import { TenantEditDialog } from './components/tenants/tenant-edit-dialog';
import { TenantFilters } from './components/tenants/tenant-filters';
import { TenantSummaryCards } from './components/tenants/tenant-summary-cards';
import type { TenantItem, TenantPageProps } from './types';

export default function AdminTenants({
    tenants = [],
    pagination,
    filters = { status: 'all', search: '' },
    counts = { all: 0, active: 0, inactive: 0, trashed: 0 },
    available_users = [],
    error,
}: TenantPageProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [isSearching, setIsSearching] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingTenant, setEditingTenant] = useState<TenantItem | null>(null);
    const [deletingTenant, setDeletingTenant] = useState<TenantItem | null>(null);
    const [togglingId, setTogglingId] = useState<number | null>(null);
    const [restoringId, setRestoringId] = useState<number | null>(null);

    // Live debounced search effect
    useEffect(() => {
        if (searchQuery === (filters.search || '')) {
            return;
        }

        setIsSearching(true);
        const timer = setTimeout(() => {
            router.get(
                tenantsRoute.url({
                    query: {
                        status: filters.status,
                        search: searchQuery,
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
            tenantsRoute.url({
                query: {
                    status: filters.status,
                    search: '',
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

    const handleStatusChange = (newStatus: string) => {
        router.get(
            tenantsRoute.url({
                query: {
                    status: newStatus,
                    search: searchQuery,
                    page: 1,
                },
            }),
            {},
            { preserveState: true, replace: true }
        );
    };

    const handlePageChange = (newPage: number) => {
        router.get(
            tenantsRoute.url({
                query: {
                    status: filters.status,
                    search: searchQuery,
                    page: newPage,
                },
            }),
            {},
            {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            }
        );
    };

    const handleToggleStatus = (tenant: TenantItem) => {
        setTogglingId(tenant.id);
        router.patch(
            toggleStatusTenant.url(tenant.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => setTogglingId(null),
            }
        );
    };

    const handleRestore = (tenant: TenantItem) => {
        setRestoringId(tenant.id);
        router.post(
            restoreTenant.url(tenant.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => setRestoringId(null),
            }
        );
    };

    // Data Table Column Definitions
    const columns = useMemo(
        () =>
            getTenantColumns({
                onEdit: (t) => setEditingTenant(t),
                onDelete: (t) => setDeletingTenant(t),
                onToggleStatus: (t) => handleToggleStatus(t),
                onRestore: (t) => handleRestore(t),
                togglingId,
                restoringId,
            }),
        [togglingId, restoringId]
    );

    return (
        <>
            <Head title="Kelola Stand Kantin - Admin" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header Banner */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-5">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Store className="h-5 w-5" />
                            </div>
                            <h1 className="text-2xl font-black tracking-tight text-foreground">
                                Manajemen Mitra Stand Kantin FEB
                            </h1>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Kelola data mitra stand, penugasan akun pengelola, status operasional buka/tutup, dan arsip kantin.
                        </p>
                    </div>

                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        className="gap-2 self-start sm:self-auto shadow-xs font-semibold"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Stand Baru
                    </Button>
                </div>

                {/* Summary Stat Cards */}
                <TenantSummaryCards counts={counts} />

                {/* Error Banner if any */}
                {error && (
                    <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Filter and Live Debounced Search Bar */}
                <TenantFilters
                    statusFilter={filters.status}
                    onStatusChange={handleStatusChange}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onClearSearch={handleClearSearch}
                    isSearching={isSearching}
                    counts={counts}
                />

                {/* Data Table */}
                <div className="rounded-xl border border-border/70 bg-card p-4 shadow-xs">
                    <DataTable columns={columns} data={tenants} />

                    {/* Custom Pagination */}
                    {pagination && pagination.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-border/50 pt-4 mt-4 text-xs text-muted-foreground">
                            <div>
                                Menampilkan <span className="font-semibold text-foreground">{pagination.from}</span> -{' '}
                                <span className="font-semibold text-foreground">{pagination.to}</span> dari{' '}
                                <span className="font-semibold text-foreground">{pagination.total}</span> stand
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

            {/* Modals */}
            <TenantCreateDialog
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                availableUsers={available_users}
            />

            <TenantEditDialog
                tenant={editingTenant}
                onClose={() => setEditingTenant(null)}
                availableUsers={available_users}
            />

            <TenantDeleteDialog
                tenant={deletingTenant}
                onClose={() => setDeletingTenant(null)}
            />
        </>
    );
}

AdminTenants.layout = {
    breadcrumbs: [
        {
            title: 'Admin Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Kelola Stand Kantin',
            href: '/admin/tenants',
        },
    ],
};
