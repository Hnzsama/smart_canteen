export type CategoryItem = {
    id: number;
    tenant_id: number;
    tenant_name: string;
    name: string;
    slug: string;
    menus_count: number;
    created_at: string;
    updated_at: string;
};

export type CategoryTenantOption = {
    id: number;
    name: string;
    slug: string;
    is_active: boolean;
};

export type CategoryFilters = {
    search?: string;
    tenant_id?: number | null;
    per_page?: number;
    page?: number;
};

export type CategoryCounts = {
    total: number;
    total_tenants: number;
    total_menus: number;
};

export type CategoryPageProps = {
    categories: CategoryItem[];
    pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
    };
    tenants: CategoryTenantOption[];
    filters: CategoryFilters;
    counts: CategoryCounts;
    error?: string;
};
