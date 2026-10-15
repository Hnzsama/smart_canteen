import { useEffect, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import { ArrowLeft, CreditCard, Banknote, Store } from 'lucide-react';
import StudentLayout from '@/layouts/student-layout';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CheckoutBottomBar from './components/checkout-bottom-bar';
import CheckoutCostBreakdown from './components/checkout-cost-breakdown';
import CheckoutEmptyState from './components/checkout-empty-state';
import CheckoutLocationCard from './components/checkout-location-card';
import DiningOptionSelector from './components/dining-option-selector';
import PaymentInstructionDialog from './components/payment-instruction-dialog';
import PaymentSelectorDialog from './components/payment-selector-dialog';
import TenantOrderItemGroup from './components/tenant-order-item-group';
import { useCheckoutCalculation } from './hooks/use-checkout-calculation';
import { useCheckoutCartActions } from './hooks/use-checkout-cart-actions';
import { useCheckoutProcess } from './hooks/use-checkout-process';
import { CheckoutProps } from './types';

export default function StudentCheckout({
    bankTransferMethods = [],
    eWalletMethods = [],
    appFee = 1000,
    tenants = [],
}: CheckoutProps) {
    const { cartItems, setCartItems, totalCartPrice, cartTenantId, cartTenantName } = useCart();
    const foodFallback = '/images/food-placeholder.jpg';

    // Identify tenant capabilities for the single-stand cart
    const currentTenant = useMemo(() => {
        if (!cartTenantId) return null;
        return tenants.find((t) => t.id === cartTenantId) || null;
    }, [cartTenantId, tenants]);

    const hasMidtrans = currentTenant ? Boolean(currentTenant.has_midtrans) : true;
    const activeTenantName = cartTenantName || currentTenant?.name || 'Stand Kantin';

    // Hook for form inputs, payment selection, and POST checkout request
    const {
        diningOption,
        setDiningOption,
        selectedMethodCategory,
        setSelectedMethodCategory,
        selectedChannelCode,
        setSelectedChannelCode,
        orderNotes,
        setOrderNotes,
        showPaymentPicker,
        setShowPaymentPicker,
        showCostDetails,
        setShowCostDetails,
        isSubmitting,
        paymentModalOpen,
        setPaymentModalOpen,
        paymentInfo,
        handleProcessCheckout,
    } = useCheckoutProcess({ cartItems, setCartItems });

    // Automatically enforce cash if tenant has no active Midtrans gateway
    useEffect(() => {
        if (!hasMidtrans && selectedMethodCategory !== 'cash') {
            setSelectedMethodCategory('cash');
            setSelectedChannelCode('cash');
        }
    }, [hasMidtrans, selectedMethodCategory, setSelectedMethodCategory, setSelectedChannelCode]);

    // Hook for cart item updates, deletion, and clipboard copy
    const { copiedText, handleUpdateQty, handleRemoveItem, handleCopy } = useCheckoutCartActions({
        setCartItems,
    });

    // Hook for calculating fees, tenant groups, and grand total
    const {
        itemsByTenant,
        tenantNamesStr,
        totalItemQty,
        selectedMethodLabel,
        effectiveAppFee,
        channelFee,
        grandTotal,
    } = useCheckoutCalculation({
        cartItems,
        totalCartPrice,
        bankTransferMethods,
        eWalletMethods,
        appFee,
        selectedMethodCategory,
        selectedChannelCode,
    });

    const handleSelectPaymentMethod = (category: 'qris' | 'va' | 'cash', code: string) => {
        if (!hasMidtrans && category !== 'cash') {
            setSelectedMethodCategory('cash');
            setSelectedChannelCode('cash');
            return;
        }
        setSelectedMethodCategory(category);
        setSelectedChannelCode(code);
    };

    if (cartItems.length === 0 && !paymentModalOpen) {
        return <CheckoutEmptyState />;
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
                            Konfirmasi Pesanan
                        </h1>
                    </div>
                </div>

                {/* Stand Header & Payment Capability Card */}
                <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="size-8 rounded-lg bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
                                <Store className="size-4" />
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground block font-medium">Stand Terpilih</span>
                                <h3 className="text-sm font-extrabold text-foreground">{activeTenantName}</h3>
                            </div>
                        </div>

                        {hasMidtrans ? (
                            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold gap-1">
                                <CreditCard className="size-3" />
                                <span>QRIS & Tunai</span>
                            </Badge>
                        ) : (
                            <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-bold gap-1">
                                <Banknote className="size-3" />
                                <span>Khusus Tunai</span>
                            </Badge>
                        )}
                    </div>

                    {!hasMidtrans && (
                        <div className="rounded-xl bg-muted/40 p-2.5 text-[11px] text-muted-foreground leading-relaxed border border-border/40">
                            💡 Stand ini belum mengaktifkan payment gateway digital. Pembayaran akan diproses secara <span className="font-semibold text-foreground">Tunai di Kasir Stand</span> saat pesanan siap diambil.
                        </div>
                    )}
                </div>

                {/* Dining Option Segmented Tab */}
                <DiningOptionSelector
                    diningOption={diningOption}
                    onSelectOption={setDiningOption}
                />

                {/* Location & Prep Time Card */}
                <CheckoutLocationCard tenantNamesStr={tenantNamesStr} />

                {/* Items Grouped by Tenant / Stand */}
                <TenantOrderItemGroup
                    itemsByTenant={itemsByTenant}
                    cartItems={cartItems}
                    foodFallback={foodFallback}
                    onUpdateQty={handleUpdateQty}
                    onRemoveItem={handleRemoveItem}
                />

                {/* Payment Option Row, Fee Breakdown Accordion, and Notes */}
                <CheckoutCostBreakdown
                    selectedMethodLabel={selectedMethodLabel}
                    onOpenPaymentPicker={() => setShowPaymentPicker(true)}
                    showCostDetails={showCostDetails}
                    onToggleCostDetails={() => setShowCostDetails(!showCostDetails)}
                    totalItemQty={totalItemQty}
                    totalCartPrice={totalCartPrice}
                    effectiveAppFee={effectiveAppFee}
                    channelFee={channelFee}
                    grandTotal={grandTotal}
                    orderNotes={orderNotes}
                    onOrderNotesChange={setOrderNotes}
                />
            </div>

            {/* Bottom Floating Place Order Action Bar */}
            <CheckoutBottomBar
                grandTotal={grandTotal}
                isSubmitting={isSubmitting}
                isDisabled={cartItems.length === 0}
                onSubmit={handleProcessCheckout}
            />

            {/* Payment Method Selector Modal */}
            <PaymentSelectorDialog
                open={showPaymentPicker}
                onOpenChange={setShowPaymentPicker}
                eWalletMethods={eWalletMethods}
                bankTransferMethods={bankTransferMethods}
                selectedMethodCategory={selectedMethodCategory}
                selectedChannelCode={selectedChannelCode}
                onSelectMethod={handleSelectPaymentMethod}
                hasMidtrans={hasMidtrans}
                tenantName={activeTenantName}
            />

            {/* In-App Payment Instructions Modal */}
            <PaymentInstructionDialog
                open={paymentModalOpen}
                onOpenChange={setPaymentModalOpen}
                paymentInfo={paymentInfo}
                grandTotal={grandTotal}
                copiedText={copiedText}
                onCopy={handleCopy}
            />
        </>
    );
}

StudentCheckout.layout = (page: React.ReactNode) => (
    <StudentLayout showBottomNav={false}>{page}</StudentLayout>
);
