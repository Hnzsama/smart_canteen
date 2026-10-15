# 🛡️ Panduan Penggunaan — Administrator

Panduan ini diperuntukkan bagi **Administrator Sistem Smart Canteen FEB** dalam memantau statistik operasional kantin, mengelola master data stand tenant, mengelola pengguna & role, serta mengatur konfigurasi pembayaran global.

---

## 📌 Daftar Isi
1. [Dashboard Pengawasan Admin](#1-dashboard-pengawasan-admin)
2. [Manajemen Data Stand Tenant](#2-manajemen-data-stand-tenant)
3. [Manajemen Pengguna & Role (Users)](#3-manajemen-pengguna--role-users)
4. [Supervisi & Monitoring Transaksi Global](#4-supervisi--monitoring-transaksi-global)
5. [Pengaturan Pembayaran & Biaya Layanan](#5-pengaturan-pembayaran--biaya-layanan)
6. [Audit Data & Keamanan Soft Delete](#6-audit-data--keamanan-soft-delete)

---

## 1. Dashboard Pengawasan Admin

Setelah masuk dengan akun **Administrator**, Anda akan diarahkan ke Dashboard Admin (`/admin/dashboard`).

```mermaid
flowchart TD
    A[Admin Dashboard Overview] --> B[Card Metric: Total Pendapatan Kantin]
    A --> C[Card Metric: Rasio Volume Cash vs Cashless]
    A --> D[Card Metric: Jumlah Stand Aktif & User]
    A --> E[Grafik Tren Transaksi Harian & Mingguan]
```

### Indikator Utama (KPI Cards):
- 💰 **Total Transaksi**: Nilai total rupiah transaksi yang berhasil dilakukan di kantin FEB.
- 💳 **Rasio Cash vs Cashless**: Persentase penggunaan pembayaran digital (Midtrans) dibandingkan uang tunai di kasir stand.
- 🏪 **Tenant Aktif**: Jumlah stand kantin yang sedang beroperasi di lingkungan FEB.
- 👥 **Total Pengguna**: Jumlah akun mahasiswa, tenant, dan admin terdaftar.

---

## 2. Manajemen Data Stand Tenant

Admin bertanggung jawab mendaftarkan dan memantau seluruh stand / kantin di lingkungan FEB (`/admin/tenants`).

```mermaid
flowchart LR
    A[Halaman Master Tenant] --> B[Klik '+ Tambah Tenant Baru']
    B --> C[Isi Form: Nama Stand, Nama Pemilik, Banner]
    C --> D[Hubungkan dengan Akun Tenant]
    D --> E[Simpan Tenant]
```

### 2.1 Menambah Stand Tenant Baru
1. Navigasi ke menu **Master Tenant** (`/admin/tenants`).
2. Klik tombol **+ Tambah Tenant Baru**.
3. Lengkapi formulir:
   - **Nama Stand**: Nama usaha (contoh: *Kantin Bakso FEB*).
   - **Slug URL**: Nama unik di URL (contoh: `bakso-feb`).
   - **Pemilik Stand**: Pilih akun pengguna bertipe *Tenant* yang akan mengelola stand ini.
   - **Deskripsi & Foto Banner**: Deskripsi singkat dan gambar header stand.
4. Klik **Simpan Tenant**.

### 2.2 Mengubah / Non-aktifkan Stand
- **Edit Info**: Klik tombol **Edit** pada baris tenant untuk mengubah nama, pemilik, atau deskripsi.
- **Non-aktifkan Stand**: Jika stand melanggar aturan atau libur semester, ubah status `is_active` menjadi **Non-aktif**. Stand tidak akan muncul di katalog mahasiswa.

---

## 3. Manajemen Pengguna & Role (Users)

Admin dapat mengelola daftar seluruh pengguna terdaftar pada sistem (`/admin/users`).

```mermaid
flowchart TD
    A[Halaman Master User] --> B[Cari User via Email / Nama]
    B --> C[Ubah Role: Mahasiswa / Tenant / Admin]
    B --> D[Reset Password atau Non-aktifkan Akun]
    B --> E[Fitur Soft Delete & Restore Akun]
```

### 3.1 Mengubah Role Pengguna
1. Buka menu **Master Pengguna** (`/admin/users`).
2. Gunakan kolom pencarian untuk menemukan akun berdasarkan nama atau email.
3. Klik tombol **Edit Role**.
4. Pilih peran yang sesuai:
   - `mahasiswa`: Pengguna umum pembeli makanan.
   - `tenant`: Penjual / pemilik stand.
   - `admin`: Pengelola sistem penuh.
5. Klik **Simpan Role**.

---

## 4. Supervisi & Monitoring Transaksi Global

Admin memiliki akses pengawasan ke seluruh transaksi kantin tanpa batas stand (`/admin/orders`).

### Fitur Monitoring:
- **Filter Transaksi**: Filter pesanan berdasarkan **Tanggal**, **Tenant**, **Metode Pembayaran (Cash/Cashless)**, atau **Status Pesanan**.
- **Audit Detail Pesanan**: Klik salah satu nomor order (misal: `SC-20260920-004`) untuk melihat rincian item, waktu pembayaran, hingga kasir tenant yang mengonfirmasi.
- **Export Data**: Ekspor laporan transaksi ke format CSV/Excel untuk kebutuhan rekapitulasi keuangan fakultas.

---

## 5. Tata Kelola Biaya Terpusat (Centralized Fee Governance)

Untuk memastikan keadilan tarif bagi seluruh mahasiswa dan mencegah manipulasi harga, seluruh komponen biaya non-makanan dikendalikan secara terpusat oleh Administrator di `/admin/payment-settings`:

### 5.1 Biaya Layanan Aplikasi (`app_fee`)
- Biaya platform pemeliharaan sistem kantin FEB (default: `Rp1.000` per checkout).
- Dikelola di tabel `app_settings` (key: `app_fee`).
- Berlaku seragam untuk semua transaksi.

### 5.2 Biaya Saluran Pembayaran (`channel_fee`)
- Biaya switching payment gateway resmi (misal QRIS 0.7%, BCA Virtual Account Rp4.000, Tunai Rp0).
- Dikelola di tabel `payment_methods` dengan tipe biaya tetap (*fixed*) atau persentase (*percentage*).
- **Aturan Tegas**: Tenant tidak diberikan izin untuk menambah markup biaya gateway atau memotong fee sepihak.

---

## 6. Pengawasan Multi-Tenant Midtrans & Kebijakan Keranjang Tunggal

Sistem Smart Canteen FEB mengadopsi arsitektur desentralisasi Midtrans:

```mermaid
flowchart TD
    Cart["Mahasiswa Checkout Stand A"] --> Check{"Stand A Punya Midtrans Aktif?"}
    Check -->|"Ya (Kredensial Terisi)"| DynamicMidtrans["Inisialisasi SDK Midtrans Stand A"]
    DynamicMidtrans --> Snap["Snap Popup (Dana masuk ke rekening Stand A)"]
    Check -->|"Tidak (Kosong/Nonaktif)"| CashOnly["Fallback Tunai: Hanya Opsi Bayar di Kasir Stand"]
    Gov["Admin Mengendalikan Biaya Standar (app_fee & channel_fee)"] -.-> Cart
```

### 6.1 Status Gateway Stand (Active vs Cash-Only)
- Stand dengan kredensial Midtrans aktif (`midtrans_is_active = true` dan Server Key terisi) dapat melayani pembayaran digital Snap.
- Stand tanpa akun Midtrans otomatis beralih (*graceful fallback*) ke mode **Tunai Saja (Cash-Only)** tanpa error sistem.

### 6.2 Kebijakan Single-Tenant Cart
- Mahasiswa hanya dapat melakukan checkout untuk 1 stand dalam 1 transaksi.
- Mencegah kompleksitas split-settlement antar rekening bank merchant Midtrans yang berbeda, sekaligus menyederhanakan alur antrean dapur masing-masing stand.

### 6.3 Keamanan Enkripsi Kredensial
- Server Key tenant dienkripsi menggunakan algoritma `AES-256-CBC` via Laravel Encrypted Casts, melindungi kerahasiaan merchant dari kebocoran data.

---

## 7. Audit Data & Keamanan Soft Delete

Seluruh penghapusan data penting pada aplikasi Smart Canteen FEB menerapkan prinsip **Soft Delete** (`deleted_at`).

```mermaid
flowchart LR
    A[Admin/Tenant Hapus Data] --> B[Data Diisi deleted_at]
    B --> C[Data Hilang dari Tampilan Aktif]
    B --> D[Data TETAP Tersimpan di Database]
    D --> E[Riwayat Transaksi Historis Lunas Tetap Konsisten 100%]
    E --> F[Admin Bisa Melakukan Restore Data Kapan Saja]
```

- **Penting**: Penonaktifan akun pengguna, stand tenant, maupun menu makanan **TIDAK AKAN** merusak laporan transaksi masa lalu.
- Jika data tidak sengaja terhapus, Admin dapat masuk ke tab **Sampah / Deleted Records** di halaman masing-masing dan mengklik **Pulihkan (Restore)** untuk mengembalikan data seperti semula.

---

[⬅️ Kembali ke Indeks Panduan](README.md)

