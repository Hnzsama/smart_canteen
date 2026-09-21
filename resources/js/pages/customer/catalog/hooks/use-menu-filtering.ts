import { useMemo } from 'react';
import { GlobalCategoryKey } from '../components/global-category-chips';
import { MenuItem, TimeMode } from '../types';
import { matchGlobalCategory } from '../utils/catalog-utils';

interface UseMenuFilteringProps {
    menus: MenuItem[];
    timeMode: TimeMode;
    searchQuery: string;
    selectedGlobalCategory: GlobalCategoryKey;
    selectedCategoryId: string;
}

export function useMenuFiltering({
    menus,
    timeMode,
    searchQuery,
    selectedGlobalCategory,
    selectedCategoryId,
}: UseMenuFilteringProps) {
    const searchedMenus = useMemo(() => {
        if (!searchQuery.trim() && selectedGlobalCategory === 'all' && selectedCategoryId === 'all') {
            return menus;
        }

        return menus.filter((menu) => {
            const matchesSearch =
                !searchQuery.trim() ||
                menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (menu.description && menu.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                menu.tenant_name.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesGlobalCategory = matchGlobalCategory(menu, selectedGlobalCategory);

            const matchesCategory =
                selectedCategoryId === 'all' ||
                (selectedCategoryId === 'recommended' && menu.is_recommended) ||
                String(menu.category_id) === selectedCategoryId;

            return matchesSearch && matchesGlobalCategory && matchesCategory;
        });
    }, [menus, searchQuery, selectedGlobalCategory, selectedCategoryId]);

    const timeRecommendedMenus = useMemo(() => {
        if (timeMode === 'pagi') {
            return menus.filter(
                (m) =>
                    m.category_name.toLowerCase().includes('sarapan') ||
                    m.name.toLowerCase().includes('nasi') ||
                    m.name.toLowerCase().includes('bubur') ||
                    m.name.toLowerCase().includes('kopi') ||
                    m.is_recommended
            );
        } else if (timeMode === 'siang') {
            return menus.filter(
                (m) =>
                    m.name.toLowerCase().includes('geprek') ||
                    m.name.toLowerCase().includes('nasi') ||
                    m.name.toLowerCase().includes('ayam') ||
                    m.name.toLowerCase().includes('mie') ||
                    m.is_recommended
            );
        } else if (timeMode === 'sore') {
            return menus.filter(
                (m) =>
                    m.name.toLowerCase().includes('es') ||
                    m.name.toLowerCase().includes('jus') ||
                    m.name.toLowerCase().includes('teh') ||
                    m.name.toLowerCase().includes('cemilan') ||
                    m.name.toLowerCase().includes('gorengan')
            );
        } else {
            return menus.filter(
                (m) =>
                    m.name.toLowerCase().includes('kopi') ||
                    m.name.toLowerCase().includes('roti') ||
                    m.name.toLowerCase().includes('snack') ||
                    m.is_recommended
            );
        }
    }, [menus, timeMode]);

    const hitsMenus = useMemo(() => menus.filter((m) => m.is_recommended), [menus]);
    const budgetMenus = useMemo(() => menus.filter((m) => m.price <= 15000), [menus]);

    return {
        searchedMenus,
        timeRecommendedMenus,
        hitsMenus,
        budgetMenus,
    };
}
