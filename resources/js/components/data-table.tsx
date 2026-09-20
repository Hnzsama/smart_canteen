import { useState } from 'react';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
} from '@tanstack/react-table';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    emptyMessage?: string;
    showPagination?: boolean;
    pageSize?: number;
    showColumnVisibility?: boolean;
    toolbar?: React.ReactNode;
    // Server-side / manual pagination props
    manualPagination?: boolean;
    pageCount?: number;
    currentPage?: number;
    totalRows?: number;
    fromRow?: number | null;
    toRow?: number | null;
    onPageChange?: (page: number) => void;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    emptyMessage = 'Tidak ada data yang ditemukan.',
    showPagination = true,
    pageSize = 10,
    showColumnVisibility = false,
    toolbar,
    manualPagination = false,
    pageCount = 1,
    currentPage = 1,
    totalRows,
    fromRow,
    toRow,
    onPageChange,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        data,
        columns,
        manualPagination,
        pageCount: manualPagination ? pageCount : undefined,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            ...(manualPagination
                ? {
                      pagination: {
                          pageIndex: Math.max(0, currentPage - 1),
                          pageSize,
                      },
                  }
                : {}),
        },
        initialState: {
            pagination: {
                pageSize,
            },
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        ...(!manualPagination ? { getPaginationRowModel: getPaginationRowModel() } : {}),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    const selectedRowsCount = table.getFilteredSelectedRowModel().rows.length;
    const clientTotalRows = table.getFilteredRowModel().rows.length;
    const clientPageIndex = table.getState().pagination.pageIndex;
    const clientPageCount = table.getPageCount();

    const activePage = manualPagination ? currentPage : clientPageIndex + 1;
    const activeTotalPages = manualPagination ? Math.max(1, pageCount) : Math.max(1, clientPageCount);
    const activeTotalRows = manualPagination ? (totalRows ?? data.length) : clientTotalRows;

    const canPrevious = manualPagination
        ? activePage > 1
        : table.getCanPreviousPage();
    const canNext = manualPagination
        ? activePage < activeTotalPages
        : table.getCanNextPage();

    const handleFirstPage = () => {
        if (manualPagination) {
            onPageChange?.(1);
        } else {
            table.setPageIndex(0);
        }
    };

    const handlePrevPage = () => {
        if (manualPagination) {
            onPageChange?.(Math.max(1, activePage - 1));
        } else {
            table.previousPage();
        }
    };

    const handleNextPage = () => {
        if (manualPagination) {
            onPageChange?.(Math.min(activeTotalPages, activePage + 1));
        } else {
            table.nextPage();
        }
    };

    const handleLastPage = () => {
        if (manualPagination) {
            onPageChange?.(activeTotalPages);
        } else {
            table.setPageIndex(activeTotalPages - 1);
        }
    };

    const getColumnTitle = (column: ReturnType<typeof table.getAllColumns>[number]) => {
        if (typeof column.columnDef.header === 'string') {
            return column.columnDef.header;
        }
        return column.id.replace(/_/g, ' ');
    };

    return (
        <div className="space-y-3">
            {/* Optional Toolbar & Column Visibility */}
            {(toolbar || showColumnVisibility) && (
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-1 items-center gap-2">
                        {toolbar}
                    </div>

                    {showColumnVisibility && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="ml-auto h-8 gap-1.5 text-xs"
                                >
                                    <SlidersHorizontal className="h-3.5 w-3.5" />
                                    Tampilan Kolom
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel className="text-xs">
                                    Pilih Kolom Aktif
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {table
                                    .getAllColumns()
                                    .filter(
                                        (column) =>
                                            typeof column.accessorFn !== 'undefined' &&
                                            column.getCanHide()
                                    )
                                    .map((column) => (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize text-xs"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {getColumnTitle(column)}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            )}

            {/* Main Table Container */}
            <div className="rounded-xl border border-border/70 bg-card shadow-xs overflow-hidden">
                <ScrollArea className="w-full">
                    <Table>
                        <TableHeader className="bg-muted/50 text-xs font-semibold">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className="py-3 px-4 font-bold text-muted-foreground"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody className="divide-y divide-border/60">
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && 'selected'}
                                        className="transition-colors hover:bg-muted/40"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="py-3.5 px-4 text-sm">
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-32 text-center text-sm text-muted-foreground"
                                    >
                                        {emptyMessage}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <ScrollBar orientation="horizontal" className="h-2" />
                </ScrollArea>
            </div>

            {/* Pagination & Selection Stats Footer */}
            {showPagination && activeTotalRows > 0 && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-1 text-xs text-muted-foreground">
                    <div>
                        {selectedRowsCount > 0 ? (
                            <span className="font-medium text-foreground">
                                {selectedRowsCount} dari {activeTotalRows} baris terpilih
                            </span>
                        ) : manualPagination && fromRow !== undefined && toRow !== undefined && fromRow !== null && toRow !== null ? (
                            <span>
                                Menampilkan {fromRow} - {toRow} dari{' '}
                                <strong className="font-semibold text-foreground">
                                    {activeTotalRows}
                                </strong>{' '}
                                total data
                            </span>
                        ) : (
                            <span>
                                Menampilkan {Math.min(data.length, (clientPageIndex + 1) * pageSize)} dari{' '}
                                <strong className="font-semibold text-foreground">
                                    {activeTotalRows}
                                </strong>{' '}
                                total data
                            </span>
                        )}
                    </div>

                    {activeTotalPages > 1 && (
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                            <span className="font-medium text-foreground mr-1">
                                Halaman {activePage} dari {activeTotalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={handleFirstPage}
                                disabled={!canPrevious}
                                title="Halaman Pertama"
                            >
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={handlePrevPage}
                                disabled={!canPrevious}
                                title="Halaman Sebelumnya"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={handleNextPage}
                                disabled={!canNext}
                                title="Halaman Berikutnya"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={handleLastPage}
                                disabled={!canNext}
                                title="Halaman Terakhir"
                            >
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
