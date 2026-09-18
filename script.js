const API_KEY = "Bell409"
const TERMAI = "https://api.termai.cc/api"

/*

MAXIEL WEB CONFIG

1. Buat akun/site di GoatCounter:
   https://www.goatcounter.com/

2. Masukkan kode site kamu di bawah.
   Contoh:
   const GOATCOUNTER_CODE = "abc123"

3. Jika belum punya GoatCounter, biarkan kosong.
   */

const GOATCOUNTER_CODE = "GANTI_DENGAN_CODE_GOATCOUNTER"

const DEPLOYMENT_FILE = "./deployment.json"

const startedFallback = Date.now()

let deploymentStarted = startedFallback
let deploymentLoaded = false

const $ = id => document.getElementById(id)

function escapeHtml(value) {
return String(value ?? "")
.replace(/&/g,"&")
.replace(/</g,"<")
.replace(/>/g,">")
.replace(/"/g,""")
.replace(/'/g,"'")
}

function formatNumber(value) {
const number = Number(value)

if (!Number.isFinite(number)) return "—"

return new Intl.NumberFormat("id-ID").format(number)
}

function showToast(message) {
const toast = $("toast")

if (!toast) return

toast.textContent = message
toast.classList.add("show")

clearTimeout(window.__toastTimer)

window.__toastTimer = setTimeout(() => {
toast.classList.remove("show")
},3000)
}

/* ========================================
NAVIGATION
======================================== */

const pageTitles = {
dashboard: "DASHBOARD",
tiktok: "TIKTOK DOWNLOADER",
instagram: "INSTAGRAM DOWNLOADER",
facebook: "FACEBOOK DOWNLOADER",
runtime: "WEB RUNTIME",
system: "SYSTEM",
developer: "DEVELOPER"
}

const headerTitles = {
dashboard: "Dashboard",
tiktok: "TikTok Downloader",
instagram: "Instagram Downloader",
facebook: "Facebook Downloader",
runtime: "Web Runtime",
system: "System Information",
developer: "Developer"
}

function openPage(page) {

document.querySelectorAll(".page").forEach(el => {
el.classList.remove("active")
})

const target = $("page-${page}")

if (target) {
target.classList.add("active")
}

document.querySelectorAll(".nav-item").forEach(el => {
el.classList.toggle("active",el.dataset.page === page)
})

$("pageTitle").textContent = pageTitles[page] || "DASHBOARD"
$("headerTitle").textContent = headerTitles[page] || "Dashboard"

$("sidebar")?.classList.remove("open")

if (page === "runtime") {
updateRuntime()
}

window.scrollTo({
top: 0,
behavior: "smooth"
})
}

document.querySelectorAll("[data-page]").forEach(button => {
button.addEventListener("click",() => {
openPage(button.dataset.page)
})
})

$("mobileMenu")?.addEventListener("click",() => {
$("sidebar")?.classList.toggle("open")
})

/* ========================================
CLOCK
======================================== */

function updateClock() {

const now = new Date()

const time = now.toLocaleTimeString("id-ID",{
hour:"2-digit",
minute:"2-digit",
second:"2-digit",
hour12:false
})

const date = now.toLocaleDateString("id-ID",{
weekday:"long",
day:"2-digit",
month:"long",
year:"numeric"
})

if ($("clock")) {
$("clock").textContent = time
}

if ($("date")) {
$("date").textContent = date
}
}

/* ========================================
DEPLOYMENT RUNTIME
======================================== */

async function loadDeploymentTime() {

try {

const response = await fetch("${DEPLOYMENT_FILE}?v=${Date.now()}",{
cache:"no-store"
})

if (!response.ok) {
throw new Error("deployment.json tidak ditemukan")
}

const data = await response.json()

const timestamp = Date.parse(data.deployedAt)

if (!Number.isFinite(timestamp)) {
throw new Error("deployedAt tidak valid")
}

deploymentStarted = timestamp
deploymentLoaded = true

if ($("deploymentTime")) {

$("deploymentTime").textContent =
new Date(deploymentStarted).toLocaleString("id-ID",{
dateStyle:"medium",
timeStyle:"medium",
hour12:false
})

}

updateRuntime()

} catch(error) {

deploymentStarted = startedFallback
deploymentLoaded = false

if ($("deploymentTime")) {
$("deploymentTime").textContent = "Deployment time belum tersedia"
}

updateRuntime()

console.warn("Runtime deployment:",error)

}
}

function formatRuntime(ms) {

if (!Number.isFinite(ms) || ms < 0) {
ms = 0
}

let totalSeconds = Math.floor(ms / 1000)

const days = Math.floor(totalSeconds / 86400)

totalSeconds %= 86400

const hours = Math.floor(totalSeconds / 3600)

totalSeconds %= 3600

const minutes = Math.floor(totalSeconds / 60)

const seconds = totalSeconds % 60

return [
String(days).padStart(2,"0"),
String(hours).padStart(2,"0"),
String(minutes).padStart(2,"0"),
String(seconds).padStart(2,"0")
].join(":")
}

function updateRuntime() {

const elapsed = Date.now() - deploymentStarted

const value = formatRuntime(elapsed)

if ($("runtime")) {
$("runtime").textContent = value
}

if ($("runtimeBig")) {
$("runtimeBig").textContent = value
}

if ($("lastUpdate")) {

$("lastUpdate").textContent =
new Date().toLocaleTimeString("id-ID",{
hour:"2-digit",
minute:"2-digit",
second:"2-digit",
hour12:false
})

}

}

/* ========================================
SYSTEM INFO
======================================== */

function detectBrowser() {

const ua = navigator.userAgent

if (/Edg//i.test(ua)) return "Microsoft Edge"

if (/OPR//i.test(ua)) return "Opera"

if (/Chrome//i.test(ua)) return "Google Chrome"

if (/Firefox//i.test(ua)) return "Mozilla Firefox"

if (/Safari//i.test(ua) && !/Chrome/i.test(ua)) {
return "Safari"
}

return "Unknown"
}

function updateSystem() {

if ($("sysPlatform")) {
$("sysPlatform").textContent = navigator.platform || "Unknown"
}

if ($("sysBrowser")) {
$("sysBrowser").textContent = detectBrowser()
}

if ($("sysLanguage")) {
$("sysLanguage").textContent = navigator.language || "Unknown"
}

if ($("sysScreen")) {
$("sysScreen").textContent =
"${screen.width} × ${screen.height}"
}

if ($("sysViewport")) {
$("sysViewport").textContent =
"${window.innerWidth} × ${window.innerHeight}"
}

if ($("sysTimezone")) {
$("sysTimezone").textContent =
Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown"
}

if ($("sysConnection")) {

const connection =
navigator.connection ||
navigator.mozConnection ||
navigator.webkitConnection

$("sysConnection").textContent =
connection?.effectiveType || "Unknown"

}

if ($("sysCookies")) {
$("sysCookies").textContent =
navigator.cookieEnabled ? "Enabled" : "Disabled"
}
}

/* ========================================
DOWNLOADER HELPERS
======================================== */

function getMediaArray(data) {

if (!data) return []

const candidates = [
data.data,
data.result,
data.results,
data.medias,
data.media,
data.url,
data.urls,
data.download,
data.downloads
]

const output = []

function collect(value) {

if (!value) return

if (typeof value === "string") {

if (/^https?:///i.test(value)) {
output.push({
url:value,
type:"video"
})
}

return
}

if (Array.isArray(value)) {

value.forEach(collect)

return
}

if (typeof value !== "object") return

const url =
value.url ||
value.download ||
value.link ||
value.src ||
value.play ||
value.play_url ||
value.hdplay ||
value.wmplay

if (typeof url === "string") {

output.push({
url,
type:value.type || value.mime || "video",
title:value.title || value.name || ""
})

}

Object.entries(value).forEach(([key,val]) => {

if (
typeof val === "string" &&
/^(url|download|link|src|play|play_url|hdplay|wmplay)$/i.test(key) &&
/^https?:///i.test(val)
) {

output.push({
url:val,
type:"video"
})

}

})

}

candidates.forEach(collect)

return output.filter((item,index,array) =>
item.url &&
array.findIndex(x => x.url === item.url) === index
)
}

function renderDownloaderResult(container,data) {

if (!container) return

const medias = getMediaArray(data)

if (!medias.length) {

container.innerHTML = `

<div class="error">
❌ Link download tidak ditemukan dari API.
</div>
`return
}

const html = medias.map((media,index) => {

const url = escapeHtml(media.url)
const title = escapeHtml(media.title || "Media ${index + 1}")

const isImage =
/image|jpg|jpeg|png|webp|gif/i.test(media.type || "") ||
/.(jpg|jpeg|png|webp|gif)(?|$)/i.test(media.url)

return `

<div class="result-card">${
isImage
? "<img src="${url}" alt="${title}" loading="lazy">"
: "<video controls preload="metadata" src="${url}"></video>"
}

<div class="result-actions"><a href="${url}" target="_blank" rel="noopener">
Open
</a><a href="${url}" download>
Download
</a></div></div>
`}).join("")

container.innerHTML = html
}

function setLoading(container) {

if (!container) return

container.innerHTML = `

<div class="loading">
⏳ Processing...
</div>
`
}/* ========================================
TIKTOK
======================================== */

async function downloadTikTok() {

const input = $("tiktokUrl")

const container = $("tiktokResult")

const url = input?.value.trim()

if (!url) {

showToast("Masukkan URL TikTok terlebih dahulu.")

return
}

setLoading(container)

try {

const body = new URLSearchParams()

body.set("url",url)

const response = await fetch("https://www.tikwm.com/api/",{
method:"POST",
headers:{
"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"
},
body
})

const data = await response.json()

if (!response.ok || data.code !== 0) {
throw new Error(data.msg || "TikTok API gagal")
}

renderDownloaderResult(container,data.data)

} catch(error) {

console.error(error)

container.innerHTML = `

<div class="error">
❌ Gagal mengambil video TikTok.<br>
<small>${escapeHtml(error.message)}</small>
</div>
`}
}

$("tiktokBtn")?.addEventListener("click",downloadTikTok)

$("tiktokUrl")?.addEventListener("keydown",event => {

if (event.key === "Enter") {
downloadTikTok()
}

})

/* ========================================
INSTAGRAM
======================================== */

async function downloadInstagram() {

const input = $("instagramUrl")

const container = $("instagramResult")

const url = input?.value.trim()

if (!url) {

showToast("Masukkan URL Instagram terlebih dahulu.")

return
}

setLoading(container)

try {

const endpoint =
"${TERMAI}/downloader/instagram?url=${encodeURIComponent(url)}&key=${encodeURIComponent(API_KEY)}"

const response = await fetch(endpoint)

const data = await response.json()

if (!response.ok) {
throw new Error(data?.message || "Instagram API gagal")
}

renderDownloaderResult(container,data)

} catch(error) {

console.error(error)

container.innerHTML = `

<div class="error">
❌ Gagal mengambil media Instagram.<br>
<small>${escapeHtml(error.message)}</small>
</div>
`}
}

$("instagramBtn")?.addEventListener("click",downloadInstagram)

$("instagramUrl")?.addEventListener("keydown",event => {

if (event.key === "Enter") {
downloadInstagram()
}

})

/* ========================================
FACEBOOK
======================================== */

async function downloadFacebook() {

const input = $("facebookUrl")

const container = $("facebookResult")

const url = input?.value.trim()

if (!url) {

showToast("Masukkan URL Facebook terlebih dahulu.")

return
}

setLoading(container)

try {

const endpoint =
"${TERMAI}/downloader/facebook?url=${encodeURIComponent(url)}&key=${encodeURIComponent(API_KEY)}"

const response = await fetch(endpoint)

const data = await response.json()

if (!response.ok) {
throw new Error(data?.message || "Facebook API gagal")
}

renderDownloaderResult(container,data)

} catch(error) {

console.error(error)

container.innerHTML = `

<div class="error">
❌ Gagal mengambil video Facebook.<br>
<small>${escapeHtml(error.message)}</small>
</div>
`}
}

$("facebookBtn")?.addEventListener("click",downloadFacebook)

$("facebookUrl")?.addEventListener("keydown",event => {

if (event.key === "Enter") {
downloadFacebook()
}

})

/* ========================================
GOATCOUNTER
======================================== */

function setupGoatCounter() {

if (
!GOATCOUNTER_CODE ||
GOATCOUNTER_CODE === "GANTI_DENGAN_CODE_GOATCOUNTER"
) {

console.warn(
"GoatCounter belum dikonfigurasi. Isi GOATCOUNTER_CODE di script.js."
)

if ($("totalUsers")) {
$("totalUsers").textContent = "—"
}

if ($("totalViews")) {
$("totalViews").textContent = "—"
}

return
}

const script = document.createElement("script")

script.async = true

script.src = "//gc.zgo.at/count.js"

script.dataset.goatcounter =
"https://${GOATCOUNTER_CODE}.goatcounter.com/count"

script.onload = () => {

loadGoatCounterTotals()

}

script.onerror = () => {

console.warn("GoatCounter gagal dimuat.")

}

document.head.appendChild(script)

}

async function loadGoatCounterTotals() {

if (
!GOATCOUNTER_CODE ||
GOATCOUNTER_CODE === "GANTI_DENGAN_CODE_GOATCOUNTER"
) {
return
}

try {

const path = encodeURIComponent("/")

const response = await fetch(
"https://${GOATCOUNTER_CODE}.goatcounter.com/counter/${path}.json",
{
cache:"no-store"
}
)

if (!response.ok) {
throw new Error("Counter endpoint gagal")
}

const data = await response.json()

const pageViews = Number(
data.count ??
data.count_unique ??
0
)

if ($("totalViews")) {
$("totalViews").textContent =
formatNumber(pageViews)
}

/*
GoatCounter membedakan visits dan pageviews.
Untuk tampilan sederhana, kita menggunakan count
dari counter sebagai angka kunjungan pada halaman utama.
*/

if ($("totalUsers")) {
$("totalUsers").textContent =
formatNumber(pageViews)
}

} catch(error) {

console.warn("Statistik GoatCounter:",error)

if ($("totalUsers")) {
$("totalUsers").textContent = "—"
}

if ($("totalViews")) {
$("totalViews").textContent = "—"
}

}
}

/* ========================================
INIT
======================================== */

updateClock()
updateRuntime()
updateSystem()

setInterval(updateClock,1000)
setInterval(updateRuntime,1000)
setInterval(updateSystem,5000)

loadDeploymentTime()

setupGoatCounter()
