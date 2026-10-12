import { firebaseConfig } from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, RecaptchaVerifier, signInWithPhoneNumber } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { getFirestore, collection, query, orderBy, limit, getDocs, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

const $ = id => document.getElementById(id);
const authBox = $('auth'), dashboard = $('dashboard');
let auth, db, confirmation = null, recaptcha = null, currentUser = null;

function status(message, error=false) {
  $('auth-status').textContent = message;
  $('auth-status').style.color = error ? '#ff9b9b' : '#ffc878';
}
const configured = firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('YOUR_');
if (!configured) {
  status('Konfigurasi belum diisi. Salin firebase-config.example.js menjadi firebase-config.js dan isi dari Firebase Console.', true);
  $('google').disabled = $('send-otp').disabled = $('verify-otp').disabled = true;
} else {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  $('google').addEventListener('click', async () => {
    try { await signInWithPopup(auth, new GoogleAuthProvider()); }
    catch (e) { status(e.message, true); }
  });
  $('send-otp').addEventListener('click', async () => {
    try {
      if (!recaptcha) recaptcha = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'normal' });
      confirmation = await signInWithPhoneNumber(auth, $('phone').value.trim(), recaptcha);
      status('Kode OTP dikirim jika nomor dan kuota SMS valid.');
    } catch (e) { status(e.message, true); try { await recaptcha?.clear(); } catch {} recaptcha = null; }
  });
  $('verify-otp').addEventListener('click', async () => {
    try {
      if (!confirmation) return status('Minta kode OTP terlebih dahulu.', true);
      await confirmation.confirm($('otp').value.trim());
    } catch (e) { status('Verifikasi gagal. Periksa kode OTP.', true); }
  });
  $('logout').addEventListener('click', () => signOut(auth));
  $('refresh').addEventListener('click', loadNotifications);
  onAuthStateChanged(auth, async user => {
    currentUser = user;
    authBox.classList.toggle('hidden', !!user);
    dashboard.classList.toggle('hidden', !user);
    $('logout').classList.toggle('hidden', !user);
    if (user) {
      $('who').textContent = user.displayName || user.phoneNumber || user.email || 'Akun terverifikasi';
      await loadNotifications();
    }
  });
}

async function loadNotifications() {
  if (!currentUser || !db) return;
  const container = $('items');
  container.innerHTML = '<div class="empty">Memuat...</div>';
  try {
    const q = query(collection(db, 'users', currentUser.uid, 'notifications'), orderBy('createdAt', 'desc'), limit(100));
    const snap = await getDocs(q);
    if (snap.empty) { container.innerHTML = '<div class="empty">Belum ada notifikasi. Login juga di APK pendamping dan aktifkan izin notifikasi.</div>'; return; }
    container.innerHTML = '';
    snap.forEach(s => {
      const d = s.data(), article = document.createElement('article');
      article.className = 'item';
      const top = document.createElement('div'); top.className = 'itemtop';
      const title = document.createElement('h3'); title.textContent = d.title || 'WhatsApp';
      const time = document.createElement('time'); time.textContent = d.postedAt ? new Date(d.postedAt).toLocaleString() : '';
      top.append(title, time);
      const body = document.createElement('p'); body.textContent = d.text || '(Tidak ada teks dalam notifikasi)';
      const del = document.createElement('button'); del.className = 'ghost'; del.textContent = 'Hapus'; del.style.marginTop = '10px';
      del.addEventListener('click', async () => { await deleteDoc(doc(db, 'users', currentUser.uid, 'notifications', s.id)); await loadNotifications(); });
      article.append(top, body, del); container.append(article);
    });
  } catch (e) {
    container.innerHTML = '<div class="empty">Gagal memuat. Pastikan Firestore aktif dan rules sudah dipasang.</div>';
    console.error(e);
  }
}
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(console.error));
