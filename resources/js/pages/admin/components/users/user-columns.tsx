import type { ColumnDef } from '@tanstack/react-table';
import {
    ArrowUpDown,
    CheckCircle2,
    Edit2,
    MailCheck,
    MailX,
    MoreHorizontal,
    RotateCcw,
    Shield,
    Store,
    Trash2,
    Users,
    XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { UserItem } from '../../types';

interface GetUserColumnsProps {
    currentUserId: number;
    verifyingId: number | null;
    restoringId: number | null;
    onEdit: (user: UserItem) => void;
    onDelete: (user: UserItem) => void;
    onToggleVerify: (user: UserItem) => void;
    onRestore: (user: UserItem) => void;
}

export function getRoleBadge(role: string, roleLabel: string) {
    switch (role) {
        case 'admin':
            return (
                <Badge
                    variant="secondary"
                    className="gap-1 bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800"
                >
                    <Shield className="h-3 w-3" />
                    {roleLabel}
                </Badge>
            );
        case 'tenant':
            return (
                <Badge
                    variant="secondary"
                    className="gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                >
                    <Store className="h-3 w-3" />
                    {roleLabel}
                </Badge>
            );
        default:
            return (
                <Badge
                    variant="secondary"
                    className="gap-1 bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                >
                    <Users className="h-3 w-3" />
                    {roleLabel}
                </Badge>
            );
    }
}

export function getUserColumns({
    currentUserId,
    verifyingId,
    restoringId,
    onEdit,
    onDelete,
    onToggleVerify,
    onRestore,
}: GetUserColumnsProps): ColumnDef<UserItem>[] {
    return [
        {
            id: 'select',
            header: ({ table }) => (
                <div className="px-1">
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() && 'indeterminate')
                        }
                        onCheckedChange={(value) =>
                            table.toggleAllPageRowsSelected(!!value)
                        }
                        aria-label="Pilih semua baris"
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="px-1">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Pilih baris"
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8 gap-1.5 font-bold hover:bg-muted/80 text-muted-foreground"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    <span>Pengguna</span>
                    <ArrowUpDown className="h-3.5 w-3.5" />
                </Button>
            ),
            cell: ({ row }) => {
                const user = row.original;
                const isCurrentUser = user.id === currentUserId;
                return (
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 font-bold text-sm text-primary shadow-xs">
                            {user.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-foreground">
                                    {user.name}
                                </span>
                                {isCurrentUser && (
                                    <Badge
                                        variant="outline"
                                        className="text-[10px] px-1.5 py-0 border-primary/30 text-primary font-medium"
                                    >
                                        Anda
                                    </Badge>
                                )}
                                {user.is_trashed && (
                                    <Badge
                                        variant="destructive"
                                        className="text-[10px] px-1.5 py-0"
                                    >
                                        Terhapus
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{user.email}</span>
                                <span>•</span>
                                <span>Terdaftar: {user.created_at}</span>
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'role',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8 gap-1.5 font-bold hover:bg-muted/80 text-muted-foreground"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    <span>Role Akses</span>
                    <ArrowUpDown className="h-3.5 w-3.5" />
                </Button>
            ),
            cell: ({ row }) => getRoleBadge(row.original.role, row.original.role_label),
        },
        {
            accessorKey: 'tenant_name',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8 gap-1.5 font-bold hover:bg-muted/80 text-muted-foreground"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    <span>Stand Kantin</span>
                    <ArrowUpDown className="h-3.5 w-3.5" />
                </Button>
            ),
            cell: ({ row }) => {
                const tenantName = row.original.tenant_name;
                if (!tenantName) {
                    return (
                        <span className="text-xs text-muted-foreground/60 italic">
                            -
                        </span>
                    );
                }
                return (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                        <Store className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{tenantName}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'orders_count',
            header: ({ column }) => (
                <div className="text-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1.5 font-bold hover:bg-muted/80 text-muted-foreground"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }
                    >
                        <span>Pesanan</span>
                        <ArrowUpDown className="h-3.5 w-3.5" />
                    </Button>
                </div>
            ),
            cell: ({ row }) => (
                <div className="text-center">
                    <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-semibold font-mono">
                        {row.original.orders_count}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'is_verified',
            header: ({ column }) => (
                <div className="text-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1.5 font-bold hover:bg-muted/80 text-muted-foreground"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }
                    >
                        <span>Status Email</span>
                        <ArrowUpDown className="h-3.5 w-3.5" />
                    </Button>
                </div>
            ),
            cell: ({ row }) => {
                const user = row.original;
                if (user.is_trashed) {
                    return (
                        <div className="text-center">
                            <span className="text-xs text-muted-foreground italic">
                                Arsip ({user.deleted_at})
                            </span>
                        </div>
                    );
                }
                return (
                    <div className="text-center">
                        <button
                            type="button"
                            disabled={verifyingId === user.id}
                            onClick={() => onToggleVerify(user)}
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-all ${
                                user.is_verified
                                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20'
                                    : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20'
                            }`}
                            title="Klik untuk ubah status verifikasi email"
                        >
                            {user.is_verified ? (
                                <>
                                    <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                    Terverifikasi
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                                    Belum Verifikasi
                                </>
                            )}
                        </button>
                    </div>
                );
            },
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Aksi</div>,
            cell: ({ row }) => {
                const user = row.original;
                const isCurrentUser = user.id === currentUserId;

                if (user.is_trashed) {
                    return (
                        <div className="flex justify-end">
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={restoringId === user.id}
                                onClick={() => onRestore(user)}
                                className="gap-1.5 h-8 text-xs text-primary font-medium"
                            >
                                <RotateCcw className="h-3.5 w-3.5" />
                                Pulihkan
                            </Button>
                        </div>
                    );
                }

                return (
                    <div className="flex items-center justify-end gap-1">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => onEdit(user)}
                            title="Ubah data pengguna"
                        >
                            <Edit2 className="h-3.5 w-3.5" />
                            <span className="sr-only">Ubah</span>
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                    title="Menu opsi lainnya"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Menu opsi</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52">
                                <DropdownMenuLabel className="text-xs">
                                    Opsi Pengguna
                                </DropdownMenuLabel>
                                <DropdownMenuItem
                                    onClick={() => onEdit(user)}
                                    className="gap-2 text-xs"
                                >
                                    <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                                    Ubah Data Pengguna
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => onToggleVerify(user)}
                                    className="gap-2 text-xs"
                                >
                                    {user.is_verified ? (
                                        <>
                                            <MailX className="h-3.5 w-3.5 text-amber-600" />
                                            Batalkan Verifikasi Email
                                        </>
                                    ) : (
                                        <>
                                            <MailCheck className="h-3.5 w-3.5 text-emerald-600" />
                                            Verifikasi Email Manual
                                        </>
                                    )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    disabled={isCurrentUser}
                                    className={`gap-2 text-xs text-destructive focus:text-destructive ${
                                        isCurrentUser
                                            ? 'opacity-40 cursor-not-allowed'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        !isCurrentUser && onDelete(user)
                                    }
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    {isCurrentUser
                                        ? 'Tidak Bisa Hapus Akun Sendiri'
                                        : 'Hapus ke Sampah'}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
    ];
}
