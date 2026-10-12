ALIM CHAT 3D — PETUNJUK SETUP
================================

FITUR YANG SUDAH DIBUAT
- Desain modern bergaya 3D/glass dengan layout desktop dan Android.
- Login Google menggunakan Firebase Authentication.
- Pemulihan hasil login redirect + onAuthStateChanged agar kembali ke halaman chat setelah memilih akun.
- Ruang obrolan realtime bersama pengguna lain yang memakai aplikasi ini.
- Kirim pesan teks dan gambar kecil (maks. 850 KB, disimpan sebagai data pesan).
- Pencarian pesan yang telah dimuat.
- Profil akun, keluar akun, dan PWA untuk ditambahkan ke layar utama.

PENTING
Alim Chat adalah aplikasi chat sendiri. Aplikasi ini TIDAK membaca pesan/notifikasi WhatsApp asli, SMS, atau foto pribadi di ponsel. Chat di Ruang Umum dapat dibaca pengguna lain yang diberi akses Firebase. Versi ini bukan end-to-end encrypted dan belum mempunyai chat privat, panggilan, status, sinkronisasi kontak, maupun OTP nomor telepon.

1. BUAT / PILIH FIREBASE PROJECT
- Buka https://console.firebase.google.com/
- Pilih project milikmu.
- Tambahkan Web App (ikon </>) dan salin konfigurasi Firebase.
- Buka firebase-config.js, lalu ganti semua nilai PASTE_ dengan nilai dari Firebase.
  Jangan beri tanda kurung tambahan; pertahankan format JavaScript yang sudah ada.

2. AKTIFKAN LOGIN GOOGLE
- Firebase Console > Authentication > Get started.
- Sign-in method > Google > Enable > Save.
- Authentication > Settings > Authorized domains.
- Tambahkan: shamiunalim.github.io
- Jika menggunakan domain lain, tambahkan domain tersebut juga.

3. AKTIFKAN FIRESTORE
- Firebase Console > Firestore Database > Create database.
- Setelah dibuat, buka tab Rules dan pasang rules berikut untuk uji coba.
- Tekan Publish.

RULES UJI COBA (PENGGUNA LOGIN DAPAT MEMBACA/MENGIRIM KE RUANG BERSAMA)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /messages/{messageId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null
        && request.resource.data.uid == request.auth.uid
        && request.resource.data.text is string
        && request.resource.data.text.size() <= 4000
        && (request.resource.data.image == null
          || (request.resource.data.image is string
            && request.resource.data.image.size() <= 1200000));
      allow update, delete: if request.auth != null
        && resource.data.uid == request.auth.uid;
    }
  }
}

Catatan: ini rules awal untuk aplikasi demo. Sebelum aplikasi dipakai publik, tambahkan proteksi spam/abuse dan aturan moderasi. Untuk skala produksi, simpan foto di Firebase Storage dan jangan menaruh gambar besar sebagai data pesan Firestore.

4. UPLOAD KE GITHUB PAGES
- Ekstrak ZIP.
- Upload SEMUA isi folder ke root repo: https://github.com/shamiunalim/alim-web
- Pastikan index.html berada langsung di root, bukan di dalam folder alim-chat-3d.
- Commit perubahan.
- Di repo > Settings > Pages, pilih branch yang benar dan folder /(root).
- Buka: https://shamiunalim.github.io/alim-web/

5. PASANG DI ANDROID
- Buka URL di Chrome.
- Menu ⋮ > Tambahkan ke layar utama / Install app.

TROUBLESHOOTING LOGIN
- Jika balik ke pendaftaran: pastikan konfigurasi firebase-config.js benar dan domain shamiunalim.github.io ada di Authorized domains.
- Buka situs lewat HTTPS GitHub Pages, bukan file://.
- Setelah upload, lakukan refresh. Jika versi lama masih tersimpan, Chrome > Info situs > Penyimpanan > Hapus data situs, lalu buka lagi.
- Pastikan popup/redirect tidak diblokir browser.
- Jika muncul error, catat teks error persisnya.

KETERBATASAN VERSI INI
- Semua pesan berada dalam satu Ruang Umum, bukan chat privat.
- Gambar dibatasi 850 KB dan dikirim sebagai data URL dalam dokumen pesan.
- Status online, panggilan suara/video, status/story, OTP telepon, dan notifikasi push belum dibuat.
