import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LogIn,
    LogOut,
    MapPin,
    Receipt,
    Settings,
    ShoppingBag,
    ShoppingCart,
    Store,
    User as UserIcon,
    UserPlus,
    UtensilsCrossed,
} from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useCart } from '@/hooks/use-cart';
import { useInitials } from '@/hooks/use-initials';
import CartDrawer from '@/pages/catalog/components/cart-drawer';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import type { User } from '@/types';

type StudentLayoutProps = {
    children: React.ReactNode;
    showBottomNav?: boolean;
};

export default function StudentLayout({ children, showBottomNav = true }: StudentLayoutProps) {
    const page = usePage();
    const auth = page.props.auth as { user: User | null };
    const url = page.url;
    const componentName = page.component || '';
    const getInitials = useInitials();

    const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
    const { cartItems, setCartItems, totalCartCount } = useCart();

    const isLoggedIn = Boolean(auth?.user);

    const isCheckoutPage =
        !showBottomNav ||
        url.startsWith('/checkout') ||
        componentName.toLowerCase().includes('checkout');

    const navItems = [
        {
            title: 'Katalog',
            href: '/',
            icon: UtensilsCrossed,
            active:
                url === '/' ||
                (!url.startsWith('/orders') &&
                    !url.startsWith('/settings') &&
                    !url.startsWith('/admin') &&
                    !url.startsWith('/tenant') &&
                    !url.startsWith('/checkout') &&
                    !url.startsWith('/login')),
        },
        {
            title: 'Pesanan',
            href: '/orders',
            icon: ShoppingBag,
            active: url === '/orders',
        },
        {
            title: 'Riwayat',
            href: '/orders/history',
            icon: Receipt,
            active: url === '/orders/history',
        },
    ];

    const isProfileActive = url.startsWith('/settings') || url.startsWith('/login');

    return (
        <div className="min-h-screen bg-muted/30 dark:bg-neutral-950 flex justify-center items-start font-sans antialiased touch-manipulation">
            {/* Centered Smartphone Frame Container (Mobile-Only UX) */}
            <div className="w-full max-w-[430px] min-h-screen bg-background text-foreground flex flex-col shadow-2xl border-x border-border/60 relative overflow-x-hidden">
                {/* Gen-Z Floating Glass Header Navbar with Top Spacing */}
                <header className="sticky top-0 z-40 w-full pt-3 px-3.5 pb-2 bg-background/80 backdrop-blur-md shrink-0 pointer-events-none">
                    <div className="pointer-events-auto bg-card/90 dark:bg-neutral-900/95 backdrop-blur-2xl border border-border/80 dark:border-white/15 h-14 rounded-2xl px-3.5 flex items-center justify-between shadow-xs">
                        {/* Brand / Logo */}
                        <Link href="/" className="flex items-center gap-2.5 group active:scale-95 transition-transform">
                            <AppLogoIcon className="size-8.5 rounded-xl object-contain shadow-xs group-hover:scale-105 transition-transform duration-200" />
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1.5">
                                    <span className="font-black text-xs sm:text-sm tracking-tight leading-none text-foreground">
                                        Smart Canteen
                                    </span>
                                    <Badge
                                        variant="secondary"
                                        className="text-[8px] px-1.5 py-0 h-3.5 font-black bg-primary/10 text-primary border border-primary/20 rounded-md"
                                    >
                                        FEB
                                    </Badge>
                                </div>
                                <span className="text-[9.5px] text-muted-foreground font-semibold leading-tight flex items-center gap-1 mt-0.5">
                                    <span className="size-1.5 rounded-full bg-emerald-600" />
                                    Kantin FEB • <span className="text-emerald-400 font-bold">Open Now</span>
                                </span>
                            </div>
                        </Link>

                        {/* Right Actions & User Dropdown */}
                        <div className="flex items-center gap-2">
                            {/* Global Header Cart Button */}
                            <button
                                type="button"
                                onClick={() => setIsCartDrawerOpen(true)}
                                className="relative size-9 rounded-full border border-border/80 bg-muted/40 hover:bg-accent flex items-center justify-center text-foreground transition-all active:scale-90 p-0 shadow-2xs group"
                                title="Buka Keranjang Belanja"
                            >
                                <ShoppingCart className="size-4 text-primary group-hover:scale-110 transition-transform" />
                                {totalCartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 size-4.5 rounded-full bg-primary text-primary-foreground text-[9px] font-black flex items-center justify-center shadow-xs animate-in zoom-in-75">
                                        {totalCartCount}
                                    </span>
                                )}
                            </button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="relative size-9 rounded-full ring-2 ring-primary/20 hover:ring-primary/50 active:scale-90 transition-all p-0 shadow-2xs"
                                    >
                                        <Avatar className="size-9 rounded-full overflow-hidden border border-border/80">
                                            <AvatarImage src={auth?.user?.avatar} alt={auth?.user?.name ?? 'Tamu'} />
                                            <AvatarFallback className="bg-primary text-primary-foreground font-black text-xs">
                                                {isLoggedIn ? getInitials(auth?.user?.name ?? 'M') : 'T'}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end">
                                    <DropdownMenuLabel className="p-0 font-normal">
                                        <div className="flex items-center gap-2 px-2 py-2 text-left text-sm">
                                            <UserInfo user={auth?.user} showEmail={true} />
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />

                                    {isLoggedIn ? (
                                        <>
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem asChild>
                                                    <Link href="/" className="cursor-pointer">
                                                        <UtensilsCrossed className="mr-2 size-4 text-primary" />
                                                        Katalog Makanan
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => setIsCartDrawerOpen(true)}
                                                    className="cursor-pointer"
                                                >
                                                    <ShoppingCart className="mr-2 size-4 text-primary" />
                                                    Keranjang Belanja ({totalCartCount})
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href="/orders" className="cursor-pointer">
                                                        <ShoppingBag className="mr-2 size-4 text-primary" />
                                                        Pesanan Aktif
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href="/orders/history" className="cursor-pointer">
                                                        <Receipt className="mr-2 size-4 text-primary" />
                                                        Riwayat Pesanan
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={edit().url} className="cursor-pointer">
                                                        <Settings className="mr-2 size-4 text-muted-foreground" />
                                                        Pengaturan Akun
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href={logout().url}
                                                    method="post"
                                                    as="button"
                                                    className="w-full text-destructive cursor-pointer"
                                                >
                                                    <LogOut className="mr-2 size-4 text-destructive" />
                                                    Keluar
                                                </Link>
                                            </DropdownMenuItem>
                                        </>
                                    ) : (
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem asChild>
                                                <Link href="/login" className="cursor-pointer font-bold text-primary">
                                                    <LogIn className="mr-2 size-4 text-primary" />
                                                    Masuk / Login
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/register" className="cursor-pointer">
                                                    <UserPlus className="mr-2 size-4 text-muted-foreground" />
                                                    Daftar Mahasiswa
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/register/tenant" className="cursor-pointer">
                                                    <Store className="mr-2 size-4 text-muted-foreground" />
                                                    Daftar Stand Kantin
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>

                {/* Main Mobile Content Area with Breathing Room Top Spacing */}
                <main className="flex-1 pb-24 px-3.5 pt-2 w-full">
                    {children}
                </main>

                {/* Global Cart Drawer Sheet Modal */}
                <CartDrawer
                    isOpen={isCartDrawerOpen}
                    onClose={() => setIsCartDrawerOpen(false)}
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                    foodFallback="/images/food-placeholder.jpg"
                />

                {/* Gen-Z Floating Glass Dock Mobile Bottom Navigation Bar */}
                {!isCheckoutPage && (
                    <div className="fixed bottom-3 z-50 w-full max-w-[430px] left-1/2 -translate-x-1/2 px-3 pointer-events-none">
                        <nav className="pointer-events-auto bg-card/85 dark:bg-neutral-900/90 backdrop-blur-2xl border border-border/80 dark:border-white/15 h-15 rounded-3xl flex items-center justify-around px-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_35px_rgba(0,0,0,0.5)]">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = item.active;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`relative flex items-center justify-center py-2 px-3.5 rounded-2xl text-xs font-bold transition-all duration-300 active:scale-90 select-none ${
                                            isActive
                                                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105'
                                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                        }`}
                                    >
                                        <Icon className={`size-4.5 transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-xs' : 'opacity-80'}`} />
                                        {isActive && (
                                            <span className="text-[11px] font-black tracking-tight ml-1.5 animate-in fade-in zoom-in-75 duration-200">
                                                {item.title}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}

                            <Link
                                href={isLoggedIn ? edit().url : '/login'}
                                className={`relative flex items-center justify-center py-2 px-3.5 rounded-2xl text-xs font-bold transition-all duration-300 active:scale-90 select-none ${
                                    isProfileActive
                                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                }`}
                            >
                                <UserIcon className={`size-4.5 transition-transform duration-300 ${isProfileActive ? 'scale-110 drop-shadow-xs' : 'opacity-80'}`} />
                                {isProfileActive && (
                                    <span className="text-[11px] font-black tracking-tight ml-1.5 animate-in fade-in zoom-in-75 duration-200">
                                        Profil
                                    </span>
                                )}
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
}
