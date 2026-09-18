# User Flow — Smart Canteen FEB

## 1. Core End-to-End Business Flow

Alur utama pemesanan dengan opsi **Cashless (Midtrans Sandbox)** dan **Cash (Scan QR / Kode di Tenant)** disajikan dalam diagram Mermaid berikut:

```mermaid
sequenceDiagram
    autonumber
    actor M as Mahasiswa
    participant SYS as "Sistem Smart Canteen"
    participant MID as "Midtrans Sandbox"
    actor T as Tenant

    M->>SYS: Login dan Lihat Menu per Kategori
    M->>SYS: Tambah ke Keranjang lalu Checkout
    M->>SYS: Pilih Metode Pembayaran (Cashless / Cash)
    
    alt Pembayaran Cashless
        SYS->>MID: Request Midtrans Snap Token
        MID-->>M: Tampilkan Midtrans Sandbox Pop-up
        M->>MID: Selesaikan Bayar di Sandbox
        MID-->>SYS: Webhook Auto Callback Success
        SYS->>SYS: Status Pesanan: Dibayar
    else Pembayaran Cash (Tunai)
        SYS-->>M: Tampilkan Kode QR / Kode Pengambilan
        M->>T: Tunjukkan Kode QR dan Serahkan Uang Tunai di Stand
        T->>SYS: Scan QR / Input Kode di App Tenant
        T->>SYS: Klik Konfirmasi Terima Tunai
        SYS->>SYS: Status Pesanan: Dibayar
    end

    SYS-->>T: Pesanan Masuk di Dashboard Tenant
    T->>SYS: Ubah Status: Diproses
    T->>SYS: Ubah Status: Siap Diambil
    SYS-->>M: Live Tracker Update: Siap Diambil
    M->>T: Ambil Makanan di Stand (Self-Pickup)
    T->>SYS: Konfirmasi Selesai: Status Selesai
```

---

## 2. Detail Alur Pembayaran Cash (Scan QR oleh Tenant)

```mermaid
flowchart TD
    A["Mahasiswa Checkout Pilih Cash"] --> B["Sistem Generate pickup_code & QR"]
    B --> C["Status Order: Menunggu Pembayaran Tunai"]
    C --> D["Mahasiswa Datang ke Stand Tenant"]
    D --> E["Tenant Buka Scanner / Input Form di App Tenant"]
    E --> F["Tenant Scan QR / Ketik Kode Pesanan"]
    F --> G["Tampil Detail Tagihan & Item Pesanan"]
    G --> H["Tenant Terima Uang & Klik Konfirmasi Pembayaran"]
    H --> I["Status Order Berubah: Dibayar"]
    I --> J["Tenant Langsung Memproses Pesanan"]
```
