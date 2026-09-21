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

    const foodFallback = '/images/food-placeholder.jpg';
    const tenantFallback = '/images/tenant-placeholder.jpg';

    // Filter menus based on search and category filter
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

    // Group filtered menus by Category for sectioned rendering
    const groupedCategorySections = useMemo(() => {
        if (filteredMenus.length === 0) return [];

        if (selectedCategoryId === 'recommended') {
            const recommendedMenus = filteredMenus.filter((m) => m.is_recommended);
            if (recommendedMenus.length === 0) return [];
            return [
                {
                    id: 'recommended',
                    name: '⭐ Best Seller / Menu Hits',
                    menus: recommendedMenus,
                },
            ];
        }

        if (selectedCategoryId !== 'all') {
            const cat = categories.find((c) => String(c.id) === selectedCategoryId);
            const catMenus = filteredMenus.filter((m) => String(m.category_id) === selectedCategoryId);
            if (catMenus.length === 0) return [];
            return [
                {
                    id: selectedCategoryId,
                    name: cat?.name || 'Kategori Menu',
                    menus: catMenus,
                },
            ];
        }

        // Selected === 'all': Group all filtered menus by category sections!
        const sections: Array<{
            id: string | number;
            name: string;
            menus: typeof menus;
        }> = [];

        categories.forEach((cat) => {
            const catMenus = filteredMenus.filter((m) => String(m.category_id) === String(cat.id));
            if (catMenus.length > 0) {
                sections.push({
                    id: cat.id,
                    name: cat.name,
                    menus: catMenus,
                });
            }
        });

        // Uncategorized items fallback
        const uncategorized = filteredMenus.filter(
            (m) => !m.category_id || !categories.some((c) => String(c.id) === String(m.category_id))
        );
        if (uncategorized.length > 0) {
            sections.push({
                id: 'uncategorized',
                name: 'Menu Lainnya',
                menus: uncategorized,
            });
        }

        return sections;
    }, [categories, filteredMenus, selectedCategoryId]);

    const rawBanner = tenant.banner_image || tenant.image || tenant.logo_image || '/images/tenant-placeholder.jpg';
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const bannerUrl = rawBanner.startsWith('http')
        ? rawBanner
        : `${origin}${rawBanner.startsWith('/') ? '' : '/'}${rawBanner}`;

    const tenantDescription =
        tenant.description || `Pesan makanan lezat & minuman segar dari ${tenant.name} di Smart Canteen FEB.`;

    return (
        <>
            <Head title={`${tenant.name} - Smart Canteen FEB`}>
                <meta name="description" content={tenantDescription} />
                <meta property="og:title" content={`${tenant.name} - Smart Canteen FEB`} />
                <meta property="og:description" content={tenantDescription} />
                <meta property="og:image" content={bannerUrl} />
                <meta property="og:image:secure_url" content={bannerUrl} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${tenant.name} - Smart Canteen FEB`} />
                <meta name="twitter:description" content={tenantDescription} />
                <meta name="twitter:image" content={bannerUrl} />
            </Head>

            <div className="flex flex-col gap-3.5 w-full pb-20">
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

                {/* Stand Header Card */}
                <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs relative">
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

                {/* Categories Filter Pills */}
                {categories.length > 0 && (
                    <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none sticky top-14 z-20 bg-background/95 backdrop-blur-md py-1">
                        <Button
                            type="button"
                            variant={selectedCategoryId === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategoryId('all')}
                            className="h-7 text-[10px] font-bold rounded-lg px-2.5 shrink-0"
                        >
                            Semua Kategori
                        </Button>
                        <Button
                            type="button"
                            variant={selectedCategoryId === 'recommended' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategoryId('recommended')}
                            className="h-7 text-[10px] font-bold rounded-lg px-2.5 gap-1 shrink-0"
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

                {/* Sectioned Menu Display by Category */}
                <div className="space-y-6">
                    {groupedCategorySections.length === 0 ? (
                        <div className="p-8 text-center border border-dashed rounded-2xl bg-muted/10 text-muted-foreground space-y-1">
                            <Utensils className="h-8 w-8 mx-auto opacity-30" />
                            <p className="text-xs font-semibold">Tidak ada menu ditemukan.</p>
                        </div>
                    ) : (
                        groupedCategorySections.map((section) => (
                            <div key={section.id} className="space-y-3">
                                {/* Category Caption Header */}
                                <div className="flex items-center justify-between border-b border-border/70 pb-2 pt-1">
                                    <div className="flex items-center gap-2">
                                        <div className="size-2.5 rounded-full bg-primary shrink-0" />
                                        <h2 className="text-sm font-black text-foreground tracking-tight">
                                            {section.name}
                                        </h2>
                                    </div>
                                    <span className="text-[10px] font-mono font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                                        {section.menus.length} Menu
                                    </span>
                                </div>

                                {/* Menu Grid for this Category */}
                                <div className="grid grid-cols-2 gap-2.5">
                                    {section.menus.map((menu) => (
                                        <div
                                            key={menu.id}
                                            onClick={() => router.get(`/menu/${menu.id}`)}
                                            className="group rounded-xl border border-border bg-card overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
                                        >
                                            <div>
                                                {/* 1:1 Aspect Ratio Food Photo */}
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
                                                    <h3 className="font-bold text-xs text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                                        {menu.name}
                                                    </h3>
                                                    {menu.description && (
                                                        <p className="text-[10.5px] text-muted-foreground line-clamp-2 leading-tight">
                                                            {menu.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="p-2.5 pt-1 border-t border-border/40 mt-1 flex items-center justify-between gap-1">
                                                <span className="font-mono font-extrabold text-xs text-foreground">
                                                    Rp {menu.price.toLocaleString('id-ID')}
                                                </span>
                                                <Button size="sm" className="h-7 w-7 p-0 rounded-lg shrink-0">
                                                    <Plus className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

TenantDetail.layout = (page: React.ReactNode) => (
    <StudentLayout>{page}</StudentLayout>
);
