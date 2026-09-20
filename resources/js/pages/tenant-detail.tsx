import { useState, useMemo, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Clock,
    Loader2,
    MapPin,
    Phone,
    Plus,
    Search,
    ShoppingBag,
    Sparkles,
    Star,
    Store,
    Utensils,
} from 'lucide-react';
import StudentLayout from '@/layouts/student-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type TenantDetailProps = {
    tenant: {
        id: number;
        name: string;
        slug: string;
        description: string | null;
        image: string | null;
        banner_image: string | null;
        logo_image: string | null;
        phone: string | null;
        opening_hours: string | null;
        is_open: boolean;
        rating: number;
        reviews_count: number;
    };
    categories: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
    menus: Array<{
        id: number;
        tenant_id: number;
        tenant_name: string;
        tenant_slug: string;
        tenant_logo: string;
        is_tenant_open: boolean;
        category_id: number | null;
        category_name: string;
        name: string;
        description: string | null;
        price: number;
        original_price: number | null;
        image: string | null;
        is_recommended: boolean;
        estimated_time: number;
        options: Array<{
            name: string;
            type?: string;
            required?: boolean;
            choices: Array<{ name: string; price: number }>;
        }>;
    }>;
};

export default function TenantDetail({ tenant, categories = [], menus = [] }: TenantDetailProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

    // Batch Scroll Pagination state (5 items initially, trigger +5 on scroll with debounce)
    const [visibleMenusCount, setVisibleMenusCount] = useState(5);
    const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);

    const foodFallback = '/images/food-placeholder.jpg';
    const tenantFallback = '/images/tenant-placeholder.jpg';

    const filteredMenus = useMemo(() => {
        return menus.filter((m) => {
            const matchesSearch =
                !searchQuery.trim() ||
                m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesCat =
                selectedCategoryId === 'all' ||
                (selectedCategoryId === 'recommended' && m.is_recommended) ||
                String(m.category_id) === selectedCategoryId;

            return matchesSearch && matchesCat;
        });
    }, [menus, searchQuery, selectedCategoryId]);

    // Reset pagination when search query or category changes
    useEffect(() => {
        setVisibleMenusCount(5);
    }, [searchQuery, selectedCategoryId]);

    // Debounced window scroll handler (loads 5 more menus when near bottom)
    useEffect(() => {
        const handleWindowScroll = () => {
            const scrollBottom = window.innerHeight + window.scrollY;
            const targetThreshold = document.documentElement.scrollHeight - 300;

            if (scrollBottom >= targetThreshold) {
                if (visibleMenusCount < filteredMenus.length && !scrollTimerRef.current) {
                    scrollTimerRef.current = setTimeout(() => {
                        setVisibleMenusCount((prev) => Math.min(prev + 5, filteredMenus.length));
                        scrollTimerRef.current = null;
                    }, 250);
                }
            }
        };

        window.addEventListener('scroll', handleWindowScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleWindowScroll);
            if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
        };
    }, [visibleMenusCount, filteredMenus.length]);

    return (
        <>
            <Head title={`${tenant.name} - Smart Canteen FEB`} />

            <div className="flex flex-col gap-3.5 w-full">
                {/* Back Button & Top Navigation */}
                <div className="flex items-center justify-between">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => router.get('/')}
                        className="h-8 text-xs font-bold gap-1 text-muted-foreground hover:text-foreground p-0"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Kembali ke Katalog</span>
                    </Button>

                    <Badge
                        variant="outline"
                        className={
                            tenant.is_open
                                ? 'text-[10px] font-bold text-emerald-300 border-emerald-800/40 bg-emerald-950/40'
                                : 'text-[10px] font-bold bg-destructive text-destructive-foreground'
                        }
                    >
                        {tenant.is_open ? 'STAND BUKA' : 'STAND TUTUP'}
                    </Badge>
                </div>

                {/* Stand Header Card & Fallback Images */}
                <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs relative">
                    {/* Stand Banner / Header Accent */}
                    <div className="h-24 w-full bg-gradient-to-r from-primary/80 to-primary relative overflow-hidden">
                        <img
                            src={tenant.banner_image || tenant.image || tenantFallback}
                            alt={tenant.name}
                            className="h-full w-full object-cover opacity-40"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = tenantFallback;
                            }}
                        />
                    </div>

                    <div className="p-4 pt-0 relative space-y-3">
                        {/* Stand Avatar Logo */}
                        <div className="-mt-10 flex items-end justify-between">
                            <img
                                src={tenant.logo_image || tenant.image || tenantFallback}
                                alt={tenant.name}
                                className="h-16 w-16 rounded-2xl object-cover border-4 border-card shadow-md bg-muted"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = tenantFallback;
                                }}
                            />

                            <div className="flex items-center gap-1 bg-muted/80 border border-border/60 text-foreground text-xs px-3 py-1 rounded-full font-bold shadow-2xs mt-11">
                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
                                <span>{tenant.rating.toFixed(1)}</span>
                                <span className="text-[10px] text-muted-foreground font-normal">({tenant.reviews_count} ulasan)</span>
                            </div>
                        </div>

                        {/* Stand Title & Details */}
                        <div className="space-y-1">
                            <h1 className="text-lg font-black text-foreground">{tenant.name}</h1>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                                {tenant.description || 'Stand kuliner favorit di Kantin FEB Universitas.'}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground font-mono pt-1 border-t border-border">
                            <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 text-primary" />
                                Operasional: {tenant.opening_hours || '08:00 - 17:00'}
                            </span>
                            {tenant.phone && (
                                <span className="flex items-center gap-1">
                                    <Phone className="h-3.5 w-3.5 text-primary" />
                                    {tenant.phone}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Search Bar inside Tenant */}
                <div className="relative w-full">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                        placeholder={`Cari menu di ${tenant.name}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-8 text-xs rounded-xl"
                    />
                </div>

                {/* Categories Pills */}
                {categories.length > 0 && (
                    <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
                        <Button
                            type="button"
                            variant={selectedCategoryId === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategoryId('all')}
                            className="h-7 text-[10px] font-bold rounded-lg px-2.5"
                        >
                            Semua Menu
                        </Button>
                        <Button
                            type="button"
                            variant={selectedCategoryId === 'recommended' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategoryId('recommended')}
                            className="h-7 text-[10px] font-bold rounded-lg px-2.5 gap-1"
                        >
                            <Star className="h-3 w-3 fill-current" />
                            Best Seller
                        </Button>
                        {categories.map((c) => (
                            <Button
                                key={c.id}
                                type="button"
                                variant={selectedCategoryId === String(c.id) ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedCategoryId(String(c.id))}
                                className="h-7 text-[10px] font-semibold rounded-lg px-2.5 shrink-0"
                            >
                                {c.name}
                            </Button>
                        ))}
                    </div>
                )}

                {/* Menus List */}
                <div className="space-y-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {filteredMenus.length} Menu {tenant.name}
                    </span>

                    {filteredMenus.length === 0 ? (
                        <div className="p-8 text-center border border-dashed rounded-2xl bg-muted/10 text-muted-foreground space-y-1">
                            <Utensils className="h-8 w-8 mx-auto opacity-30" />
                            <p className="text-xs font-semibold">Tidak ada menu ditemukan.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2.5">
                            {filteredMenus.slice(0, visibleMenusCount).map((menu) => (
                                <div
                                    key={menu.id}
                                    onClick={() => router.get(`/menu/${menu.id}`)}
                                    className="group rounded-xl border border-border bg-card overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
                                >
                                    <div>
                                        {/* 1:1 Aspect Ratio Food Photo with Fallback */}
                                        <div className="relative aspect-square w-full bg-muted/40 overflow-hidden">
                                            <img
                                                src={menu.image || foodFallback}
                                                alt={menu.name}
                                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = foodFallback;
                                                }}
                                            />

                                            <div className="absolute top-1.5 left-1.5 flex flex-col gap-1 items-start">
                                                {menu.is_recommended && (
                                                    <Badge variant="default" className="text-[8px] px-1 py-0 h-3.5 font-bold shadow-xs gap-0.5">
                                                        <Star className="h-2.5 w-2.5 fill-current" />
                                                        Hits
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="absolute bottom-1.5 right-1.5 bg-background/90 text-foreground text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 font-mono border border-border">
                                                <Clock className="h-2.5 w-2.5 text-primary" />
                                                <span>{menu.estimated_time}m</span>
                                            </div>
                                        </div>

                                        <div className="p-2.5 space-y-1">
                                            <Badge variant="secondary" className="text-[8px] font-normal px-1 py-0 h-3.5">
                                                {menu.category_name}
                                            </Badge>
                                            <h3 className="font-bold text-xs text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                                {menu.name}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="p-2.5 pt-0 border-t border-border/40 mt-1 flex items-center justify-between gap-1">
                                        <span className="font-mono font-extrabold text-xs text-foreground">
                                            Rp {menu.price.toLocaleString('id-ID')}
                                        </span>
                                        <Button size="sm" className="h-7 w-7 p-0 rounded-lg shrink-0">
                                            <Plus className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {visibleMenusCount < filteredMenus.length && (
                                <div className="col-span-2 py-3 flex items-center justify-center gap-2 text-xs text-muted-foreground font-medium animate-pulse bg-muted/20 rounded-xl border border-dashed border-border">
                                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                    <span>Scroll untuk memuat 5 menu berikutnya ({visibleMenusCount}/{filteredMenus.length})</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

TenantDetail.layout = (page: React.ReactNode) => (
    <StudentLayout>{page}</StudentLayout>
);
