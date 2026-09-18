# User Roles & Permissions — Smart Canteen FEB

## 1. Definisi Role

Sistem Smart Canteen FEB menggunakan 3 role utama via **Spatie Laravel Permission**:

1. `mahasiswa` (Customer)
2. `tenant` (Penjual / Stand FEB)
3. `admin` (Pengelola System)

---

## 2. Hak Akses & Matriks Permisi

| Fitur / Halaman | Mahasiswa | Tenant | Admin |
| :--- | :---: | :---: | :---: |
| **Login / Logout** | ✅ | ✅ | ✅ |
| **Melihat Tenant & Menu per Kategori** | ✅ | ✅ | ✅ |
| **Tambah ke Cart & Checkout (Cashless / Cash)** | ✅ | ❌ | ❌ |
| **Mendapatkan Kode QR / Kode Pengambilan** | ✅ | ❌ | ❌ |
| **Scan QR / Input Kode Pembayaran Cash** | ❌ | ✅ | ❌ |
| **Kelola Status Pesanan (`Dibayar` → `Selesai`)** | ❌ | ✅ | ❌ |
| **Kelola Kategori & Menu (CRUD + Soft Delete)** | ❌ | ✅ | ❌ |
| **Dashboard Admin & Supervision** | ❌ | ❌ | ✅ |
| **Kelola Tenant (CRUD + Soft Delete)** | ❌ | ❌ | ✅ |
| **Kelola User (CRUD + Soft Delete)** | ❌ | ❌ | ✅ |

---

## 3. Aturan Soft Delete Permisi
* Tenant atau Admin yang melakukan penghapusan data (User, Tenant, Menu) hanya melakukan Soft Delete (`deleted_at`), sehingga tidak menghapus data secara permanen dan menjaga integritas tabel transaksi `orders` & `order_items`.
