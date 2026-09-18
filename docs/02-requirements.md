# Functional & Non-Functional Requirements — Smart Canteen FEB

## 1. Requirements Overview

Dokumen ini mendefinisikan kebutuhan fungsional (Functional Requirements) dan non-fungsional (Non-Functional Requirements) dari sistem Smart Canteen FEB berdasarkan [01-scope.md](file:///home/darbi/Projects/smart_canteen/docs/01-scope.md).

---

## 2. Functional Requirements (FR)

### 2.1 Modul Mahasiswa (Customer)
* **FR-MHS-01:** Mahasiswa dapat melakukan login dan logout.
* **FR-MHS-02:** Mahasiswa dapat melihat daftar tenant dan filter menu berdasarkan kategori (Makanan, Minuman, Camilan).
* **FR-MHS-03:** Mahasiswa dapat melihat detail menu (nama, harga, foto, ketersediaan).
* **FR-MHS-04:** Mahasiswa dapat mengelola keranjang belanja (cart).
* **FR-MHS-05:** Mahasiswa dapat memilih metode pembayaran di Checkout: **Cashless** (Midtrans Sandbox) atau **Cash** (Tunai di Stand).
* **FR-MHS-06:** Mahasiswa mendapatkan **Kode QR / Kode Pengambilan** unik untuk setiap transaksi.
* **FR-MHS-07:** Mahasiswa dapat memantau live status pesanan (`Menunggu Pembayaran` → `Dibayar` → `Diproses` → `Siap Diambil` → `Selesai`).
* **FR-MHS-08:** Mahasiswa dapat melihat riwayat pesanan (historis tetap aman meskipun menu/tenant di-soft delete).

### 2.2 Modul Tenant (Penjual)
* **FR-TNT-01:** Tenant dapat login ke dashboard tenant.
* **FR-TNT-02:** Tenant dapat melakukan **Scan Kode QR / Input Kode Pesanan** mahasiswa untuk mengonfirmasi pembayaran Tunai (Cash).
* **FR-TNT-03:** Tenant dapat melihat ringkasan & detail pesanan masuk.
* **FR-TNT-04:** Tenant dapat memperbarui status pesanan (`Dibayar` → `Diproses` → `Siap Diambil` → `Selesai`).
* **FR-TNT-05:** Tenant dapat mengelola Kategori Menu & Item Menu (Tambah, Edit, Soft Delete, Toggle Stok Available/Out of Stock).

### 2.3 Modul Admin (Pengelola)
* **FR-ADM-01:** Admin dapat login ke dashboard admin.
* **FR-ADM-02:** Admin dapat melihat statistik demo (Total Tenant, Total User, Total Transaksi, Transaksi Cash vs Cashless).
* **FR-ADM-03:** Admin dapat mengelola data tenant (CRUD + Soft Delete).
* **FR-ADM-04:** Admin dapat mengelola pengguna & role (CRUD + Soft Delete).
* **FR-ADM-05:** Admin dapat memantau seluruh transaksi kantin secara global.

---

## 3. Non-Functional Requirements (NFR)

### 3.1 Data Integrity & Soft Deletes
* **NFR-01:** Menerapkan `softDeletes` (`deleted_at`) pada `users`, `tenants`, `menus`, dan `orders` untuk menjaga integritas data historis.
* **NFR-02:** Menggunakan snapshot nama & harga menu pada `order_items` saat transaksi terjadi.

### 3.2 Performance & Usability
* **NFR-03:** Layout responsive (Mobile-first untuk Mahasiswa, Desktop/Mobile friendly untuk Tenant & Admin).
* **NFR-04:** Respon verifikasi scan QR / kode tunai di stand tenant berjalan instan (< 1 detik).
