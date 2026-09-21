import { Head } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import StudentLayout from '@/layouts/student-layout';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
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
}: CheckoutProps) {
    const { cartItems, setCartItems, totalCartPrice } = useCart();
    const foodFallback = '/images/food-placeholder.jpg';

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
                            Confirm Order
                        </h1>
                    </div>
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
