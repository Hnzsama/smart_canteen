import { useMemo, useState, type FormEvent } from 'react';
import { Head, router } from '@inertiajs/react';
import { Plus, Tags } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { categories as categoriesRoute } from '@/routes/admin';
import { getCategoryColumns } from './components/categories/category-columns';
import { CategoryCreateDialog } from './components/categories/category-create-dialog';
import { CategoryDeleteDialog } from './components/categories/category-delete-dialog';
import { CategoryEditDialog } from './components/categories/category-edit-dialog';
import { CategoryFilters } from './components/categories/category-filters';
import { CategorySummaryCards } from './components/categories/category-summary-cards';
import type { CategoryItem, CategoryPageProps } from './types';

export default function AdminCategories({
    categories = [],
    pagination,
    tenants = [],
    filters,
    counts,
    error,
}: CategoryPageProps) {
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [selectedTenantFilter, setSelectedTenantFilter] = useState<string>(
        filters?.tenant_id ? String(filters.tenant_id) : 'all'
    );
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
    const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null);

    const handleSearchSubmit = (e: FormEvent) => {
        e.preventDefault();
        applyFilters(searchQuery, selectedTenantFilter);
    };

    const handleTenantFilterChange = (val: string) => {
        setSelectedTenantFilter(val);
        applyFilters(searchQuery, val);
    };

    const applyFilters = (search: string, tenantId: string) => {
        const queryParams: Record<string, any> = {};
        if (search.trim()) queryParams.search = search.trim();
        if (tenantId && tenantId !== 'all') queryParams.tenant_id = tenantId;

        router.get(categoriesRoute.url(), queryParams, {
            preserveState: true,
            replace: true,
        });
    };

    const handleResetFilter = () => {
        setSearchQuery('');
        setSelectedTenantFilter('all');
        router.get(categoriesRoute.url(), {}, { preserveState: true, replace: true });
    };

    const columns = useMemo(
        () =>
            getCategoryColumns({
                onEdit: (cat) => setEditingCategory(cat),
                onDelete: (cat) => setDeletingCategory(cat),
            }),
        []
    );

    return (
        <>
            <Head title="Master Data Kategori Menu - Smart Canteen FEB" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-border/50 pb-5">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                                <Tags className="h-5 w-5" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black tracking-tight text-foreground">
                                    Master Data Kategori Menu
                                </h1>
                                <p className="mt-0.5 text-sm text-muted-foreground">
                                    Kelola daftar kategori makanan/minuman untuk pengelompokan menu stand kantin FEB.
                                </p>
                            </div>
                        </div>
                    </div>

                    <Button onClick={() => setIsCreateOpen(true)} className="gap-2 text-xs font-semibold self-start lg:self-auto">
                        <Plus className="h-4 w-4" />
                        Tambah Kategori Baru
                    </Button>
                </div>

                {/* Summary Cards */}
                {counts && <CategorySummaryCards counts={counts} />}

                {/* Filter & Search Controls */}
                <CategoryFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onSearchSubmit={handleSearchSubmit}
                    selectedTenantFilter={selectedTenantFilter}
                    onTenantFilterChange={handleTenantFilterChange}
                    tenants={tenants}
                    onResetFilter={handleResetFilter}
                />

                {/* Data Table */}
                <div className="rounded-xl border border-border/70 bg-card p-4 shadow-xs">
                    <DataTable columns={columns} data={categories} />
                </div>
            </div>

            {/* Modals */}
            <CategoryCreateDialog
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                tenants={tenants}
            />

            <CategoryEditDialog
                category={editingCategory}
                isOpen={!!editingCategory}
                onClose={() => setEditingCategory(null)}
                tenants={tenants}
            />

            <CategoryDeleteDialog
                category={deletingCategory}
                isOpen={!!deletingCategory}
                onClose={() => setDeletingCategory(null)}
            />
        </>
    );
}

AdminCategories.layout = {
    breadcrumbs: [
        {
            title: 'Admin Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Master Data Kategori Menu',
            href: '/admin/categories',
        },
    ],
};
