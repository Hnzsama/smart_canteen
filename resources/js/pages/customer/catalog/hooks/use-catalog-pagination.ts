import { useState, useEffect, useRef } from 'react';

interface UseCatalogPaginationProps {
    isFiltering: boolean;
    totalSearchedMenus: number;
    totalTenants: number;
    searchQuery: string;
    selectedGlobalCategory: string;
    selectedCategoryId: string;
}

export function useCatalogPagination({
    isFiltering,
    totalSearchedMenus,
    totalTenants,
    searchQuery,
    selectedGlobalCategory,
    selectedCategoryId,
}: UseCatalogPaginationProps) {
    const [visibleTenantsCount, setVisibleTenantsCount] = useState(5);
    const [visibleSearchedMenusCount, setVisibleSearchedMenusCount] = useState(5);
    const [visibleTimeMenusCount, setVisibleTimeMenusCount] = useState(5);
    const [visibleHitsMenusCount, setVisibleHitsMenusCount] = useState(5);
    const [visibleBudgetMenusCount, setVisibleBudgetMenusCount] = useState(5);

    const [isLoadingTenants, setIsLoadingTenants] = useState(false);
    const [isLoadingSearchedMenus, setIsLoadingSearchedMenus] = useState(false);

    const tenantScrollTimerRef = useRef<NodeJS.Timeout | null>(null);
    const searchMenuScrollTimerRef = useRef<NodeJS.Timeout | null>(null);
    const timeCarouselTimerRef = useRef<NodeJS.Timeout | null>(null);
    const hitsCarouselTimerRef = useRef<NodeJS.Timeout | null>(null);
    const budgetCarouselTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Reset searched menus visible count when search/filters change
    useEffect(() => {
        setVisibleSearchedMenusCount(5);
    }, [searchQuery, selectedGlobalCategory, selectedCategoryId]);

    // Debounced window scroll listener for vertical infinite scroll
    useEffect(() => {
        const handleWindowScroll = () => {
            const scrollBottom = window.innerHeight + window.scrollY;
            const targetThreshold = document.documentElement.scrollHeight - 300;

            if (scrollBottom >= targetThreshold) {
                if (isFiltering) {
                    if (visibleSearchedMenusCount < totalSearchedMenus && !searchMenuScrollTimerRef.current) {
                        setIsLoadingSearchedMenus(true);
                        searchMenuScrollTimerRef.current = setTimeout(() => {
                            setVisibleSearchedMenusCount((prev) => Math.min(prev + 5, totalSearchedMenus));
                            setIsLoadingSearchedMenus(false);
                            searchMenuScrollTimerRef.current = null;
                        }, 250);
                    }
                } else {
                    if (visibleTenantsCount < totalTenants && !tenantScrollTimerRef.current) {
                        setIsLoadingTenants(true);
                        tenantScrollTimerRef.current = setTimeout(() => {
                            setVisibleTenantsCount((prev) => Math.min(prev + 5, totalTenants));
                            setIsLoadingTenants(false);
                            tenantScrollTimerRef.current = null;
                        }, 250);
                    }
                }
            }
        };

        window.addEventListener('scroll', handleWindowScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleWindowScroll);
            if (tenantScrollTimerRef.current) clearTimeout(tenantScrollTimerRef.current);
            if (searchMenuScrollTimerRef.current) clearTimeout(searchMenuScrollTimerRef.current);
        };
    }, [
        visibleTenantsCount,
        totalTenants,
        visibleSearchedMenusCount,
        totalSearchedMenus,
        isFiltering,
    ]);

    const handleCarouselScroll = (
        e: React.UIEvent<HTMLDivElement>,
        visibleCount: number,
        totalCount: number,
        setVisibleCount: React.Dispatch<React.SetStateAction<number>>,
        timerRef: React.MutableRefObject<NodeJS.Timeout | null>
    ) => {
        const target = e.currentTarget;
        const isNearEnd = target.scrollLeft + target.clientWidth >= target.scrollWidth - 50;

        if (isNearEnd && visibleCount < totalCount && !timerRef.current) {
            timerRef.current = setTimeout(() => {
                setVisibleCount((prev) => Math.min(prev + 5, totalCount));
                timerRef.current = null;
            }, 250);
        }
    };

    return {
        visibleTenantsCount,
        visibleSearchedMenusCount,
        visibleTimeMenusCount,
        visibleHitsMenusCount,
        visibleBudgetMenusCount,
        setVisibleTimeMenusCount,
        setVisibleHitsMenusCount,
        setVisibleBudgetMenusCount,
        isLoadingTenants,
        isLoadingSearchedMenus,
        timeCarouselTimerRef,
        hitsCarouselTimerRef,
        budgetCarouselTimerRef,
        handleCarouselScroll,
    };
}
