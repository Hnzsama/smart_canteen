import { useState } from 'react';
import { useCart, addToCart } from '@/hooks/use-cart';
import { MenuItem } from '../types';

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

    // Single-tenant cart boundary modal state
    const [switchTenantData, setSwitchTenantData] = useState<{
        isOpen: boolean;
        currentTenantName: string;
        newTenantName: string;
        pendingItem?: {
            menu: MenuItem;
            qty: number;
            price: number;
            choices: Record<string, { name: string; price: number }>;
            note: string;
        };
    }>({
        isOpen: false,
        currentTenantName: '',
        newTenantName: '',
    });

    const { cartItems, setCartItems, totalCartCount, totalCartPrice, cartTenantId, cartTenantName, clearCart } = useCart();

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

        const result = addToCart(
            selectedMenuModal,
            itemQuantity,
            total,
            selectedChoices,
            orderNote,
            false
        );

        if (result.requiresConfirmation) {
            setSwitchTenantData({
                isOpen: true,
                currentTenantName: result.currentTenantName || 'Stand Sebelumnya',
                newTenantName: result.newTenantName || 'Stand Baru',
                pendingItem: {
                    menu: selectedMenuModal,
                    qty: itemQuantity,
                    price: total,
                    choices: selectedChoices,
                    note: orderNote,
                },
            });
            return;
        }

        setSelectedMenuModal(null);
    };

    const confirmSwitchTenant = () => {
        if (switchTenantData.pendingItem) {
            const { menu, qty, price, choices, note } = switchTenantData.pendingItem;
            addToCart(menu, qty, price, choices, note, true);
        }
        setSwitchTenantData({
            isOpen: false,
            currentTenantName: '',
            newTenantName: '',
            pendingItem: undefined,
        });
        setSelectedMenuModal(null);
    };

    const cancelSwitchTenant = () => {
        setSwitchTenantData({
            isOpen: false,
            currentTenantName: '',
            newTenantName: '',
            pendingItem: undefined,
        });
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
        clearCart,
        cartTenantId,
        cartTenantName,
        totalCartCount,
        totalCartPrice,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        switchTenantData,
        confirmSwitchTenant,
        cancelSwitchTenant,
    };
}
