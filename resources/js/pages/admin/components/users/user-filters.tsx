import { Loader2, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { UserCounts } from '../../types';

interface UserFiltersProps {
    roleFilter: string;
    onRoleChange: (role: string) => void;
    searchQuery: string;
    onSearchChange: (search: string) => void;
    onClearSearch: () => void;
    isSearching: boolean;
    counts: UserCounts;
}

export function UserFilters({
    roleFilter,
    onRoleChange,
    searchQuery,
    onSearchChange,
    onClearSearch,
    isSearching,
    counts,
}: UserFiltersProps) {
    const tabs = [
        { key: 'all', label: 'Semua Pengguna', count: counts.all },
        { key: 'mahasiswa', label: 'Mahasiswa', count: counts.mahasiswa },
        { key: 'tenant', label: 'Penjual Stand', count: counts.tenant },
        { key: 'admin', label: 'Admin', count: counts.admin },
        { key: 'trashed', label: 'Tempat Sampah', count: counts.trashed },
    ];

    return (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Role Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-lg border bg-muted/40 p-1">
                {tabs.map((tab) => {
                    const isActive = (roleFilter || 'all') === tab.key;
                    return (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => onRoleChange(tab.key)}
                            className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                                isActive
                                    ? 'bg-background text-foreground shadow-xs font-semibold'
                                    : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
                            }`}
                        >
                            <span>{tab.label}</span>
                            <span
                                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                                    isActive
                                        ? 'bg-primary/15 text-primary'
                                        : 'bg-muted text-muted-foreground'
                                }`}
                            >
                                {tab.count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Live Search Input */}
            <div className="relative w-full sm:w-80">
                <div className="pointer-events-none absolute left-3 top-2.5 text-muted-foreground">
                    {isSearching ? (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    ) : (
                        <Search className="h-4 w-4" />
                    )}
                </div>
                <Input
                    type="text"
                    placeholder="Cari nama atau email pengguna..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9 pr-9 h-9 bg-card focus-visible:ring-primary/20 text-xs"
                />
                {searchQuery && (
                    <button
                        type="button"
                        onClick={onClearSearch}
                        className="absolute right-2.5 top-2.5 rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        title="Hapus pencarian"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
