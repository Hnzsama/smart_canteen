import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    Building2,
    CheckCircle2,
    Coins,
    CreditCard,
    Percent,
    QrCode,
    Save,
    ShieldCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

type PaymentMethodItem = {
    id: number;
    code: string;
    name: string;
    category: 'bank_transfer' | 'ewallet';
    fee_type: 'fixed' | 'percentage';
    fee_amount: number | string;
    is_active: boolean;
};

type PaymentSettingsProps = {
    bankTransferMethods: PaymentMethodItem[];
    eWalletMethods: PaymentMethodItem[];
    appFee: number;
};

export default function AdminPaymentSettings({
    bankTransferMethods = [],
    eWalletMethods = [],
    appFee = 1000,
}: PaymentSettingsProps) {
    const [currentAppFee, setCurrentAppFee] = useState<number | string>(appFee);
    const [savingAppFee, setSavingAppFee] = useState(false);

    const handleSaveAppFee = (e: React.FormEvent) => {
        e.preventDefault();
        setSavingAppFee(true);
        router.post(
            '/admin/payment-settings/app-fee',
            { app_fee: currentAppFee },
            {
                onFinish: () => setSavingAppFee(false),
                preserveScroll: true,
            }
        );
    };

    const handleToggleMethodActive = (method: PaymentMethodItem) => {
        router.patch(
            `/admin/payment-settings/methods/${method.id}`,
            { is_active: !method.is_active },
            { preserveScroll: true }
        );
    };

    return (
        <>
            <Head title="Pengaturan Pembayaran - Admin Smart Canteen" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Standard Admin Header Banner */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-5">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <CreditCard className="h-5 w-5" />
                            </div>
                            <h1 className="text-2xl font-black tracking-tight text-foreground">
                                Pengaturan Pembayaran & Gateway
                            </h1>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Kelola metode pembayaran aktif, tarif biaya MDR per saluran, dan biaya pengembang aplikasi.
                        </p>
                    </div>

                    <Badge variant="outline" className="font-mono text-xs px-3 py-1 rounded-md gap-1.5 self-start sm:self-auto bg-muted/50 text-foreground border-border">
                        <ShieldCheck className="size-3.5 text-primary" />
                        <span>Midtrans Integration Active</span>
                    </Badge>
                </div>

                {/* Section 1: Application Development Fee Setting */}
                <Card className="rounded-xl border-border/60 shadow-xs bg-card">
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                                <Coins className="h-4 w-4" />
                            </div>
                            <div>
                                <CardTitle className="text-base font-bold text-foreground">
                                    Biaya Admin Aplikasi (Pengembangan)
                                </CardTitle>
                                <CardDescription className="text-xs text-muted-foreground">
                                    Biaya tambahan per transaksi yang dibebankan untuk pemeliharaan & pengembangan aplikasi kantin.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-2 p-5">
                        <form onSubmit={handleSaveAppFee} className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                            <div className="space-y-1.5 w-full sm:max-w-xs">
                                <Label htmlFor="appFee" className="text-xs font-semibold text-foreground">
                                    Nominal Biaya Admin Aplikasi (Rp)
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground font-mono">
                                        Rp
                                    </span>
                                    <Input
                                        id="appFee"
                                        type="number"
                                        min="0"
                                        step="500"
                                        value={currentAppFee}
                                        onChange={(e) => setCurrentAppFee(e.target.value)}
                                        className="pl-9 text-xs font-mono font-bold h-9 rounded-md"
                                        placeholder="1000"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={savingAppFee}
                                className="h-9 px-4 text-xs font-bold rounded-md gap-1.5 shadow-xs"
                            >
                                <Save className="size-3.5" />
                                <span>Simpan Biaya Admin</span>
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Section 2: Bank Transfer Payment Methods */}
                <Card className="rounded-xl border-border/60 shadow-xs bg-card">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                                    <Building2 className="h-4 w-4" />
                                </div>
                                <div>
                                    <CardTitle className="text-base font-bold text-foreground">
                                        Metode Pembayaran Transfer Bank (Virtual Account)
                                    </CardTitle>
                                    <CardDescription className="text-xs text-muted-foreground">
                                        Tarif baku transaksi Virtual Account Midtrans (Rp 4.000 / transaksi). Aktifkan channel yang diinginkan.
                                    </CardDescription>
                                </div>
                            </div>
                            <Badge variant="secondary" className="text-xs font-semibold">
                                {bankTransferMethods.filter((m) => m.is_active).length} Aktif
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-border/50 border-t border-border/50">
                            {bankTransferMethods.map((method) => (
                                <div
                                    key={method.id}
                                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <Switch
                                            checked={method.is_active}
                                            onCheckedChange={() => handleToggleMethodActive(method)}
                                        />
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-xs font-bold text-foreground">
                                                    {method.name}
                                                </h4>
                                                {method.is_active ? (
                                                    <Badge className="bg-emerald-600 text-white border-none text-[9px] px-1.5 py-0 h-4 font-bold">
                                                        <CheckCircle2 className="size-2.5 mr-1" />
                                                        AKTIF
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 font-normal text-muted-foreground">
                                                        NONAKTIF
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-[10.5px] text-muted-foreground font-mono">
                                                Kode Midtrans: <code className="bg-muted px-1 py-0.5 rounded text-[10px] text-foreground font-semibold">{method.code}</code>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                                        <Badge variant="outline" className="font-mono text-xs font-bold px-2.5 py-1 bg-muted/60 text-foreground border-border/80">
                                            Rp {Number(method.fee_amount).toLocaleString('id-ID')}
                                        </Badge>
                                        <span className="text-[11px] text-muted-foreground font-medium shrink-0">
                                            /transaksi
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Section 3: E-Wallet & QRIS Payment Methods */}
                <Card className="rounded-xl border-border/60 shadow-xs bg-card">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                                    <QrCode className="h-4 w-4" />
                                </div>
                                <div>
                                    <CardTitle className="text-base font-bold text-foreground">
                                        Metode Pembayaran E-Wallet & QRIS
                                    </CardTitle>
                                    <CardDescription className="text-xs text-muted-foreground">
                                        Tarif persentase (%) MDR transaksi Instant & QRIS Midtrans (QRIS 0,7%, GoPay 2%, dll).
                                    </CardDescription>
                                </div>
                            </div>
                            <Badge variant="secondary" className="text-xs font-semibold">
                                {eWalletMethods.filter((m) => m.is_active).length} Aktif
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-border/50 border-t border-border/50">
                            {eWalletMethods.map((method) => (
                                <div
                                    key={method.id}
                                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <Switch
                                            checked={method.is_active}
                                            onCheckedChange={() => handleToggleMethodActive(method)}
                                        />
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-xs font-bold text-foreground">
                                                    {method.name}
                                                </h4>
                                                {method.is_active ? (
                                                    <Badge className="bg-emerald-600 text-white border-none text-[9px] px-1.5 py-0 h-4 font-bold">
                                                        <CheckCircle2 className="size-2.5 mr-1" />
                                                        AKTIF
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 font-normal text-muted-foreground">
                                                        NONAKTIF
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-[10.5px] text-muted-foreground font-mono">
                                                Kode Midtrans: <code className="bg-muted px-1 py-0.5 rounded text-[10px] text-foreground font-semibold">{method.code}</code>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                                        <Badge variant="outline" className="font-mono text-xs font-bold px-2.5 py-1 bg-muted/60 text-foreground border-border/80">
                                            {method.fee_amount}%
                                        </Badge>
                                        <span className="text-[11px] text-muted-foreground font-medium shrink-0">
                                            /transaksi
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

AdminPaymentSettings.layout = {
    breadcrumbs: [
        {
            title: 'Admin Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Pengaturan Pembayaran',
            href: '/admin/payment-settings',
        },
    ],
};
