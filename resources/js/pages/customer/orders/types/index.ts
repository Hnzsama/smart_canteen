export type OrderItem = {
    id: number;
    name: string;
    menu_name?: string;
    qty: number;
    quantity?: number;
    price: number;
    subtotal?: number;
    image?: string;
    choices?: string[];
    options?: Record<string, { name: string; price?: number }> | string[];
    note?: string;
};

export type PaymentDetails = {
    type?: 'qris' | 'bank_transfer' | 'cash';
    channel_code?: string;
    channel_name?: string;
    va_number?: string;
    qr_url?: string;
    instructions?: string[];
};

export type ActiveOrder = {
    id: number;
    order_number: string;
    pickup_code: string;
    tenant_name: string;
    tenant_slug: string;
    tenant_location: string;
    created_at: string;
    status: string;
    status_label: string;
    payment_status: string;
    payment_method: string;
    payment_method_label?: string;
    subtotal_amount: number;
    app_fee: number;
    channel_fee: number;
    total_amount: number;
    estimated_time: string;
    items: OrderItem[];
};

export type HistoryOrder = {
    id: number;
    order_number: string;
    pickup_code: string;
    tenant_name: string;
    tenant_slug: string;
    tenant_location: string;
    date: string;
    status: string;
    status_label: string;
    total_amount: number;
    payment_method: string;
    items: OrderItem[];
    rating_given?: number | null;
};

export type OrderDetail = {
    id: number;
    order_number: string;
    pickup_code: string;
    tenant_name: string;
    tenant_slug: string;
    tenant_location: string;
    created_at: string;
    status: string;
    status_label: string;
    payment_status: string;
    payment_status_label: string;
    payment_method: string;
    payment_method_label: string;
    payment_channel_code?: string;
    dining_option: string;
    subtotal_amount: number;
    app_fee: number;
    channel_fee: number;
    total_amount: number;
    estimated_time: string;
    notes?: string;
    qr_md5?: string;
    items: OrderItem[];
};

export type PaymentOrderData = {
    id: number;
    order_number: string;
    pickup_code: string;
    status: string;
    payment_status: string;
    payment_method: string;
    payment_channel_code?: string;
    dining_option: string;
    subtotal_amount: number;
    app_fee: number;
    channel_fee: number;
    total_amount: number;
    created_at: string;
    expires_at?: string | null;
    is_expired?: boolean;
    notes?: string;
    payment_details?: PaymentDetails;
    tenant: {
        id: number;
        name: string;
    };
    items: OrderItem[];
};

export type SuccessOrderData = {
    id: number;
    order_number: string;
    pickup_code: string;
    customer_name: string;
    customer_email: string;
    tenant_name: string;
    tenant_slug: string;
    tenant_location: string;
    created_at: string;
    paid_at: string;
    status: string;
    status_label: string;
    payment_status: string;
    payment_status_label: string;
    payment_method: string;
    payment_method_label: string;
    dining_option: string;
    subtotal_amount: number;
    app_fee: number;
    channel_fee: number;
    total_amount: number;
    notes?: string;
    qr_md5?: string;
    items: OrderItem[];
};

export type OrdersIndexProps = {
    activeOrders?: ActiveOrder[];
};

export type OrdersHistoryProps = {
    orderHistory?: HistoryOrder[];
};

export type OrderShowProps = {
    order: OrderDetail;
};

export type OrderPaymentProps = {
    order: PaymentOrderData;
};

export type OrderSuccessProps = {
    order: SuccessOrderData;
};
