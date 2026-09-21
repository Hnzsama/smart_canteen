export type { CartItem } from '@/pages/customer/catalog/types';

export type PaymentMethodItem = {
    id: number;
    code: string;
    name: string;
    category: 'bank_transfer' | 'ewallet';
    fee_type: 'fixed' | 'percentage';
    fee_amount: number | string;
    is_active: boolean;
};

export type CheckoutProps = {
    bankTransferMethods?: PaymentMethodItem[];
    eWalletMethods?: PaymentMethodItem[];
    appFee?: number;
};

export type PaymentInfoState = {
    type: 'qris' | 'bank_transfer' | 'cash';
    channel_code: string;
    channel_name: string;
    va_number?: string;
    biller_code?: string;
    bill_key?: string;
    qr_url?: string;
    qr_string?: string;
    instructions?: string[];
};

