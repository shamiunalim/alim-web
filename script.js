const API_KEY = "Bell409"
const TERMAI = "https://api.termai.cc/api"

const GOATCOUNTER_CODE =
"GANTI_DENGAN_CODE_GOATCOUNTER"

const $ = id =>
document.getElementById(id)

/* ========================================
TOAST
======================================== */

function showToast(message){

const toast = $("toast")

if(!toast) return

toast.textContent = message
toast.classList.add("show")

clearTimeout(window.__toast)

window.__toast =
setTimeout(()=>{
toast.classList.remove("show")
},3000)

}

/* ========================================
SIDEBAR
======================================== */

function openSidebar(){

$("sidebar")?.classList.add("open")
$("drawerOverlay")?.classList.add("show")

}

function closeSidebar(){

$("sidebar")?.classList.remove("open")
$("drawerOverlay")?.classList.remove("show")

}

$("menuButton")?.addEventListener(
"click",
openSidebar
)

$("closeMenu")?.addEventListener(
"click",
closeSidebar
)

$("drawerOverlay")?.addEventListener(
"click",
closeSidebar
)

/* ========================================
SWIPE MENU
======================================== */

let touchStartX = 0
let touchStartY = 0

document.addEventListener(
"touchstart",
event=>{

const touch =
event.touches[0]

touchStartX =
touch.clientX

touchStartY =
touch.clientY

},
{
passive:true
}
)

document.addEventListener(
"touchend",
event=>{

const touch =
event.changedTouches[0]

const endX =
touch.clientX

const endY =
touch.clientY

const diffX =
endX - touchStartX

const diffY =
Math.abs(endY - touchStartY)

if(diffY > 80){
return
}

if(
diffX > 70 &&
touchStartX < 45
){

openSidebar()

}

if(
diffX < -70 &&
$("sidebar")?.classList.contains("open")
){

closeSidebar()

}

},
{
passive:true
}
)

/* ========================================
NAVIGATION
======================================== */

const pageNames = {

dashboard:"DASHBOARD",

tiktok:"TIKTOK DOWNLOADER",

instagram:"INSTAGRAM DOWNLOADER",

facebook:"FACEBOOK DOWNLOADER",

time:"WAKTU SEKARANG",

developer:"DEVELOPER"

}

function openPage(page){

document.querySelectorAll(".page")
.forEach(element=>{
element.classList.remove("active")
})

const target =
$("page-${page}")

if(!target){
return
}

target.classList.add("active")

document.querySelectorAll(".nav-item")
.forEach(button=>{

button.classList.toggle(
"active",
button.dataset.page === page
)

})

const title =
$("pageTitle")

if(title){

title.textContent =
pageNames[page] || "DASHBOARD"

}

closeSidebar()

window.scrollTo({
top:0,
behavior:"smooth"
})

}

document.querySelectorAll(
".nav-item"
).forEach(button=>{

button.addEventListener(
"click",
event=>{

event.preventDefault()

const page =
button.dataset.page

if(page){
openPage(page)
}

}
)

})

/* ========================================
TIME
======================================== */

function getHijri(){

const now =
new Date()

try{

return now.toLocaleDateString(
"ar-SA-u-ca-islamic",
{
day:"numeric",
month:"long",
year:"numeric"
}
) + " H"

}catch{

return "Kalender Hijriyah"

}

}

function updateTime(){

const now =
new Date()

const clock =
now.toLocaleTimeString(
"id-ID",
{
hour:"2-digit",
minute:"2-digit",
second:"2-digit",
hour12:false
}
)

const day =
now.toLocaleDateString(
"id-ID",
{
weekday:"long"
}
)

const date =
now.toLocaleDateString(
"id-ID",
{
day:"2-digit",
month:"long",
year:"numeric"
}
)

const hijri =
getHijri()

/* TOPBAR */

if($("clock")){
$("clock").textContent =
clock
}

if($("day")){
$("day").textContent =
day
}

if($("date")){
$("date").textContent =
date
}

if($("hijriSmall")){
$("hijriSmall").textContent =
hijri
}

/* DASHBOARD */

if($("dashboardClock")){
$("dashboardClock").textContent =
clock
}

if($("dashboardDay")){
$("dashboardDay").textContent =
day
}

if($("dashboardDate")){
$("dashboardDate").textContent =
date
}

if($("dashboardHijri")){
$("dashboardHijri").textContent =
hijri
}

/* TIME PAGE */

if($("fullClock")){
$("fullClock").textContent =
clock
}

if($("fullDay")){
$("fullDay").textContent =
day
}

if($("fullDate")){
$("fullDate").textContent =
date
}

if($("fullHijri")){
$("fullHijri").textContent =
hijri
}

if($("timezone")){

$("timezone").textContent =
Intl.DateTimeFormat()
.resolvedOptions()
.timeZone

}

}

/* ========================================
DOWNLOADER
======================================== */

function escapeHtml(value){

return String(value ?? "")
.replace(/&/g,"&")
.replace(/</g,"<")
.replace(/>/g,">")
.replace(/"/g,""")
.replace(/'/g,"'")

}

function setLoading(container){

if(!container){
return
}

container.innerHTML = `

<div class="loading">
⏳ Sedang memproses...
</div>
`}

function getMediaArray(data){

if(!data){
return []
}

const output = []

function collect(value){

if(!value){
return
}

if(typeof value === "string"){

if(/^https?:///i.test(value)){

output.push({
url:value,
type:"video"
})

}

return
}

if(Array.isArray(value)){

value.forEach(collect)

return
}

if(typeof value !== "object"){
return
}

const direct =
value.url ||
value.download ||
value.link ||
value.src ||
value.play ||
value.play_url ||
value.hdplay ||
value.wmplay

if(typeof direct === "string"){

output.push({

url:direct,

type:
value.type ||
value.mime ||
"video",

title:
value.title ||
value.name ||
""

})

}

Object.entries(value)
.forEach(([key,value])=>{

if(
typeof value === "string" &&
/^(url|download|link|src|play|play_url|hdplay|wmplay)$/i
.test(key) &&
/^https?:///i.test(value)
){

output.push({
url:value,
type:"video"
})

}

})

}

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

candidates.forEach(collect)

return output.filter(
(item,index,array)=>
item.url &&
array.findIndex(
x=>x.url === item.url
) === index
)

}

function renderDownloaderResult(
container,
data
){

if(!container){
return
}

const medias =
getMediaArray(data)

if(!medias.length){

container.innerHTML = `

<div class="error">
❌ Media tidak ditemukan dari API.
</div>
`return
}

container.innerHTML =
medias.map(
(media,index)=>{

const url =
escapeHtml(media.url)

const title =
escapeHtml(
media.title ||
"Media ${index+1}"
)

const isImage =
/image|jpg|jpeg|png|webp|gif/i
.test(media.type || "") ||
/.(jpg|jpeg|png|webp|gif)(?|$)/i
.test(media.url)

return `

<div class="result-card">${
isImage
?
`
<img
src="${url}"
alt="${title}"
loading="lazy"

«»

":"
<video
controls
preload="metadata"
src="${url}">
</video>
`
}

<div class="result-actions"><a
href="${url}"
target="_blank"
rel="noopener"

«»

Open
</a>

<a
href="${url}"
download

«»

Download
</a>

</div></div>`

}
).join("")

}

/* ========================================
TIKTOK
======================================== */

async function downloadTikTok(){

const input =
$("tiktokUrl")

const result =
$("tiktokResult")

const url =
input?.value.trim()

if(!url){

showToast(
"Masukkan URL TikTok."
)

return
}

setLoading(result)

try{

const body =
new URLSearchParams()

body.set(
"url",
url
)

const response =
await fetch(
"https://www.tikwm.com/api/",
{
method:"POST",
headers:{
"Content-Type":
"application/x-www-form-urlencoded; charset=UTF-8"
},
body
}
)

const data =
await response.json()

if(
!response.ok ||
data.code !== 0
){

throw new Error(
data.msg ||
"TikTok API gagal"
)

}

renderDownloaderResult(
result,
data.data
)

}catch(error){

console.error(error)

result.innerHTML = `

<div class="error">
❌ Gagal mengambil video TikTok.
<br>
<small>
${escapeHtml(error.message)}
</small>
</div>
`}

}

$("tiktokBtn")?.addEventListener(
"click",
downloadTikTok
)

$("tiktokUrl")?.addEventListener(
"keydown",
event=>{

if(event.key === "Enter"){
downloadTikTok()
}

}
)

/* ========================================
INSTAGRAM
======================================== */

async function downloadInstagram(){

const input =
$("instagramUrl")

const result =
$("instagramResult")

const url =
input?.value.trim()

if(!url){

showToast(
"Masukkan URL Instagram."
)

return
}

setLoading(result)

try{

const endpoint =
"${TERMAI}/downloader/instagram?url=${encodeURIComponent(url)}&key=${encodeURIComponent(API_KEY)}"

const response =
await fetch(endpoint)

const data =
await response.json()

if(!response.ok){

throw new Error(
data?.message ||
"Instagram API gagal"
)

}

renderDownloaderResult(
result,
data
)

}catch(error){

console.error(error)

result.innerHTML = `

<div class="error">
❌ Gagal mengambil media Instagram.
<br>
<small>
${escapeHtml(error.message)}
</small>
</div>
`}

}

$("instagramBtn")?.addEventListener(
"click",
downloadInstagram
)

$("instagramUrl")?.addEventListener(
"keydown",
event=>{

if(event.key === "Enter"){
downloadInstagram()
}

}
)

/* ========================================
FACEBOOK
======================================== */

async function downloadFacebook(){

const input =
$("facebookUrl")

const result =
$("facebookResult")

const url =
input?.value.trim()

if(!url){

showToast(
"Masukkan URL Facebook."
)

return
}

setLoading(result)

try{

const endpoint =
"${TERMAI}/downloader/facebook?url=${encodeURIComponent(url)}&key=${encodeURIComponent(API_KEY)}"

const response =
await fetch(endpoint)

const data =
await response.json()

if(!response.ok){

throw new Error(
data?.message ||
"Facebook API gagal"
)

}

renderDownloaderResult(
result,
data
)

}catch(error){

console.error(error)

result.innerHTML = `

<div class="error">
❌ Gagal mengambil video Facebook.
<br>
<small>
${escapeHtml(error.message)}
</small>
</div>
`}

}

$("facebookBtn")?.addEventListener(
"click",
downloadFacebook
)

$("facebookUrl")?.addEventListener(
"keydown",
event=>{

if(event.key === "Enter"){
downloadFacebook()
}

}
)

/* ========================================
MUSIC
======================================== */

const music =
$("backgroundMusic")

let musicStarted = false

async function startMusic(){

if(!music){
return
}

if(musicStarted){
return
}

try{

music.volume = .45

await music.play()

musicStarted = true

if($("musicStatus")){
$("musicStatus").textContent =
"Playing"
}

if($("musicToggle")){
$("musicToggle").textContent =
"❚❚"
}

}catch(error){

if($("musicStatus")){
$("musicStatus").textContent =
"Tap untuk play"
}

}

}

function toggleMusic(){

if(!music){
return
}

if(music.paused){

music.play()
.then(()=>{

musicStarted = true

if($("musicStatus")){
$("musicStatus").textContent =
"Playing"
}

if($("musicToggle")){
$("musicToggle").textContent =
"❚❚"
}

})
.catch(()=>{

showToast(
"Browser memblokir autoplay."
)

})

}else{

music.pause()

if($("musicStatus")){
$("musicStatus").textContent =
"Paused"
}

if($("musicToggle")){
$("musicToggle").textContent =
"▶"
}

}

}

$("musicToggle")?.addEventListener(
"click",
toggleMusic
)

window.addEventListener(
"load",
()=>{

setTimeout(
startMusic,
600
)

}
)

document.addEventListener(
"pointerdown",
()=>{
startMusic()
},
{
once:true,
passive:true
}
)

document.addEventListener(
"keydown",
()=>{
startMusic()
},
{
once:true
}
)

/* ========================================
GOATCOUNTER
======================================== */

function setupGoatCounter(){

if(
!GOATCOUNTER_CODE ||
GOATCOUNTER_CODE ===
"GANTI_DENGAN_CODE_GOATCOUNTER"
){

console.info(
"GoatCounter belum dikonfigurasi."
)

return
}

const script =
document.createElement("script")

script.async = true

script.src =
"//gc.zgo.at/count.js"

script.dataset.goatcounter =
"https://${GOATCOUNTER_CODE}.goatcounter.com/count"

document.head.appendChild(script)

}

/* ========================================
INIT
======================================== */

updateTime()

setInterval(
updateTime,
1000
)

setupGoatCounter()