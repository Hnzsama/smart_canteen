import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import { GlobalCategoryKey } from '../components/global-category-chips';

interface CatalogFiltersInitial {
    search?: string;
    tenant_id?: string;
    category_id?: string;
    global_category?: string;
}

export function useCatalogFilters(initialFilters: CatalogFiltersInitial = {}) {
    const [searchQuery, setSearchQuery] = useState(initialFilters.search || '');
    const [selectedGlobalCategory, setSelectedGlobalCategory] = useState<GlobalCategoryKey>(
        (initialFilters.global_category as GlobalCategoryKey) || 'all'
    );
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
        initialFilters.category_id || 'all'
    );
    const [isSearchingServer, setIsSearchingServer] = useState(false);

    const serverSearchTimerRef = useRef<NodeJS.Timeout | null>(null);
    const isInitialMountRef = useRef(true);

    useEffect(() => {
        if (isInitialMountRef.current) {
            isInitialMountRef.current = false;
            return;
        }

        setIsSearchingServer(true);

        if (serverSearchTimerRef.current) {
            clearTimeout(serverSearchTimerRef.current);
        }

        serverSearchTimerRef.current = setTimeout(() => {
            const queryParams: Record<string, string> = {};
            if (searchQuery.trim()) {
                queryParams.search = searchQuery.trim();
            }
            if (selectedGlobalCategory !== 'all') {
                queryParams.global_category = selectedGlobalCategory;
            }
            if (selectedCategoryId !== 'all') {
                queryParams.category_id = selectedCategoryId;
            }

            router.get('/', queryParams, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['menus', 'filters'],
                onFinish: () => {
                    setIsSearchingServer(false);
                },
            });
        }, 350);

        return () => {
            if (serverSearchTimerRef.current) {
                clearTimeout(serverSearchTimerRef.current);
            }
        };
    }, [searchQuery, selectedGlobalCategory, selectedCategoryId]);

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedGlobalCategory('all');
        setSelectedCategoryId('all');
    };

    const isFiltering =
        Boolean(searchQuery.trim()) ||
        selectedGlobalCategory !== 'all' ||
        selectedCategoryId !== 'all';

    return {
        searchQuery,
        setSearchQuery,
        selectedGlobalCategory,
        setSelectedGlobalCategory,
        selectedCategoryId,
        setSelectedCategoryId,
        isSearchingServer,
        isFiltering,
        resetFilters,
    };
}
