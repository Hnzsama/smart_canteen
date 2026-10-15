# Rencana Implementasi & Checklist: Multi-Tenant Midtrans, Dynamic Payment Methods & Centralized Fee Governance — Smart Canteen FEB

Dokumen ini adalah **panduan eksekusi teknis (Technical Implementation Plan & Checklist)** untuk mengimplementasikan fitur **Multi-Tenant Midtrans Gateway**, di mana setiap tenant/toko memiliki ketersediaan metode pembayaran yang berbeda (Midtrans vs Cash), dengan **tata kelola tarif (Base Service Fee & Payment Gateway Fee) yang tetap dikontrol secara terpusat oleh Admin**.

---

## 📌 Prinsip & Batasan Arsitektural Utama

1. **Ketersediaan Metode Pembayaran Dinamis Per Tenant**:
   - **Toko A (Midtrans Aktif)**: Mendukung pembayaran **Cashless (QRIS, E-Wallet, VA via Midtrans)** dan **Tunai (Cash di Stand)**.
   - **Toko B (Midtrans Nonaktif/Kosong)**: Eksklusif melayani pembayaran **Tunai (Cash di Stand)**. Opsi cashless otomatis disembunyikan.
2. **Tata Kelola Tarif Terpusat (Centralized Fee Governance by Superadmin)**:
   - **Base Service Fee (`app_fee`)**: Diatur oleh Superadmin via konfigurasi global / `app_settings`.
   - **Payment Gateway Fee (`channel_fee`)**: Diatur oleh Superadmin via tabel `payment_methods` (`fee_type`, `fee_amount`).
   - **Tenant Protection**: Tenant **TIDAK MEMILIKI HAK** untuk mengubah tarif fee, mark up harga gateway, atau membebankan biaya sepihak kepada mahasiswa.
3. **Single-Tenant Cart Policy (Standar Industri ShopeeFood / GoFood)**:
   - Keranjang belanja dibatasi secara ketat hanya menampung menu dari **1 tenant per transaksi**.
   - Jika mahasiswa mencoba menambah menu dari stand yang berbeda, sistem akan memunculkan modal konfirmasi untuk mereset keranjang belanja.

---

## 🗂️ Matriks Skema Biaya (Fee Calculation Engine)

| Komponen Biaya | Field di Database (`orders`) | Pengatur Kebijakan | Deskripsi & Validasi |
| :--- | :--- | :--- | :--- |
| **Subtotal Belanja** | `subtotal_amount` | Tenant (via harga menu) | Total akumulasi harga varian & menu yang dipesan. |
| **Biaya Layanan (Base Service Fee)** | `app_fee` | **Superadmin** | Biaya platform/operasional kantin (misal: Rp 1.000 flat per order). Bersumber dari `app_settings`. |
| **Biaya Gateway (Channel Fee)** | `channel_fee` | **Superadmin** | Biaya transaksi MDR/switching gateway. Bersumber dari tabel `payment_methods`. Untuk metode **Cash**, nilai ini adalah **Rp 0**. |
| **Total Bayar** | `total_amount` | Kalkulasi Sistem | `subtotal_amount + app_fee + channel_fee`. Dihitung ulang di sisi backend untuk mencegah manipulasi client-side. |

---

## 📋 Checklist & Tahapan Implementasi (Step-by-Step)

```
[ ] Phase 1: Database & Model Layer (Fondasi Data & Keamanan Kredensial)
    [ ] 1.1 Buat Migration penambahan kolom Midtrans di tabel `tenants`
    [ ] 1.2 Update Model `Tenant.php` (casts enkripsi, fillable, helper methods)
    [ ] 1.3 Update `TenantSeeder.php` dengan variasi toko (Midtrans vs Cash-only)
    [ ] 1.4 Verifikasi tabel `payment_methods` & seeders fee admin

[ ] Phase 2: Gateway & Service Engine (Backend Core)
    [ ] 2.1 Refactor `MidtransService.php` (Dynamic SDK Configuration per Tenant)
    [ ] 2.2 Implementasi verifikasi signature dinamis per tenant
    [ ] 2.3 Refactor `MidtransCallbackController.php` (Dynamic webhook listener)

[ ] Phase 3: Tenant Portal (Dashboard Pengaturan Merchant)
    [ ] 3.1 Validasi form pengaturan Midtrans di `Tenant/SettingsController.php`
    [ ] 3.2 Buat Form UI Pengaturan Midtrans di `resources/js/pages/tenant/settings/index.tsx`
    [ ] 3.3 Validasi bahwa form tenant TIDAK BISA mengedit tarif service fee / gateway fee

[ ] Phase 4: Frontend Cart & Single-Tenant Policy
    [ ] 4.1 Refactor hook `use-cart.ts` (Enforce single tenant ID state)
    [ ] 4.2 Buat komponen Modal Konfirmasi Ganti Toko (`SwitchTenantModal.tsx`)
    [ ] 4.3 Integrasikan proteksi ganti toko pada halaman katalog menu

[ ] Phase 5: Customer Checkout & Dynamic Payment Selector
    [ ] 5.1 Refactor `Customer/CheckoutController.php` (Kalkulasi fee admin & single-order)
    [ ] 5.2 Refactor UI Halaman Checkout (`resources/js/pages/customer/checkout/index.tsx`)
    [ ] 5.3 Implementasi selector metode pembayaran dinamis (Cash vs Midtrans)
    [ ] 5.4 Penanganan Snap Token Popup vs Direct Cash Redirect

[ ] Phase 6: Pengujian End-to-End & Validasi Keamanan
    [ ] 6.1 Fresh migration & seed: `php artisan migrate:fresh --seed`
    [ ] 6.2 Uji Skenario A: Checkout di Toko Tanpa Midtrans (Cash Only, channel_fee = 0)
    [ ] 6.3 Uji Skenario B: Checkout di Toko Dengan Midtrans (Cashless & Cash, fee sesuai admin)
    [ ] 6.4 Uji Skenario C: Webhook Callback dengan Tenant Server Key
    [ ] 6.5 Uji Skenario D: Proteksi switch tenant pada keranjang belanja
```

---

## 🔍 Rincian Teknis Per Sub-Task

### 🔹 Phase 1: Database & Model Layer

#### Sub-task 1.1: Migration Tabel `tenants`
- **File**: `database/migrations/2026_10_15_000001_add_midtrans_credentials_to_tenants_table.php`
- **Spesifikasi Kolom**:
  ```php
  $table->string('midtrans_merchant_id')->nullable()->after('is_active');
  $table->string('midtrans_client_key')->nullable()->after('midtrans_merchant_id');
  $table->text('midtrans_server_key')->nullable()->after('midtrans_client_key'); // Text untuk menampung string terenkripsi
  $table->boolean('midtrans_is_production')->default(false)->after('midtrans_server_key');
  $table->boolean('midtrans_is_active')->default(true)->after('midtrans_is_production');
  ```

#### Sub-task 1.2: Update Model `Tenant.php`
- **File**: `app/Models/Tenant.php`
- **Spesifikasi Enkripsi & Helper**:
  ```php
  protected function casts(): array
  {
      return [
          'midtrans_server_key' => 'encrypted',
          'midtrans_is_production' => 'boolean',
          'midtrans_is_active' => 'boolean',
          'is_active' => 'boolean',
      ];
  }

  // Sembunyikan server key dari serialisasi Inertia/JSON
  protected $hidden = [
      'midtrans_server_key',
  ];

  // Helper kapabilitas pembayaran
  public function hasActiveMidtrans(): bool
  {
      return $this->midtrans_is_active 
          && !empty($this->midtrans_server_key) 
          && !empty($this->midtrans_client_key);
  }
  ```

#### Sub-task 1.3: Update `TenantSeeder.php`
- **File**: `database/seeders/TenantSeeder.php`
- Menyiapkan minimal:
  - **Tenant 1 (Ayam Geprek Kampus)**: `midtrans_is_active = true`, diisi kredensial sandbox.
  - **Tenant 2 (Kantin Bu Siti)**: `midtrans_is_active = false`, kredensial null (Mode Cash Only).

---

### 🔹 Phase 2: Gateway & Service Engine

#### Sub-task 2.1: Refactor `MidtransService.php`
- **File**: `app/Services/MidtransService.php`
- **Konfigurasi Dinamis**:
  ```php
  public function configureForTenant(Tenant $tenant): void
  {
      if (!$tenant->hasActiveMidtrans()) {
          throw new \InvalidArgumentException("Tenant {$tenant->name} tidak memiliki konfigurasi Midtrans yang aktif.");
      }

      \Midtrans\Config::$serverKey = $tenant->midtrans_server_key;
      \Midtrans\Config::$isProduction = $tenant->midtrans_is_production;
      \Midtrans\Config::$isSanitized = true;
      \Midtrans\Config::$is3ds = true;
  }
  ```

#### Sub-task 2.2: Refactor `MidtransCallbackController.php`
- **File**: `app/Http/Controllers/Api/MidtransCallbackController.php`
- **Signature Dinamis**:
  ```php
  $order = Order::with('tenant')->where('order_number', $orderId)->firstOrFail();
  $serverKey = $order->tenant->midtrans_server_key;
  $calculatedSignature = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);
  
  if ($signatureKey !== $calculatedSignature) {
      return response()->json(['message' => 'Invalid signature key for tenant gateway'], 403);
  }
  ```

---

### 🔹 Phase 3: Tenant Dashboard Management

#### Sub-task 3.1 & 3.2: Form Pengaturan Toko
- **Backend**: `app/Http/Controllers/Tenant/SettingsController.php`
- **Frontend**: `resources/js/pages/tenant/settings/index.tsx`
- **Ketentuan Tata Kelola**:
  - Tenant hanya dapat mengubah `midtrans_merchant_id`, `midtrans_client_key`, `midtrans_server_key`, `midtrans_is_production`, `midtrans_is_active`.
  - Field `server_key` ditampilkan masked (`••••••••••••`). Hanya diganti jika tenant menginput nilai baru.
  - Form **TIDAK MENYEDIAKAN** input untuk `app_fee` atau `gateway_fee`.
  - Dilengkapi banner petunjuk: *"Biaya layanan aplikasi dan payment gateway diatur secara terpusat oleh pengelola kantin demi standardisasi harga bagi mahasiswa."*

---

### 🔹 Phase 4: Frontend Cart & Single-Tenant Policy

#### Sub-task 4.1 & 4.2: Enforce Single Tenant Cart
- **File**: `resources/js/hooks/use-cart.ts`
- **State Structure**:
  ```ts
  interface CartState {
    tenantId: number | null;
    tenantName: string | null;
    items: CartItem[];
  }
  ```
- **Logika Tambah Menu**:
  1. Jika `cart.items.length === 0`: Set `tenantId = menu.tenant_id`, tambahkan item.
  2. Jika `cart.tenantId === menu.tenant_id`: Tambahkan item ke keranjang.
  3. Jika `cart.tenantId !== menu.tenant_id`: Tampilkan popup modal konfirmasi:
     > **"Ganti Toko?"**
     > Keranjangmu saat ini berisi menu dari **[Nama Toko A]**. Menambahkan menu dari **[Nama Toko B]** akan mengosongkan keranjang sebelumnya.
     > `[Batal]` `[Kosongkan & Ganti Toko]`

---

### 🔹 Phase 5: Customer Checkout & Dynamic Payment Selector

#### Sub-task 5.1: Refactor `CheckoutController.php`
- **File**: `app/Http/Controllers/Customer/CheckoutController.php`
- **Kalkulasi Biaya Terpusat**:
  ```php
  // 1. Ambil fee resmi dari Superadmin
  $appFee = (float) AppSetting::get('fee.service_fee', 1000); // Base platform fee
  
  // 2. Cek metode pembayaran
  if ($paymentMethod === 'cash') {
      $channelFee = 0;
  } else {
      $method = PaymentMethod::where('code', $paymentChannel)->where('is_active', true)->firstOrFail();
      $channelFee = $method->fee_type === 'percentage' 
          ? ($subtotal * $method->fee_amount / 100) 
          : $method->fee_amount;
  }

  $totalAmount = $subtotal + $appFee + $channelFee;
  ```

#### Sub-task 5.2 & 5.3: UI Checkout Dinamis
- **File**: `resources/js/pages/customer/checkout/index.tsx`
- **Kondisi Tampilan**:
  - **Jika `$tenant->has_midtrans === true`**:
    - Tab 1: **Cashless (QRIS / E-Wallet / VA)** -> Menampilkan rincian: Subtotal + Biaya Layanan + Biaya Gateway.
    - Tab 2: **Tunai (Bayar di Kasir Stand)** -> Menampilkan rincian: Subtotal + Biaya Layanan (Biaya Gateway = Rp 0).
  - **Jika `$tenant->has_midtrans === false`**:
    - Opsi Cashless dinonaktifkan / disembunyikan.
    - Muncul badge peringatan ramah: *"Stand ini hanya melayani pembayaran Tunai (Cash di Stand)."*
    - Biaya Gateway otomatis Rp 0.

---

### 🔹 Phase 6: Pengujian & Validasi

1. **Uji Validasi Biaya**:
   - Pastikan mahasiswa tidak bisa memodifikasi `app_fee` atau `channel_fee` via request payload (backend selalu menghitung ulang dari database).
2. **Uji Fallback Tunai**:
   - Buat pesanan di tenant tanpa Midtrans. Pastikan `snap_token` null, status pembayaran `unpaid`, order status `pending`.
3. **Uji Pembayaran Midtrans**:
   - Buat pesanan di tenant dengan Midtrans. Pastikan Snap popup muncul dengan kredensial toko terkait.
4. **Uji Keamanan Kredensial**:
   - Pastikan endpoint API publik / katalog tidak pernah membocorkan `midtrans_server_key`.
