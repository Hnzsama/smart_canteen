import React from 'react';
import { ChevronRight, Clock, Flame, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TenantItem } from '../types';

type TenantListCardProps = {
    tenant: TenantItem;
    tenantFallback: string;
    onSelectTenant: (tenant: TenantItem) => void;
};

export default function TenantListCard({
    tenant,
    tenantFallback,
    onSelectTenant,
}: TenantListCardProps) {
    const ratingVal = tenant.rating ? Number(tenant.rating).toFixed(1) : '5.0';
    const ordersVal = tenant.orders_count ?? 120;

    return (
        <div
            onClick={() => onSelectTenant(tenant)}
            className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-4 shadow-2xs hover:border-primary/50 hover:shadow-md transition-all duration-300 cursor-pointer flex items-center justify-between gap-3.5 before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-primary/0 before:via-primary/80 before:to-primary/0 before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300"
        >
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
                {/* Stand Logo Image */}
                <div className="relative size-14 sm:size-15 rounded-2xl overflow-hidden border border-border/80 bg-muted/60 shrink-0 shadow-2xs group-hover:scale-105 group-hover:border-primary/40 transition-all duration-300">
                    <img
                        src={tenant.logo_image || tenant.image || tenantFallback}
                        alt={tenant.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = tenantFallback;
                        }}
                    />
                </div>

                {/* Stand Content */}
                <div className="flex flex-col min-w-0 flex-1 space-y-1.5">
                    {/* Header Row: Title & Status Badge */}
                    <div className="flex items-center justify-between gap-2 min-w-0 w-full">
                        <h3 className="font-black text-xs sm:text-sm text-foreground truncate min-w-0 flex-1 group-hover:text-primary transition-colors leading-tight tracking-tight">
                            {tenant.name}
                        </h3>
                        <Badge
                            variant="outline"
                            className={`text-[9px] px-2 py-0.5 h-4.5 font-extrabold shrink-0 gap-1 rounded-full border ${
                                tenant.is_open
                                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                    : 'border-slate-500/30 bg-slate-500/10 text-slate-500'
                            }`}
                        >
                            <span
                                className={`size-1.5 rounded-full ${
                                    tenant.is_open ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                                }`}
                            />
                            <span>{tenant.is_open ? 'BUKA' : 'TUTUP'}</span>
                        </Badge>
                    </div>

                    {/* Description */}
                    <p className="text-[11px] text-muted-foreground line-clamp-1 leading-snug">
                        {tenant.description || 'Stand kuliner favorit Kantin FEB'}
                    </p>

                    {/* Metrics Pills Row */}
                    <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                        {/* Rating Pill */}
                        <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-extrabold">
                            <Star className="size-3.5 fill-amber-400 text-amber-400 shrink-0" />
                            <span>{ratingVal}</span>
                            <span className="text-[9.5px] text-muted-foreground font-normal">
                                ({tenant.reviews_count || 0})
                            </span>
                        </div>

                        {/* Terlayani Pill */}
                        <div className="flex items-center gap-1 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-bold">
                            <Flame className="size-3 text-rose-500 shrink-0" />
                            <span>{ordersVal}+ terlayani</span>
                        </div>

                        {/* Opening Hours Pill */}
                        {tenant.opening_hours && (
                            <div className="hidden sm:flex items-center gap-1 bg-muted/60 border border-border/50 px-2.5 py-0.5 rounded-full text-[10.5px] font-mono text-muted-foreground">
                                <Clock className="size-3 text-primary/80 shrink-0" />
                                <span>{tenant.opening_hours}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Arrow Icon Button */}
            <div className="size-8 rounded-2xl bg-muted/60 group-hover:bg-primary group-hover:text-primary-foreground text-muted-foreground flex items-center justify-center transition-all duration-300 shrink-0 ml-1 border border-border/60 group-hover:border-primary group-hover:shadow-sm">
                <ChevronRight className="size-4 group-hover:translate-x-0.5 transition-transform duration-300" />
            </div>
        </div>
    );
}
