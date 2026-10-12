const $ = (id) => document.getElementById(id);
const safeHttpUrl = (raw) => {
  try { const u = new URL(raw.trim()); return ['http:', 'https:'].includes(u.protocol) ? u.href : null; }
  catch { return null; }
};
document.querySelectorAll('.tab').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b === btn));
  $('download').classList.toggle('hidden', btn.dataset.tab !== 'download');
  $('browser').classList.toggle('hidden', btn.dataset.tab !== 'browser');
}));
$('themeBtn').addEventListener('click', () => document.body.classList.toggle('light'));

$('loadVideos').addEventListener('click', () => {
  const grid = $('videoGrid'); grid.replaceChildren();
  const lines = $('videoUrls').value.split(/\n+/).map(s => s.trim()).filter(Boolean);
  if (!lines.length) { $('videoStatus').textContent = 'Masukkan setidaknya satu URL video.'; return; }
  let count = 0;
  for (const line of lines) {
    const url = safeHttpUrl(line);
    if (!url) { $('videoStatus').textContent = 'Sebagian URL tidak valid dan dilewati.'; continue; }
    count++;
    const card = document.createElement('article'); card.className = 'video-card';
    const video = document.createElement('video'); video.controls = true; video.preload = 'metadata'; video.playsInline = true;
    const source = document.createElement('source'); source.src = url; video.append(source);
    video.addEventListener('error', () => { const err = card.querySelector('.play-error'); if (err) err.textContent = 'Video tidak bisa diputar: format tidak didukung, URL bukan file video langsung, atau akses dibatasi server.'; });
    const meta = document.createElement('div'); meta.className = 'video-meta';
    const name = document.createElement('div'); name.className = 'video-name'; name.textContent = url;
    const error = document.createElement('div'); error.className = 'play-error tiny';
    const actions = document.createElement('div'); actions.className = 'video-actions';
    const open = document.createElement('a'); open.href = url; open.target = '_blank'; open.rel = 'noopener noreferrer'; open.textContent = 'Buka URL ↗';
    const save = document.createElement('a'); save.href = url; save.download = ''; save.textContent = 'Simpan';
    save.addEventListener('click', () => { $('videoStatus').textContent = 'Permintaan simpan dikirim. Jika server tidak mengizinkan unduhan lintas situs, video mungkin terbuka di tab baru atau tidak tersimpan.'; });
    actions.append(open, save); meta.append(name, error, actions); card.append(video, meta); grid.append(card);
  }
  $('videoStatus').textContent = `${count} video ditambahkan. Jika URL adalah halaman situs, bukan URL file media langsung, pemutar mungkin tidak bisa membacanya.`;
});
$('clearVideos').addEventListener('click', () => { $('videoUrls').value = ''; $('videoGrid').replaceChildren(); $('videoStatus').textContent = ''; });

let currentExternalUrl = '';
function navigate(raw) {
  const input = raw.trim();
  if (!input) return;
  let url;
  if (/^https?:\/\//i.test(input)) url = safeHttpUrl(input);
  else if (/^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(input)) url = safeHttpUrl('https://' + input);
  else url = $('searchEngine').value + encodeURIComponent(input);
  if (!url) { $('browserStatus').textContent = 'URL tidak valid.'; return; }
  currentExternalUrl = url; $('openExternal').disabled = false;
  $('siteFrame').src = url;
  $('browserStatus').textContent = 'Mencoba memuat halaman. Jika kosong atau ditolak, buka di tab baru.';
}
$('browseForm').addEventListener('submit', e => { e.preventDefault(); navigate($('browseInput').value); });
$('openExternal').addEventListener('click', () => { if (currentExternalUrl) window.open(currentExternalUrl, '_blank', 'noopener,noreferrer'); });
$('clearBrowser').addEventListener('click', () => { $('siteFrame').src = 'about:blank'; $('browseInput').value = ''; currentExternalUrl = ''; $('openExternal').disabled = true; $('browserStatus').textContent = ''; });
