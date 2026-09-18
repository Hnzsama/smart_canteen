# Feature Specification — Smart Canteen FEB

## 1. Modul Mahasiswa

### 1.1 Auth & Account
* **F-MHS-01 Login Mahasiswa:** Form login credentials mahasiswa.
* **F-MHS-02 Quick Switch Role Demo:** Utility switcher role untuk kemudahan saat presentasi demo.

### 1.2 Katalog & Pemesanan
* **F-MHS-03 Katalog Tenant & Kategori:** Menampilkan tenant & filter menu berdasarkan kategori (Makanan Utama, Minuman, Camilan).
* **F-MHS-04 Cart & Checkout Options:** Mengelola item belanja dan memilih metode pembayaran:
  - **Cashless:** Midtrans Sandbox.
  - **Cash:** Tunai di Stand Tenant.
* **F-MHS-05 Digital QR / Pickup Code:** Menampilkan Kode QR unik & string kode (cth: `FEB-8912`) untuk pembayaran tunai / klaim **Self-Pickup**.
* **F-MHS-06 Live Tracker & History:** Memantau progress status pesanan beserta timeline timestamp (`paid_at`, `processing_at`, `ready_at`, `completed_at`).

---

## 2. Modul Tenant

### 2.1 Order & QR Scanner
* **F-TNT-01 Tenant Order Dashboard:** Overview pesanan baru, diproses, dan siap diambil.
* **F-TNT-02 Cash QR Scanner / Code Verifier:** Fitur scan kamera / input kode manual untuk memverifikasi pembayaran tunai di stand dan mengubah status menjadi `Dibayar`.
* **F-TNT-03 Order Status Handler:** Tombol aksi cepat update status (`Proses Pesanan`, `Siap Diambil`, `Selesai`).

### 2.2 Category & Menu Management
* **F-TNT-04 Category CRUD:** Mengelompokkan menu dalam kategori.
* **F-TNT-05 Menu CRUD with Soft Delete:** Menambah, mengubah, mengunggah foto, dan menghapus menu dengan fitur **Soft Delete** (`deleted_at`).
* **F-TNT-06 Stock Toggle:** Switch cepat untuk mengubah ketersediaan (Tersedia / Stok Habis).

---

## 3. Modul Admin

### 3.1 Dashboard & Supervision
* **F-ADM-01 Admin Metric Dashboard:** Statistik total transaksi, perbandingan transaksi Cash vs Cashless, total tenant, dan total user.
* **F-ADM-02 Global Order Supervision:** Monitoring seluruh transaksi kantin FEB.

### 3.2 Master Data Management (Soft Delete)
* **F-ADM-03 Tenant Management:** CRUD Tenant dilengkapi dengan Soft Delete & Restore.
* **F-ADM-04 User Management:** CRUD User & Role dilengkapi dengan Soft Delete & Restore.
