export type TenantDashboardMetricData = {
    pending_orders: number;
    processing_orders: number;
    ready_orders: number;
    completed_today: number;
    today_revenue: number;
    active_menu_count: number;
    total_menu_count: number;
    is_stand_active: boolean;
    cashless_orders?: number;
    cash_orders?: number;
    cashless_revenue?: number;
    cash_revenue?: number;
    cashless_percentage?: number;
    cash_percentage?: number;
};

export type RevenueTrendItem = {
    date: string;
    cashless: number;
    cash: number;
    total: number;
    orders_count: number;
};

export type PaymentDistributionItem = {
    method: string;
    label: string;
    count: number;
    amount: number;
    fill: string;
};

export type TopSellingMenuItem = {
    name: string;
    category?: string;
    total_sold: number;
    revenue: number;
};

export type TenantOrderItemDetail = {
    id: number;
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
    notes?: string;
};

export type TenantOrderDetailItem = {
    id: number;
    order_number: string;
    pickup_code: string;
    customer_name: string;
    customer_phone?: string;
    customer_email?: string;
    total_amount: number;
    payment_method: 'cash' | 'cashless' | string;
    payment_method_label: string;
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | string;
    payment_status_label: string;
    status: 'pending' | 'processing' | 'ready' | 'completed' | 'failed';
    status_label: string;
    items_count?: number;
    items_summary?: string;
    items?: TenantOrderItemDetail[];
    created_at: string;
    notes?: string;
};

export type MenuOptionChoice = {
    name: string;
    price: number;
};

export type MenuOptionGroup = {
    name: string;
    type: 'radio' | 'checkbox' | string;
    required: boolean;
    choices: MenuOptionChoice[];
};

export type TenantMenuItem = {
    id: number;
    tenant_id: number;
    category_id: number | null;
    category_name: string;
    name: string;
    description: string | null;
    price: number;
    formatted_price: string;
    original_price?: number | null;
    formatted_original_price?: string | null;
    image: string | null;
    is_available: boolean;
    is_recommended?: boolean;
    estimated_time?: number;
    options?: MenuOptionGroup[] | null;
    is_trashed: boolean;
    created_at: string;
};

export type TenantDashboardOrder = TenantOrderDetailItem;

export type TenantDashboardProps = {
    tenant?: {
        id: number;
        name: string;
        slug: string;
        is_active: boolean;
        category?: string;
    };
    metrics?: TenantDashboardMetricData;
    revenueTrend?: RevenueTrendItem[];
    paymentDistribution?: PaymentDistributionItem[];
    topSellingMenus?: TopSellingMenuItem[];
    orders?: TenantDashboardOrder[];
};
