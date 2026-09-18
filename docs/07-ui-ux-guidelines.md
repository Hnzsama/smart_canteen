# UI/UX Guidelines — Smart Canteen FEB

## 1. Core Design Principles

Smart Canteen FEB mengutamakan tampilan yang modern, segar, konsisten, dan memukau (WOW factor) serta dioptimalkan untuk performa demonstrasi demo.

* **Clean & Modern Aesthetic:** Menggunakan palette warna harmonis, rounded corners, subtle shadows, dan tipografi yang jelas.
* **Mobile-First & Responsive:** Antarmuka harus tampil sempurna di layar Smartphone (Mahasiswa yang memesan di kantin) maupun Desktop (Dashboard Admin & Tenant).
* **Clear Feedback & States:** Setiap aksi pengguna (klik tombol, ubah kuantitas, update status) memberikan respon visual yang seketika.

---

## 2. Palette Warna & Visual System

* **Primary Color:** Emerald / Teal / Modern Green (Merepresentasikan kebersihan, kesegaran kantin, dan kemudahan).
* **Secondary / Accent:** Warm Amber / Orange (Merepresentasikan makanan & kehangatan).
* **Neutral Tones:** Dark Slate / Charcoal untuk teks, Light Gray / Ice White untuk background card.
* **Status Badges:**
  - `Menunggu Pembayaran`: Yellow / Amber Badge
  - `Dibayar` / `Diproses`: Blue / Indigo Badge
  - `Siap Diambil`: Emerald / Green Pulse Badge
  - `Selesai`: Neutral Gray Badge
  - `Pembayaran Gagal`: Red Badge

---

## 3. Component & Interactive States

Setiap komponen UI harus mengimplementasikan 4 state utama:

1. **Default State:** Tampilan bersih dengan hirarki visual yang jelas.
2. **Loading State:** Skeleton loader / pulsing animation saat memuat data atau memproses transaksi.
3. **Empty State:** Ilustrasi / pesan ramah jika keranjang kosong, riwayat kosong, atau tidak ada pesanan masuk.
4. **Error / Validation State:** Message error yang informatif jika terjadi kesalahan input atau kegagalan simulasi pembayaran.

---

## 4. Feedback & Notifications

* **Toast Notification:** Pop-up kecil di sudut layar saat pengguna menambahkan item ke keranjang atau berhasil mengubah status pesanan.
* **Confirmation Modals:** Modal konfirmasi sebelum menghapus item dari keranjang atau melakukan aksi pembatalan.
* **Progress Trackers:** Stepper visual yang hidup pada halaman detail pesanan mahasiswa untuk memperlihatkan tahap **Self-Pickup**.
