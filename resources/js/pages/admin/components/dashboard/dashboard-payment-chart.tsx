import { useMemo } from 'react';
import { CreditCard, DollarSign } from 'lucide-react';
import { Cell, Pie, PieChart } from 'recharts';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/ui/chart';
import type { DashboardMetricData, PaymentDistributionItem } from '../../types';

type Props = {
    metrics: DashboardMetricData;
    paymentDistribution: PaymentDistributionItem[];
};

const chartConfig = {
    cashless: {
        label: 'Cashless (Midtrans)',
        color: 'var(--chart-1, #10b981)',
    },
    cash: {
        label: 'Tunai Kasir',
        color: 'var(--chart-2, #f59e0b)',
    },
} satisfies ChartConfig;

const formatRupiah = (val: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(val);

export function DashboardPaymentChart({ metrics }: Props) {
    const chartData = useMemo(() => {
        return [
            {
                name: 'cashless',
                value: metrics.cashless_orders,
                amount: metrics.cashless_revenue,
                fill: 'var(--color-cashless, #10b981)',
            },
            {
                name: 'cash',
                value: metrics.cash_orders,
                amount: metrics.cash_revenue,
                fill: 'var(--color-cash, #f59e0b)',
            },
        ];
    }, [metrics]);

    const totalOrders = metrics.total_orders;

    return (
        <Card className="col-span-1 shadow-xs border-border/70 bg-card flex flex-col justify-between">
            <CardHeader className="pb-2">
                <CardTitle className="text-base sm:text-lg font-bold tracking-tight">
                    Rasio Metode Pembayaran
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                    Perbandingan adopsi transaksi QRIS/Midtrans vs Tunai.
                </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col items-center justify-center pt-2">
                <div className="relative w-full aspect-square max-h-[220px]">
                    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[220px]">
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        hideLabel
                                        formatter={(value, name, item) => (
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-semibold text-foreground">
                                                    {name === 'cashless' ? 'Cashless' : 'Tunai'}: {value} Pesanan
                                                </span>
                                                <span className="text-xs text-muted-foreground font-mono">
                                                    {formatRupiah(item.payload.amount)}
                                                </span>
                                            </div>
                                        )}
                                    />
                                }
                            />
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={60}
                                outerRadius={85}
                                strokeWidth={3}
                                stroke="var(--background)"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ChartContainer>

                    {/* Centered Stats in Donut */}
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-extrabold tracking-tight text-foreground font-mono">
                            {metrics.cashless_percentage}%
                        </span>
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-400">
                            Cashless
                        </span>
                    </div>
                </div>

                {/* Stat Breakdown Bars */}
                <div className="grid grid-cols-2 gap-3 w-full mt-4 pt-3 border-t border-border/50">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <CreditCard className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <div className="truncate">
                            <div className="text-[11px] text-muted-foreground">Cashless ({metrics.cashless_orders})</div>
                            <div className="text-xs font-bold font-mono text-emerald-700 dark:text-emerald-300 truncate">
                                {formatRupiah(metrics.cashless_revenue)}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <DollarSign className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        <div className="truncate">
                            <div className="text-[11px] text-muted-foreground">Tunai ({metrics.cash_orders})</div>
                            <div className="text-xs font-bold font-mono text-amber-700 dark:text-amber-300 truncate">
                                {formatRupiah(metrics.cash_revenue)}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-2 text-xs text-muted-foreground border-t border-border/50 justify-between">
                <span>Total volume: {totalOrders} pesanan</span>
                <span className="font-semibold text-foreground font-mono">
                    {formatRupiah(metrics.total_revenue)}
                </span>
            </CardFooter>
        </Card>
    );
}
