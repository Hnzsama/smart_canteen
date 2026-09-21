import { useState } from 'react';
import { CartItem } from '../types';

interface UseCheckoutCartActionsProps {
    setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export function useCheckoutCartActions({ setCartItems }: UseCheckoutCartActionsProps) {
    const [copiedText, setCopiedText] = useState<string | null>(null);

    const handleUpdateQty = (cartIndex: number, delta: number) => {
        setCartItems((prev) => {
            const item = prev[cartIndex];
            if (!item) return prev;
            const newQty = item.qty + delta;
            if (newQty <= 0) {
                return prev.filter((_, i) => i !== cartIndex);
            }
            const unitPrice = item.qty > 0 ? item.price / item.qty : item.price;
            return prev.map((itm, i) =>
                i === cartIndex ? { ...itm, qty: newQty, price: unitPrice * newQty } : itm
            );
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

    return {
        copiedText,
        handleUpdateQty,
        handleRemoveItem,
        handleCopy,
    };
}
