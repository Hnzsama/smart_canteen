import type { PaginationMeta } from './tenants';

export type UserItem = {
    id: number;
    name: string;
    email: string;
    role: string;
    role_label: string;
    tenant_id: number | null;
    tenant_name: string | null;
    is_verified: boolean;
    email_verified_at: string | null;
    orders_count: number;
    is_trashed: boolean;
    deleted_at: string | null;
    created_at: string;
};

export type UserTenantOption = {
    id: number;
    name: string;
};

export type UserCounts = {
    all: number;
    admin: number;
    tenant: number;
    mahasiswa: number;
    trashed: number;
};

export type UserFilters = {
    role: string;
    search: string;
    per_page?: number;
    page?: number;
};

export type UserPageProps = {
    users: UserItem[];
    pagination?: PaginationMeta;
    tenants: UserTenantOption[];
    filters: UserFilters;
    counts: UserCounts;
    currentUserId: number;
    error?: string;
};
