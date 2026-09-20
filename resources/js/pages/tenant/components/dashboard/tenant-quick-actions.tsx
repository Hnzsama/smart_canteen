import { Link } from '@inertiajs/react';
import { ChefHat, CreditCard, Plus, Utensils } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { menus as tenantMenusRoute, orders as tenantOrdersRoute } from '@/routes/tenant';

export function TenantQuickActions() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href={tenantOrdersRoute.url()}>
                <Card className="shadow-xs border-border/70 hover:border-primary/50 transition-colors bg-card hover:bg-muted/40 cursor-pointer group">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                            <ChefHat className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-foreground">Order Board Dapur</h3>
                            <p className="text-xs text-muted-foreground">Kelola antrean & ubah status memasak</p>
                        </div>
                    </CardContent>
                </Card>
            </Link>

            <Link href="/tenant/verify-payment">
                <Card className="shadow-xs border-border/70 hover:border-emerald-500/50 transition-colors bg-card hover:bg-muted/40 cursor-pointer group">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                            <CreditCard className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-foreground">Verifikasi Kasir Tunai</h3>
                            <p className="text-xs text-muted-foreground">Konfirmasi bayar cash mahasiswa</p>
                        </div>
                    </CardContent>
                </Card>
            </Link>

            <Link href={tenantMenusRoute.url()}>
                <Card className="shadow-xs border-border/70 hover:border-amber-500/50 transition-colors bg-card hover:bg-muted/40 cursor-pointer group">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                            <Utensils className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-foreground">Katalog Menu & Stok</h3>
                            <p className="text-xs text-muted-foreground">Atur harga, foto, & status ketersediaan</p>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </div>
    );
}
