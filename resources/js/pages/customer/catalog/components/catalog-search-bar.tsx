import { Search, Loader2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface CatalogSearchBarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    isSearchingServer: boolean;
}

export default function CatalogSearchBar({
    searchQuery,
    onSearchChange,
    isSearchingServer,
}: CatalogSearchBarProps) {
    return (
        <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
                placeholder="Cari makanan, minuman, es teh, ayam geprek..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 pr-8 h-9 text-xs rounded-xl border-border bg-card shadow-2xs"
            />
            {isSearchingServer ? (
                <div className="absolute right-2.5 top-2.5 flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
            ) : searchQuery ? (
                <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            ) : null}
        </div>
    );
}
