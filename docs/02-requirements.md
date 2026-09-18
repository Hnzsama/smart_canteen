# Functional & Non-Functional Requirements — Smart Canteen FEB

## 1. Requirements Overview

Dokumen ini mendefinisikan kebutuhan fungsional (Functional Requirements) dan non-fungsional (Non-Functional Requirements) dari sistem Smart Canteen FEB berdasarkan [01-scope.md](file:///home/darbi/Projects/smart_canteen/docs/01-scope.md).

---

## 2. Functional Requirements (FR)

### 2.1 Modul Mahasiswa (Customer)
* **FR-MHS-01:** Mahasiswa dapat melakukan login dan logout ke dalam sistem demo.
* **FR-MHS-02:** Mahasiswa dapat melihat daftar seluruh tenant/kantin yang aktif di FEB.
* **FR-MHS-03:** Mahasiswa dapat melihat daftar menu dan detail menu (nama, harga, gambar, ketersediaan) dari tenant yang dipilih.
* **FR-MHS-04:** Mahasiswa dapat menambahkan menu ke keranjang belanja (cart), mengubah kuantitas, dan menghapus item dari keranjang.
* **FR-MHS-05:** Mahasiswa dapat melakukan checkout pesanan dengan metode pengambilan **Self-Pickup**.
* **FR-MHS-06:** Mahasiswa dapat melakukan simulasi/alur pembayaran (Midtrans demo / simulasi).
* **FR-MHS-07:** Mahasiswa dapat memantau perubahan status pesanan secara real-time / refresh.
* **FR-MHS-08:** Mahasiswa dapat melihat riwayat pesanan yang pernah dibuat beserta detailnya.

### 2.2 Modul Tenant (Penjual)
* **FR-TNT-01:** Tenant dapat login ke dashboard khusus tenant.
* **FR-TNT-02:** Tenant dapat melihat ringkasan pesanan masuk (Pesanan Baru, Diproses, Siap Diambil).
* **FR-TNT-03:** Tenant dapat melihat detail setiap pesanan (daftar item, kuantitas, nama mahasiswa, total harga).
* **FR-TNT-04:** Tenant dapat memperbarui status pesanan (`Dibayar` → `Diproses` → `Siap Diambil` → `Selesai`).
* **FR-TNT-05:** Tenant dapat mengelola daftar menu (Tambah, Edit, Hapus, dan ubah status Ketersediaan menu).

### 2.3 Modul Admin (Pengelola)
* **FR-ADM-01:** Admin dapat login ke dashboard admin.
* **FR-ADM-02:** Admin dapat melihat ringkasan statistik demo (jumlah mahasiswa, jumlah tenant, total pesanan).
* **FR-ADM-03:** Admin dapat mengelola data tenant (Tambah, Edit, Hapus/Nonaktifkan tenant).
* **FR-ADM-04:** Admin dapat mengelola data pengguna (Melihat daftar user dan role).
* **FR-ADM-05:** Admin dapat memantau seluruh transaksi/pesanan yang terjadi di sistem.

---

## 3. Non-Functional Requirements (NFR)

### 3.1 Performance & Usability
* **NFR-01:** Interface harus responsive dan berjalan baik pada perangkat mobile maupun desktop.
* **NFR-02:** Waktu muat halaman utama dan navigasi antar halaman < 2 detik dalam lingkungan demo lokal.
* **NFR-03:** Memberikan feedback visual yang jelas saat user melakukan aksi (loading state, toast notification, empty state, error state).

### 3.2 Security & Simplicity
* **NFR-04:** Menggunakan authentication bawaan Laravel (Fortify / Session Auth) dengan pembagian role via Spatie Permission.
* **NFR-05:** Keamanan dasar seperti validasi form input, proteksi CSRF, dan enkripsi password standard.
* **NFR-06:** Tidak menggunakan infrastruktur keamanan kompleks (seperti 2FA enterprise, OAuth2 provider eksternal, dsb.) karena fokus pada demo UI/UX.

### 3.3 Scope Boundary
* **NFR-07:** Sistem dibuat sebagai **Website Dummy/Demo**, bukan production-grade.
* **NFR-08:** Bebas dari fitur out-of-scope seperti sistem keuangan kompleks, pengiriman (delivery), notifikasi SMS/WA, dan accounting.
