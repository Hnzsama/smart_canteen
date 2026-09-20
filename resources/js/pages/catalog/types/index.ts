export type TenantItem = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    banner_image: string | null;
    logo_image: string | null;
    phone: string | null;
    opening_hours: string | null;
    is_open: boolean;
    rating: number;
    reviews_count: number;
    orders_count?: number;
};

export type CategoryItem = {
    id: number;
    tenant_id: number;
    name: string;
    slug: string;
};

export type MenuItem = {
    id: number;
    tenant_id: number;
    tenant_name: string;
    tenant_slug: string;
    tenant_logo: string;
    is_tenant_open: boolean;
    category_id: number | null;
    category_name: string;
    global_category?: string;
    name: string;
    description: string | null;
    price: number;
    original_price: number | null;
    image: string | null;
    is_recommended: boolean;
    estimated_time: number;
    options: Array<{
        name: string;
        type?: string;
        required?: boolean;
        choices: Array<{ name: string; price: number }>;
    }>;
};

export type CatalogProps = {
    tenants?: TenantItem[];
    categories?: CategoryItem[];
    menus?: MenuItem[];
    activeTenant?: TenantItem | null;
    filters?: {
        search?: string;
        tenant_id?: string;
        category_id?: string;
        global_category?: string;
    };
};

export type TimeMode = 'pagi' | 'siang' | 'sore' | 'malam';

export type CartItem = {
    menu: MenuItem;
    qty: number;
    price: number;
    choices: Record<string, { name: string; price: number }>;
    note: string;
};
