export type DashboardMetricData = {
    total_revenue: number;
    total_orders: number;
    paid_orders: number;
    cashless_orders: number;
    cash_orders: number;
    cashless_revenue: number;
    cash_revenue: number;
    cashless_percentage: number;
    cash_percentage: number;
    active_tenants: number;
    total_tenants: number;
    total_students: number;
    total_tenant_users: number;
    status_counts: {
        pending: number;
        processing: number;
        ready: number;
        completed: number;
        failed: number;
    };
};

export type DashboardRecentOrder = {
    id: number;
    order_number: string;
    pickup_code: string;
    customer_name: string;
    tenant_name: string;
    total_amount: number;
    payment_method: string;
    payment_method_label: string;
    payment_status: string;
    payment_status_label: string;
    status: string;
    status_label: string;
    created_at: string;
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

export type TenantOption = {
    id: number;
    name: string;
    slug: string;
    is_active: boolean;
};

export type DashboardProps = {
    metrics: DashboardMetricData;
    recentOrders: DashboardRecentOrder[];
    revenueTrend: RevenueTrendItem[];
    paymentDistribution: PaymentDistributionItem[];
    tenants: TenantOption[];
    selectedTenantId: number | null;
};
