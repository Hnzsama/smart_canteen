import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Banknote, Flame, Sunrise, Sun, Sunset, Moon } from 'lucide-react';
import StudentLayout from '@/layouts/student-layout';
import { Badge } from '@/components/ui/badge';
import CartDrawer from './components/cart-drawer';
import CatalogSearchBar from './components/catalog-search-bar';
import GlobalCategoryChips from './components/global-category-chips';
import HorizontalMenuCarousel from './components/horizontal-menu-carousel';
import MenuOptionsDialog from './components/menu-options-dialog';
import SearchedMenuList from './components/searched-menu-list';
import TenantSection from './components/tenant-section';
import TimeHeroBanner from './components/time-hero-banner';
import { useCatalogFilters } from './hooks/use-catalog-filters';
import { useCatalogPagination } from './hooks/use-catalog-pagination';
import { useMenuFiltering } from './hooks/use-menu-filtering';
import { useMenuOptionsModal } from './hooks/use-menu-options-modal';
import { CatalogProps, TenantItem, TimeMode } from './types';
import { detectInitialTimeMode } from './utils/catalog-utils';

export default function StudentCatalog({
    tenants = [],
    categories = [],
    menus = [],
    userFavorites = [],
    activeTenant = null,
    filters = { search: '', tenant_id: 'all', category_id: 'all' },
}: CatalogProps) {
    const page = usePage();
    const userName = (page.props.auth as any)?.user?.name?.split(' ')[0] || 'Mahasiswa';

    const foodFallback = '/images/food-placeholder.jpg';
    const tenantFallback = '/images/tenant-placeholder.jpg';

    const [timeMode] = useState<TimeMode>(detectInitialTimeMode);

    // Filter & search state hook
    const {
        searchQuery,
        setSearchQuery,
        selectedGlobalCategory,
        setSelectedGlobalCategory,
        selectedCategoryId,
        setSelectedCategoryId,
        isSearchingServer,
        isFiltering,
        resetFilters,
    } = useCatalogFilters(filters);

    // Menu filtering & grouping hook
    const { searchedMenus, timeRecommendedMenus, hitsMenus, budgetMenus } = useMenuFiltering({
        menus,
        timeMode,
        searchQuery,
        selectedGlobalCategory,
        selectedCategoryId,
    });

    // Pagination & scrolling hook
    const {
        visibleTenantsCount,
        visibleSearchedMenusCount,
        visibleTimeMenusCount,
        visibleHitsMenusCount,
        visibleBudgetMenusCount,
        setVisibleTimeMenusCount,
        setVisibleHitsMenusCount,
        setVisibleBudgetMenusCount,
        timeCarouselTimerRef,
        hitsCarouselTimerRef,
        budgetCarouselTimerRef,
        handleCarouselScroll,
    } = useCatalogPagination({
        isFiltering,
        totalSearchedMenus: searchedMenus.length,
        totalTenants: tenants.length,
        searchQuery,
        selectedGlobalCategory,
        selectedCategoryId,
    });

    // Modal state, choices calculation, favorites & cart hook
    const {
        selectedMenuModal,
        setSelectedMenuModal,
        selectedChoices,
        setSelectedChoices,
        itemQuantity,
        setItemQuantity,
        orderNote,
        setOrderNote,
        favorites,
        toggleFavorite,
        handleOpenOptionModal,
        calculateModalTotalPrice,
        handleAddToCart,
        cartItems,
        setCartItems,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
    } = useMenuOptionsModal(userFavorites);

    const timeRowTitles: Record<TimeMode, { title: string; icon: React.ElementType }> = {
        pagi: { title: 'Rekomendasi Sarapan Pagi', icon: Sunrise },
        siang: { title: 'Rekomendasi Makan Siang Kenyang', icon: Sun },
        sore: { title: 'Minuman Segar & Cemilan Sore', icon: Sunset },
        malam: { title: 'Kopi & Cemilan Lembur Malam', icon: Moon },
    };

    const currentVibeRow = timeRowTitles[timeMode];

    const handleSelectTenant = (tenant: TenantItem | null) => {
        if (!tenant) {
            router.get('/', {}, { preserveState: true, preserveScroll: true });
        } else {
            router.get(`/${tenant.slug}`, {}, { preserveState: true, preserveScroll: true });
        }
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
                {/* Dynamic Time-Based Hero Banner */}
                <TimeHeroBanner userName={userName} timeMode={timeMode} />

                {/* Live Search Bar */}
                <CatalogSearchBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    isSearchingServer={isSearchingServer}
                />

                {/* Global Categories Chips Bar */}
                <GlobalCategoryChips
                    selectedCategory={selectedGlobalCategory}
                    onSelectCategory={setSelectedGlobalCategory}
                />

                {/* Active Filter Results vs Default Time-based Sliding Carousels */}
                {isFiltering ? (
                    <SearchedMenuList
                        selectedGlobalCategory={selectedGlobalCategory}
                        searchedMenus={searchedMenus}
                        visibleSearchedMenusCount={visibleSearchedMenusCount}
                        foodFallback={foodFallback}
                        favorites={favorites}
                        onToggleFav={toggleFavorite}
                        onOpenOptionModal={handleOpenOptionModal}
                        onResetFilters={resetFilters}
                    />
                ) : (
                    <>
                        {/* SECTION 1: Rekomendasi Makanan Berdasarkan Waktu */}
                        <HorizontalMenuCarousel
                            title={
                                <>
                                    <currentVibeRow.icon className="h-3.5 w-3.5 text-primary shrink-0" />
                                    <span>{currentVibeRow.title}</span>
                                </>
                            }
                            menus={timeRecommendedMenus}
                            visibleCount={visibleTimeMenusCount}
                            totalCount={timeRecommendedMenus.length}
                            foodFallback={foodFallback}
                            favorites={favorites}
                            onToggleFav={toggleFavorite}
                            onOpenOptionModal={handleOpenOptionModal}
                            onScroll={handleCarouselScroll}
                            setVisibleCount={setVisibleTimeMenusCount}
                            timerRef={timeCarouselTimerRef}
                        />

                        {/* SECTION 2: Best Seller Hits Kampus FEB */}
                        <HorizontalMenuCarousel
                            title={
                                <>
                                    <Flame className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
                                    <span>Best Seller Hits Kampus</span>
                                </>
                            }
                            menus={hitsMenus}
                            visibleCount={visibleHitsMenusCount}
                            totalCount={hitsMenus.length}
                            foodFallback={foodFallback}
                            favorites={favorites}
                            onToggleFav={toggleFavorite}
                            onOpenOptionModal={handleOpenOptionModal}
                            onScroll={handleCarouselScroll}
                            setVisibleCount={setVisibleHitsMenusCount}
                            timerRef={hitsCarouselTimerRef}
                        />

                        {/* SECTION 3: Menu Hemat Kantong Mahasiswa (< 15rb) */}
                        <HorizontalMenuCarousel
                            title={
                                <>
                                    <Badge
                                        variant="secondary"
                                        className="text-[9px] px-1 py-0 h-3.5 bg-emerald-500 text-white font-bold border-none gap-0.5"
                                    >
                                        <Banknote className="h-2.5 w-2.5" />
                                        &lt; 15rb
                                    </Badge>
                                    <span>Kantong Mahasiswa</span>
                                </>
                            }
                            menus={budgetMenus}
                            visibleCount={visibleBudgetMenusCount}
                            totalCount={budgetMenus.length}
                            foodFallback={foodFallback}
                            favorites={favorites}
                            onToggleFav={toggleFavorite}
                            onOpenOptionModal={handleOpenOptionModal}
                            onScroll={handleCarouselScroll}
                            setVisibleCount={setVisibleBudgetMenusCount}
                            timerRef={budgetCarouselTimerRef}
                        />

                        {/* SECTION 4: List Stand Toko Kantin */}
                        <TenantSection
                            tenants={tenants}
                            visibleTenantsCount={visibleTenantsCount}
                            tenantFallback={tenantFallback}
                            onSelectTenant={handleSelectTenant}
                        />
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

StudentCatalog.layout = (page: React.ReactNode) => <StudentLayout>{page}</StudentLayout>;
