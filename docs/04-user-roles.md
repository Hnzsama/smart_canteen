# User Roles & Permissions — Smart Canteen FEB

## 1. Definisi Role

Sistem Smart Canteen FEB menggunakan 3 role utama yang dikelola menggunakan **Spatie Laravel Permission**:

1. `mahasiswa` (Customer)
2. `tenant` (Penjual / Pemilik Stand)
3. `admin` (Pengelola Sistem)

---

## 2. Hak Akses & Matriks Permisi

| Fitur / Halaman | Mahasiswa | Tenant | Admin |
| :--- | :---: | :---: | :---: |
| **Login / Logout** | ✅ | ✅ | ✅ |
| **Melihat Tenant & Menu** | ✅ | ✅ | ✅ |
| **Tambah ke Keranjang & Edit Cart** | ✅ | ❌ | ❌ |
| **Checkout & Simulasi Pembayaran** | ✅ | ❌ | ❌ |
| **Melihat Status Pesanan Sendiri** | ✅ | ❌ | ❌ |
| **Melihat Riwayat Pesanan Sendiri** | ✅ | ❌ | ❌ |
| **Dashboard Tenant** | ❌ | ✅ | ❌ |
| **Kelola Status Pesanan Masuk** | ❌ | ✅ | ❌ |
| **Kelola Menu Tenant (CRUD)** | ❌ | ✅ | ❌ |
| **Dashboard Admin** | ❌ | ❌ | ✅ |
| **Kelola Tenant (CRUD)** | ❌ | ❌ | ✅ |
| **Kelola Pengguna (CRUD User & Role)**| ❌ | ❌ | ✅ |
| **Monitoring Seluruh Pesanan** | ❌ | ❌ | ✅ |

---

## 3. Detail Aturan Akses (Guard & Middleware)

### 3.1 Role Mahasiswa (`role:mahasiswa`)
* Diberikan kepada akun pembeli/mahasiswa FEB.
* Hanya berhak melakukan transaksi pemesanan atas namanya sendiri.
* Tidak memiliki akses ke area manajemen `/tenant/*` atau `/admin/*`.

### 3.2 Role Tenant (`role:tenant`)
* Terhubung dengan record entity `Tenant` (misal via `tenant_id` pada model `User`).
* Hanya dapat melihat dan memproses pesanan yang ditujukan kepada tenant miliknya.
* Hanya dapat mengedit menu yang dimiliki oleh tenant miliknya.

### 3.3 Role Admin (`role:admin`)
* Memiliki hak akses penuh untuk mengelola master data (Tenant, User, Role).
* Diberikan fasilitas monitoring transaksi menyeluruh untuk kepentingan supervisi demo.
