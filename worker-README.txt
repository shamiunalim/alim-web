MAXIEL AI - TANPA URL WORKER

Versi ini tidak meminta pengguna memasukkan URL Worker.
Website memanggil endpoint internal /ai. Service Worker menangkap request
tersebut lalu meneruskan query ke:
https://api.fromscratch.web.id/v1/api/ai/publicai

Alur:
Website -> /ai?query=... -> Service Worker -> Public AI -> data.response

GitHub Pages harus HTTPS agar Service Worker dapat berjalan.
worker.js tetap disertakan sebagai opsi Cloudflare Worker, tetapi website
versi ini tidak membutuhkan URL Cloudflare Worker.

Pengaturan AI:
- Text: jawaban tampil sebagai chat.
- Voice: jawaban tampil dan dibacakan browser.
- Suara otomatis: on/off.
