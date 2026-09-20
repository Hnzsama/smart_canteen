export type OrderItemDetail = {
    id: number;
    menu_name: string;
    price: number;
    quantity: number;
    subtotal: number;
};

export type OrderItem = {
    id: number;
    order_number: string;
    pickup_code: string;
    customer_name: string;
    customer_email: string;
    tenant_id: number;
    tenant_name: string;
    total_amount: number;
    payment_method: string;
    payment_method_label: string;
    payment_status: string;
    payment_status_label: string;
    status: string;
    status_label: string;
    paid_at: string | null;
    processing_at: string | null;
    ready_at: string | null;
    completed_at: string | null;
    created_at: string;
    items: OrderItemDetail[];
};

export type OrderTenantOption = {
    id: number;
    name: string;
};

export type OrderSummary = {
    total_orders: number;
    total_revenue: number;
    cashless_revenue: number;
    cash_revenue: number;
};

export type OrderFilters = {
    search: string;
    tenant_id: string;
    status: string;
    payment_status: string;
    payment_method: string;
    date: string;
};

export type PaginatedOrders = {
    data: OrderItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
};

export type OrderPageProps = {
    orders: PaginatedOrders;
    summary: OrderSummary;
    tenants: OrderTenantOption[];
    filters: OrderFilters;
    error?: string;
};
