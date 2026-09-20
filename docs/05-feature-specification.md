# Feature Specification — Smart Canteen FEB

Dokumen ini mendefinisikan seluruh spesifikasi fitur fungsional aplikasi Smart Canteen FEB sesuai dengan implementasi terkini.

---

## 1. Modul Mahasiswa (Customer)

### 1.1 Auth & Account Management
* **F-MHS-01 Registrasi & Login Mahasiswa:** Form autentikasi credentials mahasiswa dengan dukungan pengingat sesi (*Remember Me*) dan batas kata sandi minimal 8 karakter.
* **F-MHS-02 Quick Role Switcher Demo:** Utility switcher role instant pada header/navigasi untuk kemudahan saat presentasi demo.
* **F-MHS-03 Profil & Keamanan Akun:** Edit nama, email, foto profil (`/settings/profile`), ubah kata sandi, dan Two-Factor Authentication (2FA) (`/settings/security`).

### 1.2 Katalog & Pemesanan Makanan
* **F-MHS-04 Katalog Tenant & Filter Kategori:** Halaman utama (`/catalog`) menampilkan promo banner carousel, daftar stand kantin, dan filter kategori global (*Makanan Utama*, *Minuman*, *Camilan*).
* **F-MHS-05 Detail Stand Kantin:** Halaman profil stand (`/{tenant:slug}`) menampilkan banner header, logo, jam operasional, status buka/tutup, ulasan bintang, dan menu khusus stand.
* **F-MHS-06 Modal Detail Menu & Catatan Pesanan:** Tampilan modal hidangan berukuran besar, pengatur kuantitas porsi (`+`/`-`), dan input teks catatan khusus pesanan ke penjual.
* **F-MHS-07 Floating Cart Bar & Multi-Stand Checkout:** Bilah keranjang melayang di bawah layar saat item > 0, dan halaman checkout (`/checkout`) yang mendukung pengelompokan pesanan multi-stand.

### 1.3 Pembayaran & Tracking Status
* **F-MHS-08 Dual Payment Engine:**
  - **Cashless Digital (Midtrans Sandbox):** Integrasi Snap Pop-up dengan simulasi BCA Virtual Account ([Simulator BCA VA](https://simulator.sandbox.midtrans.com/bca/va/index)) dan QRIS ([Simulator QRIS](https://simulator.sandbox.midtrans.com/v2/qris/index)).
  - **Tunai / Cash:** Digital Pickup Pass dengan gambar Kode QR, string unik `FEB-XXXX`, dan hitung mundur timer bayar 15 menit.
* **F-MHS-09 Live Status Tracker Real-Time:** Stepper visual 5-tahap (`Menunggu Pembayaran` ➔ `Dibayar` ➔ `Diproses` ➔ `Siap Diambil` ➔ `Selesai`) dengan timestamp audit instan.
* **F-MHS-10 Rating & Ulasan Menu:** Pemberian bintang 1–5 ⭐ dan ulasan rasa/pelayanan setelah pesanan di-pickup (`/orders/{order}/rate`).
* **F-MHS-11 Riwayat Transaksi & Re-Order:** Halaman riwayat pesanan (`/orders`, `/orders/history`) lengkap dengan invoice digital dan tombol *Pesan Lagi*.

---

## 2. Modul Tenant (Pemilik Stand)

### 2.1 Dashboard & Operasional Stand
* **F-TNT-01 Tenant Metric Dashboard:** Overview pendapatan hari ini, jumlah pesanan aktif per status, rasio Cash vs Cashless, dan grafik penjualan (`/tenant/dashboard`).
* **F-TNT-02 Quick Toggle Status Stand:** Saklar instant untuk mengubah status *Buka / Tutup Stand* (`is_open`).
* **F-TNT-03 Pengaturan Profil Stand:** Mengunggah foto banner header, foto logo, nomor telepon, deskripsi, dan jam operasional (`/tenant/settings`).

### 2.2 Order Board & Verifikasi QR Tunai
* **F-TNT-04 Kitchen Order Board & Kanban:** Papan kontrol pesanan masuk (`/tenant/orders`) berbasis tab status dengan aksi update cepat (`🍳 Mulai Proses` ➔ `🔔 Siap Diambil` ➔ `✅ Tandai Selesai`).
* **F-TNT-05 Cash QR Code Scanner & Code Verifier:** Fitur kamera scan QR Code / input manual kode `FEB-XXXX` di kasir stand (`/tenant/verify-payment`) untuk memverifikasi pembayaran tunai.

### 2.3 Manajemen Kategori, Menu & Ulasan
* **F-TNT-06 Manajemen Kategori Menu:** CRUD pengelompokan menu internal stand (`/tenant/categories`).
* **F-TNT-07 Manajemen Katalog Menu (CRUD + Soft Delete):** Menambah, mengubah foto, harga, estimasi waktu penyajian, varian opsi, tag *Best Seller*, dan saklar stok instant (*Available / Out of Stock*) (`/tenant/menus`).
* **F-TNT-08 Fitur Sampah (Restore Data):** Pemulihan data menu yang tidak sengaja terhapus via fitur Soft Delete.
* **F-TNT-09 Ulasan & Rating Pembeli:** Melihat daftar ulasan bintang dan testimoni pembeli (`/tenant/ratings`).

---

## 3. Modul Admin (Administrator System)

### 3.1 Pengawasan Global & Metric
* **F-ADM-01 Admin Dashboard Supervision:** Monitoring total omset kantin FEB, jumlah stand aktif, total user, rasio metode pembayaran, dan statistik transaksi (`/admin/dashboard`).
* **F-ADM-02 Global Order Supervision:** Monitoring seluruh transaksi kantin secara global dengan filter tanggal, stand, dan status (`/admin/orders`).

### 3.2 Master Data & Settings
* **F-ADM-03 Master Data Tenant Management:** CRUD data stand tenant dilengkapi dengan Soft Delete & Restore (`/admin/tenants`).
* **F-ADM-04 Master Data User & Role Management:** CRUD pengguna, manajemen role (*Mahasiswa*, *Tenant*, *Admin*), dan Soft Delete & Restore (`/admin/users`).
* **F-ADM-05 Master Payment Settings & Fee:** Pengaturan saluran pembayaran aktif dan biaya layanan aplikasi / Admin Fee (`/admin/payment-settings`).
