import { ReactNode, UIEvent, MutableRefObject } from 'react';
import { Loader2 } from 'lucide-react';
import HorizontalFoodCard from './horizontal-food-card';
import { MenuItem } from '../types';

interface HorizontalMenuCarouselProps {
    title: ReactNode;
    menus: MenuItem[];
    visibleCount: number;
    totalCount: number;
    foodFallback: string;
    favorites: Record<number, boolean>;
    onToggleFav: (e: React.MouseEvent, menuId: number) => void;
    onOpenOptionModal: (e: React.MouseEvent, menu: MenuItem) => void;
    onScroll: (
        e: UIEvent<HTMLDivElement>,
        visibleCount: number,
        totalCount: number,
        setVisibleCount: React.Dispatch<React.SetStateAction<number>>,
        timerRef: MutableRefObject<NodeJS.Timeout | null>
    ) => void;
    setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
    timerRef: MutableRefObject<NodeJS.Timeout | null>;
}

export default function HorizontalMenuCarousel({
    title,
    menus,
    visibleCount,
    totalCount,
    foodFallback,
    favorites,
    onToggleFav,
    onOpenOptionModal,
    onScroll,
    setVisibleCount,
    timerRef,
}: HorizontalMenuCarouselProps) {
    if (menus.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-black text-foreground flex items-center gap-1.5">
                    {title}
                </h2>
            </div>

            <div
                onScroll={(e) => onScroll(e, visibleCount, totalCount, setVisibleCount, timerRef)}
                className="flex items-center gap-4 overflow-x-auto pb-2.5 scrollbar-none snap-x"
            >
                {menus.slice(0, visibleCount).map((menu) => (
                    <div key={menu.id} className="w-[180px] shrink-0 snap-start">
                        <HorizontalFoodCard
                            menu={menu}
                            foodFallback={foodFallback}
                            isFav={Boolean(favorites[menu.id])}
                            onToggleFav={(e) => onToggleFav(e, menu.id)}
                            onOpenOptionModal={(e) => onOpenOptionModal(e, menu)}
                        />
                    </div>
                ))}

                {visibleCount < totalCount && (
                    <div className="w-[120px] shrink-0 snap-start h-[160px] border border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center p-3 gap-1 text-muted-foreground bg-muted/20 animate-pulse">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-[10px] font-semibold">Geser +5 menu</span>
                    </div>
                )}
            </div>
        </div>
    );
}
