MAXIEL AI WORKER

File: worker.js
Target: Cloudflare Workers

1. Buat Worker baru di Cloudflare.
2. Salin seluruh isi worker.js ke Worker tersebut.
3. Deploy.
4. URL Worker biasanya seperti:
   https://nama-worker.username.workers.dev
5. Endpoint AI:
   https://nama-worker.username.workers.dev/ai?query=Halo
6. Di website buka:
   Pengaturan -> AI Worker
   lalu masukkan URL Worker TANPA /ai.

Worker meneruskan query ke:
https://api.fromscratch.web.id/v1/api/ai/publicai?query=...

Website tidak memanggil Public AI secara langsung; request AI diarahkan melalui Worker.


CATATAN:
- File worker.js berada di root ZIP sebagai template Cloudflare Worker.
- Jangan menaruh token rahasia di app.js atau GitHub Pages. Worker ini tidak membutuhkan token untuk endpoint Public AI yang digunakan.
- Setelah deploy Worker, masukkan URL Worker di menu Pengaturan -> AI Worker pada website.
- URL yang disimpan di browser bersifat lokal untuk perangkat/browser tersebut.
