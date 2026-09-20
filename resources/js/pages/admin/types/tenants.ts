export type TenantManager = {
    id: number;
    name: string;
    email: string;
};

export type AvailableUser = {
    id: number;
    name: string;
    email: string;
    role: string;
    tenant_id: number | null;
};

export type TenantItem = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
    is_trashed: boolean;
    menus_count: number;
    orders_count: number;
    managers: TenantManager[];
    deleted_at: string | null;
    created_at: string;
};

export type TenantCounts = {
    all: number;
    active: number;
    inactive: number;
    trashed: number;
};

export type TenantFilters = {
    status: string;
    search: string;
    per_page?: number;
    page?: number;
};

export type PaginationMeta = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
};

export type TenantPageProps = {
    tenants: TenantItem[];
    pagination?: PaginationMeta;
    available_users: AvailableUser[];
    filters: TenantFilters;
    counts: TenantCounts;
    error?: string;
};
