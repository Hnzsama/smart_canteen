import { useState, useMemo, useEffect, useRef } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import {
    Banknote,
    Flame,
    Loader2,
    Search,
    Store,
    Sunrise,
    Sun,
    Sunset,
    Moon,
    Utensils,
    X,
} from 'lucide-react';
import StudentLayout from '@/layouts/student-layout';
import { useCart } from '@/hooks/use-cart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CartDrawer from './components/cart-drawer';
import GlobalCategoryChips, { GlobalCategoryKey } from './components/global-category-chips';
import HorizontalFoodCard from './components/horizontal-food-card';
import MenuOptionsDialog from './components/menu-options-dialog';
import TenantListCard from './components/tenant-list-card';
import TimeHeroBanner from './components/time-hero-banner';
import { CartItem, CatalogProps, MenuItem, TenantItem, TimeMode } from './types';

export default function StudentCatalog({
    tenants = [],
    categories = [],
    menus = [],
    activeTenant = null,
    filters = { search: '', tenant_id: 'all', category_id: 'all' },
}: CatalogProps) {
    const page = usePage();
    const userName = (page.props.auth as any)?.user?.name?.split(' ')[0] || 'Mahasiswa';

    const foodFallback = '/images/food-placeholder.jpg';
    const tenantFallback = '/images/tenant-placeholder.jpg';

    // Auto-detect time mode based on actual hour
    const [timeMode, setTimeMode] = useState<TimeMode>(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 11) return 'pagi';
        if (hour >= 11 && hour < 15) return 'siang';
        if (hour >= 15 && hour < 18) return 'sore';
        return 'malam';
    });

    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedGlobalCategory, setSelectedGlobalCategory] = useState<GlobalCategoryKey>(
        (filters.global_category as GlobalCategoryKey) || 'all'
    );
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>(filters.category_id || 'all');
    const [isSearchingServer, setIsSearchingServer] = useState(false);
    const [favorites, setFavorites] = useState<Record<number, boolean>>({});

    const serverSearchTimerRef = useRef<NodeJS.Timeout | null>(null);
    const isInitialMountRef = useRef(true);

    // Debounced server-side live search effect
    useEffect(() => {
        if (isInitialMountRef.current) {
            isInitialMountRef.current = false;
            return;
        }

        setIsSearchingServer(true);

        if (serverSearchTimerRef.current) {
            clearTimeout(serverSearchTimerRef.current);
        }

        serverSearchTimerRef.current = setTimeout(() => {
            const queryParams: Record<string, string> = {};
            if (searchQuery.trim()) {
                queryParams.search = searchQuery.trim();
            }
            if (selectedGlobalCategory !== 'all') {
                queryParams.global_category = selectedGlobalCategory;
            }
            if (selectedCategoryId !== 'all') {
                queryParams.category_id = selectedCategoryId;
            }

            router.get('/', queryParams, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['menus', 'filters'],
                onFinish: () => {
                    setIsSearchingServer(false);
                },
            });
        }, 350);

        return () => {
            if (serverSearchTimerRef.current) {
                clearTimeout(serverSearchTimerRef.current);
            }
        };
    }, [searchQuery, selectedGlobalCategory, selectedCategoryId]);

    // Batch Scroll Pagination state (5 items initially, trigger +5 on scroll with debounce)
    const [visibleTenantsCount, setVisibleTenantsCount] = useState(5);
    const [visibleSearchedMenusCount, setVisibleSearchedMenusCount] = useState(5);
    const [visibleTimeMenusCount, setVisibleTimeMenusCount] = useState(5);
    const [visibleHitsMenusCount, setVisibleHitsMenusCount] = useState(5);
    const [visibleBudgetMenusCount, setVisibleBudgetMenusCount] = useState(5);

    const [isLoadingTenants, setIsLoadingTenants] = useState(false);
    const [isLoadingSearchedMenus, setIsLoadingSearchedMenus] = useState(false);

    // Debounce refs for scroll handlers
    const tenantScrollTimerRef = useRef<NodeJS.Timeout | null>(null);
    const searchMenuScrollTimerRef = useRef<NodeJS.Timeout | null>(null);
    const timeCarouselTimerRef = useRef<NodeJS.Timeout | null>(null);
    const hitsCarouselTimerRef = useRef<NodeJS.Timeout | null>(null);
    const budgetCarouselTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Add-on Order Modal state
    const [selectedMenuModal, setSelectedMenuModal] = useState<MenuItem | null>(null);
    const [selectedChoices, setSelectedChoices] = useState<Record<string, { name: string; price: number }>>({});
    const [itemQuantity, setItemQuantity] = useState(1);
    const [orderNote, setOrderNote] = useState('');
    const { cartItems, setCartItems, totalCartCount, totalCartPrice } = useCart();
    const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

    const toggleFavorite = (e: React.MouseEvent, menuId: number) => {
        e.stopPropagation();
        setFavorites((prev) => ({ ...prev, [menuId]: !prev[menuId] }));
    };

    // Filter menus based on search or global category selection
    const searchedMenus = useMemo(() => {
        if (!searchQuery.trim() && selectedGlobalCategory === 'all' && selectedCategoryId === 'all') {
            return menus;
        }

        return menus.filter((menu) => {
            const matchesSearch =
                !searchQuery.trim() ||
                menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (menu.description && menu.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                menu.tenant_name.toLowerCase().includes(searchQuery.toLowerCase());

            let matchesGlobalCategory = true;
            if (selectedGlobalCategory !== 'all') {
                const name = menu.name.toLowerCase();
                const desc = (menu.description || '').toLowerCase();
                const cat = (menu.category_name || '').toLowerCase();
                const corpus = `${name} ${desc} ${cat}`;

                if (selectedGlobalCategory === 'makanan') {
                    matchesGlobalCategory =
                        cat.includes('makanan') ||
                        corpus.includes('nasi') ||
                        corpus.includes('ayam') ||
                        corpus.includes('mie') ||
                        corpus.includes('geprek') ||
                        corpus.includes('bakso') ||
                        corpus.includes('padang') ||
                        corpus.includes('soto') ||
                        corpus.includes('rendang') ||
                        corpus.includes('gulai') ||
                        corpus.includes('bebek') ||
                        corpus.includes('ikan') ||
                        corpus.includes('sate');
                } else if (selectedGlobalCategory === 'minuman') {
                    matchesGlobalCategory =
                        cat.includes('minuman') ||
                        corpus.includes('es') ||
                        corpus.includes('jus') ||
                        corpus.includes('teh') ||
                        corpus.includes('kopi') ||
                        corpus.includes('boba') ||
                        corpus.includes('susu') ||
                        corpus.includes('air') ||
                        corpus.includes('drink') ||
                        corpus.includes('soda') ||
                        corpus.includes('smoothie');
                } else if (selectedGlobalCategory === 'snack') {
                    matchesGlobalCategory =
                        cat.includes('snack') ||
                        cat.includes('cemilan') ||
                        corpus.includes('pisang') ||
                        corpus.includes('roti') ||
                        corpus.includes('dimsum') ||
                        corpus.includes('siomay') ||
                        corpus.includes('cireng') ||
                        corpus.includes('gorengan') ||
                        corpus.includes('kentang') ||
                        corpus.includes('snack');
                } else if (selectedGlobalCategory === 'dessert') {
                    matchesGlobalCategory =
                        cat.includes('dessert') ||
                        corpus.includes('manis') ||
                        corpus.includes('es krim') ||
                        corpus.includes('pudding') ||
                        corpus.includes('puding') ||
                        corpus.includes('cokelat') ||
                        corpus.includes('cake') ||
                        corpus.includes('waffle') ||
                        corpus.includes('donut');
                } else if (selectedGlobalCategory === 'sarapan') {
                    matchesGlobalCategory =
                        cat.includes('sarapan') ||
                        corpus.includes('bubur') ||
                        corpus.includes('lontong') ||
                        corpus.includes('uduk') ||
                        corpus.includes('roti') ||
                        corpus.includes('telur');
                } else if (selectedGlobalCategory === 'kopi') {
                    matchesGlobalCategory =
                        cat.includes('kopi') ||
                        corpus.includes('kopi') ||
                        corpus.includes('coffee') ||
                        corpus.includes('latte') ||
                        corpus.includes('espresso') ||
                        corpus.includes('teh') ||
                        corpus.includes('matcha');
                }
            }

            const matchesCategory =
                selectedCategoryId === 'all' ||
                (selectedCategoryId === 'recommended' && menu.is_recommended) ||
                String(menu.category_id) === selectedCategoryId;

            return matchesSearch && matchesGlobalCategory && matchesCategory;
        });
    }, [menus, searchQuery, selectedGlobalCategory, selectedCategoryId]);

    // Grouping menus for horizontal sliders based on time vibe
    const timeRecommendedMenus = useMemo(() => {
        if (timeMode === 'pagi') {
            return menus.filter(
                (m) =>
                    m.category_name.toLowerCase().includes('sarapan') ||
                    m.name.toLowerCase().includes('nasi') ||
                    m.name.toLowerCase().includes('bubur') ||
                    m.name.toLowerCase().includes('kopi') ||
                    m.is_recommended
            );
        } else if (timeMode === 'siang') {
            return menus.filter(
                (m) =>
                    m.name.toLowerCase().includes('geprek') ||
                    m.name.toLowerCase().includes('nasi') ||
                    m.name.toLowerCase().includes('ayam') ||
                    m.name.toLowerCase().includes('mie') ||
                    m.is_recommended
            );
        } else if (timeMode === 'sore') {
            return menus.filter(
                (m) =>
                    m.name.toLowerCase().includes('es') ||
                    m.name.toLowerCase().includes('jus') ||
                    m.name.toLowerCase().includes('teh') ||
                    m.name.toLowerCase().includes('cemilan') ||
                    m.name.toLowerCase().includes('gorengan')
            );
        } else {
            return menus.filter(
                (m) =>
                    m.name.toLowerCase().includes('kopi') ||
                    m.name.toLowerCase().includes('roti') ||
                    m.name.toLowerCase().includes('snack') ||
                    m.is_recommended
            );
        }
    }, [menus, timeMode]);

    const hitsMenus = useMemo(() => menus.filter((m) => m.is_recommended), [menus]);
    const budgetMenus = useMemo(() => menus.filter((m) => m.price <= 15000), [menus]);

    const timeRowTitles: Record<TimeMode, { title: string; icon: React.ElementType }> = {
        pagi: { title: 'Rekomendasi Sarapan Pagi', icon: Sunrise },
        siang: { title: 'Rekomendasi Makan Siang Kenyang', icon: Sun },
        sore: { title: 'Minuman Segar & Cemilan Sore', icon: Sunset },
        malam: { title: 'Kopi & Cemilan Lembur Malam', icon: Moon },
    };

    const currentVibeRow = timeRowTitles[timeMode];

    // Reset searched menus visible count when search/filters change
    useEffect(() => {
        setVisibleSearchedMenusCount(5);
    }, [searchQuery, selectedGlobalCategory, selectedCategoryId]);

    // Debounced window scroll listener for vertical infinite scroll (searched menus & stand list)
    useEffect(() => {
        const handleWindowScroll = () => {
            const scrollBottom = window.innerHeight + window.scrollY;
            const targetThreshold = document.documentElement.scrollHeight - 300;

            if (scrollBottom >= targetThreshold) {
                const isSearching =
                    Boolean(searchQuery.trim()) ||
                    selectedGlobalCategory !== 'all' ||
                    selectedCategoryId !== 'all';

                if (isSearching) {
                    if (visibleSearchedMenusCount < searchedMenus.length && !searchMenuScrollTimerRef.current) {
                        setIsLoadingSearchedMenus(true);
                        searchMenuScrollTimerRef.current = setTimeout(() => {
                            setVisibleSearchedMenusCount((prev) => Math.min(prev + 5, searchedMenus.length));
                            setIsLoadingSearchedMenus(false);
                            searchMenuScrollTimerRef.current = null;
                        }, 250);
                    }
                } else {
                    if (visibleTenantsCount < tenants.length && !tenantScrollTimerRef.current) {
                        setIsLoadingTenants(true);
                        tenantScrollTimerRef.current = setTimeout(() => {
                            setVisibleTenantsCount((prev) => Math.min(prev + 5, tenants.length));
                            setIsLoadingTenants(false);
                            tenantScrollTimerRef.current = null;
                        }, 250);
                    }
                }
            }
        };

        window.addEventListener('scroll', handleWindowScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleWindowScroll);
            if (tenantScrollTimerRef.current) clearTimeout(tenantScrollTimerRef.current);
            if (searchMenuScrollTimerRef.current) clearTimeout(searchMenuScrollTimerRef.current);
        };
    }, [
        visibleTenantsCount,
        tenants.length,
        visibleSearchedMenusCount,
        searchedMenus.length,
        searchQuery,
        selectedGlobalCategory,
        selectedCategoryId,
    ]);

    // Helper for horizontal carousel scroll pagination (5 items trigger on scroll, debounced)
    const handleCarouselScroll = (
        e: React.UIEvent<HTMLDivElement>,
        visibleCount: number,
        totalCount: number,
        setVisibleCount: React.Dispatch<React.SetStateAction<number>>,
        timerRef: React.MutableRefObject<NodeJS.Timeout | null>
    ) => {
        const target = e.currentTarget;
        const isNearEnd = target.scrollLeft + target.clientWidth >= target.scrollWidth - 50;

        if (isNearEnd && visibleCount < totalCount && !timerRef.current) {
            timerRef.current = setTimeout(() => {
                setVisibleCount((prev) => Math.min(prev + 5, totalCount));
                timerRef.current = null;
            }, 250);
        }
    };

    const handleSelectTenant = (tenant: TenantItem | null) => {
        if (!tenant) {
            router.get('/', {}, { preserveState: true, preserveScroll: true });
        } else {
            router.get(`/${tenant.slug}`, {}, { preserveState: true, preserveScroll: true });
        }
    };

    const handleOpenOptionModal = (e: React.MouseEvent, menu: MenuItem) => {
        e.stopPropagation();
        setSelectedMenuModal(menu);
        setItemQuantity(1);
        setOrderNote('');
        const initialChoices: Record<string, { name: string; price: number }> = {};
        if (menu.options && menu.options.length > 0) {
            menu.options.forEach((group) => {
                if (group.required && group.choices && group.choices.length > 0) {
                    initialChoices[group.name] = group.choices[0];
                }
            });
        }
        setSelectedChoices(initialChoices);
    };

    const calculateModalTotalPrice = () => {
        if (!selectedMenuModal) return 0;
        let base = selectedMenuModal.price;
        Object.values(selectedChoices).forEach((choice) => {
            base += choice.price || 0;
        });
        return base * itemQuantity;
    };

    const areChoicesEqual = (
        c1: Record<string, { name: string; price: number }>,
        c2: Record<string, { name: string; price: number }>
    ) => {
        const keys1 = Object.keys(c1 || {});
        const keys2 = Object.keys(c2 || {});
        if (keys1.length !== keys2.length) return false;
        for (const key of keys1) {
            if (!c2[key] || c1[key].name !== c2[key].name) return false;
        }
        return true;
    };

    const handleAddToCart = () => {
        if (!selectedMenuModal) return;
        const total = calculateModalTotalPrice();

        setCartItems((prev) => {
            // Find existing item with exact same menu ID, exact same choices, and exact same note
            const existingIndex = prev.findIndex(
                (item) =>
                    item.menu.id === selectedMenuModal.id &&
                    areChoicesEqual(item.choices, selectedChoices) &&
                    (item.note || '').trim() === orderNote.trim()
            );

            if (existingIndex > -1) {
                // Exact same menu + same add-ons + same note: combine quantities!
                const updated = [...prev];
                const existing = updated[existingIndex];
                const newQty = existing.qty + itemQuantity;
                const unitPrice = total / itemQuantity;
                updated[existingIndex] = {
                    ...existing,
                    qty: newQty,
                    price: unitPrice * newQty,
                };
                return updated;
            } else {
                // Same menu with DIFFERENT add-ons or DIFFERENT note (or new menu): add as a new separate item entry!
                return [
                    ...prev,
                    {
                        menu: selectedMenuModal,
                        qty: itemQuantity,
                        price: total,
                        choices: selectedChoices,
                        note: orderNote,
                    },
                ];
            }
        });

        setSelectedMenuModal(null);
    };

    return (
        <>
            <Head
                title={
                    activeTenant
                        ? `${activeTenant.name} - Smart Canteen FEB`
                        : 'Katalog Kantin FEB - Smart Canteen'
                }
            >
                <meta
                    name="description"
                    content="Jelajahi stand kantin dan menu makanan lezat di Fakultas Ekonomi dan Bisnis."
                />
                <meta
                    property="og:title"
                    content={
                        activeTenant
                            ? `${activeTenant.name} - Smart Canteen FEB`
                            : 'Katalog Kantin FEB - Smart Canteen'
                    }
                />
                <meta
                    property="og:description"
                    content="Jelajahi stand kantin dan menu makanan lezat di Fakultas Ekonomi dan Bisnis."
                />
            </Head>

            <div className="flex flex-col gap-6 w-full pb-4">
                {/* Dynamic Hero Banner (Time-Based Interactive Vibe) */}
                <TimeHeroBanner
                    userName={userName}
                    timeMode={timeMode}
                />

                {/* Live Search Bar */}
                <div className="relative w-full">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                        placeholder="Cari makanan, minuman, es teh, ayam geprek..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-8 h-9 text-xs rounded-xl border-border bg-card shadow-2xs"
                    />
                    {isSearchingServer ? (
                        <div className="absolute right-2.5 top-2.5 flex items-center justify-center">
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        </div>
                    ) : searchQuery ? (
                        <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    ) : null}
                </div>

                {/* Global Categories Chips Bar */}
                <GlobalCategoryChips
                    selectedCategory={selectedGlobalCategory}
                    onSelectCategory={setSelectedGlobalCategory}
                />

                {/* Search / Category Filtered Results Mode */}
                {searchQuery || selectedGlobalCategory !== 'all' || selectedCategoryId !== 'all' ? (
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
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedGlobalCategory('all');
                                    setSelectedCategoryId('all');
                                }}
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
                                        onToggleFav={(e) => toggleFavorite(e, menu.id)}
                                        onOpenOptionModal={(e) => handleOpenOptionModal(e, menu)}
                                    />
                                ))}

                                {visibleSearchedMenusCount < searchedMenus.length && (
                                    <div className="col-span-2 py-3 flex items-center justify-center gap-2 text-xs text-muted-foreground font-medium animate-pulse bg-muted/20 rounded-xl border border-dashed border-border">
                                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                        <span>Scroll untuk memuat 5 menu berikutnya ({visibleSearchedMenusCount}/{searchedMenus.length})</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    /* Default Interactive Time-based Sliding Carousels Mode */
                    <>
                        {/* SECTION 1: Rekomendasi Makanan Berdasarkan Waktu */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-xs font-black text-foreground flex items-center gap-1.5">
                                    <currentVibeRow.icon className="h-3.5 w-3.5 text-primary shrink-0" />
                                    <span>{currentVibeRow.title}</span>
                                </h2>
                                <span className="text-[10px] text-muted-foreground font-mono">Geser &rarr;</span>
                            </div>

                            <div
                                onScroll={(e) =>
                                    handleCarouselScroll(
                                        e,
                                        visibleTimeMenusCount,
                                        timeRecommendedMenus.length,
                                        setVisibleTimeMenusCount,
                                        timeCarouselTimerRef
                                    )
                                }
                                className="flex items-center gap-4 overflow-x-auto pb-2.5 scrollbar-none snap-x"
                            >
                                {timeRecommendedMenus.slice(0, visibleTimeMenusCount).map((menu) => (
                                    <div key={menu.id} className="w-[180px] shrink-0 snap-start">
                                        <HorizontalFoodCard
                                            menu={menu}
                                            foodFallback={foodFallback}
                                            isFav={Boolean(favorites[menu.id])}
                                            onToggleFav={(e) => toggleFavorite(e, menu.id)}
                                            onOpenOptionModal={(e) => handleOpenOptionModal(e, menu)}
                                        />
                                    </div>
                                ))}

                                {visibleTimeMenusCount < timeRecommendedMenus.length && (
                                    <div className="w-[120px] shrink-0 snap-start h-[160px] border border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center p-3 gap-1 text-muted-foreground bg-muted/20 animate-pulse">
                                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                        <span className="text-[10px] font-semibold">Geser +5 menu</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* SECTION 2: Best Seller Hits Kampus FEB */}
                        {hitsMenus.length > 0 && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-xs font-black text-foreground flex items-center gap-1.5">
                                        <Flame className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
                                        <span>Best Seller Hits Kampus</span>
                                    </h2>
                                    <span className="text-[10px] text-muted-foreground font-mono">Geser &rarr;</span>
                                </div>

                                <div
                                    onScroll={(e) =>
                                        handleCarouselScroll(
                                            e,
                                            visibleHitsMenusCount,
                                            hitsMenus.length,
                                            setVisibleHitsMenusCount,
                                            hitsCarouselTimerRef
                                        )
                                    }
                                    className="flex items-center gap-4 overflow-x-auto pb-2.5 scrollbar-none snap-x"
                                >
                                    {hitsMenus.slice(0, visibleHitsMenusCount).map((menu) => (
                                        <div key={menu.id} className="w-[180px] shrink-0 snap-start">
                                            <HorizontalFoodCard
                                                menu={menu}
                                                foodFallback={foodFallback}
                                                isFav={Boolean(favorites[menu.id])}
                                                onToggleFav={(e) => toggleFavorite(e, menu.id)}
                                                onOpenOptionModal={(e) => handleOpenOptionModal(e, menu)}
                                            />
                                        </div>
                                    ))}

                                    {visibleHitsMenusCount < hitsMenus.length && (
                                        <div className="w-[120px] shrink-0 snap-start h-[160px] border border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center p-3 gap-1 text-muted-foreground bg-muted/20 animate-pulse">
                                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                            <span className="text-[10px] font-semibold">Geser +5 menu</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* SECTION 3: Menu Hemat Kantong Mahasiswa (< 15rb) */}
                        {budgetMenus.length > 0 && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-xs font-black text-foreground flex items-center gap-1.5">
                                        <Badge variant="secondary" className="text-[9px] px-1 py-0 h-3.5 bg-emerald-500 text-white font-bold border-none gap-0.5">
                                            <Banknote className="h-2.5 w-2.5" />
                                            &lt; 15rb
                                        </Badge>
                                        <span>Kantong Mahasiswa</span>
                                    </h2>
                                    <span className="text-[10px] text-muted-foreground font-mono">Geser &rarr;</span>
                                </div>

                                <div
                                    onScroll={(e) =>
                                        handleCarouselScroll(
                                            e,
                                            visibleBudgetMenusCount,
                                            budgetMenus.length,
                                            setVisibleBudgetMenusCount,
                                            budgetCarouselTimerRef
                                        )
                                    }
                                    className="flex items-center gap-4 overflow-x-auto pb-2.5 scrollbar-none snap-x"
                                >
                                    {budgetMenus.slice(0, visibleBudgetMenusCount).map((menu) => (
                                        <div key={menu.id} className="w-[180px] shrink-0 snap-start">
                                            <HorizontalFoodCard
                                                menu={menu}
                                                foodFallback={foodFallback}
                                                isFav={Boolean(favorites[menu.id])}
                                                onToggleFav={(e) => toggleFavorite(e, menu.id)}
                                                onOpenOptionModal={(e) => handleOpenOptionModal(e, menu)}
                                            />
                                        </div>
                                    ))}

                                    {visibleBudgetMenusCount < budgetMenus.length && (
                                        <div className="w-[120px] shrink-0 snap-start h-[160px] border border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center p-3 gap-1 text-muted-foreground bg-muted/20 animate-pulse">
                                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                            <span className="text-[10px] font-semibold">Geser +5 menu</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* SECTION 4: List Stand Toko Kantin */}
                        <div className="space-y-4 pt-6 mt-4 border-t border-border">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-xs font-black text-foreground flex items-center gap-1.5">
                                    <Store className="h-4 w-4 text-primary" />
                                    <span>Stand Toko Kantin FEB (Tersedia)</span>
                                </h2>
                                <span className="text-[10px] text-muted-foreground font-mono">
                                    {tenants.length} Stand Toko
                                </span>
                            </div>

                            <div className="space-y-3">
                                {tenants.slice(0, visibleTenantsCount).map((tenant) => (
                                    <TenantListCard
                                        key={tenant.id}
                                        tenant={tenant}
                                        tenantFallback={tenantFallback}
                                        onSelectTenant={handleSelectTenant}
                                    />
                                ))}

                                {visibleTenantsCount < tenants.length && (
                                    <div className="py-3 flex items-center justify-center gap-2 text-xs text-muted-foreground font-medium animate-pulse bg-muted/20 rounded-xl border border-dashed border-border">
                                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                        <span>Scroll untuk memuat 5 stand berikutnya ({visibleTenantsCount}/{tenants.length})</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Cart Items Drawer Sheet Modal */}
            <CartDrawer
                isOpen={isCartDrawerOpen}
                onClose={() => setIsCartDrawerOpen(false)}
                cartItems={cartItems}
                setCartItems={setCartItems}
                foodFallback={foodFallback}
            />

            {/* Menu Options Addon Modal */}
            <MenuOptionsDialog
                selectedMenuModal={selectedMenuModal}
                foodFallback={foodFallback}
                selectedChoices={selectedChoices}
                setSelectedChoices={setSelectedChoices}
                itemQuantity={itemQuantity}
                setItemQuantity={setItemQuantity}
                orderNote={orderNote}
                setOrderNote={setOrderNote}
                onClose={() => setSelectedMenuModal(null)}
                onAddToCart={handleAddToCart}
                calculateModalTotalPrice={calculateModalTotalPrice}
            />
        </>
    );
}

StudentCatalog.layout = (page: React.ReactNode) => (
    <StudentLayout>{page}</StudentLayout>
);
