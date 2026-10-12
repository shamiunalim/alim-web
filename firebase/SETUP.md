# Setup Firebase

1. Buka https://console.firebase.google.com/ lalu buat project.
2. Authentication → Sign-in method: aktifkan **Google** dan **Phone**.
3. Untuk Phone Auth web, isi authorized domains pada Authentication → Settings. Firebase akan memakai reCAPTCHA untuk web.
4. Buat database Firestore.
5. Tempel rules dari `firestore.rules`.
6. Tambahkan Web App, salin konfigurasi ke `web/firebase-config.js`.
7. Tambahkan Android App dengan package `site.maxiel.zhenithconnect`, unduh `google-services.json` ke `android/app/`.
8. Di Google provider, ikuti petunjuk support email. Untuk Android Google Sign-In, tambahkan SHA fingerprints dari signing key.
9. Jangan pernah memasukkan service-account private key atau Admin SDK credential ke web/ZIP publik.

## Phone OTP
Firebase Phone Auth memiliki kuota dan ketentuan SMS. Gunakan nomor tes di Firebase Authentication saat development agar tidak mengirim SMS sungguhan terus-menerus.

## Hosting GitHub Pages
PWA harus diakses lewat HTTPS. Firebase Auth authorized domains harus mencakup domain GitHub Pages yang dipakai. `firebase-config.js` tidak boleh berisi rahasia server.
