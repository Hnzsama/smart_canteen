import type { FormEvent } from 'react';
import { Filter, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface CategoryFiltersProps {
    searchQuery: string;
    onSearchChange: (val: string) => void;
    onSearchSubmit: (e: FormEvent) => void;
    selectedTenantFilter: string;
    onTenantFilterChange: (val: string) => void;
    tenants: Array<{ id: number; name: string }>;
    onResetFilter: () => void;
}

export function CategoryFilters({
    searchQuery,
    onSearchChange,
    onSearchSubmit,
    selectedTenantFilter,
    onTenantFilterChange,
    tenants,
    onResetFilter,
}: CategoryFiltersProps) {
    const hasActiveFilters = searchQuery.trim() !== '' || (selectedTenantFilter && selectedTenantFilter !== 'all');

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-xl border border-border/70 shadow-xs">
            <form onSubmit={onSearchSubmit} className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Cari nama / slug kategori..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9 h-9 text-xs"
                />
            </form>

            <div className="flex items-center gap-2">
                <Select value={selectedTenantFilter} onValueChange={onTenantFilterChange}>
                    <SelectTrigger className="h-9 w-[220px] text-xs">
                        <Filter className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <SelectValue placeholder="Filter per Stand Kantin" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all" className="text-xs">
                            Semua Stand Kantin
                        </SelectItem>
                        {tenants.map((t) => (
                            <SelectItem key={t.id} value={String(t.id)} className="text-xs">
                                {t.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onResetFilter}
                        className="h-9 text-xs gap-1 text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-3.5 w-3.5" />
                        Reset
                    </Button>
                )}
            </div>
        </div>
    );
}
