# Feature Specification — Smart Canteen FEB

## 1. Modul Mahasiswa

### 1.1 Auth & Account
* **F-MHS-01 Login Mahasiswa:** Form login menggunakan email/password sederhana.
* **F-MHS-02 Quick Switch Role (Demo Utility):** Tombol pembantu demo (jika ada) untuk berpindah role dengan cepat antar Mahasiswa, Tenant, dan Admin.

### 1.2 Katalog & Pemesanan
* **F-MHS-03 Katalog Tenant:** Menampilkan card tenant kantin FEB dengan nama, foto/logo, dan deskripsi ringkas.
* **F-MHS-04 Katalog Menu Tenant:** Menampilkan list menu per tenant yang dapat difilter berdasarkan ketersediaan.
* **F-MHS-05 Detail Menu:** Pop-up / modal / halaman detail yang menampilkan nama, foto, harga, deskripsi, dan tombol kuantitas.
* **F-MHS-06 Cart Management:** Mengelola penyimpanan temporary item (penambahan kuantitas, pengurangan, hapus item, penghitungan total).

### 1.3 Checkout & Status
* **F-MHS-07 Checkout Form:** Menampilkan ringkasan pesanan, metode **Self-Pickup** (konfirmasi ambil di kantin FEB), dan tombol aksi bayar.
* **F-MHS-08 Midtrans Payment Simulation:** Integrasi widget/snap Midtrans sandbox / modal simulasi pembayaran.
* **F-MHS-09 Live Order Status Tracker:** Progress bar / badge visual status pesanan (`Menunggu Pembayaran` → `Dibayar` → `Diproses` → `Siap Diambil` → `Selesai`).
* **F-MHS-10 Order History:** Menampilkan daftar pesanan lampau beserta status dan detailnya.

---

## 2. Modul Tenant

### 2.1 Dashboard & Orders
* **F-TNT-01 Tenant Summary Dashboard:** Statistik singkat pesanan masuk hari ini dan status terkini.
* **F-TNT-02 Order Management Board:** Kanban board atau tabel pesanan masuk dengan aksi cepat update status (`Terima & Proses`, `Tandai Siap Diambil`, `Selesai`).
* **F-TNT-03 Order Detail View:** Rincian item pesanan, catatan pesanan, dan identitas mahasiswa.

### 2.2 Menu Management
* **F-TNT-04 Menu List:** Tabel/grid menu milik tenant.
* **F-TNT-05 Menu CRUD:** Form tambah menu baru, edit menu, dan hapus menu.
* **F-TNT-06 Stock Toggle:** Switch cepat untuk mengubah status menu menjadi `Tersedia` atau `Habis`.

---

## 3. Modul Admin

### 3.1 Dashboard & Supervision
* **F-ADM-01 Admin Dashboard:** Metrics utama demo (Total Tenant, Total User, Total Transaksi, Transaksi Berhasil).
* **F-ADM-02 Order Supervision List:** Monitor seluruh transaksi kantin secara global.

### 3.2 Master Data Management
* **F-ADM-03 Tenant Management (CRUD):** Tambah tenant baru, edit profil tenant, nonaktifkan tenant.
* **F-ADM-04 User Management:** Melihat daftar pengguna dan menetapkan role (`mahasiswa`, `tenant`, `admin`).
