# Page Specification — Smart Canteen FEB

Dokumen ini mendeskripsikan seluruh halaman dalam sistem beserta komponen, rute Inertia React, layout, dan interaksinya.

---

## 1. Halaman Mahasiswa (Customer)

### 1.1 Halaman Katalog Kantin (`/catalog` atau `/`)
* **Rute / Component:** `resources/js/pages/catalog.tsx` (atau `catalog/index.tsx`)
* **Elemen:** Promo Banner Carousel, Live Search Bar, Chips Filter Kategori Global (*Makanan Utama*, *Minuman*, *Camilan*), Kartu Stand Kantin (Rating, Status Buka/Tutup), Grid Kartu Menu Hidangan, Floating Cart Bar.
* **Aksi:** Ketik pencarian, filter kategori, klik stand untuk detail, klik menu untuk modal detail, klik checkout.

### 1.2 Halaman Detail Stand Tenant (`/{tenant:slug}`)
* **Rute / Component:** `resources/js/pages/tenant-detail.tsx`
* **Elemen:** Header Banner Cover Stand, Foto Logo, Nama Stand, Jam Operasional, Rating Bintang & Total Ulasan, Chips Kategori Internal Stand, Grid Menu Stand.

### 1.3 Halaman Checkout (`/checkout`)
* **Rute / Component:** `resources/js/pages/checkout/index.tsx`
* **Elemen:** Rincian Item per Stand, Edit Jumlah / Hapus Item, Input Catatan Khusus, Ringkasan Pembayaran (Subtotal, Biaya Admin, Total Tagihan), Radio Button Metode Pembayaran (Cashless Midtrans vs Cash Tunai), Opsi Santap (*Dine In* / *Takeaway*), Tombol "Buat Pesanan".

### 1.4 Halaman Pembayaran & Digital Pickup Pass (`/orders/{order}/payment`)
* **Rute / Component:** `resources/js/pages/orders/payment.tsx` & `resources/js/pages/orders/show.tsx`
* **Elemen:**
  - **Cashless:** Tombol Buka Pop-up Midtrans Snap + Petunjuk Link Simulator BCA VA / QRIS.
  - **Tunai:** Pass Pengambilan Digital (Gambar QR Code besar, Kode Pengambilan `FEB-XXXX`, Hitung Mundur 15 Menit).

### 1.5 Halaman Live Order Tracker (`/orders/{order}`)
* **Rute / Component:** `resources/js/pages/orders/show.tsx`
* **Elemen:** Visual Timeline Stepper 5-Tahap (`Menunggu Pembayaran` ➔ `Dibayar` ➔ `Diproses` ➔ `Siap Diambil` ➔ `Selesai`), Notifikasi Berkedip (*Pulsing Green*) saat Siap Di-pickup, Detail Item Pesanan, Audit Timestamps (`paid_at`, `processing_at`, `ready_at`, `completed_at`).

### 1.6 Halaman Riwayat Pesanan (`/orders` & `/orders/history`)
* **Rute / Component:** `resources/js/pages/orders/index.tsx` & `orders/history.tsx`
* **Elemen:** Tab *Pesanan Aktif* vs *Riwayat Selesai*, Kartu Transaksi, Invoice Digital, Tombol *Beri Ulasan*, Tombol *Pesan Lagi*.

### 1.7 Halaman Pengaturan Akun (`/settings/*`)
* **Rute / Component:** `resources/js/pages/settings/profile.tsx`, `security.tsx`, `appearance.tsx`
* **Elemen:** Form Edit Profil & Foto Avatar, Form Ubah Password, Panel Two-Factor Authentication (2FA), Saklar Mode Gelap / Mode Terang.

---

## 2. Halaman Tenant (Pemilik Stand)

### 2.1 Tenant Dashboard (`/tenant/dashboard`)
* **Rute / Component:** `resources/js/pages/tenant/dashboard.tsx`
* **Elemen:** Metric Card (Omset Hari Ini, Pesanan Masuk, Rasio Bayar), Quick Saklar *Status Buka/Tutup Stand*, Grafik Penjualan, Tabel Preview Pesanan Terbaru.

### 2.2 Kelola Pesanan & Kitchen Kanban Board (`/tenant/orders`)
* **Rute / Component:** `resources/js/pages/tenant/orders.tsx`
* **Elemen:** Tab Status Pesanan (*Masuk*, *Diproses*, *Siap Diambil*), Papan Kanban Dapur, Tombol Aksi Cepat (`🍳 Mulai Proses`, `🔔 Siap Diambil`, `✅ Tandai Selesai`), Detail Item & Catatan Pembeli.

### 2.3 Cash QR Code Scanner & Verifier (`/tenant/verify-payment`)
* **Rute / Component:** `resources/js/pages/tenant/verify-payment.tsx`
* **Elemen:** Pemindai Kamera QR Code, Kolom Input Teks Kode `FEB-XXXX`, Kartu Ringkasan Tagihan Pembeli, Tombol "💵 Konfirmasi Pembayaran Tunai".

### 2.4 Manajemen Kategori & Menu (`/tenant/menus`, `/tenant/categories`)
* **Rute / Component:** `resources/js/pages/tenant/menus.tsx`, `menus/create.tsx`, `menus/edit.tsx`, `categories.tsx`
* **Elemen:** Tabel Data Kategori & Menu, Form Tambah/Edit Menu (Foto, Nama, Harga, Varian, Tag Best Seller, Estimasi Waktu), Saklar Stok Instant (*Available/Out of Stock*), Action Soft Delete & Restore dari Sampah.

### 2.5 Halaman Ulasan & Pengaturan Stand (`/tenant/ratings`, `/tenant/settings`)
* **Rute / Component:** `resources/js/pages/tenant/ratings.tsx`, `settings.tsx`
* **Elemen:** Daftar Ulasan Bintang & Komentar Pembeli, Form Edit Profile Stand (Banner Cover, Logo, Telepon, Jam Operasional).

---

## 3. Halaman Admin (Administrator System)

### 3.1 Admin Metric Dashboard (`/admin/dashboard`)
* **Rute / Component:** `resources/js/pages/admin/dashboard.tsx`
* **Elemen:** Metric Cards (Total Omset Kantin, Volume Transaksi, Stand Aktif, Total User), Grafik Penjualan Harian, Combobox Filter Tenant.

### 3.2 Master Data Stand Tenant (`/admin/tenants`)
* **Rute / Component:** `resources/js/pages/admin/tenants.tsx`
* **Elemen:** Data Table Stand Tenant, Modal Tambah/Edit Stand, Dialog Non-aktifkan Stand, Soft Delete & Restore.

### 3.3 Master Data Pengguna & Role (`/admin/users`)
* **Rute / Component:** `resources/js/pages/admin/users.tsx`
* **Elemen:** Data Table User, Modal Tambah User, Dialog Ubah Role (*Mahasiswa*, *Tenant*, *Admin*), Soft Delete & Restore.

### 3.4 Monitoring Pesanan Global (`/admin/orders`)
* **Rute / Component:** `resources/js/pages/admin/orders.tsx`
* **Elemen:** Data Table Transaksi Global Kantin, Filter Tanggal & Stand, Dialog Detail Invoice.

### 3.5 Pengaturan Pembayaran & Biaya (`/admin/payment-settings`)
* **Rute / Component:** `resources/js/pages/admin/payment-settings/index.tsx`
* **Elemen:** Form Kunci Midtrans Gateway, Daftar Saluran Pembayaran Aktif, Input Biaya Layanan Aplikasi (Admin Fee).
