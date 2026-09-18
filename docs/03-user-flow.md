# User Flow — Smart Canteen FEB

## 1. Core End-to-End Business Flow

Alur utama yang **WAJIB dapat didemokan** dari awal hingga selesai disajikan dalam diagram Mermaid berikut:

```mermaid
sequenceDiagram
    autonumber
    actor M as Mahasiswa
    participant SYS as Sistem FEB
    participant MID as Midtrans Sandbox
    actor T as Tenant

    M->>SYS: 1. Login & Pilih Tenant / Menu
    M->>SYS: 2. Tambah Menu ke Keranjang
    M->>SYS: 3. Checkout (Self-Pickup)
    SYS->>MID: 4. Request Payment Snap Token
    MID-->>M: 5. Tampilkan Modal Simulasi Pembayaran
    M->>MID: 6. Bayar (Simulasi Sukses)
    MID-->>SYS: 7. Callback Payment Success
    SYS->>SYS: 8. Update Status Pesanan: "Dibayar"
    SYS-->>T: 9. Notifikasi Pesanan Masuk
    T->>SYS: 10. Ubah Status Pesanan: "Diproses"
    T->>SYS: 11. Makanan Selesai -> Status: "Siap Diambil"
    SYS-->>M: 12. Notifikasi Status: "Siap Diambil"
    M->>T: 13. Datang ke Stand (Self-Pickup)
    T->>SYS: 14. Konfirmasi Ambil -> Status: "Selesai"
```

---

## 2. Alur Detail Berdasarkan Aktor

### 2.1 Alur Mahasiswa

```mermaid
flowchart TD
    A[Mulai Login Mahasiswa] --> B[Pilih Tenant di FEB]
    B --> C[Lihat Menu & Detail]
    C --> D[Tambah ke Keranjang]
    D --> E{Ubah Isi Cart?}
    E -- Ya --> F[Edit Kuantitas / Hapus Item]
    F --> D
    E -- Tidak --> G[Proses Checkout]
    G --> H[Pilih Self-Pickup]
    H --> I[Bayar - Simulasi Midtrans]
    I --> J{Status Pembayaran?}
    J -- Gagal --> K[Status: Pembayaran Gagal]
    J -- Sukses --> L[Status: Dibayar]
    L --> M[Pantau Tracker Status]
    M --> N[Status: Diproses]
    N --> O[Status: Siap Diambil]
    O --> P[Ambil Pesanan di Stand]
    P --> Q[Status: Selesai]
```

---

### 2.2 Alur Tenant

```mermaid
flowchart TD
    A[Login Dashboard Tenant] --> B[Lihat Pesanan Masuk Status: Dibayar]
    B --> C[Buka Detail Pesanan Mahasiswa]
    C --> D[Ubah Status: Diproses]
    D --> E[Siapkan Makanan / Minuman]
    E --> F[Ubah Status: Siap Diambil]
    F --> G[Mahasiswa Mengambil Makanan]
    G --> H[Ubah Status: Selesai]
```

---

### 2.3 Alur Admin

```mermaid
flowchart TD
    A[Login Dashboard Admin] --> B[Lihat Overview Metric Demo]
    B --> C{Pilih Menu Kelola}
    C -- Master Tenant --> D[CRUD Data Tenant]
    C -- Master User --> E[CRUD User & Role]
    C -- Monitoring --> F[Lihat Seluruh Pesanan FEB]
```
