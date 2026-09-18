# Project Scope — Smart Canteen FEB

## 1. Informasi Proyek

**Nama Proyek:** Smart Canteen FEB
**Jenis:** Website Dummy / Demo
**Budget:** Rp1.000.000
**Estimasi Pengerjaan:** 5–7 hari kerja

Dokumen ini menjadi **batas utama pengembangan proyek**.

Seluruh implementasi harus mengikuti scope yang tercantum di dokumen ini.

---

# 2. Tujuan Proyek

Smart Canteen FEB adalah website demo yang digunakan untuk memperlihatkan konsep pemesanan makanan/minuman di lingkungan FEB.

Tujuan utama website:

* Menampilkan tenant/kantin.
* Menampilkan menu yang tersedia.
* Memungkinkan mahasiswa membuat pesanan.
* Menampilkan proses checkout.
* Menampilkan simulasi/alur pembayaran.
* Memungkinkan tenant memproses pesanan.
* Menampilkan status pesanan sampai siap diambil.
* Menunjukkan konsep **self-pickup**.

Website ini **BUKAN sistem kantin production**.

Fokus utama adalah **UI, UX, dan demonstrasi alur bisnis utama**.

---

# 3. Aktor Sistem

Sistem hanya memiliki tiga jenis pengguna:

### 3.1 Mahasiswa

Mahasiswa dapat:

* Login / mengakses akun.
* Melihat daftar tenant.
* Melihat menu tenant.
* Melihat detail menu.
* Menambahkan menu ke keranjang.
* Mengubah isi keranjang.
* Melakukan checkout.
* Melakukan simulasi/alur pembayaran.
* Melihat status pesanan.
* Melihat riwayat pesanan.
* Melihat informasi pengambilan pesanan.

### 3.2 Tenant / Penjual

Tenant dapat:

* Login ke dashboard.
* Melihat pesanan masuk.
* Melihat detail pesanan.
* Mengubah status pesanan.
* Menambahkan menu.
* Mengubah menu.
* Menghapus menu.
* Mengatur ketersediaan menu.

### 3.3 Admin

Admin dapat:

* Login ke dashboard.
* Melihat dashboard.
* Mengelola tenant.
* Mengelola pengguna.
* Melihat data pesanan.

---

# 4. Scope Mahasiswa

## 4.1 Authentication

Termasuk:

* Halaman login.
* Akses akun mahasiswa.
* Logout.

Authentication dibuat secukupnya untuk kebutuhan demo.

Tidak diperlukan sistem authentication enterprise.

---

## 4.2 Dashboard / Beranda

Mahasiswa dapat melihat:

* Informasi Smart Canteen.
* Daftar tenant/kantin.
* Menu atau rekomendasi sederhana jika diperlukan oleh desain.
* Navigasi ke halaman tenant.

---

## 4.3 Daftar Tenant

Mahasiswa dapat:

* Melihat daftar tenant.
* Melihat nama tenant.
* Melihat informasi dasar tenant.
* Memilih tenant untuk melihat menu.

---

## 4.4 Daftar Menu

Mahasiswa dapat:

* Melihat menu dari tenant.
* Melihat nama menu.
* Melihat harga.
* Melihat gambar jika tersedia.
* Melihat ketersediaan menu.

---

## 4.5 Detail Menu

Mahasiswa dapat melihat:

* Nama menu.
* Gambar.
* Harga.
* Deskripsi sederhana.
* Ketersediaan.
* Jumlah yang ingin dibeli.

Mahasiswa dapat menambahkan menu ke keranjang.

---

## 4.6 Keranjang

Keranjang minimal memiliki:

* Daftar item.
* Harga item.
* Jumlah item.
* Subtotal.
* Total pembayaran.
* Hapus item.
* Ubah jumlah item.

---

## 4.7 Checkout

Checkout menampilkan:

* Ringkasan pesanan.
* Tenant.
* Item pesanan.
* Total harga.
* Metode pengambilan.
* Informasi self-pickup.
* Tombol pembayaran.

Metode pengambilan dalam scope:

**Self-Pickup**

Tidak diperlukan fitur delivery.

---

## 4.8 Pembayaran

Pembayaran hanya digunakan untuk:

**Simulasi / demonstrasi flow pembayaran.**

Integrasi Midtrans dapat digunakan sesuai kebutuhan demo.

Scope pembayaran:

```text
Checkout
→ Payment
→ Payment Success / Pending / Failed
→ Order Created / Updated
```

Tidak diperlukan:

* Settlement system.
* Rekonsiliasi pembayaran.
* Accounting.
* Financial reporting.
* Sistem pembayaran kompleks.

---

## 4.9 Status Pesanan

Mahasiswa dapat melihat status pesanan.

Status utama:

```text
Menunggu Pembayaran
        ↓
Dibayar
        ↓
Diproses
        ↓
Siap Diambil
        ↓
Selesai
```

Jika diperlukan untuk flow pembayaran:

```text
Menunggu Pembayaran
        ↓
Pembayaran Gagal
```

---

## 4.10 Riwayat Pesanan

Mahasiswa dapat:

* Melihat daftar pesanan sebelumnya.
* Melihat nomor pesanan.
* Melihat tanggal pesanan.
* Melihat tenant.
* Melihat total.
* Melihat status.
* Membuka detail pesanan.

---

# 5. Scope Tenant

## 5.1 Dashboard Tenant

Dashboard sederhana yang menampilkan informasi seperti:

* Jumlah pesanan.
* Pesanan yang perlu diproses.
* Pesanan sedang diproses.
* Pesanan siap diambil.

Dashboard tidak membutuhkan analytics kompleks.

---

## 5.2 Pesanan Masuk

Tenant dapat:

* Melihat pesanan masuk.
* Membuka detail pesanan.
* Melihat item pesanan.
* Melihat jumlah item.
* Melihat total pesanan.
* Melihat informasi mahasiswa yang diperlukan untuk demo.

---

## 5.3 Perubahan Status Pesanan

Tenant dapat mengubah status pesanan.

Flow utama:

```text
Dibayar
  ↓
Diproses
  ↓
Siap Diambil
  ↓
Selesai
```

Tidak diperlukan workflow approval yang kompleks.

---

## 5.4 Manajemen Menu

Tenant dapat:

* Menambah menu.
* Mengubah menu.
* Menghapus menu.
* Mengubah harga.
* Mengubah deskripsi.
* Mengubah gambar jika diperlukan.
* Mengatur menu tersedia/tidak tersedia.

---

# 6. Scope Admin

## 6.1 Dashboard Admin

Admin memiliki dashboard sederhana.

Informasi yang dapat ditampilkan:

* Jumlah mahasiswa.
* Jumlah tenant.
* Jumlah pesanan.
* Ringkasan status pesanan.

Data statistik hanya untuk kebutuhan demo.

Tidak diperlukan analytics tingkat lanjut.

---

## 6.2 Manajemen Tenant

Admin dapat:

* Melihat tenant.
* Menambah tenant.
* Mengubah tenant.
* Menghapus/nonaktifkan tenant.
* Melihat informasi dasar tenant.

---

## 6.3 Manajemen Pengguna

Admin dapat:

* Melihat pengguna.
* Melihat role pengguna.
* Mengelola data dasar pengguna.

Tidak diperlukan user-management enterprise.

---

## 6.4 Data Pesanan

Admin dapat:

* Melihat daftar pesanan.
* Melihat detail pesanan.
* Melihat status pesanan.

Admin tidak membutuhkan fitur accounting atau settlement.

---

# 7. Alur Bisnis Utama

Alur utama yang **WAJIB dapat didemokan**:

```text
Mahasiswa Login
      ↓
Melihat Tenant
      ↓
Memilih Tenant
      ↓
Melihat Menu
      ↓
Memilih Menu
      ↓
Tambah ke Keranjang
      ↓
Checkout
      ↓
Pembayaran
      ↓
Pesanan Dibuat
      ↓
Tenant Melihat Pesanan
      ↓
Tenant Memproses Pesanan
      ↓
Pesanan Siap Diambil
      ↓
Mahasiswa Mengambil Pesanan
      ↓
Pesanan Selesai
```

Flow di atas merupakan **core flow proyek**.

Pengembangan harus memprioritaskan flow ini sebelum fitur tambahan.

---

# 8. Halaman yang Termasuk Scope

## Mahasiswa

* Login
* Home / Dashboard
* Tenant List
* Tenant Detail
* Menu List
* Menu Detail
* Cart
* Checkout
* Payment
* Order Detail
* Order Status
* Order History
* Profile sederhana jika diperlukan

## Tenant

* Login
* Dashboard
* Order List
* Order Detail
* Menu List
* Create Menu
* Edit Menu

## Admin

* Login
* Dashboard
* Tenant Management
* User Management
* Order Management

---

# 9. UI/UX Scope

Website harus:

* Responsive.
* Memiliki desain yang konsisten.
* Memiliki navigasi yang jelas.
* Memiliki feedback ketika melakukan aksi.
* Memiliki loading state jika diperlukan.
* Memiliki empty state.
* Memiliki error state sederhana.
* Memiliki confirmation ketika melakukan aksi destruktif.

UI harus berfokus pada kebutuhan demo.

Jangan menambahkan halaman atau komponen hanya karena dianggap umum pada aplikasi production.

---

# 10. Data Scope

Data yang dibutuhkan minimal:

### User

* id
* nama
* email
* role

### Tenant

* id
* nama
* deskripsi
* status

### Menu

* id
* tenant_id
* nama
* deskripsi
* harga
* gambar
* tersedia

### Order

* id
* user_id
* tenant_id
* total
* status
* payment_status
* created_at

### Order Item

* id
* order_id
* menu_id
* quantity
* price
* subtotal

Struktur dapat disesuaikan dengan implementasi teknis selama tidak mengubah scope bisnis.

---

# 11. Prioritas Development

Prioritas pengerjaan:

## Priority 1 — Core Flow

* Authentication sederhana.
* Tenant.
* Menu.
* Cart.
* Checkout.
* Payment demo.
* Order.
* Order status.
* Tenant processing.

## Priority 2 — Supporting Features

* Order history.
* Admin dashboard.
* Tenant management.
* User management.
* Menu management.

## Priority 3 — UI Polish

* Responsive layout.
* Loading state.
* Empty state.
* Error state.
* Toast/feedback.
* Visual refinement.

Fitur Priority 3 tidak boleh mengorbankan core flow.

---

# 12. Batasan Pengembangan

Developer/AI **TIDAK BOLEH** memperluas scope secara otomatis.

Jika menemukan kebutuhan baru yang belum tercantum dalam dokumen:

1. Jangan langsung mengimplementasikan.
2. Identifikasi sebagai **Out of Scope**.
3. Jelaskan kebutuhan tersebut.
4. Tunggu persetujuan sebelum implementasi.

---

# 13. Prinsip Vibe Coding

AI harus mengikuti prinsip:

> **Build the documented product, not the imagined product.**

AI tidak boleh menganggap bahwa sebuah fitur wajib dibuat hanya karena:

* aplikasi sejenis biasanya memilikinya;
* framework mendukungnya;
* fitur tersebut dianggap lebih modern;
* fitur tersebut dianggap lebih aman;
* fitur tersebut dianggap lebih scalable;
* AI menganggap aplikasi akan digunakan di production.

Dokumentasi proyek menjadi sumber kebenaran utama.

---

# 14. Perubahan Scope

Setiap perubahan terhadap scope harus dianggap sebagai:

**CHANGE REQUEST**

Contoh:

```text
Existing Scope
↓
Request fitur baru
↓
Check docs/
↓
Jika belum ada
↓
OUT OF SCOPE
↓
Approval
↓
Update documentation
↓
Implementation
```

Jangan mengimplementasikan perubahan scope sebelum dokumentasi diperbarui.

---

# 15. Definition of Done

Proyek dianggap memenuhi scope apabila:

* Mahasiswa dapat melakukan flow pemesanan.
* Mahasiswa dapat melakukan checkout.
* Payment demo dapat berjalan sesuai flow.
* Tenant dapat melihat pesanan.
* Tenant dapat mengubah status pesanan.
* Mahasiswa dapat melihat perubahan status.
* Admin dapat mengelola data dasar tenant dan pengguna.
* Core flow dapat didemonstrasikan dari awal sampai selesai.
* Tidak terdapat fitur besar di luar scope yang dibuat tanpa persetujuan.

---

# 16. Scope Boundary

Secara sederhana:

```text
┌─────────────────────────────────────────────┐
│              SMART CANTEEN FEB              │
│                  DEMO ONLY                  │
├─────────────────────────────────────────────┤
│                                             │
│  MAHASISWA                                  │
│  Login → Tenant → Menu → Cart → Checkout   │
│                       ↓                     │
│                  Payment Demo               │
│                       ↓                     │
│                   Order                     │
│                       ↓                     │
│  TENANT                                     │
│  Receive → Process → Ready                  │
│                       ↓                     │
│  MAHASISWA                                  │
│  Self-Pickup → Selesai                      │
│                                             │
├─────────────────────────────────────────────┤
│ ADMIN                                       │
│ Tenant Management                           │
│ User Management                             │
│ Order Monitoring                            │
├─────────────────────────────────────────────┤
│              OUTSIDE THE SCOPE              │
│                                             │
│ Mobile App                                  │
│ Accounting                                  │
│ Complex Inventory                           │
│ WhatsApp/SMS Notification                   │
│ Advanced Analytics                          │
│ Complex Infrastructure                      │
│ Production Financial System                 │
│ Other Undocumented Features                 │
└─────────────────────────────────────────────┘
```

**Dokumen ini harus dibaca sebelum melakukan perubahan kode.**

Jika terjadi konflik antara asumsi AI dan dokumen ini, **dokumen ini yang menjadi acuan.**
