import type { FormEvent } from 'react';
import { Loader2, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface MenuFiltersProps {
    searchQuery: string;
    onSearchChange: (val: string) => void;
    onSearchSubmit?: (e: FormEvent) => void;
    selectedStatus: string;
    onStatusChange: (status: string) => void;
    selectedCategory: string;
    onCategoryChange: (catId: string) => void;
    categories: { id: number; name: string }[];
    onResetFilter: () => void;
    onOpenCreate?: () => void;
    isSearching?: boolean;
}

export function MenuFilters({
    searchQuery,
    onSearchChange,
    onSearchSubmit,
    selectedStatus,
    onStatusChange,
    selectedCategory,
    onCategoryChange,
    categories,
    onResetFilter,
    isSearching = false,
}: MenuFiltersProps) {
    const tabs = [
        { key: 'all', label: 'Semua Menu' },
        { key: 'available', label: 'Tersedia' },
        { key: 'unavailable', label: 'Stok Habis' },
        { key: 'trashed', label: 'Terhapus' },
    ];

    const hasActiveFilter =
        searchQuery.trim() !== '' ||
        selectedStatus !== 'all' ||
        selectedCategory !== 'all';

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSearchSubmit?.(e);
    };

    return (
        <div className="flex flex-col gap-3 bg-card p-4 rounded-xl border border-border/70 shadow-xs">
            {/* Row 1: Search + Category Select */}
            <div className="flex gap-2">
                <form onSubmit={handleFormSubmit} className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari nama menu / deskripsi..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9 pr-8 h-9 text-xs"
                    />
                    {isSearching ? (
                        <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                    ) : searchQuery ? (
                        <button
                            type="button"
                            onClick={() => onSearchChange('')}
                            className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    ) : null}
                </form>

                {/* Category Select Filter */}
                <Select value={selectedCategory} onValueChange={onCategoryChange}>
                    <SelectTrigger className="h-9 text-xs w-36 shrink-0">
                        <SelectValue placeholder="Semua Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Kategori</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={String(cat.id)}>
                                {cat.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Row 2: Status Filter Tabs (full-width ScrollArea) */}
            <ScrollArea className="w-full">
                <div className="flex items-center gap-1.5 pb-1 text-xs">
                    {tabs.map((tb) => (
                        <Button
                            key={tb.key}
                            variant={selectedStatus === tb.key ? 'secondary' : 'outline'}
                            size="sm"
                            onClick={() => onStatusChange(tb.key)}
                            className={`h-8 text-xs shrink-0 ${selectedStatus === tb.key ? 'font-bold border-primary/40' : ''}`}
                        >
                            {tb.label}
                        </Button>
                    ))}

                    {hasActiveFilter && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onResetFilter}
                            className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground shrink-0"
                        >
                            <X className="h-3.5 w-3.5" />
                            Reset
                        </Button>
                    )}
                </div>
                <ScrollBar orientation="horizontal" className="h-1.5" />
            </ScrollArea>
        </div>
    );
}
