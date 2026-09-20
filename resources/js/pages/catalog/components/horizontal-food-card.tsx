import React from 'react';
import { router } from '@inertiajs/react';
import { Banknote, Clock, Heart, Plus, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MenuItem } from '../types';

type HorizontalFoodCardProps = {
    menu: MenuItem;
    foodFallback: string;
    isFav: boolean;
    onToggleFav: (e: React.MouseEvent) => void;
    onOpenOptionModal: (e: React.MouseEvent) => void;
};

export default function HorizontalFoodCard({
    menu,
    foodFallback,
    isFav,
    onToggleFav,
    onOpenOptionModal,
}: HorizontalFoodCardProps) {
    const numPrice = menu.price;
    const numOrigPrice = menu.original_price;
    const formattedPrice = `Rp ${numPrice.toLocaleString('id-ID')}`;
    const formattedOriginalPrice =
        numOrigPrice && numOrigPrice > numPrice
            ? `Rp ${numOrigPrice.toLocaleString('id-ID')}`
            : null;

    const isCheap = menu.price <= 15000;

    return (
        <div
            onClick={() => router.get(`/menu/${menu.id}`)}
            className={`group rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer h-full ${
                !menu.is_tenant_open ? 'opacity-90' : ''
            }`}
        >
            <div>
                {/* 1:1 Aspect Ratio Photo */}
                <div className="relative aspect-square w-full bg-muted/40 overflow-hidden">
                    <img
                        src={menu.image || foodFallback}
                        alt={menu.name}
                        className={`h-full w-full object-cover transition-transform duration-300 ${
                            menu.is_tenant_open ? 'group-hover:scale-105' : 'grayscale opacity-75'
                        }`}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = foodFallback;
                        }}
                    />

                    {/* Favorite Button */}
                    <button
                        type="button"
                        onClick={onToggleFav}
                        className="absolute top-2.5 right-2.5 size-7 rounded-full bg-background/85 backdrop-blur-md flex items-center justify-center text-muted-foreground hover:text-rose-500 shadow-xs transition-colors z-10"
                    >
                        <Heart className={`size-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>

                    {/* Left Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
                        {!menu.is_tenant_open ? (
                            <Badge variant="destructive" className="text-[8.5px] px-1.5 py-0.5 h-4 font-black shadow-xs bg-rose-600 text-white border-none">
                                TUTUP
                            </Badge>
                        ) : (
                            <>
                                {menu.is_recommended && (
                                    <Badge variant="default" className="text-[8.5px] px-1.5 py-0.5 h-4 font-bold shadow-xs gap-0.5">
                                        <Star className="h-2.5 w-2.5 fill-current" />
                                        Hits
                                    </Badge>
                                )}
                                {isCheap && !menu.is_recommended && (
                                    <Badge variant="secondary" className="text-[8.5px] px-1.5 py-0.5 h-4 font-bold shadow-xs bg-emerald-500 text-white border-none gap-0.5">
                                        <Banknote className="h-2.5 w-2.5" />
                                        Hemat
                                    </Badge>
                                )}
                            </>
                        )}
                    </div>

                    {/* Prep time badge */}
                    <div className="absolute bottom-2.5 right-2.5 bg-background/90 text-foreground text-[9.5px] px-2 py-0.5 rounded-full flex items-center gap-1 font-mono border border-border/80 shadow-xs z-10">
                        <Clock className="h-2.5 w-2.5 text-primary" />
                        <span>{menu.estimated_time}m</span>
                    </div>
                </div>

                {/* Details */}
                <div className="p-3.5 space-y-1.5">
                    <span className="text-[9.5px] font-semibold text-muted-foreground/80 uppercase tracking-wider block truncate">
                        {menu.tenant_name}
                    </span>

                    <h3 className="font-extrabold text-xs text-foreground line-clamp-1 group-hover:text-primary transition-colors leading-snug">
                        {menu.name}
                    </h3>
                </div>
            </div>

            {/* Price & Plus Button */}
            <div className="px-3 pb-3 pt-2 border-t border-border/40 mt-1 flex items-center justify-between gap-2">
                <div className="flex flex-col min-w-0 pr-1">
                    {formattedOriginalPrice && (
                        <span className="font-mono text-[9.5px] text-muted-foreground line-through whitespace-nowrap">
                            {formattedOriginalPrice}
                        </span>
                    )}
                    <span className="font-mono font-black text-xs text-foreground whitespace-nowrap">
                        {formattedPrice}
                    </span>
                </div>

                <Button
                    type="button"
                    size="sm"
                    disabled={!menu.is_tenant_open}
                    onClick={(e) => {
                        if (!menu.is_tenant_open) {
                            e.stopPropagation();
                            return;
                        }
                        onOpenOptionModal(e);
                    }}
                    className={`h-7 px-2 text-[9.5px] font-black rounded-full shadow-xs shrink-0 flex items-center justify-center transition-all ${
                        menu.is_tenant_open
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90 group-hover:scale-105'
                            : 'bg-muted text-muted-foreground cursor-not-allowed opacity-70'
                    }`}
                    title={menu.is_tenant_open ? 'Tambah ke pesanan' : 'Stand Tutup'}
                >
                    {menu.is_tenant_open ? (
                        <Plus className="h-4 w-4 stroke-[2.5]" />
                    ) : (
                        <span>TUTUP</span>
                    )}
                </Button>
            </div>
        </div>
    );
}
