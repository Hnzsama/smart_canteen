# Payment Flow & Midtrans Sandbox Integration — Smart Canteen FEB

## 1. Midtrans Sandbox Integration Overview

Sesuai dengan section 4.8 pada [01-scope.md](file:///home/darbi/Projects/smart_canteen/docs/01-scope.md), fitur pembayaran pada Smart Canteen FEB menggunakan **Midtrans Sandbox (Mode Testing)** untuk mendemonstrasikan alur pembayaran nyata secara langsung.

```mermaid
sequenceDiagram
    autonumber
    actor M as Mahasiswa
    participant APP as Smart Canteen App
    participant MID as Midtrans Sandbox API
    participant MIDSIM as Midtrans Payment Simulator
    actor T as Tenant

    M->>APP: Klik "Bayar Sekarang" di Checkout
    APP->>MID: Request Snap Token (Order ID, Amount, Customer Info)
    MID-->>APP: Return Snap Token
    APP-->>M: Tampilkan Midtrans Snap Pop-up / Modal
    M->>MIDSIM: Memilih Metode (Bank Transfer / QRIS / GoPay / ShopeePay)
    M->>MIDSIM: Lakukan Pembayaran di Simulator Sandbox
    MIDSIM->>MID: Process Payment Status
    MID->>APP: Webhook HTTP Notification / Callback (HTTP POST)
    APP->>APP: Verifikasi Signature Key & Order ID
    APP->>APP: Update Status Pesanan -> "Dibayar" (Status: paid)
    APP-->>T: Tampilkan Pesanan di Dashboard Tenant
    APP-->>M: Redirect ke Halaman Detail Pesanan (Status: Dibayar)
```

---

## 2. Alur Status Pembayaran (Payment State Machine)

Diagram transisi status transaksi Midtrans Sandbox disajikan dalam Mermaid flowchart berikut:

```mermaid
flowchart TD
    A[Order Created: Pending / Unpaid] --> B[Generate Midtrans Snap Token]
    B --> C[Tampilkan Midtrans Snap Popup]
    C --> D{Pilihan di Midtrans Sandbox}
    D -- Payment Settled / Captured --> E[Order Status: Dibayar / paid]
    D -- Denied / Expired / Cancelled --> F[Order Status: Pembayaran Gagal / failed]
    D -- Pending Payment --> A
    E --> G[Tenant Memproses Pesanan]
```

---

## 3. Konfigurasi Midtrans Sandbox (Environment Variables)

File `.env` aplikasi dikonfigurasi menggunakan kredensial Sandbox Midtrans:

```env
MIDTRANS_SERVER_KEY=SB-Mid-server-YOUR_SANDBOX_SERVER_KEY
MIDTRANS_CLIENT_KEY=SB-Mid-client-YOUR_SANDBOX_CLIENT_KEY
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_IS_SANITIZED=true
MIDTRANS_IS_3DS=true
```

---

## 4. Webhook Notification & Verifikasi HTTP Callback

Handler endpoint (`/api/midtrans/notification`):
1. Menerima payload JSON dari Midtrans Sandbox (`order_id`, `transaction_status`, `fraud_status`, `gross_amount`, `signature_key`).
2. Melakukan verifikasi `signature_key`:
   $$\text{SHA512}(\text{order\_id} + \text{status\_code} + \text{gross\_amount} + \text{ServerKey})$$
3. Jika valid:
   - Status `settlement` / `capture` $\rightarrow$ set `orders.status = 'paid'`, `orders.payment_status = 'paid'`.
   - Status `deny` / `cancel` / `expire` $\rightarrow$ set `orders.status = 'failed'`, `orders.payment_status = 'failed'`.
