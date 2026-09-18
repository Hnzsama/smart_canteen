# Rencana Anggaran Biaya (RAB) — Smart Canteen FEB

Dokumen ini merincikan alokasi anggaran biaya (Rp1.000.000) dan estimasi pengerjaan (5–7 Hari Kerja) untuk pengembangan Website Demo Smart Canteen FEB.

---

## 1. Timeline & Budget Breakdown

```mermaid
gantt
    title Timeline Pengerjaan Smart Canteen FEB (5-7 Hari)
    dateFormat  YYYY-MM-DD
    section Phase 1: Planning & Setup
    Doc & DB Schema Setup        :active, p1, 2026-09-18, 1d
    section Phase 2: Core Flow
    Auth & Spatie Role Setup     :p2, after p1, 1d
    Tenant & Menu Katalog (FE/BE):p3, after p2, 1d
    Cart & Checkout (Self-Pickup):p4, after p3, 1d
    Midtrans Sandbox Integration :p5, after p4, 1d
    section Phase 3: Tenant & Admin
    Tenant Order Management      :p6, after p5, 1d
    Admin Dashboard & Polish     :p7, after p6, 1d
```

---

## 2. Rincian Alokasi Biaya (Rp1.000.000)

| No | Modul / Komponen Pekerjaan | Bobot (%) | Biaya (IDR) | Output / Deliverables |
| :--- | :--- | :---: | :---: | :--- |
| 1 | **Setup Project, Spatie Auth & DB Schema** | 15% | Rp150.000 | Core Laravel 12 + Inertia React setup, Roles (`mahasiswa`, `tenant`, `admin`), Database Migration & Seeders. |
| 2 | **Modul Mahasiswa (Katalog, Cart & Checkout)** | 30% | Rp300.000 | Halaman Tenant, Detail Menu, Cart Management, Checkout **Self-Pickup**. |
| 3 | **Integrasi Pembayaran Midtrans Sandbox** | 20% | Rp200.000 | Midtrans Snap Integration, Webhook Notification Handler, Pembayaran Demo Flow. |
| 4 | **Modul Tenant & Order Management** | 20% | Rp200.000 | Tenant Dashboard, Kanban Order Tracker Status (`Dibayar` $\rightarrow$ `Diproses` $\rightarrow$ `Siap Diambil`), CRUD Menu Tenant. |
| 5 | **Modul Admin & UI Polish** | 15% | Rp150.000 | Admin Dashboard, Master Tenant & User CRUD, Responsive Design Polish & Manual Testing. |
| **TOTAL** | | **100%** | **Rp1.000.000** | **Website Demo Ready Smart Canteen FEB** |

---

## 3. Syarat & Ketentuan Pembayaran

1. **Total Biaya:** Rp1.000.000 (Nett).
2. **Lingkup Pekerjaan:** Sesuai dengan [01-scope.md](file:///home/darbi/Projects/smart_canteen/docs/01-scope.md).
3. **Change Request:** Setiap permintaan fitur tambahan di luar dokumen `docs/` akan dikenakan penyesuaian biaya dan waktu pengerjaan tersendiri.
