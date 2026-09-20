import { Link, router, usePage } from '@inertiajs/react';
import {
    BookOpen,
    ClipboardList,
    CreditCard,
    History,
    Layers,
    LayoutDashboard,
    LayoutGrid,
    QrCode,
    ReceiptText,
    Settings,
    ShoppingBag,
    Star,
    Store,
    Users,
    Utensils,
    UtensilsCrossed,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import {
    dashboard as adminDashboard,
    orders as adminOrders,
    tenants as adminTenants,
    users as adminUsers,
} from '@/routes/admin';
import {
    history as ordersHistory,
    index as ordersIndex,
} from '@/routes/orders';
import {
    categories as tenantCategories,
    dashboard as tenantDashboard,
    menus as tenantMenus,
    orders as tenantOrders,
    ratings as tenantRatings,
    settings as tenantSettings,
    verifyPayment as tenantVerifyPayment,
} from '@/routes/tenant';
import { toggleOpen as toggleOpenRoute } from '@/routes/tenant/settings';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { auth, queueCount = 0, verifyPaymentCount = 0 } = usePage<{
        auth: { user?: { roles?: string[]; tenant?: { name: string; is_open?: boolean } } };
        queueCount?: number;
        verifyPaymentCount?: number;
    }>().props;
    const roles = auth.user?.roles ?? [];

    const isAdmin = roles.includes('admin');
    const isTenant = roles.includes('tenant');
    const isOpen = auth.user?.tenant?.is_open ?? true;

    let mainNavItems: NavItem[] = [];
    let groupLabel = 'Smart Canteen FEB';
    let homeUrl = dashboard();

    if (isAdmin) {
        groupLabel = 'Supervisi Administrator';
        homeUrl = adminDashboard();
        mainNavItems = [
            {
                title: 'Dashboard Supervisi',
                href: adminDashboard(),
                icon: LayoutDashboard,
            },
            {
                title: 'Kelola Stand Kantin',
                href: adminTenants(),
                icon: Store,
            },
            {
                title: 'Kelola Pengguna',
                href: adminUsers(),
                icon: Users,
            },
            {
                title: 'Semua Transaksi',
                href: adminOrders(),
                icon: ReceiptText,
                badge: queueCount > 0 ? queueCount : undefined,
            },
            {
                title: 'Pengaturan Pembayaran',
                href: '/admin/payment-settings',
                icon: CreditCard,
            },
        ];
    } else if (isTenant) {
        groupLabel = auth.user?.tenant?.name ? `Stand: ${auth.user.tenant.name}` : 'Mitra Tenant FEB';
        homeUrl = tenantDashboard();
        mainNavItems = [
            {
                title: 'Dashboard Stand',
                href: tenantDashboard(),
                icon: LayoutGrid,
            },
            {
                title: 'Antrean Pesanan',
                href: tenantOrders(),
                icon: ClipboardList,
                badge: queueCount > 0 ? queueCount : undefined,
            },
            {
                title: 'Verifikasi Tunai & QR',
                href: tenantVerifyPayment(),
                icon: QrCode,
                badge: verifyPaymentCount > 0 ? verifyPaymentCount : undefined,
                badgeClassName: 'ml-auto flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 px-1.5 text-[10px] font-bold text-white shadow-2xs group-data-[collapsible=icon]:hidden',
            },
            {
                title: 'Kelola Menu Stand',
                href: tenantMenus(),
                icon: Utensils,
            },
            {
                title: 'Kategori Stand',
                href: tenantCategories(),
                icon: Layers,
            },
            {
                title: 'Rating & Ulasan',
                href: tenantRatings(),
                icon: Star,
            },
            {
                title: 'Pengaturan Stand',
                href: tenantSettings(),
                icon: Settings,
            },
        ];
    } else {
        // Mahasiswa / Customer
        groupLabel = 'Smart Canteen FEB';
        homeUrl = dashboard();
        mainNavItems = [
            {
                title: 'Katalog Kantin & Menu',
                href: dashboard(),
                icon: UtensilsCrossed,
            },
            {
                title: 'Pesanan Saya',
                href: ordersIndex(),
                icon: ShoppingBag,
            },
            {
                title: 'Riwayat Transaksi',
                href: ordersHistory(),
                icon: History,
            },
        ];
    }

    const footerNavItems: NavItem[] = [
        {
            title: 'Bantuan & Panduan',
            href: '#',
            icon: BookOpen,
        },
    ];

    const handleToggleStoreOpen = () => {
        router.post(toggleOpenRoute().url, {}, { preserveScroll: true });
    };

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={homeUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                {/* Sleek Animated Store Open/Closed Pill Button for Tenant */}
                {isTenant && (
                    <div className="px-3 py-1.5 flex items-center justify-between border-y border-sidebar-border/60 group-data-[collapsible=icon]:hidden">
                        <span className="text-[11px] font-medium text-sidebar-foreground/70">
                            Status Toko
                        </span>
                        <button
                            type="button"
                            onClick={handleToggleStoreOpen}
                            title="Klik untuk ubah status Toko Buka / Tutup"
                            className={`group flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold transition-all shadow-2xs border ${
                                isOpen
                                    ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25'
                                    : 'border-rose-500/30 bg-rose-500/15 text-rose-600 dark:text-rose-400 hover:bg-rose-500/25'
                            }`}
                        >
                            <span className="relative flex h-2 w-2">
                                {isOpen && (
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                )}
                                <span
                                    className={`relative inline-flex rounded-full h-2 w-2 ${
                                        isOpen ? 'bg-emerald-500' : 'bg-rose-500'
                                    }`}
                                ></span>
                            </span>
                            <span>{isOpen ? 'STAND BUKA' : 'STAND TUTUP'}</span>
                        </button>
                    </div>
                )}
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} label={groupLabel} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
