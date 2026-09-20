import React, { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Banknote,
    Building2,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Clock,
    Copy,
    CreditCard,
    Info,
    Loader2,
    MapPin,
    Minus,
    Package,
    Plus,
    QrCode,
    Receipt,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    Store,
    Tag,
    Trash2,
    Utensils,
    UtensilsCrossed,
} from 'lucide-react';
import StudentLayout from '@/layouts/student-layout';
import { useCart } from '@/hooks/use-cart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type PaymentMethodItem = {
    id: number;
    code: string;
    name: string;
    category: 'bank_transfer' | 'ewallet';
    fee_type: 'fixed' | 'percentage';
    fee_amount: number | string;
    is_active: boolean;
};

type CheckoutProps = {
    bankTransferMethods: PaymentMethodItem[];
    eWalletMethods: PaymentMethodItem[];
    appFee: number;
};

type PaymentInfoState = {
    type: 'qris' | 'bank_transfer' | 'cash';
    channel_code: string;
    channel_name: string;
    va_number?: string;
    biller_code?: string;
    bill_key?: string;
    qr_url?: string;
    qr_string?: string;
    instructions?: string[];
};

export default function StudentCheckout({
    bankTransferMethods = [],
    eWalletMethods = [],
    appFee = 1000,
}: CheckoutProps) {
    const { cartItems, setCartItems, totalCartPrice } = useCart();
    const foodFallback = '/images/food-placeholder.jpg';

    const [diningOption, setDiningOption] = useState<'dine_in' | 'takeaway'>('dine_in');
    const [selectedMethodCategory, setSelectedMethodCategory] = useState<'qris' | 'va' | 'cash'>('qris');
    const [selectedChannelCode, setSelectedChannelCode] = useState<string>('qris');
    const [orderNotes, setOrderNotes] = useState('');

    const [showPaymentPicker, setShowPaymentPicker] = useState(false);
    const [showCostDetails, setShowCostDetails] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [copiedText, setCopiedText] = useState<string | null>(null);

    // Modal state for in-app custom payment display (QRIS / VA / Cash)
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState<PaymentInfoState | null>(null);

    // Group cart items by tenant_id
    const itemsByTenant = useMemo(() => {
        const groups: Record<number, { tenant_name: string; items: typeof cartItems }> = {};
        cartItems.forEach((item) => {
            const tenantId = item.menu.tenant_id;
            if (!groups[tenantId]) {
                groups[tenantId] = {
                    tenant_name: item.menu.tenant_name || 'Stand Kantin',
                    items: [],
                };
            }
            groups[tenantId].items.push(item);
        });
        return groups;
    }, [cartItems]);

    // Derived tenant names string
    const tenantNamesStr = useMemo(() => {
        const names = Array.from(new Set(Object.values(itemsByTenant).map((g) => g.tenant_name).filter(Boolean)));
        return names.length > 0 ? names.join(', ') : 'Mitra Stand Kantin';
    }, [itemsByTenant]);

    // Total quantity count
    const totalItemQty = useMemo(() => {
        return cartItems.reduce((acc, i) => acc + i.qty, 0);
    }, [cartItems]);

    // Compute active payment channel model
    const selectedChannelModel = useMemo(() => {
        if (selectedMethodCategory === 'cash') return null;
        const allMethods = [...bankTransferMethods, ...eWalletMethods];
        return allMethods.find((m) => m.code === selectedChannelCode) || eWalletMethods[0] || bankTransferMethods[0] || null;
    }, [selectedMethodCategory, selectedChannelCode, bankTransferMethods, eWalletMethods]);

    // Active method label for display
    const selectedMethodLabel = useMemo(() => {
        if (selectedMethodCategory === 'cash') return 'Bayar Tunai di Kasir (Rp 0 Fee)';
        if (selectedChannelModel) return selectedChannelModel.name;
        return 'QRIS (Gopay / OVO / Dana / BCA)';
    }, [selectedMethodCategory, selectedChannelModel]);

    // Compute Effective App Fee (0 for cash, global appFee for cashless)
    const effectiveAppFee = useMemo(() => {
        return selectedMethodCategory === 'cash' ? 0 : appFee;
    }, [selectedMethodCategory, appFee]);

    // Compute Channel Fee
    const channelFee = useMemo(() => {
        if (selectedMethodCategory === 'cash' || !selectedChannelModel) return 0;
        if (selectedChannelModel.fee_type === 'fixed') {
            return Number(selectedChannelModel.fee_amount);
        }
        return Math.round((totalCartPrice * Number(selectedChannelModel.fee_amount)) / 100);
    }, [selectedMethodCategory, selectedChannelModel, totalCartPrice]);

    // Compute Final Total Amount
    const grandTotal = useMemo(() => {
        if (cartItems.length === 0) return 0;
        return totalCartPrice + effectiveAppFee + channelFee;
    }, [cartItems, totalCartPrice, effectiveAppFee, channelFee]);

    const handleUpdateQty = (cartIndex: number, delta: number) => {
        setCartItems((prev) => {
            const item = prev[cartIndex];
            if (!item) return prev;
            const newQty = item.qty + delta;
            if (newQty <= 0) {
                return prev.filter((_, i) => i !== cartIndex);
            }
            const unitPrice = item.qty > 0 ? item.price / item.qty : item.price;
            return prev.map((itm, i) => (i === cartIndex ? { ...itm, qty: newQty, price: unitPrice * newQty } : itm));
        });
    };

    const handleRemoveItem = (cartIndex: number) => {
        setCartItems((prev) => prev.filter((_, i) => i !== cartIndex));
    };

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopiedText(label);
        setTimeout(() => setCopiedText(null), 2500);
    };

    const handleProcessCheckout = async () => {
        if (cartItems.length === 0 || isSubmitting) return;

        setIsSubmitting(true);

        const payloadItems = cartItems.map((item) => ({
            menu_id: item.menu.id,
            qty: item.qty,
            price: item.price,
            choices: item.choices || {},
            note: item.note || '',
        }));

        try {
            const paymentMethodParam = selectedMethodCategory === 'cash' ? 'cash' : 'cashless';
            const channelCodeParam = selectedMethodCategory === 'cash' ? null : selectedChannelCode;

            const response = await fetch('/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    items: payloadItems,
                    payment_method: paymentMethodParam,
                    payment_channel_code: channelCodeParam,
                    dining_option: diningOption,
                    notes: orderNotes,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                alert(data.message || 'Gagal memproses checkout. Silakan coba lagi.');
                setIsSubmitting(false);
                return;
            }

            // Clear cart from local state & storage
            setCartItems([]);

            // Navigate to dedicated payment page
            if (data.redirect_url) {
                router.visit(data.redirect_url);
            } else if (data.primary_order_id) {
                router.visit(`/orders/${data.primary_order_id}/payment`);
            } else {
                router.visit('/orders');
            }
        } catch (e) {
            console.error('Checkout error:', e);
            alert('Terjadi kesalahan jaringan. Silakan periksa koneksi Anda.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cartItems.length === 0 && !paymentModalOpen) {
        return (
            <>
                <Head title="Confirm Order - Smart Canteen FEB" />
                <div className="min-h-[420px] rounded-3xl border border-dashed border-border/80 bg-card/60 backdrop-blur-md p-6 text-center flex flex-col items-center justify-center space-y-4 my-4 shadow-xs">
                    <div className="relative">
                        <div className="size-16 rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 text-primary flex items-center justify-center border border-primary/20 shadow-inner">
                            <ShoppingBag className="size-8 text-primary animate-bounce" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h3 className="font-black text-base text-foreground tracking-tight">Keranjang Kosong</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Yuk pilih makanan favoritmu di Kantin FEB!
                        </p>
                    </div>

                    <Button asChild className="font-black text-xs rounded-2xl h-11 px-6 gap-2 shadow-md hover:scale-105 active:scale-95 transition-all">
                        <Link href="/">
                            <Utensils className="size-4" />
                            <span>Jelajahi Menu</span>
                        </Link>
                    </Button>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Confirm Order - Smart Canteen FEB" />

            <div className="w-full space-y-3 pb-32 pt-1 font-sans">
                {/* Top Bar Header */}
                <div className="flex items-center justify-between px-1 py-1">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => history.back()}
                            className="size-9 rounded-full hover:bg-muted active:scale-90 p-0 text-foreground"
                        >
                            <ArrowLeft className="size-5" />
                        </Button>
                        <h1 className="text-lg font-black tracking-tight text-foreground">
                            Confirm Order
                        </h1>
                    </div>
                </div>

                {/* Top Segmented Tab: Dining Option (Dine-In vs Takeaway) */}
                <div className="p-1 bg-muted/60 dark:bg-neutral-900 rounded-2xl border border-border/60 grid grid-cols-2 gap-1">
                    <button
                        type="button"
                        onClick={() => setDiningOption('dine_in')}
                        className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all text-center flex items-center justify-center gap-1.5 ${
                            diningOption === 'dine_in'
                                ? 'bg-card text-primary shadow-xs ring-1 ring-border font-black'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <Utensils className="size-3.5" />
                        <span>Makan di Tempat</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setDiningOption('takeaway')}
                        className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all text-center flex items-center justify-center gap-1.5 ${
                            diningOption === 'takeaway'
                                ? 'bg-card text-primary shadow-xs ring-1 ring-border font-black'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <Package className="size-3.5" />
                        <span>Bawa Pulang</span>
                    </button>
                </div>

                {/* Location & Prep Time Card */}
                <div className="p-3.5 bg-card rounded-2xl border border-border/70 space-y-2 shadow-2xs">
                    <div className="flex items-start gap-2.5">
                        <MapPin className="size-4.5 text-primary shrink-0 mt-0.5" />
                        <div className="space-y-0.5 flex-1 min-w-0">
                            <h3 className="text-xs font-extrabold text-foreground leading-snug truncate">
                                {tenantNamesStr}
                            </h3>
                            <p className="text-[10.5px] text-muted-foreground leading-tight truncate">
                                Kantin FEB • Universitas Negeri Surabaya
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10.5px] text-muted-foreground pt-2 border-t border-border/40 font-medium">
                        <Clock className="size-3.5 text-amber-500 shrink-0" />
                        <span>Estimasi Waktu Penyiapan: <strong className="text-foreground font-bold">10-15 Min</strong></span>
                    </div>
                </div>

                {/* Items Grouped by Tenant / Stand */}
                <div className="space-y-3">
                    {Object.entries(itemsByTenant).map(([tenantId, group]) => (
                        <div key={tenantId} className="bg-card rounded-2xl border border-border/70 p-3.5 space-y-3 shadow-2xs">
                            {/* Stand Header Row */}
                            <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
                                <div className="flex items-center gap-2 min-w-0">
                                    <Store className="size-4 text-primary shrink-0" />
                                    <span className="text-xs font-black text-foreground truncate">
                                        {group.tenant_name}
                                    </span>
                                </div>
                                <Button asChild variant="ghost" size="sm" className="h-6 text-[11px] font-bold text-primary hover:text-primary p-0 hover:bg-transparent shrink-0">
                                    <Link href="/">
                                        <span>+ Tambah Menu</span>
                                    </Link>
                                </Button>
                            </div>

                            {/* Food Items List */}
                            <div className="divide-y divide-border/40">
                                {group.items.map((item) => {
                                    const cartIdx = cartItems.findIndex((c) => c === item);
                                    const choicesArray = Object.entries(item.choices || {}).map(
                                        ([groupName, choice]) => `${groupName}: ${choice.name}`
                                    );

                                    return (
                                        <div key={cartIdx} className="py-2.5 first:pt-0 last:pb-0 flex items-start gap-3">
                                            <img
                                                src={item.menu.image || foodFallback}
                                                alt={item.menu.name}
                                                className="size-16 rounded-xl object-cover border border-border bg-muted shrink-0"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = foodFallback;
                                                }}
                                            />

                                            <div className="flex-1 min-w-0 space-y-1">
                                                <div className="flex items-start justify-between gap-1">
                                                    <h4 className="text-xs font-bold text-foreground leading-snug line-clamp-1">
                                                        {item.menu.name}
                                                    </h4>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveItem(cartIdx)}
                                                        className="text-muted-foreground hover:text-destructive p-0.5 shrink-0"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </button>
                                                </div>

                                                {choicesArray.length > 0 && (
                                                    <p className="text-[10px] text-muted-foreground line-clamp-1">
                                                        {choicesArray.join(', ')}
                                                    </p>
                                                )}

                                                {item.note && (
                                                    <p className="text-[9.5px] text-muted-foreground italic">
                                                        "{item.note}"
                                                    </p>
                                                )}

                                                <div className="flex items-center justify-between pt-1">
                                                    <span className="font-mono text-xs font-black text-primary">
                                                        Rp{item.price.toLocaleString('id-ID')}
                                                    </span>

                                                    <div className="flex items-center gap-1.5 border border-border/80 rounded-lg p-0.5 bg-muted/30">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleUpdateQty(cartIdx, -1)}
                                                            className="size-5 rounded bg-card flex items-center justify-center text-foreground hover:bg-accent font-bold"
                                                        >
                                                            <Minus className="size-3" />
                                                        </button>
                                                        <span className="font-mono text-xs font-black w-4 text-center">
                                                            {item.qty}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleUpdateQty(cartIdx, 1)}
                                                            className="size-5 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold"
                                                        >
                                                            <Plus className="size-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Payment Option Row */}
                <button
                    type="button"
                    onClick={() => setShowPaymentPicker(true)}
                    className="w-full p-3.5 bg-card rounded-2xl border border-border/70 flex items-center justify-between text-left hover:bg-muted/30 transition-colors shadow-2xs"
                >
                    <span className="text-xs font-bold text-muted-foreground">Payment Option</span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                        <span className="truncate max-w-[190px]">{selectedMethodLabel}</span>
                        <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                    </div>
                </button>

                {/* Total Payment Row (With Expandable Cost Breakdown Toggle) */}
                <div className="bg-card rounded-2xl border border-border/70 p-3.5 space-y-2 shadow-2xs">
                    <button
                        type="button"
                        onClick={() => setShowCostDetails(!showCostDetails)}
                        className="w-full flex items-center justify-between text-left"
                    >
                        <span className="text-xs font-bold text-muted-foreground">Total Payment</span>
                        <div className="flex items-center gap-1 text-sm font-black font-mono text-primary">
                            <span>Rp{grandTotal.toLocaleString('id-ID')}</span>
                            <ChevronDown className={`size-4 text-muted-foreground transition-transform ${showCostDetails ? 'rotate-180' : ''}`} />
                        </div>
                    </button>

                    {/* Expandable Breakdown Drawer */}
                    {showCostDetails && (
                        <div className="pt-2 border-t border-border/40 space-y-1.5 text-[11px] text-muted-foreground animate-in fade-in zoom-in-95 duration-150">
                            <div className="flex justify-between items-center">
                                <span>Subtotal Menu ({totalItemQty} porsi)</span>
                                <span className="font-mono font-bold text-foreground">
                                    Rp{totalCartPrice.toLocaleString('id-ID')}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span>Admin Service</span>
                                <span className={`font-mono font-bold ${effectiveAppFee === 0 ? 'text-emerald-500' : 'text-foreground'}`}>
                                    {effectiveAppFee === 0 ? 'Rp 0 (Free)' : `Rp${effectiveAppFee.toLocaleString('id-ID')}`}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span>Payment Service</span>
                                <span className={`font-mono font-bold ${channelFee === 0 ? 'text-emerald-500' : 'text-foreground'}`}>
                                    {channelFee === 0 ? 'Rp 0 (Free)' : `Rp${channelFee.toLocaleString('id-ID')}`}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Order Note Input Row */}
                <div className="p-3.5 bg-card rounded-2xl border border-border/70 space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-muted-foreground">Note:</span>
                        <span className="text-[10px] text-muted-foreground">Catatan ke penjual</span>
                    </div>
                    <Textarea
                        placeholder="Contoh: Sambal dipisah, sendok ekstra..."
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        className="text-xs min-h-[55px] rounded-xl resize-none bg-muted/20 border-border/70 focus:ring-primary"
                    />
                </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="fixed bottom-3 z-50 w-full max-w-[430px] left-1/2 -translate-x-1/2 px-3 pointer-events-none">
                <div className="pointer-events-auto bg-card/95 dark:bg-neutral-900/95 backdrop-blur-2xl border border-border/80 dark:border-white/15 h-16 rounded-3xl p-3 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.15)]">
                    <div className="flex flex-col pl-1">
                        <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider leading-none">
                            Total Payment
                        </span>
                        <span className="font-mono font-black text-base text-primary leading-tight mt-0.5">
                            Rp{grandTotal.toLocaleString('id-ID')}
                        </span>
                    </div>

                    <Button
                        type="button"
                        onClick={handleProcessCheckout}
                        disabled={isSubmitting || cartItems.length === 0}
                        className="h-11 px-6 text-xs font-black rounded-2xl gap-1.5 shadow-md active:scale-95 transition-all bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <span>Place Order</span>
                                <ChevronRight className="size-4 opacity-80" />
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Payment Method Selector Dialog / Sheet */}
            <Dialog open={showPaymentPicker} onOpenChange={setShowPaymentPicker}>
                <DialogContent className="w-[calc(100%-1.5rem)] max-w-[390px] rounded-3xl p-5 text-left space-y-4 border-border/80 shadow-2xl bg-card">
                    <DialogHeader className="space-y-1">
                        <DialogTitle className="text-base font-black text-foreground">
                            Pilih Metode Pembayaran
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            Pilih cara pembayaran yang kamu inginkan
                        </DialogDescription>
                    </DialogHeader>

                    {/* QRIS / E-Wallet Option */}
                    <div className="space-y-2">
                        <span className="text-[11px] font-black text-foreground block">
                            QRIS & E-Wallet (Scan Instant)
                        </span>
                        {eWalletMethods.map((m) => {
                            const isSelected = selectedMethodCategory === 'qris' && selectedChannelCode === m.code;
                            return (
                                <button
                                    key={m.id}
                                    type="button"
                                    onClick={() => {
                                        setSelectedMethodCategory('qris');
                                        setSelectedChannelCode(m.code);
                                        setShowPaymentPicker(false);
                                    }}
                                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                                        isSelected
                                            ? 'border-primary bg-primary/10 ring-2 ring-primary/20 font-black'
                                            : 'border-border/70 hover:bg-muted/40'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="size-8 rounded-lg bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                                            <QrCode className="size-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-foreground">{m.name}</span>
                                            <span className="text-[9.5px] text-muted-foreground font-mono">
                                                Fee: {m.fee_amount}%
                                            </span>
                                        </div>
                                    </div>
                                    {isSelected && <Check className="size-4 text-primary" />}
                                </button>
                            );
                        })}
                    </div>

                    {/* Virtual Account Option */}
                    <div className="space-y-2">
                        <span className="text-[11px] font-black text-foreground block">
                            Virtual Account (Bank Transfer)
                        </span>
                        {bankTransferMethods.map((m) => {
                            const isSelected = selectedMethodCategory === 'va' && selectedChannelCode === m.code;
                            return (
                                <button
                                    key={m.id}
                                    type="button"
                                    onClick={() => {
                                        setSelectedMethodCategory('va');
                                        setSelectedChannelCode(m.code);
                                        setShowPaymentPicker(false);
                                    }}
                                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                                        isSelected
                                            ? 'border-primary bg-primary/10 ring-2 ring-primary/20 font-black'
                                            : 'border-border/70 hover:bg-muted/40'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="size-8 rounded-lg bg-blue-500/15 text-blue-600 flex items-center justify-center shrink-0">
                                            <Building2 className="size-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-foreground">{m.name}</span>
                                            <span className="text-[9.5px] text-muted-foreground font-mono">
                                                Fee: Rp{Number(m.fee_amount).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    </div>
                                    {isSelected && <Check className="size-4 text-primary" />}
                                </button>
                            );
                        })}
                    </div>

                    {/* Cash / Tunai Option */}
                    <div className="space-y-2">
                        <span className="text-[11px] font-black text-foreground block">
                            Tunai (Bayar di Kasir Stand)
                        </span>
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedMethodCategory('cash');
                                setSelectedChannelCode('cash');
                                setShowPaymentPicker(false);
                            }}
                            className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                                selectedMethodCategory === 'cash'
                                    ? 'border-primary bg-primary/10 ring-2 ring-primary/20 font-black'
                                    : 'border-border/70 hover:bg-muted/40'
                            }`}
                        >
                            <div className="flex items-center gap-2.5">
                                <div className="size-8 rounded-lg bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
                                    <Banknote className="size-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-foreground">Bayar Tunai di Kasir</span>
                                    <span className="text-[9.5px] text-emerald-600 font-bold">
                                        Bebas Biaya Admin (Rp 0 Fee)
                                    </span>
                                </div>
                            </div>
                            {selectedMethodCategory === 'cash' && <Check className="size-4 text-primary" />}
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Custom In-App Payment Instruction Modal (QRIS & Virtual Account) */}
            <Dialog
                open={paymentModalOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setPaymentModalOpen(false);
                        router.get('/orders');
                    }
                }}
            >
                <DialogContent className="w-[calc(100%-1.5rem)] max-w-[390px] rounded-3xl p-5 text-center space-y-3.5 border-border/80 shadow-2xl bg-card">
                    <DialogHeader className="space-y-1">
                        <div className="mx-auto size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-xs mb-1">
                            {paymentInfo?.type === 'qris' ? (
                                <QrCode className="size-5 text-emerald-600" />
                            ) : (
                                <Building2 className="size-5 text-blue-600" />
                            )}
                        </div>
                        <DialogTitle className="text-base font-black text-foreground">
                            {paymentInfo?.type === 'qris'
                                ? 'Pembayaran QRIS Instant'
                                : `Virtual Account ${paymentInfo?.channel_name || ''}`}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            Selesaikan pembayaran menggunakan detail di bawah ini
                        </DialogDescription>
                    </DialogHeader>

                    {/* QRIS Display Section */}
                    {paymentInfo?.type === 'qris' && (
                        <div className="space-y-3">
                            <div className="p-3 bg-white rounded-2xl border border-slate-200 inline-block mx-auto shadow-md">
                                <img
                                    src={paymentInfo.qr_url}
                                    alt="QRIS Code"
                                    className="size-44 mx-auto object-contain rounded-lg"
                                />
                                <div className="pt-1 text-slate-500 font-mono text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                                    <Sparkles className="size-3 text-emerald-600" />
                                    <span>Scan via GoPay, OVO, ShopeePay, DANA</span>
                                </div>
                            </div>

                            <div className="space-y-0.5 bg-muted/40 p-2.5 rounded-xl border border-border/60">
                                <span className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider block">
                                    Total Nominal QRIS
                                </span>
                                <span className="text-xl font-black font-mono text-primary">
                                    Rp{grandTotal.toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Virtual Account Display Section */}
                    {paymentInfo?.type === 'bank_transfer' && (
                        <div className="space-y-3">
                            <div className="p-3 bg-card rounded-xl border border-border/80 space-y-1.5 text-left shadow-xs">
                                <span className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider block">
                                    Nomor Virtual Account ({paymentInfo.channel_name})
                                </span>
                                <div className="flex items-center justify-between gap-2 bg-muted/60 p-2.5 rounded-lg border border-border/80 font-mono">
                                    <span className="text-base font-black tracking-wider text-foreground select-all">
                                        {paymentInfo.va_number}
                                    </span>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleCopy(paymentInfo.va_number || '', 'va')}
                                        className="h-8 px-2.5 text-[10px] font-extrabold gap-1 rounded-lg shrink-0 border-border shadow-xs"
                                    >
                                        {copiedText === 'va' ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                                        <span>{copiedText === 'va' ? 'Tersalin' : 'Salin'}</span>
                                    </Button>
                                </div>
                            </div>

                            <div className="p-2.5 bg-muted/40 rounded-xl border border-border/60 text-left space-y-0.5">
                                <span className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider block">
                                    Total Transfer Tepat
                                </span>
                                <div className="flex items-center justify-between">
                                    <span className="text-base font-black font-mono text-primary">
                                        Rp{grandTotal.toLocaleString('id-ID')}
                                    </span>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleCopy(String(grandTotal), 'total')}
                                        className="h-7 px-2 text-[10px] font-bold gap-1"
                                    >
                                        {copiedText === 'total' ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                                        <span>{copiedText === 'total' ? 'Tersalin' : 'Salin'}</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step-by-step Instructions */}
                    {paymentInfo?.instructions && paymentInfo.instructions.length > 0 && (
                        <div className="text-left bg-muted/30 p-3 rounded-xl border border-border/40 space-y-1">
                            <span className="text-[10px] font-black text-foreground block">
                                Petunjuk Pembayaran:
                            </span>
                            <ol className="list-decimal list-inside text-[10px] text-muted-foreground space-y-0.5 leading-snug">
                                {paymentInfo.instructions.map((inst, i) => (
                                    <li key={i}>{inst}</li>
                                ))}
                            </ol>
                        </div>
                    )}

                    <Button
                        type="button"
                        onClick={() => {
                            setPaymentModalOpen(false);
                            router.get('/orders');
                        }}
                        className="w-full h-11 text-xs font-black rounded-xl gap-1.5 shadow-md bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        <CheckCircle2 className="size-4" />
                        <span>Saya Sudah Bayar / Lihat Status</span>
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
}

StudentCheckout.layout = (page: React.ReactNode) => <StudentLayout showBottomNav={false}>{page}</StudentLayout>;
