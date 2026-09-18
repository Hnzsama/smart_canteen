# Page Specification — Smart Canteen FEB

Dokumen ini mendeskripsikan seluruh halaman dalam sistem beserta komponen, layout, dan interaksi.

---

## 1. Halaman Mahasiswa

### 1.1 Tenant Detail & Category Menu Page (`/tenants/{id}`)
* **Elemen:** Header Tenant, Tab Kategori Menu (Makanan, Minuman, Snack), Card Menu (Foto, Nama, Harga, Stock Badge, Button "Tambah").
* **Aksi:** Filter per kategori, klik menu untuk modal detail, Floating Cart Bar.

### 1.2 Checkout Page (`/checkout`)
* **Elemen:** Ringkasan Pesanan, Radio Button Metode Pembayaran (**Cashless via Midtrans** vs **Cash / Tunai di Stand**), Informasi **Self-Pickup**, Button "Proses Pesanan".

### 1.3 Digital QR & Pickup Pass Page (`/orders/{id}/pickup-pass`)
* **Elemen:** Kode QR besar, Kode Pengambilan (cth: `FEB-9912`), Badge Status Pembayaran (Unpaid / Paid), Panduan Tunjukkan Kode ke Tenant.

### 1.4 Order Status Tracker Page (`/orders/{id}`)
* **Elemen:** Visual Timeline Stepper (`Menunggu Pembayaran` → `Dibayar` → `Diproses` → `Siap Diambil` → `Selesai`), Detail Item, Timestamps (`paid_at`, `ready_at`, dll).

---

## 2. Halaman Tenant

### 2.1 Cash Scanner & Code Verifier Modal/Page (`/tenant/verify-payment`)
* **Elemen:** Camera QR Code Scanner, Input Text Kode Pesanan, Card Result Pesanan Mahasiswa, Button "Konfirmasi Terima Uang Tunai".
* **Aksi:** Scan / ketik kode → Tampil detail tagihan → Klik konfirmasi → Status order otomatis berubah menjadi `Dibayar`.

### 2.2 Tenant Order Board (`/tenant/orders`)
* **Elemen:** Tab Status (`Pesanan Masuk`, `Diproses`, `Siap Diambil`), Card Pesanan dengan Badge Metode Pembayaran (Cashless / Cash).

### 2.3 Category & Menu Management (`/tenant/menus`, `/tenant/categories`)
* **Elemen:** Tabel Kategori & Menu, Action Edit, Switcher Stock Available, Button Soft Delete (Pindah ke Trash), Button Restore.

---

## 3. Halaman Admin

### 3.1 Admin Dashboard (`/admin/dashboard`)
* **Elemen:** Metric Card (Total Transaksi, Cash vs Cashless Ratio, Active Tenants), Tabel Master Data dengan indikator Soft Delete.
