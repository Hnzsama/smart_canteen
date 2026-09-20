import { Loader2, Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TenantFiltersProps {
    statusFilter: string;
    onStatusChange: (status: string) => void;
    searchQuery: string;
    onSearchChange: (search: string) => void;
    onClearSearch: () => void;
    isSearching: boolean;
    counts: {
        all: number;
        active: number;
        inactive: number;
        trashed: number;
    };
}

export function TenantFilters({
    statusFilter,
    onStatusChange,
    searchQuery,
    onSearchChange,
    onClearSearch,
    isSearching,
    counts,
}: TenantFiltersProps) {
    const tabs = [
        { key: 'all', label: 'Semua Stand', count: counts.all },
        { key: 'active', label: 'Aktif Buka', count: counts.active },
        { key: 'inactive', label: 'Tutup / Nonaktif', count: counts.inactive },
        { key: 'trashed', label: 'Tempat Sampah', count: counts.trashed },
    ];

    return (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Status Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-lg border bg-muted/40 p-1">
                {tabs.map((tab) => {
                    const isActive = (statusFilter || 'all') === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => onStatusChange(tab.key)}
                            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                                isActive
                                    ? 'bg-background text-foreground shadow-xs'
                                    : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
                            }`}
                        >
                            <span>{tab.label}</span>
                            <Badge
                                variant={isActive ? 'default' : 'secondary'}
                                className="h-5 px-1.5 text-[10px] font-bold"
                            >
                                {tab.count}
                            </Badge>
                        </button>
                    );
                })}
            </div>

            {/* Live Search Bar */}
            <div className="relative w-full lg:w-80">
                <div className="pointer-events-none absolute left-3 top-2.5 text-muted-foreground">
                    {isSearching ? (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    ) : (
                        <Search className="h-4 w-4" />
                    )}
                </div>
                <Input
                    type="text"
                    placeholder="Cari stand atau nama pengelola..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9 pr-8 h-9 text-xs"
                />
                {searchQuery && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onClearSearch}
                        className="absolute right-1 top-1 h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-3.5 w-3.5" />
                    </Button>
                )}
            </div>
        </div>
    );
}
