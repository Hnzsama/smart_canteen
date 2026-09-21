import { useState } from 'react';
import { router } from '@inertiajs/react';
import { CartItem, PaymentInfoState } from '../types';

interface UseCheckoutProcessProps {
    cartItems: CartItem[];
    setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export function useCheckoutProcess({ cartItems, setCartItems }: UseCheckoutProcessProps) {
    const [diningOption, setDiningOption] = useState<'dine_in' | 'takeaway'>('dine_in');
    const [selectedMethodCategory, setSelectedMethodCategory] = useState<'qris' | 'va' | 'cash'>('qris');
    const [selectedChannelCode, setSelectedChannelCode] = useState<string>('qris');
    const [orderNotes, setOrderNotes] = useState('');

    const [showPaymentPicker, setShowPaymentPicker] = useState(false);
    const [showCostDetails, setShowCostDetails] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState<PaymentInfoState | null>(null);

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
                    'X-CSRF-TOKEN':
                        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)
                            ?.content || '',
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

            setCartItems([]);

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

    return {
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
        setPaymentInfo,
        handleProcessCheckout,
    };
}
