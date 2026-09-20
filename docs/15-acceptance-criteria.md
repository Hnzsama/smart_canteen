# Acceptance Criteria — Smart Canteen FEB

## 1. Quality Gate Overview

```mermaid
flowchart TD
    AC1[1. Dual Payment Engine: Cashless & Cash QR Scan] --> GATE{Definition of Done}
    AC2[2. Soft Deletes Data Integrity pada User, Tenant, Menu, Order] --> GATE
    AC3[3. Kategori Global/Internal & Snapshot Order Items] --> GATE
    AC4[4. Self-Pickup Live Tracker 5-Tahap & Timestamps Audit] --> GATE
    AC5[5. Admin & Tenant Dashboard Supervision Metrics] --> GATE
    AC6[6. Rating & Ulasan Mahasiswa + Custom Menu Notes] --> GATE
    GATE -- Pass All --> PASSED[PROYEK DEMO ACC / SELESAI]
```

---

## 2. Checklist Acceptance Criteria

* [x] Mahasiswa dapat melakukan checkout dengan metode pembayaran **Cashless** (Midtrans Sandbox via BCA VA/QRIS) maupun **Cash** (Tunai di Stand).
* [x] Mahasiswa menerima Kode QR & string `pickup_code` unik (format `FEB-XXXX`) untuk transaksi pembayaran tunai & self-pickup.
* [x] Tenant memiliki fitur **Scan Kode QR Kamera / Input Kode Manual** pada `/tenant/verify-payment` untuk mengonfirmasi pembayaran tunai.
* [x] Model `User`, `Tenant`, `Menu`, dan `Order` mengimplementasikan Trait `SoftDeletes` (`deleted_at`) sehingga riwayat transaksi historis tetap utuh 100%.
* [x] Model `OrderItem` menyimpan `menu_name`, `price`, `options`, dan `note` sebagai snapshot data saat transaksi dibuat.
* [x] Tenant dapat mengelompokkan menu berdasarkan `Category` internal stand, dan menu terhubung dengan `global_category` (*makanan, minuman, camilan*).
* [x] Status pesanan meng-update timestamp audit secara otomatis (`paid_at`, `processing_at`, `ready_at`, `completed_at`).
* [x] Tenant dapat mengoperasikan saklar *Status Buka/Tutup Stand* (`is_open`) dan saklar *Stok Instant* (*Available/Out of Stock*).
* [x] Mahasiswa dapat memberikan rating bintang 1–5 ⭐ dan ulasan teks setelah pesanan di-pickup.
* [x] Admin dapat memantau statistik total omset kantin, mengelola master tenant & user, serta mengatur biaya layanan aplikasi (*Admin Fee*).
