import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Heart, Sparkles, Utensils } from 'lucide-react';
import StudentLayout from '@/layouts/student-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import HorizontalFoodCard from '../catalog/components/horizontal-food-card';
import MenuOptionsDialog from '../catalog/components/menu-options-dialog';
import CartDrawer from '../catalog/components/cart-drawer';
import { useMenuOptionsModal } from '../catalog/hooks/use-menu-options-modal';
import { MenuItem } from '../catalog/types';

interface FavoritesIndexProps {
    favoriteMenus?: MenuItem[];
    userFavorites?: number[];
}

export default function FavoritesIndex({
    favoriteMenus = [],
    userFavorites = [],
}: FavoritesIndexProps) {
    const foodFallback = '/images/food-placeholder.jpg';

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
        totalCartCount,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
    } = useMenuOptionsModal(userFavorites);

    // Filter list based on current active favorites state
    const activeFavoriteMenus = favoriteMenus.filter((menu) => favorites[menu.id] !== false);

    return (
        <>
            <Head title="Menu Favorit Saya - Smart Canteen FEB" />

            <div className="flex flex-col gap-6 w-full pb-10 font-sans">
                {/* Page Title Header */}
                <div className="flex items-center justify-between pt-1 border-b border-border/60 pb-3">
                    <div className="space-y-0.5">
                        <h1 className="text-lg font-black tracking-tight text-foreground flex items-center gap-2">
                            <span>Menu Favorit</span>
                            <Badge
                                variant="outline"
                                className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 text-[9.5px] font-black px-2 py-0.5 rounded-full flex items-center gap-1"
                            >
                                <Heart className="size-2.5 fill-rose-500 text-rose-500" />
                                <span>Disimpan</span>
                            </Badge>
                        </h1>
                        <p className="text-[11px] text-muted-foreground">
                            Kumpulan makanan & minuman favorit yang paling kamu sukai
                        </p>
                    </div>
                    <Badge
                        variant="secondary"
                        className="text-[10px] font-mono font-black px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/20"
                    >
                        {activeFavoriteMenus.length} Menu
                    </Badge>
                </div>

                {/* Content List / Grid */}
                {activeFavoriteMenus.length === 0 ? (
                    <div className="min-h-[340px] rounded-3xl border border-dashed border-border bg-card/40 p-8 text-center flex flex-col items-center justify-center space-y-4">
                        <div className="size-16 rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20 shadow-inner">
                            <Heart className="size-8" />
                        </div>
                        <div className="space-y-1 max-w-xs">
                            <h3 className="font-black text-base text-foreground">Belum Ada Menu Favorit</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Kamu belum menyukai menu apapun. Tekan ikon hati di katalog untuk mengumpulkannya di sini!
                            </p>
                        </div>
                        <Button asChild className="font-black text-xs rounded-2xl h-11 px-6 gap-2 shadow-md active:scale-95 transition-transform">
                            <Link href="/">
                                <Sparkles className="size-4" />
                                <span>Jelajahi Katalog Makanan</span>
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3.5">
                        {activeFavoriteMenus.map((menu) => (
                            <HorizontalFoodCard
                                key={menu.id}
                                menu={menu}
                                foodFallback={foodFallback}
                                isFav={favorites[menu.id] !== false}
                                onToggleFav={(e) => toggleFavorite(e, menu.id)}
                                onOpenOptionModal={(e) => handleOpenOptionModal(e, menu)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Menu Customization Options Modal */}
            <MenuOptionsDialog
                selectedMenuModal={selectedMenuModal}
                foodFallback={foodFallback}
                selectedChoices={selectedChoices}
                setSelectedChoices={setSelectedChoices}
                itemQuantity={itemQuantity}
                setItemQuantity={setItemQuantity}
                orderNote={orderNote}
                setOrderNote={setOrderNote}
                calculateModalTotalPrice={calculateModalTotalPrice}
                onClose={() => setSelectedMenuModal(null)}
                onAddToCart={handleAddToCart}
            />

            {/* Shopping Cart Drawer */}
            <CartDrawer
                isOpen={isCartDrawerOpen}
                onClose={() => setIsCartDrawerOpen(false)}
                cartItems={cartItems}
                setCartItems={setCartItems}
                foodFallback={foodFallback}
            />
        </>
    );
}

FavoritesIndex.layout = (page: React.ReactNode) => <StudentLayout>{page}</StudentLayout>;
