import type { ColumnDef } from '@tanstack/react-table';
import {
    AlertTriangle,
    ArrowUpDown,
    CheckCircle2,
    Edit2,
    Loader2,
    MoreHorizontal,
    Power,
    RotateCcw,
    Trash2,
    Users,
    UtensilsCrossed,
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
import type { TenantItem } from '../../types';

export function getTenantColumns(actions: {
    onEdit: (tenant: TenantItem) => void;
    onDelete: (tenant: TenantItem) => void;
    onToggleStatus: (tenant: TenantItem) => void;
    onRestore: (tenant: TenantItem) => void;
    togglingId: number | null;
    restoringId: number | null;
}): ColumnDef<TenantItem>[] {
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
                        onCheckedChange={(value: boolean | 'indeterminate') =>
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
                        onCheckedChange={(value: boolean | 'indeterminate') => row.toggleSelected(!!value)}
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
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    <span>Stand Kantin</span>
                    <ArrowUpDown className="h-3.5 w-3.5" />
                </Button>
            ),
            cell: ({ row }) => {
                const tenant = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border font-bold text-sm shadow-xs transition-transform ${
                                tenant.is_trashed
                                    ? 'border-dashed bg-muted text-muted-foreground'
                                    : tenant.is_active
                                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:border-emerald-500/20 dark:text-emerald-400'
                                      : 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:border-amber-500/20 dark:text-amber-400'
                            }`}
                        >
                            {tenant.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-foreground">
                                    {tenant.name}
                                </span>
                                {tenant.is_trashed && (
                                    <Badge
                                        variant="destructive"
                                        className="text-[10px] py-0 px-1.5"
                                    >
                                        Terhapus
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="font-mono">/{tenant.slug}</span>
                                <span>•</span>
                                <span>Terdaftar: {tenant.created_at}</span>
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'description',
            header: 'Deskripsi',
            cell: ({ row }) => {
                const desc = row.original.description;
                return (
                    <div className="max-w-xs truncate text-muted-foreground text-xs">
                        {desc || (
                            <span className="italic text-muted-foreground/60">
                                Tidak ada deskripsi
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'managers',
            header: 'Akun Pengelola',
            cell: ({ row }) => {
                const tenant = row.original;
                if (tenant.managers.length > 0) {
                    return (
                        <div className="flex flex-wrap items-center gap-1.5">
                            {tenant.managers.map((manager) => (
                                <Badge
                                    key={manager.id}
                                    variant="outline"
                                    className="gap-1 text-[11px] font-normal py-0.5 px-2 bg-background/50 hover:bg-muted transition-colors"
                                    title={manager.email}
                                >
                                    <Users className="h-3 w-3 text-primary" />
                                    <span className="font-medium text-foreground">
                                        {manager.name}
                                    </span>
                                </Badge>
                            ))}
                        </div>
                    );
                }
                return (
                    <button
                        type="button"
                        onClick={() => actions.onEdit(tenant)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 hover:bg-amber-500/20 dark:text-amber-300 transition-colors"
                        title="Klik untuk menetapkan akun pengelola"
                    >
                        <AlertTriangle className="h-3 w-3" />
                        <span>Wajib Ditautkan Akun</span>
                    </button>
                );
            },
        },
        {
            accessorKey: 'menus_count',
            header: ({ column }) => (
                <div className="text-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1.5 font-bold hover:bg-muted/80 text-muted-foreground"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        <span>Menu</span>
                        <ArrowUpDown className="h-3.5 w-3.5" />
                    </Button>
                </div>
            ),
            cell: ({ row }) => (
                <div className="text-center">
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-semibold font-mono">
                        <UtensilsCrossed className="h-3 w-3 text-muted-foreground" />
                        {row.original.menus_count}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'orders_count',
            header: ({ column }) => (
                <div className="text-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1.5 font-bold hover:bg-muted/80 text-muted-foreground"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        <span>Pesanan</span>
                        <ArrowUpDown className="h-3.5 w-3.5" />
                    </Button>
                </div>
            ),
            cell: ({ row }) => (
                <div className="text-center">
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-semibold font-mono">
                        {row.original.orders_count}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'is_active',
            header: ({ column }) => (
                <div className="text-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1.5 font-bold hover:bg-muted/80 text-muted-foreground"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        <span>Status</span>
                        <ArrowUpDown className="h-3.5 w-3.5" />
                    </Button>
                </div>
            ),
            cell: ({ row }) => {
                const tenant = row.original;
                if (tenant.is_trashed) {
                    return (
                        <div className="text-center">
                            <Badge variant="outline" className="text-muted-foreground text-xs">
                                Terhapus
                            </Badge>
                        </div>
                    );
                }
                return (
                    <div className="flex justify-center">
                        <Badge
                            variant={tenant.is_active ? 'secondary' : 'outline'}
                            className={`gap-1 cursor-pointer select-none transition-colors ${
                                tenant.is_active
                                    ? 'bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-400'
                                    : 'bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 dark:text-amber-400'
                            }`}
                            onClick={() => actions.onToggleStatus(tenant)}
                        >
                            {actions.togglingId === tenant.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : tenant.is_active ? (
                                <CheckCircle2 className="h-3 w-3" />
                            ) : (
                                <XCircle className="h-3 w-3" />
                            )}
                            <span>{tenant.is_active ? 'Stand Buka' : 'Stand Tutup'}</span>
                        </Badge>
                    </div>
                );
            },
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Aksi</div>,
            cell: ({ row }) => {
                const tenant = row.original;
                return (
                    <div className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-muted"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel className="text-xs">Aksi Stand</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {tenant.is_trashed ? (
                                    <DropdownMenuItem
                                        onClick={() => actions.onRestore(tenant)}
                                        disabled={actions.restoringId === tenant.id}
                                        className="gap-2 text-xs font-medium cursor-pointer"
                                    >
                                        {actions.restoringId === tenant.id ? (
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        ) : (
                                            <RotateCcw className="h-3.5 w-3.5 text-blue-600" />
                                        )}
                                        <span>Pulihkan Stand</span>
                                    </DropdownMenuItem>
                                ) : (
                                    <>
                                        <DropdownMenuItem
                                            onClick={() => actions.onEdit(tenant)}
                                            className="gap-2 text-xs font-medium cursor-pointer"
                                        >
                                            <Edit2 className="h-3.5 w-3.5 text-blue-600" />
                                            <span>Edit Data Stand</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => actions.onToggleStatus(tenant)}
                                            disabled={actions.togglingId === tenant.id}
                                            className="gap-2 text-xs font-medium cursor-pointer"
                                        >
                                            <Power className="h-3.5 w-3.5 text-amber-600" />
                                            <span>
                                                {tenant.is_active ? 'Tutup Stand' : 'Buka Stand'}
                                            </span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => actions.onDelete(tenant)}
                                            className="gap-2 text-xs font-medium text-destructive focus:text-destructive cursor-pointer"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            <span>Hapus Stand (Soft Delete)</span>
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];
}
