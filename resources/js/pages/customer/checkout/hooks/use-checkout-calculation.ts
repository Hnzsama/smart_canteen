import { useMemo } from 'react';
import { CartItem } from '../types';
import { PaymentMethodItem } from '../types';

interface UseCheckoutCalculationProps {
    cartItems: CartItem[];
    totalCartPrice: number;
    bankTransferMethods: PaymentMethodItem[];
    eWalletMethods: PaymentMethodItem[];
    appFee: number;
    selectedMethodCategory: 'qris' | 'va' | 'cash';
    selectedChannelCode: string;
}

export function useCheckoutCalculation({
    cartItems,
    totalCartPrice,
    bankTransferMethods,
    eWalletMethods,
    appFee,
    selectedMethodCategory,
    selectedChannelCode,
}: UseCheckoutCalculationProps) {
    const itemsByTenant = useMemo(() => {
        const groups: Record<number, { tenant_name: string; items: CartItem[] }> = {};
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

    const tenantNamesStr = useMemo(() => {
        const names = Array.from(
            new Set(Object.values(itemsByTenant).map((g) => g.tenant_name).filter(Boolean))
        );
        return names.length > 0 ? names.join(', ') : 'Mitra Stand Kantin';
    }, [itemsByTenant]);

    const totalItemQty = useMemo(() => {
        return cartItems.reduce((acc, i) => acc + i.qty, 0);
    }, [cartItems]);

    const selectedChannelModel = useMemo(() => {
        if (selectedMethodCategory === 'cash') return null;
        const allMethods = [...bankTransferMethods, ...eWalletMethods];
        return (
            allMethods.find((m) => m.code === selectedChannelCode) ||
            eWalletMethods[0] ||
            bankTransferMethods[0] ||
            null
        );
    }, [selectedMethodCategory, selectedChannelCode, bankTransferMethods, eWalletMethods]);

    const selectedMethodLabel = useMemo(() => {
        if (selectedMethodCategory === 'cash') return 'Bayar Tunai di Kasir (Rp 0 Fee)';
        if (selectedChannelModel) return selectedChannelModel.name;
        return 'QRIS (Gopay / OVO / Dana / BCA)';
    }, [selectedMethodCategory, selectedChannelModel]);

    const effectiveAppFee = useMemo(() => {
        return selectedMethodCategory === 'cash' ? 0 : appFee;
    }, [selectedMethodCategory, appFee]);

    const channelFee = useMemo(() => {
        if (selectedMethodCategory === 'cash' || !selectedChannelModel) return 0;
        if (selectedChannelModel.fee_type === 'fixed') {
            return Number(selectedChannelModel.fee_amount);
        }
        return Math.round((totalCartPrice * Number(selectedChannelModel.fee_amount)) / 100);
    }, [selectedMethodCategory, selectedChannelModel, totalCartPrice]);

    const grandTotal = useMemo(() => {
        if (cartItems.length === 0) return 0;
        return totalCartPrice + effectiveAppFee + channelFee;
    }, [cartItems, totalCartPrice, effectiveAppFee, channelFee]);

    return {
        itemsByTenant,
        tenantNamesStr,
        totalItemQty,
        selectedChannelModel,
        selectedMethodLabel,
        effectiveAppFee,
        channelFee,
        grandTotal,
    };
}
