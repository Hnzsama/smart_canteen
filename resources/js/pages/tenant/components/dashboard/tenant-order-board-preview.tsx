import { Link } from '@inertiajs/react';
import { ArrowRight, Clock, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { orders as tenantOrdersRoute } from '@/routes/tenant';
import type { TenantDashboardOrder } from '../../types';

type Props = {
    orders?: TenantDashboardOrder[];
};

const formatRupiah = (val: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(val);

export function TenantOrderBoardPreview({ orders = [] }: Props) {
    return (
        <Card className="shadow-xs border-border/70 bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                    <CardTitle className="text-base sm:text-lg font-bold tracking-tight flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                        <span>Antrean Pesanan Masuk (Realtime Stream)</span>
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                        Pesanan terbaru yang memerlukan konfirmasi atau pemrosesan dapur.
                    </CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild className="gap-1.5 text-xs font-semibold">
                    <Link href={tenantOrdersRoute.url()}>
                        <span>Buka Full Board</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </Button>
            </CardHeader>

            <CardContent>
                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                        <Clock className="h-8 w-8 mb-2 opacity-50" />
                        <p className="text-sm font-medium">Belum ada pesanan masuk saat ini</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {orders.slice(0, 6).map((ord) => (
                            <div
                                key={ord.id}
                                className="flex flex-col justify-between p-3 rounded-xl border border-border/70 bg-muted/30 hover:bg-muted/60 transition-colors"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono font-bold text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                            {ord.pickup_code}
                                        </span>
                                        <Badge
                                            variant="secondary"
                                            className={`text-[10px] ${
                                                ord.status === 'processing'
                                                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                                                    : ord.status === 'ready'
                                                    ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
                                                    : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                            }`}
                                        >
                                            {ord.status_label}
                                        </Badge>
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-foreground truncate">
                                            {ord.customer_name}
                                        </div>
                                        <div className="text-[11px] text-muted-foreground truncate">
                                            {ord.items_summary}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50 text-xs">
                                    <span className="font-mono text-muted-foreground text-[10px]">
                                        {ord.created_at}
                                    </span>
                                    <span className="font-mono font-bold text-foreground">
                                        {formatRupiah(ord.total_amount)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
