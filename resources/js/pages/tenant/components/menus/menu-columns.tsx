import { Link } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import {
    ArrowUpDown,
    CheckCircle2,
    Clock,
    Edit2,
    Loader2,
    MoreHorizontal,
    Power,
    RotateCcw,
    Star,
    Trash2,
    Utensils,
    XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { edit as editMenuRoute } from '@/routes/tenant/menus';
import type { TenantMenuItem } from '../../types';

export function getMenuColumns(actions: {
    onEdit?: (menu: TenantMenuItem) => void;
    onDelete: (menu: TenantMenuItem) => void;
    onToggleAvailability: (menu: TenantMenuItem) => void;
    onToggleRecommendation?: (menu: TenantMenuItem) => void;
    onRestore: (menu: TenantMenuItem) => void;
    togglingId: number | null;
    togglingRecId?: number | null;
    restoringId: number | null;
}): ColumnDef<TenantMenuItem>[] {
    return [
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8 gap-1.5 font-bold hover:bg-muted/80 text-muted-foreground"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    <span>Nama Menu & Detail Porsi</span>
                    <ArrowUpDown className="h-3.5 w-3.5" />
                </Button>
            ),
            cell: ({ row }) => {
                const menu = row.original;
                return (
                    <div className="flex items-center gap-3 py-1">
                        <div className="relative shrink-0">
                            {menu.image ? (
                                <img
                                    src={menu.image}
                                    alt={menu.name}
                                    className="h-12 w-12 rounded-xl object-cover border border-border shadow-xs"
                                    onError={(e) => {
                                        (e.target as HTMLElement).style.display = 'none';
                                        if (e.currentTarget.nextElementSibling) {
                                            (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                                        }
                                    }}
                                />
                            ) : null}
                            <div
                                className={`h-12 w-12 rounded-xl border font-bold text-sm shadow-xs flex items-center justify-center ${
                                    menu.image ? 'hidden' : ''
                                } ${
                                    menu.is_trashed
                                        ? 'border-dashed bg-muted text-muted-foreground'
                                        : menu.is_available
                                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                        : 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                }`}
                            >
                                <Utensils className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="space-y-1 max-w-sm">
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-semibold text-foreground text-sm">{menu.name}</span>
                                {menu.is_recommended && (
                                    <Badge className="bg-amber-500 text-white dark:bg-amber-600 border-none text-[10px] py-0 px-1.5 gap-0.5">
                                        <Star className="h-3 w-3 fill-amber-200" />
                                        <span>Best Seller</span>
                                    </Badge>
                                )}
                                {menu.is_trashed && (
                                    <Badge variant="destructive" className="text-[10px] py-0 px-1.5">
                                        Terhapus
                                    </Badge>
                                )}
                            </div>
                            {menu.description ? (
                                <div className="text-xs text-muted-foreground line-clamp-1">
                                    {menu.description}
                                </div>
                            ) : (
                                <div className="text-xs italic text-muted-foreground/60">
                                    Tidak ada deskripsi
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3 text-amber-500" />
                                    <span>Est. {menu.estimated_time || 15}m</span>
                                </span>
                                {menu.options && menu.options.length > 0 && (
                                    <span className="text-[10px] bg-primary/10 text-primary px-1.5 rounded-full font-medium">
                                        {menu.options.length} Kelompok Add-on
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'category_name',
            header: 'Kategori',
            cell: ({ row }) => (
                <Badge variant="outline" className="text-xs font-normal">
                    {row.original.category_name}
                </Badge>
            ),
        },
        {
            accessorKey: 'price',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1.5 font-bold hover:bg-muted/80 text-muted-foreground"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    <span>Harga Porsi</span>
                    <ArrowUpDown className="h-3.5 w-3.5" />
                </Button>
            ),
            cell: ({ row }) => {
                const menu = row.original;
                return (
                    <div className="flex flex-col">
                        <span className="font-mono font-bold text-sm text-foreground">
                            {menu.formatted_price}
                        </span>
                        {menu.formatted_original_price && (
                            <span className="font-mono text-xs text-muted-foreground line-through">
                                {menu.formatted_original_price}
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'is_available',
            header: 'Stok Ketersediaan',
            cell: ({ row }) => {
                const menu = row.original;
                if (menu.is_trashed) {
                    return (
                        <Badge variant="outline" className="text-muted-foreground text-xs">
                            Terhapus
                        </Badge>
                    );
                }

                return (
                    <Badge
                        variant={menu.is_available ? 'secondary' : 'outline'}
                        className={`gap-1 cursor-pointer select-none transition-colors ${
                            menu.is_available
                                ? 'bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-400'
                                : 'bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 dark:text-amber-400'
                        }`}
                        onClick={() => actions.onToggleAvailability(menu)}
                    >
                        {actions.togglingId === menu.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                        ) : menu.is_available ? (
                            <CheckCircle2 className="h-3 w-3" />
                        ) : (
                            <XCircle className="h-3 w-3" />
                        )}
                        <span>{menu.is_available ? 'Ready / Tersedia' : 'Stok Habis'}</span>
                    </Badge>
                );
            },
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Aksi</div>,
            cell: ({ row }) => {
                const menu = row.original;
                return (
                    <div className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52">
                                <DropdownMenuLabel className="text-xs">Aksi Menu Stand</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {menu.is_trashed ? (
                                    <DropdownMenuItem
                                        onClick={() => actions.onRestore(menu)}
                                        disabled={actions.restoringId === menu.id}
                                        className="gap-2 text-xs font-medium cursor-pointer"
                                    >
                                        {actions.restoringId === menu.id ? (
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        ) : (
                                            <RotateCcw className="h-3.5 w-3.5 text-blue-600" />
                                        )}
                                        <span>Pulihkan Menu</span>
                                    </DropdownMenuItem>
                                ) : (
                                    <>
                                        <DropdownMenuItem asChild className="gap-2 text-xs font-medium cursor-pointer">
                                            <Link href={editMenuRoute.url(menu.id)} className="flex items-center gap-2 w-full">
                                                <Edit2 className="h-3.5 w-3.5 text-blue-600" />
                                                <span>Edit Data Menu</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        {actions.onToggleRecommendation && (
                                            <DropdownMenuItem
                                                onClick={() => actions.onToggleRecommendation?.(menu)}
                                                disabled={actions.togglingRecId === menu.id}
                                                className="gap-2 text-xs font-medium cursor-pointer"
                                            >
                                                {actions.togglingRecId === menu.id ? (
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                ) : (
                                                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                                                )}
                                                <span>
                                                    {menu.is_recommended ? 'Hapus Best Seller' : 'Jadikan Best Seller'}
                                                </span>
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem
                                            onClick={() => actions.onToggleAvailability(menu)}
                                            disabled={actions.togglingId === menu.id}
                                            className="gap-2 text-xs font-medium cursor-pointer"
                                        >
                                            <Power className="h-3.5 w-3.5 text-amber-600" />
                                            <span>
                                                {menu.is_available ? 'Set Stok Habis' : 'Set Ready Stock'}
                                            </span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => actions.onDelete(menu)}
                                            className="gap-2 text-xs font-medium text-destructive focus:text-destructive cursor-pointer"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            <span>Hapus Menu (Soft Delete)</span>
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
