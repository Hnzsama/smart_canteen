# Page Specification — Smart Canteen FEB

Dokumen ini mendeskripsikan seluruh halaman dalam sistem beserta komponen, layout, dan interaksi sesuai dengan section 8 pada [01-scope.md](file:///home/darbi/Projects/smart_canteen/docs/01-scope.md).

---

## 1. Halaman Mahasiswa

### 1.1 Login Page (`/login`)
* **Elemen:** Input Email, Input Password, Button Login, Switcher Role untuk Demo.
* **Aksi:** Validasi credentials, simpan session, redirect berdasarkan role.

### 1.2 Home / Dashboard (`/`)
* **Elemen:** Banner/Hero Smart Canteen FEB, Grid Tenant pilihan, Rekomendasi Menu singkat.
* **Aksi:** Klik Tenant Card → Pindah ke Tenant Detail.

### 1.3 Tenant List Page (`/tenants`)
* **Elemen:** List/Grid seluruh tenant di FEB (Foto Stand, Nama Tenant, Deskripsi Singkat, Status Stand).
* **Aksi:** Filter/Pencarian tenant, klik card tenant.

### 1.4 Tenant Detail & Menu List Page (`/tenants/{id}`)
* **Elemen:** Header Profil Tenant, Filter Kategori Menu, Grid Card Menu (Gambar, Nama, Harga, Status Stock, Button "Tambah").
* **Aksi:** Klik Card Menu → Modal Detail Menu / Tambah ke Cart. Floating Cart Button di bagian bawah screen.

### 1.5 Detail Menu Modal / Page (`/menu/{id}`)
* **Elemen:** Gambar Menu besar, Nama, Deskripsi, Price Tag, Stepper Kuantitas (+/-), Button "Tambah ke Keranjang".

### 1.6 Cart Page (`/cart`)
* **Elemen:** Tabel / List Item Cart (Foto, Nama Menu, Tenant Name, Harga Satuan, Counter Qty, Subtotal, Button Hapus), Ringkasan Total Biaya, Button "Lanjut Checkout".

### 1.7 Checkout Page (`/checkout`)
* **Elemen:** Item Summary, Info Pengambilan (**Self-Pickup di Stand Kantin FEB**), Rincian Pembayaran, Button "Bayar Sekarang".

### 1.8 Payment Simulation Page / Modal (`/orders/{id}/payment`)
* **Elemen:** Midtrans Snap Modal / Interface Simulasi Pembayaran (Pilihan metode simulasi: VA / QRIS / Bank Transfer), Button "Simulasi Sukses" / "Simulasi Gagal".

### 1.9 Order Detail & Status Tracker Page (`/orders/{id}`)
* **Elemen:** Stepper Progress Status (`Menunggu Pembayaran` → `Dibayar` → `Diproses` → `Siap Diambil` → `Selesai`), Kode/Nomor Pesanan, Rincian Item, Catatan Self-Pickup.

### 1.10 Order History Page (`/orders`)
* **Elemen:** List/Table Riwayat Pesanan Mahasiswa (Tgl, No Order, Tenant, Total, Badge Status), Link ke Order Detail.

---

## 2. Halaman Tenant

### 2.1 Tenant Login Page (`/tenant/login`)
* **Elemen:** Form Login khusus akun tenant.

### 2.2 Tenant Dashboard (`/tenant/dashboard`)
* **Elemen:** Summary Card (Pesanan Baru, Diproses, Siap Diambil), Quick Link Manajemen Menu.

### 2.3 Tenant Order List Page (`/tenant/orders`)
* **Elemen:** Tab/Filter Status Pesanan, List Pesanan Masuk dengan Aksi Tombol Update Status (`Proses Pesanan`, `Tandai Siap Diambil`, `Selesaikan`).

### 2.4 Tenant Order Detail Modal/Page (`/tenant/orders/{id}`)
* **Elemen:** Detail Item Pilihan Mahasiswa, Nama Mahasiswa, Jam Pemesanan, Status Tracker.

### 2.5 Tenant Menu Management Page (`/tenant/menus`)
* **Elemen:** Tabel Menu (Foto, Nama, Harga, Switcher Status Stock Available/Out of Stock, Action Edit & Hapus), Button "Tambah Menu Baru".

### 2.6 Create / Edit Menu Page (`/tenant/menus/create`, `/tenant/menus/{id}/edit`)
* **Elemen:** Form Input Nama Menu, Deskripsi, Harga, Upload Gambar, Toggle Stock.

---

## 3. Halaman Admin

### 3.1 Admin Login Page (`/admin/login`)
* **Elemen:** Form Login khusus Admin.

### 3.2 Admin Dashboard (`/admin/dashboard`)
* **Elemen:** Metric Card (Total Tenant, Total User, Total Transaksi, Transaksi Berhasil), Ringkasan Status Pesanan.

### 3.3 Tenant Management Page (`/admin/tenants`)
* **Elemen:** Tabel Tenant, Button "Tambah Tenant", Button Edit & Nonaktifkan Tenant.

### 3.4 User Management Page (`/admin/users`)
* **Elemen:** Tabel User (Nama, Email, Role `mahasiswa`/`tenant`/`admin`), Assign Role.

### 3.5 Order Supervision Page (`/admin/orders`)
* **Elemen:** Tabel Seluruh Pesanan Sistem, Filter berdasarkan Tenant & Status.
