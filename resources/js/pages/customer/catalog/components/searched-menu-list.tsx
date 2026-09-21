import { Loader2, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlobalCategoryKey } from './global-category-chips';
import HorizontalFoodCard from './horizontal-food-card';
import { MenuItem } from '../types';

interface SearchedMenuListProps {
    selectedGlobalCategory: GlobalCategoryKey;
    searchedMenus: MenuItem[];
    visibleSearchedMenusCount: number;
    foodFallback: string;
    favorites: Record<number, boolean>;
    onToggleFav: (e: React.MouseEvent, menuId: number) => void;
    onOpenOptionModal: (e: React.MouseEvent, menu: MenuItem) => void;
    onResetFilters: () => void;
}

export default function SearchedMenuList({
    selectedGlobalCategory,
    searchedMenus,
    visibleSearchedMenusCount,
    foodFallback,
    favorites,
    onToggleFav,
    onOpenOptionModal,
    onResetFilters,
}: SearchedMenuListProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    {selectedGlobalCategory !== 'all'
                        ? `Menu ${selectedGlobalCategory.toUpperCase()} (${searchedMenus.length} Menu)`
                        : `Hasil Pencarian (${searchedMenus.length} Menu)`}
                </span>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onResetFilters}
                    className="h-6 text-[10px] text-primary p-0"
                >
                    Reset Filter
                </Button>
            </div>

            {searchedMenus.length === 0 ? (
                <div className="p-8 text-center border border-dashed rounded-2xl bg-muted/10 text-muted-foreground space-y-1">
                    <Utensils className="h-8 w-8 mx-auto opacity-30" />
                    <p className="text-xs font-semibold">Tidak ada menu yang sesuai.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3.5">
                    {searchedMenus.slice(0, visibleSearchedMenusCount).map((menu) => (
                        <HorizontalFoodCard
                            key={menu.id}
                            menu={menu}
                            foodFallback={foodFallback}
                            isFav={Boolean(favorites[menu.id])}
                            onToggleFav={(e) => onToggleFav(e, menu.id)}
                            onOpenOptionModal={(e) => onOpenOptionModal(e, menu)}
                        />
                    ))}

                    {visibleSearchedMenusCount < searchedMenus.length && (
                        <div className="col-span-2 py-3 flex items-center justify-center gap-2 text-xs text-muted-foreground font-medium animate-pulse bg-muted/20 rounded-xl border border-dashed border-border">
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            <span>
                                Scroll untuk memuat 5 menu berikutnya ({visibleSearchedMenusCount}/
                                {searchedMenus.length})
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
