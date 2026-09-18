# Development Rules

## 1. Scope First

Semua implementasi HARUS mengikuti dokumen di folder `docs/`.

Jangan menambahkan fitur baru hanya karena fitur tersebut dianggap umum,
bagus, modern, atau dibutuhkan oleh aplikasi production.

Jika sebuah fitur tidak tercantum dalam scope, jangan implementasikan.

## 2. Project Type

Project ini adalah:

- Website dummy/demo
- Bukan production system
- Fokus pada UI dan demo flow
- Fokus pada alur utama Smart Canteen FEB

Jangan mengembangkan sistem menjadi platform production yang kompleks.

## 3. Feature Addition

Jika requirement baru ditemukan:

1. Cek apakah requirement tersebut ada di `docs/`.
2. Jika tidak ada, jangan langsung implementasikan.
3. Tandai sebagai OUT OF SCOPE.
4. Minta konfirmasi sebelum mengubah scope.

## 4. Avoid Overengineering

Jangan menambahkan:

- microservices
- queue system yang kompleks
- event-driven architecture yang tidak diperlukan
- caching layer yang kompleks
- analytics
- audit log kompleks
- notification infrastructure
- mobile application
- financial accounting system

kecuali secara eksplisit diminta.

## 5. UI

Prioritaskan:

- tampilan rapi
- responsive
- konsisten
- mudah digunakan
- sesuai desain yang telah disepakati

Jangan membuat halaman tambahan yang tidak diperlukan hanya untuk
"melengkapi" aplikasi.

## 6. Payment

Payment hanya digunakan untuk kebutuhan demo/alur pembayaran.

Jangan mengembangkan sistem payment production-grade di luar scope.