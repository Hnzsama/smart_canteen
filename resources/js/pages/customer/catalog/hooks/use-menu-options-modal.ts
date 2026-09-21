import { useState } from 'react';
import { useCart } from '@/hooks/use-cart';
import { MenuItem } from '../types';
import { areChoicesEqual } from '../utils/catalog-utils';

export function useMenuOptionsModal(initialUserFavorites: number[] = []) {
    const [selectedMenuModal, setSelectedMenuModal] = useState<MenuItem | null>(null);
    const [selectedChoices, setSelectedChoices] = useState<Record<string, { name: string; price: number }>>({});
    const [itemQuantity, setItemQuantity] = useState(1);
    const [orderNote, setOrderNote] = useState('');
    const [favorites, setFavorites] = useState<Record<number, boolean>>(() => {
        const map: Record<number, boolean> = {};
        if (Array.isArray(initialUserFavorites)) {
            initialUserFavorites.forEach((id) => {
                map[id] = true;
            });
        }
        return map;
    });
    const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

    const { cartItems, setCartItems, totalCartCount, totalCartPrice } = useCart();

    const toggleFavorite = async (e: React.MouseEvent, menuId: number) => {
        e.stopPropagation();
        setFavorites((prev) => ({ ...prev, [menuId]: !prev[menuId] }));

        try {
            const token = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
            await fetch(`/favorites/${menuId}/toggle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': token,
                },
            });
        } catch (err) {
            console.error('Failed to update favorite:', err);
        }
    };

    const handleOpenOptionModal = (e: React.MouseEvent, menu: MenuItem) => {
        e.stopPropagation();
        setSelectedMenuModal(menu);
        setItemQuantity(1);
        setOrderNote('');
        const initialChoices: Record<string, { name: string; price: number }> = {};
        if (menu.options && menu.options.length > 0) {
            menu.options.forEach((group) => {
                if (group.required && group.choices && group.choices.length > 0) {
                    initialChoices[group.name] = group.choices[0];
                }
            });
        }
        setSelectedChoices(initialChoices);
    };

    const calculateModalTotalPrice = () => {
        if (!selectedMenuModal) return 0;
        let base = selectedMenuModal.price;
        Object.values(selectedChoices).forEach((choice) => {
            base += choice.price || 0;
        });
        return base * itemQuantity;
    };

    const handleAddToCart = () => {
        if (!selectedMenuModal) return;
        const total = calculateModalTotalPrice();

        setCartItems((prev) => {
            const existingIndex = prev.findIndex(
                (item) =>
                    item.menu.id === selectedMenuModal.id &&
                    areChoicesEqual(item.choices, selectedChoices) &&
                    (item.note || '').trim() === orderNote.trim()
            );

            if (existingIndex > -1) {
                const updated = [...prev];
                const existing = updated[existingIndex];
                const newQty = existing.qty + itemQuantity;
                const unitPrice = total / itemQuantity;
                updated[existingIndex] = {
                    ...existing,
                    qty: newQty,
                    price: unitPrice * newQty,
                };
                return updated;
            } else {
                return [
                    ...prev,
                    {
                        menu: selectedMenuModal,
                        qty: itemQuantity,
                        price: total,
                        choices: selectedChoices,
                        note: orderNote,
                    },
                ];
            }
        });

        setSelectedMenuModal(null);
    };

    return {
        selectedMenuModal,
        setSelectedMenuModal,
        selectedChoices,
        setSelectedChoices,
        itemQuantity,
        setItemQuantity,
        orderNote,
        setOrderNote,
        favorites,
        toggleFavorite,
        handleOpenOptionModal,
        calculateModalTotalPrice,
        handleAddToCart,
        cartItems,
        setCartItems,
        totalCartCount,
        totalCartPrice,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
    };
}
