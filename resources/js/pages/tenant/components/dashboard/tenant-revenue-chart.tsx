import { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
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
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/ui/chart';
import type { RevenueTrendItem } from '../../types';

type Props = {
    revenueTrend?: RevenueTrendItem[];
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

export function TenantRevenueChart({ revenueTrend = [] }: Props) {
    const totalWeeklyRevenue = useMemo(() => {
        return revenueTrend.reduce((acc, curr) => acc + curr.total, 0);
    }, [revenueTrend]);

    const totalWeeklyOrders = useMemo(() => {
        return revenueTrend.reduce((acc, curr) => acc + curr.orders_count, 0);
    }, [revenueTrend]);

    return (
        <Card className="col-span-1 lg:col-span-2 shadow-xs border-border/70 bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="text-base sm:text-lg font-bold tracking-tight">
                        Grafik Omset Harian Stand
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                        Pendapatan 7 hari terakhir berdasarkan transaksi QRIS/Midtrans vs Tunai.
                    </CardDescription>
                </div>
                <div className="hidden sm:flex flex-col items-end">
                    <span className="text-xs text-muted-foreground">Total 7 Hari:</span>
                    <span className="text-base font-bold text-foreground font-mono">
                        {formatRupiah(totalWeeklyRevenue)}
                    </span>
                </div>
            </CardHeader>

            <CardContent className="pt-4">
                <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
                    <AreaChart
                        data={revenueTrend}
                        margin={{
                            left: 12,
                            right: 12,
                            top: 10,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id="fillCashlessTenant" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-cashless, #10b981)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-cashless, #10b981)" stopOpacity={0.05} />
                            </linearGradient>
                            <linearGradient id="fillCashTenant" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-cash, #f59e0b)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-cash, #f59e0b)" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/40" />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            className="text-xs font-medium fill-muted-foreground"
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            className="text-xs font-mono fill-muted-foreground"
                            tickFormatter={(val) => `Rp ${(val / 1000).toFixed(0)}k`}
                        />
                        <ChartTooltip
                            cursor={{ strokeDasharray: '3 3', stroke: 'var(--border)' }}
                            content={
                                <ChartTooltipContent
                                    formatter={(value) => (
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-foreground">
                                                {formatRupiah(Number(value))}
                                            </span>
                                        </div>
                                    )}
                                />
                            }
                        />
                        <Area
                            dataKey="cashless"
                            type="monotone"
                            fill="url(#fillCashlessTenant)"
                            fillOpacity={0.4}
                            stroke="var(--color-cashless, #10b981)"
                            strokeWidth={2}
                            stackId="a"
                        />
                        <Area
                            dataKey="cash"
                            type="monotone"
                            fill="url(#fillCashTenant)"
                            fillOpacity={0.4}
                            stroke="var(--color-cash, #f59e0b)"
                            strokeWidth={2}
                            stackId="a"
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 font-medium">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    <span>{totalWeeklyOrders} pesanan selesai diproses minggu ini</span>
                </div>
                <div className="font-mono text-[11px]">Realtime Dapur</div>
            </CardFooter>
        </Card>
    );
}
