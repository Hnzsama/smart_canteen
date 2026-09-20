import { useEffect, useMemo, useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { AlertTriangle, Plus, Users } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { users as usersRoute } from '@/routes/admin';
import {
    restore as restoreUser,
    toggleVerify as toggleVerifyUser,
} from '@/routes/admin/users';
import { getUserColumns } from './components/users/user-columns';
import { UserCreateDialog } from './components/users/user-create-dialog';
import { UserDeleteDialog } from './components/users/user-delete-dialog';
import { UserEditDialog } from './components/users/user-edit-dialog';
import { UserFilters } from './components/users/user-filters';
import { UserSummaryCards } from './components/users/user-summary-cards';
import type { UserItem, UserPageProps } from './types';

export default function AdminUsers({
    users,
    pagination,
    tenants,
    filters,
    counts,
    currentUserId,
    error,
}: UserPageProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [isSearching, setIsSearching] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);
    const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);
    const [verifyingId, setVerifyingId] = useState<number | null>(null);
    const [restoringId, setRestoringId] = useState<number | null>(null);

    const isInitialMount = useRef(true);

    // Debounced server-side live search
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        setIsSearching(true);
        const timer = setTimeout(() => {
            router.get(
                usersRoute.url({
                    query: {
                        role: filters.role,
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
            usersRoute.url({
                query: {
                    role: filters.role,
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

    const handleRoleChange = (newRole: string) => {
        router.get(
            usersRoute.url({
                query: {
                    role: newRole,
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
            usersRoute.url({
                query: {
                    role: filters.role,
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

    const handleRestore = (user: UserItem) => {
        setRestoringId(user.id);
        router.post(
            restoreUser.url(user.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => setRestoringId(null),
            }
        );
    };

    const handleToggleVerify = (user: UserItem) => {
        setVerifyingId(user.id);
        router.patch(
            toggleVerifyUser.url(user.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => setVerifyingId(null),
            }
        );
    };

    // Data Table Column Definitions
    const columns = useMemo(
        () =>
            getUserColumns({
                currentUserId,
                verifyingId,
                restoringId,
                onEdit: (u) => setEditingUser(u),
                onDelete: (u) => setDeletingUser(u),
                onToggleVerify: (u) => handleToggleVerify(u),
                onRestore: (u) => handleRestore(u),
            }),
        [currentUserId, verifyingId, restoringId]
    );

    return (
        <>
            <Head title="Kelola Pengguna - Admin" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header Banner */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-5">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Users className="h-5 w-5" />
                            </div>
                            <h1 className="text-2xl font-black tracking-tight text-foreground">
                                Manajemen Pengguna Sistem FEB
                            </h1>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Kelola hak akses dan akun: Mahasiswa, Pengelola Stand Kantin, serta Administrator.
                        </p>
                    </div>

                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        className="gap-2 self-start sm:self-auto shadow-xs font-semibold"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Pengguna Baru
                    </Button>
                </div>

                {/* Dashboard-style Metric Stat Cards */}
                <UserSummaryCards counts={counts} />

                {/* Error Banner if any */}
                {error && (
                    <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Filter and Live Debounced Search Bar */}
                <UserFilters
                    roleFilter={filters.role}
                    onRoleChange={handleRoleChange}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onClearSearch={handleClearSearch}
                    isSearching={isSearching}
                    counts={counts}
                />

                {/* Data Table */}
                <DataTable
                    columns={columns}
                    data={users}
                    showColumnVisibility={true}
                    manualPagination={true}
                    currentPage={pagination?.current_page ?? 1}
                    pageCount={pagination?.last_page ?? 1}
                    pageSize={pagination?.per_page ?? 10}
                    totalRows={pagination?.total ?? counts.all}
                    fromRow={pagination?.from ?? (users.length > 0 ? 1 : 0)}
                    toRow={pagination?.to ?? users.length}
                    onPageChange={handlePageChange}
                    emptyMessage="Tidak ada akun pengguna yang ditemukan."
                />
            </div>

            {/* Modular Dialogs */}
            <UserCreateDialog
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                tenants={tenants}
            />
            <UserEditDialog
                user={editingUser}
                onClose={() => setEditingUser(null)}
                tenants={tenants}
                currentUserId={currentUserId}
            />
            <UserDeleteDialog
                user={deletingUser}
                onClose={() => setDeletingUser(null)}
            />
        </>
    );
}

AdminUsers.layout = {
    breadcrumbs: [
        {
            title: 'Admin Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Kelola Pengguna',
            href: '/admin/users',
        },
    ],
};
