import React from 'react';
import {
    Coffee,
    Compass,
    Cookie,
    CupSoda,
    IceCream,
    Sunrise,
    Utensils,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export type GlobalCategoryKey =
    | 'all'
    | 'makanan'
    | 'minuman'
    | 'snack'
    | 'dessert'
    | 'sarapan'
    | 'kopi';

type GlobalCategoryItem = {
    id: GlobalCategoryKey;
    label: string;
    icon: React.ElementType;
};

type GlobalCategoryChipsProps = {
    selectedCategory: GlobalCategoryKey;
    onSelectCategory: (category: GlobalCategoryKey) => void;
};

export const GLOBAL_CATEGORIES: GlobalCategoryItem[] = [
    { id: 'all', label: 'Semua', icon: Compass },
    { id: 'makanan', label: 'Makanan', icon: Utensils },
    { id: 'minuman', label: 'Minuman', icon: CupSoda },
    { id: 'snack', label: 'Snack & Cemilan', icon: Cookie },
    { id: 'dessert', label: 'Dessert & Manis', icon: IceCream },
    { id: 'sarapan', label: 'Sarapan', icon: Sunrise },
    { id: 'kopi', label: 'Kopi & Teh', icon: Coffee },
];

export default function GlobalCategoryChips({
    selectedCategory,
    onSelectCategory,
}: GlobalCategoryChipsProps) {
    return (
        <div className="w-full space-y-1.5">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Kategori Utama
                </span>
                {selectedCategory !== 'all' && (
                    <button
                        type="button"
                        onClick={() => onSelectCategory('all')}
                        className="text-[10px] text-primary font-bold hover:underline"
                    >
                        Tampilkan Semua
                    </button>
                )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none snap-x">
                {GLOBAL_CATEGORIES.map((cat) => {
                    const IconComponent = cat.icon;
                    const isActive = selectedCategory === cat.id;

                    return (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => onSelectCategory(cat.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 whitespace-nowrap transition-all duration-200 shrink-0 border ${
                                isActive
                                    ? 'bg-primary text-primary-foreground border-primary shadow-xs scale-102'
                                    : 'bg-card text-muted-foreground border-border/80 hover:border-primary/50 hover:text-foreground'
                            }`}
                        >
                            <IconComponent
                                className={`size-3.5 ${
                                    isActive ? 'text-primary-foreground' : 'text-primary'
                                }`}
                            />
                            <span>{cat.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
