# Zhenith Connect — starter project

Starter untuk **web chat + login Google/nomor telepon + APK Android pendamping** yang menampilkan notifikasi WhatsApp yang diizinkan Android.

## Batasan penting
- Ini **bukan klien WhatsApp** dan tidak dapat membuka database/seluruh riwayat chat WhatsApp.
- Android hanya membaca konten yang tersedia di notifikasi WhatsApp setelah pengguna sendiri mengaktifkan Notification Access.
- Foto/video/file WhatsApp tidak otomatis dapat diunduh atau dibaca. Notifikasi mungkin hanya berisi teks atau ringkasan.
- Demo ini menyimpan metadata notifikasi yang tersedia ke Firestore setelah pengguna login dan mengaktifkan izin. Jangan gunakan untuk memantau orang lain tanpa persetujuan.
- Firebase dan Google OAuth memerlukan konfigurasi proyek sendiri. Nomor telepon OTP dapat menimbulkan biaya/kuota SMS.
- APK harus dibangun dari proyek Android dengan Android Studio/Gradle yang sesuai. ZIP ini berisi source, bukan APK yang sudah ditandatangani.

## Bagian proyek
- `web/`: PWA (GitHub Pages) untuk login dan melihat notifikasi tersinkron.
- `android/`: proyek Android Kotlin untuk login Google/email/telepon (kerangka) dan NotificationListenerService.
- `firebase/firestore.rules`: aturan data per pengguna.
- `firebase/SETUP.md`: langkah konfigurasi.

## 1. Siapkan Firebase
Ikuti `firebase/SETUP.md`. Aktifkan Authentication providers Google dan Phone, buat Firestore, pasang rules dari `firebase/firestore.rules`.

Untuk web, salin `web/firebase-config.example.js` menjadi `web/firebase-config.js` dan isi konfigurasi Web App Firebase. Konfigurasi Firebase web bukan password admin, tetapi tetap atur domain resmi dan Firestore Security Rules.

Untuk Android, buat/daftarkan aplikasi Android di Firebase dengan package `site.maxiel.zhenithconnect`, unduh `google-services.json`, lalu letakkan di `android/app/google-services.json`. Tambahkan SHA-1/SHA-256 untuk Google Sign-In sesuai dokumentasi Firebase.

## 2. Jalankan web
Buka `web/index.html` lewat hosting HTTPS. Untuk GitHub Pages, upload isi folder `web/` ke repo atau sesuaikan workflow. Ganti placeholder di `firebase-config.js` terlebih dahulu. Login web mendukung Google dan nomor telepon via Firebase Phone Auth + reCAPTCHA.

## 3. Bangun APK
Buka folder `android/` dengan Android Studio versi modern, sync Gradle, tambahkan `google-services.json`, dan build APK. Source contoh ini mungkin memerlukan penyesuaian versi plugin/SDK sesuai Android Studio yang terpasang.

Di APK:
1. Login dengan akun Firebase yang sama.
2. Tekan **Buka izin notifikasi**.
3. Aktifkan **Zhenith Connect** pada pengaturan Android.
4. Kembali ke aplikasi dan aktifkan sinkronisasi.

## 4. Privasi
Data tersimpan di `users/{uid}/notifications` dan hanya UID pemilik yang dapat membaca. Pengguna bisa menghapus catatan dari dashboard. Untuk produksi, tambahkan penghapusan massal, kebijakan privasi, batas retensi, dan audit keamanan.

## Catatan implementasi
- Filter hanya paket WhatsApp Messenger (`com.whatsapp`). WhatsApp Business tidak termasuk; tambahkan `com.whatsapp.w4b` secara eksplisit jika memang diperlukan.
- Notifikasi dapat tidak lengkap, tertunda, dikelompokkan, atau tidak muncul karena pengaturan WhatsApp/Android.
- Jangan gunakan untuk melewati enkripsi WhatsApp atau mengambil pesan yang tidak ditampilkan sebagai notifikasi.
