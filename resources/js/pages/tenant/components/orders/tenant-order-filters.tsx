import type { FormEvent } from 'react';
import { Loader2, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface TenantOrderFiltersProps {
    searchQuery: string;
    onSearchChange: (val: string) => void;
    onSearchSubmit?: (e: FormEvent) => void;
    activeTab: string;
    onTabChange: (status: string) => void;
    onResetFilter: () => void;
    isSearching?: boolean;
}

export function TenantOrderFilters({
    searchQuery,
    onSearchChange,
    onSearchSubmit,
    activeTab,
    onTabChange,
    onResetFilter,
    isSearching = false,
}: TenantOrderFiltersProps) {
    const tabs = [
        { key: 'all', label: 'Semua Status' },
        { key: 'pending', label: '1. Pending' },
        { key: 'processing', label: '2. Dimasak' },
        { key: 'ready', label: '3. Siap Pickup' },
        { key: 'completed', label: '4. Selesai' },
    ];

    const hasActiveFilter = searchQuery.trim() !== '' || activeTab !== 'all';

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSearchSubmit?.(e);
    };

    return (
        <div className="flex flex-col gap-3 bg-card p-4 rounded-xl border border-border/70 shadow-xs">
            {/* Search Input */}
            <form onSubmit={handleFormSubmit} className="relative w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Cari kode pickup / nama pemesan..."
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

            {/* Filter Tabs — horizontal scroll area */}
            <ScrollArea className="w-full">
                <div className="flex items-center gap-1.5 pb-1 text-xs">
                    <span className="text-muted-foreground font-semibold uppercase text-[10px] shrink-0">Filter:</span>
                    {tabs.map((tb) => (
                        <Button
                            key={tb.key}
                            variant={activeTab === tb.key ? 'secondary' : 'outline'}
                            size="sm"
                            onClick={() => onTabChange(tb.key)}
                            className={`h-8 text-xs shrink-0 ${activeTab === tb.key ? 'font-bold border-primary/40' : ''}`}
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
