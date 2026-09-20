import { useState, useEffect } from 'react';
import { CartItem, MenuItem } from '@/pages/catalog/types';

const CART_STORAGE_KEY = 'smart_canteen_cart';

export function getCartItems(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
        const data = localStorage.getItem(CART_STORAGE_KEY);
        if (!data) return [];
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function saveCartItems(items: CartItem[]) {
    if (typeof window === 'undefined') return;
    try {
        if (!Array.isArray(items)) {
            console.error('saveCartItems expected array, received:', typeof items);
            return;
        }
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        // Defer dispatching event to prevent React synchronous state update re-entrancy loops
        setTimeout(() => {
            window.dispatchEvent(new Event('cart-updated'));
        }, 0);
    } catch (e) {
        console.error('Failed to save cart items:', e);
    }
}

export function areChoicesEqual(
    c1: Record<string, { name: string; price: number }>,
    c2: Record<string, { name: string; price: number }>
) {
    const keys1 = Object.keys(c1 || {});
    const keys2 = Object.keys(c2 || {});
    if (keys1.length !== keys2.length) return false;
    for (const key of keys1) {
        if (!c2[key] || c1[key].name !== c2[key].name) return false;
    }
    return true;
}

export function addToCart(
    menu: MenuItem,
    qty: number,
    price: number,
    choices: Record<string, { name: string; price: number }>,
    note: string
) {
    if (menu.is_tenant_open === false) {
        console.warn('Cannot add item from closed tenant to cart.');
        return;
    }

    const current = getCartItems();
    const existingIndex = current.findIndex(
        (item) =>
            item.menu.id === menu.id &&
            areChoicesEqual(item.choices, choices) &&
            (item.note || '').trim() === (note || '').trim()
    );

    let updated: CartItem[];
    if (existingIndex > -1) {
        updated = [...current];
        const existing = updated[existingIndex];
        const newQty = (existing.qty || 1) + qty;
        const unitPrice = qty > 0 ? price / qty : price;
        updated[existingIndex] = {
            ...existing,
            qty: newQty,
            price: existing.price + (unitPrice * qty),
        };
    } else {
        updated = [
            ...current,
            {
                menu,
                qty,
                price,
                choices,
                note,
            },
        ];
    }
    saveCartItems(updated);
}

export function useCart() {
    const [cartItems, setCartItemsState] = useState<CartItem[]>(getCartItems);

    useEffect(() => {
        const handleCartChange = () => {
            setCartItemsState(getCartItems());
        };
        window.addEventListener('cart-updated', handleCartChange);
        window.addEventListener('storage', handleCartChange);
        return () => {
            window.removeEventListener('cart-updated', handleCartChange);
            window.removeEventListener('storage', handleCartChange);
        };
    }, []);

    const updateCartItems = (
        action: CartItem[] | ((prev: CartItem[]) => CartItem[])
    ) => {
        setCartItemsState((prev) => {
            const next = typeof action === 'function' ? action(prev) : action;
            saveCartItems(next);
            return next;
        });
    };

    const totalCartCount = cartItems.reduce((acc, item) => acc + (item.qty || 0), 0);
    const totalCartPrice = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);

    return {
        cartItems,
        setCartItems: updateCartItems,
        totalCartCount,
        totalCartPrice,
    };
}
