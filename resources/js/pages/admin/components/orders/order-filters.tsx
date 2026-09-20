import { useMemo } from 'react';
import { Filter, Loader2, Search, Store, X } from 'lucide-react';
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { OrderFilters as OrderFiltersType } from '../../types';

interface OrderFiltersProps {
    searchQuery: string;
    onSearchChange: (val: string) => void;
    onClearSearch: () => void;
    isSearching: boolean;
    tenantFilter: string;
    onTenantFilterChange: (val: string) => void;
    statusFilter: string;
    onStatusFilterChange: (val: string) => void;
    paymentStatusFilter: string;
    onPaymentStatusFilterChange: (val: string) => void;
    dateFilter: string;
    onDateFilterChange: (val: string) => void;
    tenants: Array<{ id: number; name: string }>;
}

type ComboboxOption = {
    label: string;
    value: string;
};

export function OrderFilters({
    searchQuery,
    onSearchChange,
    onClearSearch,
    isSearching,
    tenantFilter,
    onTenantFilterChange,
    statusFilter,
    onStatusFilterChange,
    paymentStatusFilter,
    onPaymentStatusFilterChange,
    dateFilter,
    onDateFilterChange,
    tenants,
}: OrderFiltersProps) {
    const tenantOptions: ComboboxOption[] = useMemo(
        () => [
            { label: 'Semua Mitra Stand', value: 'all' },
            ...tenants.map((t) => ({ label: t.name, value: String(t.id) })),
        ],
        [tenants]
    );

    const selectedTenantOption = useMemo(() => {
        return (
            tenantOptions.find((opt) => opt.value === String(tenantFilter)) ||
            tenantOptions[0]
        );
    }, [tenantOptions, tenantFilter]);

    return (
        <div className="rounded-xl border border-border/70 bg-card p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Filter className="h-3.5 w-3.5 text-primary" />
                <span>Filter & Pencarian Lanjutan</span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {/* Live Search Input */}
                <div className="relative">
                    <Label htmlFor="search" className="text-xs text-muted-foreground font-medium">
                        Cari Kata Kunci
                    </Label>
                    <div className="relative mt-1">
                        <div className="pointer-events-none absolute left-3 top-2.5 text-muted-foreground">
                            {isSearching ? (
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            ) : (
                                <Search className="h-4 w-4" />
                            )}
                        </div>
                        <Input
                            id="search"
                            type="text"
                            placeholder="No. Order, Pickup, Nama..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-9 pr-8 h-9 bg-background focus-visible:ring-primary/20 text-xs"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={onClearSearch}
                                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                                title="Hapus pencarian"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Tenant Filter (Combobox) */}
                <div>
                    <Label className="text-xs text-muted-foreground font-medium">
                        Mitra Stand Kantin
                    </Label>
                    <div className="mt-1">
                        <Combobox
                            items={tenantOptions}
                            value={selectedTenantOption}
                            onValueChange={(item: ComboboxOption | null) => {
                                const val = item ? item.value : 'all';
                                onTenantFilterChange(val);
                            }}
                        >
                            <ComboboxInput
                                placeholder="Pilih mitra stand..."
                                showClear={tenantFilter !== 'all'}
                                className="h-9 text-xs bg-background"
                            />
                            <ComboboxContent className="w-64">
                                <ComboboxEmpty className="py-3 text-xs text-muted-foreground text-center">
                                    Mitra stand tidak ditemukan.
                                </ComboboxEmpty>
                                <ComboboxList>
                                    {(item: ComboboxOption) => (
                                        <ComboboxItem
                                            key={item.value}
                                            value={item}
                                            className="flex items-center gap-2 py-2 text-xs"
                                        >
                                            <Store className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                            <span className="truncate">{item.label}</span>
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </div>
                </div>

                {/* Order Status Filter */}
                <div>
                    <Label className="text-xs text-muted-foreground font-medium">
                        Status Alur Pesanan
                    </Label>
                    <div className="mt-1">
                        <Select
                            value={statusFilter}
                            onValueChange={onStatusFilterChange}
                        >
                            <SelectTrigger className="h-9 w-full bg-background text-xs">
                                <SelectValue placeholder="Pilih status..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="pending">Menunggu Bayar</SelectItem>
                                <SelectItem value="paid">Dibayar (Konfirmasi)</SelectItem>
                                <SelectItem value="processing">Diproses Stand</SelectItem>
                                <SelectItem value="ready">Siap Diambil</SelectItem>
                                <SelectItem value="completed">Selesai</SelectItem>
                                <SelectItem value="failed">Gagal / Batal</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Payment Status Filter */}
                <div>
                    <Label className="text-xs text-muted-foreground font-medium">
                        Status Pembayaran
                    </Label>
                    <div className="mt-1">
                        <Select
                            value={paymentStatusFilter}
                            onValueChange={onPaymentStatusFilterChange}
                        >
                            <SelectTrigger className="h-9 w-full bg-background text-xs">
                                <SelectValue placeholder="Pilih status bayar..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status Bayar</SelectItem>
                                <SelectItem value="unpaid">Belum Dibayar</SelectItem>
                                <SelectItem value="paid">Lunas</SelectItem>
                                <SelectItem value="failed">Gagal / Tolak</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Date Filter */}
                <div>
                    <Label className="text-xs text-muted-foreground font-medium">
                        Periode Waktu
                    </Label>
                    <div className="mt-1">
                        <Select
                            value={dateFilter}
                            onValueChange={onDateFilterChange}
                        >
                            <SelectTrigger className="h-9 w-full bg-background text-xs">
                                <SelectValue placeholder="Pilih periode..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Waktu</SelectItem>
                                <SelectItem value="today">Hari Ini</SelectItem>
                                <SelectItem value="week">Minggu Ini</SelectItem>
                                <SelectItem value="month">Bulan Ini</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    );
}
