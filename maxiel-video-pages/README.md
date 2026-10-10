# Maxiel Video Hub — GitHub Pages

Website statis HTML/CSS/JS dengan dua bagian:
- **Video & URL**: masukkan beberapa URL file video langsung, satu per baris, lalu putar dan coba simpan.
- **Browser & Pencarian**: buka URL atau cari kata kunci di iframe, dengan opsi membuka tab baru bila situs menolak iframe.

## Deploy ke GitHub Pages
1. Ekstrak ZIP.
2. Unggah `index.html`, `style.css`, `app.js` ke root repository GitHub (atau folder yang dipilih untuk Pages).
3. Buka **Settings → Pages**.
4. Pilih branch yang digunakan dan folder `/ (root)`, lalu Save.
5. Tunggu URL Pages aktif.

## Batasan penting
- GitHub Pages tidak menjalankan backend/proxy.
- Halaman situs tidak sama dengan URL file video. Browser tidak dapat membaca dan mengekstrak semua video dari halaman sembarang karena CORS, token, autentikasi, dan kebijakan situs.
- Situs dapat menolak iframe melalui `X-Frame-Options` atau CSP; gunakan “Buka di tab baru”.
- Tombol simpan bergantung pada izin server. Ini tidak mengakali DRM, paywall, login, token, atau proteksi akses.
- Untuk dukungan situs tertentu, gunakan API resmi/berizin di backend milik sendiri dan patuhi hak cipta serta ketentuan situs. Jangan menaruh API key rahasia di file JavaScript publik.
