import type { ColumnDef } from '@tanstack/react-table';
import { Edit2, MoreHorizontal, Store, Trash2, Utensils } from 'lucide-react';
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
import type { CategoryItem } from '../../types';

export function getCategoryColumns(actions: {
    onEdit: (category: CategoryItem) => void;
    onDelete: (category: CategoryItem) => void;
}): ColumnDef<CategoryItem>[] {
    return [
        {
            accessorKey: 'name',
            header: 'Nama Kategori',
            cell: ({ row }) => (
                <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-sm text-foreground">
                        {row.original.name}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                        slug: {row.original.slug}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'tenant_name',
            header: 'Mitra Stand Kantin',
            cell: ({ row }) => (
                <Badge variant="outline" className="gap-1 font-semibold text-xs py-0.5">
                    <Store className="h-3 w-3 text-primary" />
                    {row.original.tenant_name}
                </Badge>
            ),
        },
        {
            accessorKey: 'menus_count',
            header: 'Jumlah Menu',
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-foreground">
                    <Utensils className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{row.original.menus_count} menu</span>
                </div>
            ),
        },
        {
            accessorKey: 'created_at',
            header: 'Tanggal Dibuat',
            cell: ({ row }) => (
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {row.original.created_at}
                </span>
            ),
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => {
                const category = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel className="text-xs">Aksi Kategori</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => actions.onEdit(category)}
                                className="gap-2 text-xs cursor-pointer"
                            >
                                <Edit2 className="h-3.5 w-3.5 text-blue-600" />
                                Edit Kategori
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => actions.onDelete(category)}
                                className="gap-2 text-xs cursor-pointer text-destructive focus:text-destructive"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Hapus Kategori
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
}
