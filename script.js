const TERMAI_KEY = "Bell409"

const started = Date.now()

const menus = document.querySelectorAll(".menu")
const pages = document.querySelectorAll(".page")
const pageTitle = document.getElementById("pageTitle")
const sidebar = document.getElementById("sidebar")
const mobileMenu = document.getElementById("mobileMenu")
const toast = document.getElementById("toast")

const titles = {
dashboard:"Dashboard",
tiktok:"TikTok Downloader",
instagram:"Instagram Downloader",
facebook:"Facebook Downloader",
removebg:"Remove Background",
tourl:"ToURL",
system:"System Information",
runtime:"Web Runtime",
about:"About Maxiel"
}

function showPage(target){

menus.forEach(menu=>{
menu.classList.toggle(
"active",
menu.dataset.page===target
)
})

pages.forEach(page=>{
page.classList.toggle(
"active",
page.id===target
)
})

pageTitle.textContent =
titles[target] || "Maxiel"

sidebar.classList.remove("open")

window.scrollTo({
top:0,
behavior:"smooth"
})

}

menus.forEach(menu=>{
menu.addEventListener("click",()=>{
showPage(menu.dataset.page)
})
})

document.querySelectorAll("[data-open]")
.forEach(button=>{
button.addEventListener("click",()=>{
showPage(button.dataset.open)
})
})

mobileMenu.addEventListener("click",()=>{
sidebar.classList.toggle("open")
})


function showToast(message){

toast.textContent=message

toast.classList.add("show")

clearTimeout(showToast.timer)

showToast.timer=setTimeout(()=>{
toast.classList.remove("show")
},3000)

}


function updateClock(){

const now=new Date()

const time=
now.toLocaleTimeString(
"id-ID",
{
hour:"2-digit",
minute:"2-digit",
second:"2-digit",
hour12:false
}
)

const date=
now.toLocaleDateString(
"id-ID",
{
weekday:"long",
day:"numeric",
month:"long",
year:"numeric"
}
)

document.getElementById("clock")
.textContent=time

document.getElementById("date")
.textContent=date

document.getElementById("lastUpdate")
.textContent=time

document.getElementById("runtimeCurrent")
.textContent=time

}


function formatRuntime(ms){

let seconds=
Math.floor(ms/1000)

const days=
Math.floor(seconds/86400)

seconds%=86400

const hours=
Math.floor(seconds/3600)

seconds%=3600

const minutes=
Math.floor(seconds/60)

seconds%=60

return(
String(days).padStart(2,"0")+
":"+
String(hours).padStart(2,"0")+
":"+
String(minutes).padStart(2,"0")+
":"+
String(seconds).padStart(2,"0")
)

}


function updateRuntime(){

const value=
formatRuntime(
Date.now()-started
)

document.getElementById("runtime")
.textContent=value

document.getElementById("runtimeBig")
.textContent=value

}


function detectBrowser(){

const ua=navigator.userAgent

if(/Edg/i.test(ua))
return "Microsoft Edge"

if(/OPR/i.test(ua))
return "Opera"

if(/Firefox/i.test(ua))
return "Mozilla Firefox"

if(/Chrome/i.test(ua))
return "Google Chrome"

if(/Safari/i.test(ua))
return "Safari"

return "Unknown Browser"

}


function detectPlatform(){

const ua=navigator.userAgent

if(/Android/i.test(ua))
return "Android"

if(/iPhone|iPad|iPod/i.test(ua))
return "iOS"

if(/Windows/i.test(ua))
return "Windows"

if(/Mac/i.test(ua))
return "macOS"

if(/Linux/i.test(ua))
return "Linux"

return navigator.platform || "Unknown"

}


function updateSystem(){

const platform=
detectPlatform()

const browser=
detectBrowser()

const language=
navigator.language || "-"

const screenSize=
`${screen.width} × ${screen.height}`

const viewport=
`${window.innerWidth} × ${window.innerHeight}`

const timezone=
Intl.DateTimeFormat()
.resolvedOptions()
.timeZone || "-"

let connection="Unknown"

if(navigator.connection){

connection=
navigator.connection.effectiveType ||
"Connected"

}

const cookies=
navigator.cookieEnabled
?"Enabled"
:"Disabled"

document.getElementById("platform")
.textContent=platform

document.getElementById("browser")
.textContent=browser

document.getElementById("language")
.textContent=language

document.getElementById("screen")
.textContent=screenSize

document.getElementById("sysPlatform")
.textContent=platform

document.getElementById("sysBrowser")
.textContent=browser

document.getElementById("sysLanguage")
.textContent=language

document.getElementById("sysScreen")
.textContent=screenSize

document.getElementById("sysViewport")
.textContent=viewport

document.getElementById("sysTimezone")
.textContent=timezone

document.getElementById("timezoneShort")
.textContent=timezone

document.getElementById("sysConnection")
.textContent=connection

document.getElementById("sysCookies")
.textContent=cookies

}


function updateStarted(){

const start=
new Date(started)

const value=
start.toLocaleTimeString(
"id-ID",
{
hour:"2-digit",
minute:"2-digit",
second:"2-digit"
}
)

document.getElementById("startedAt")
.textContent=value

document.getElementById("runtimeStarted")
.textContent=value

}


function escapeHtml(value){

return String(value)
.replaceAll("&","&amp;")
.replaceAll("<","&lt;")
.replaceAll(">","&gt;")
.replaceAll('"',"&quot;")
.replaceAll("'","&#039;")

}


function validUrl(value){

try{

new URL(value)

return true

}catch{

return false

}

}


function collectUrls(value,result=[]){

if(!value)
return result

if(typeof value==="string"){

if(validUrl(value))
result.push(value)

return result

}

if(Array.isArray(value)){

value.forEach(item=>{
collectUrls(item,result)
})

return result

}

if(typeof value==="object"){

Object.entries(value)
.forEach(([key,item])=>{

const k=key.toLowerCase()

if(typeof item==="string"){

if(
k.includes("url")||
k.includes("download")||
k.includes("video")||
k.includes("image")||
k.includes("audio")||
k.includes("media")||
k.includes("play")
){

collectUrls(item,result)

}

}else if(typeof item==="object"){

collectUrls(item,result)

}

})

}

return result

}


function uniqueUrls(urls){

return [...new Set(urls)]

}


function renderUrls(data,title){

const urls=
uniqueUrls(
collectUrls(data)
)

if(!urls.length){

return `
<div class="result-box">
<p>
${escapeHtml(title)}
berhasil diproses, tetapi URL media
tidak ditemukan pada response API.
</p>
</div>
`

}

const html=
urls.slice(0,15)
.map((url,index)=>`

<div class="result-box">

<p>Media ${index+1}</p>

<a
class="result-link"
href="${escapeHtml(url)}"
target="_blank"
rel="noopener">
${escapeHtml(url)}
</a>

<a
class="primary download-link"
href="${escapeHtml(url)}"
target="_blank"
rel="noopener">
Buka / Download
</a>

</div>

`)
.join("")

return`
<div class="media-result">
${html}
</div>
`

}


async function requestJson(url,options={}){

const response=
await fetch(url,options)

const text=
await response.text()

let data

try{

data=
JSON.parse(text)

}catch{

data=text

}

if(!response.ok){

throw new Error(
data?.message ||
data?.error ||
`HTTP ${response.status}`
)

}

return data

}


async function termaiDownload(
type,
inputId,
resultId
){

const input=
document.getElementById(inputId)

const result=
document.getElementById(resultId)

const url=
input.value.trim()

if(!url){

showToast(
"Masukkan URL terlebih dahulu"
)

input.focus()

return

}

if(!validUrl(url)){

showToast(
"URL tidak valid"
)

return

}

result.innerHTML=
`
<div class="loading">
⏳ Sedang memproses...
</div>
`

let endpoint=""

if(type==="instagram"){

endpoint=
"https://api.termai.cc/api/downloader/instagram"

}

if(type==="facebook"){

endpoint=
"https://api.termai.cc/api/downloader/facebook"

}

const apiUrl=
endpoint+
"?url="+
encodeURIComponent(url)+
"&key="+
encodeURIComponent(TERMAI_KEY)

try{

const data=
await requestJson(apiUrl)

result.innerHTML=
renderUrls(
data,
"Downloader"
)

}catch(error){

result.innerHTML=
`
<div class="error">

❌ Failed fetch.

<br><br>

${escapeHtml(error.message)}

<br><br>

Browser GitHub Pages dapat memblokir
API yang tidak mengizinkan CORS.

</div>
`

}

}


document.getElementById("instagramBtn")
.addEventListener("click",()=>{

termaiDownload(
"instagram",
"instagramUrl",
"instagramResult"
)

})


document.getElementById("facebookBtn")
.addEventListener("click",()=>{

termaiDownload(
"facebook",
"facebookUrl",
"facebookResult"
)

})


async function downloadTikTok(){

const input=
document.getElementById("tiktokUrl")

const result=
document.getElementById("tiktokResult")

const url=
input.value.trim()

if(!url){

showToast(
"Masukkan URL TikTok terlebih dahulu"
)

return

}

if(!validUrl(url)){

showToast(
"URL TikTok tidak valid"
)

return

}

result.innerHTML=
`
<div class="loading">
⏳ Mengambil data TikTok...
</div>
`

try{

const body=
new URLSearchParams()

body.set("url",url)

const data=
await requestJson(
"https://www.tikwm.com/api/",
{
method:"POST",
headers:{
"Content-Type":
"application/x-www-form-urlencoded"
},
body
}
)

const video=
data?.data?.play ||
data?.data?.wmplay

const music=
data?.data?.music ||
data?.data?.music_info?.play

const images=
data?.data?.images ||
data?.data?.image_post_info?.images ||
[]

let html=""

if(video){

html+=`

<div class="result-box">

<p>Video TikTok</p>

<a
class="result-link"
href="${escapeHtml(video)}"
target="_blank"
rel="noopener">
${escapeHtml(video)}
</a>

<a
class="primary download-link"
href="${escapeHtml(video)}"
target="_blank"
rel="noopener">
Download Video
</a>

</div>

`

}

if(music){

html+=`

<div class="result-box">

<p>Audio / Music</p>

<a
class="result-link"
href="${escapeHtml(music)}"
target="_blank"
rel="noopener">
${escapeHtml(music)}
</a>

<a
class="secondary download-link"
href="${escapeHtml(music)}"
target="_blank"
rel="noopener">
Buka Audio
</a>

</div>

`

}

if(Array.isArray(images)){

images.forEach((image,index)=>{

if(!image)
return

html+=`

<div class="result-box">

<p>Foto ${index+1}</p>

<a
class="result-link"
href="${escapeHtml(image)}"
target="_blank"
rel="noopener">
${escapeHtml(image)}
</a>

<a
class="primary download-link"
href="${escapeHtml(image)}"
target="_blank"
rel="noopener">
Buka Foto
</a>

</div>

`

})

}

if(!html){

html=
`
<div class="error">
Media TikTok tidak ditemukan.
</div>
`

}

result.innerHTML=html

}catch(error){

result.innerHTML=
`
<div class="error">

❌ Failed fetch.

<br><br>

${escapeHtml(error.message)}

<br><br>

TikTok API dapat menolak request
langsung dari GitHub Pages karena CORS.

</div>
`

}

}


document.getElementById("tiktokBtn")
.addEventListener(
"click",
downloadTikTok
)


async function uploadFile(file){

const servers=[

{
url:"https://cdn.nekohime.site/upload",
field:"file"
},

{
url:"https://tmpfiles.org/api/v1/upload",
field:"fileToUpload"
},

{
url:"https://catbox.moe/user/api.php",
field:"fileToUpload"
}

]

let lastError=null

for(const server of servers){

try{

const form=
new FormData()

form.append(
server.field,
file,
file.name
)

if(
server.url.includes(
"catbox.moe"
)
){

form.append(
"reqtype",
"fileupload"
)

}

const response=
await fetch(
server.url,
{
method:"POST",
body:form
}
)

if(!response.ok){

throw new Error(
`HTTP ${response.status}`
)

}

const text=
await response.text()

let data=text

try{

data=
JSON.parse(text)

}catch{}

let url=""

if(typeof data==="string"){

url=data.trim()

}

if(data?.url){

url=data.url

}

if(data?.data?.url){

url=data.data.url

}

if(
server.url.includes(
"tmpfiles.org"
)&&
url.includes("tmpfiles.org/")
){

url=
url.replace(
"tmpfiles.org/",
"tmpfiles.org/dl/"
)

}

if(url){

return url

}

throw new Error(
"URL tidak ditemukan"
)

}catch(error){

lastError=error

}

}

throw(
lastError ||
new Error(
"Semua upload server gagal"
)
)

}


const removeFile=
document.getElementById("removeFile")

const removeChoose=
document.getElementById("removeChoose")

const removeDrop=
document.getElementById("removeDrop")


removeChoose.addEventListener(
"click",
()=>{
removeFile.click()
}
)


removeDrop.addEventListener(
"dragover",
event=>{
event.preventDefault()
removeDrop.classList.add("drag")
}
)


removeDrop.addEventListener(
"dragleave",
()=>{
removeDrop.classList.remove("drag")
}
)


removeDrop.addEventListener(
"drop",
event=>{

event.preventDefault()

removeDrop.classList.remove("drag")

const file=
event.dataTransfer.files[0]

if(file){

processRemoveBg(file)

}

}
)


removeFile.addEventListener(
"change",
()=>{

const file=
removeFile.files[0]

if(file){

processRemoveBg(file)

}

}
)


async function processRemoveBg(file){

if(!file.type.startsWith("image/")){

showToast(
"File harus berupa gambar"
)

return

}

const preview=
document.getElementById(
"removePreview"
)

const result=
document.getElementById(
"removeResult"
)

preview.innerHTML=
`
<img
src="${URL.createObjectURL(file)}"
alt="Preview">
`

result.innerHTML=
`
<div class="loading">
⏳ Mengupload gambar...
</div>
`

try{

const uploaded=
await uploadFile(file)

if(!uploaded){

throw new Error(
"Upload tidak menghasilkan URL"
)

}

result.innerHTML=
`
<div class="loading">
⏳ Menghapus background...
</div>
`

const api=
"https://api.termai.cc/api/tools/image-removebg"+
"?url="+
encodeURIComponent(uploaded)+
"&key="+
encodeURIComponent(TERMAI_KEY)

const data=
await requestJson(api)

result.innerHTML=
renderUrls(
data,
"Remove Background"
)

}catch(error){

result.innerHTML=
`
<div class="error">

❌ Failed fetch.

<br><br>

${escapeHtml(error.message)}

<br><br>

Upload server atau API Remove BG
mungkin tidak mengizinkan CORS.

</div>
`

}

}


const urlFile=
document.getElementById("urlFile")

const urlChoose=
document.getElementById("urlChoose")

const urlDrop=
document.getElementById("urlDrop")


urlChoose.addEventListener(
"click",
()=>{
urlFile.click()
}
)


urlDrop.addEventListener(
"dragover",
event=>{
event.preventDefault()
urlDrop.classList.add("drag")
}
)


urlDrop.addEventListener(
"dragleave",
()=>{
urlDrop.classList.remove("drag")
}
)


urlDrop.addEventListener(
"drop",
event=>{

event.preventDefault()

urlDrop.classList.remove("drag")

const file=
event.dataTransfer.files[0]

if(file){

processToUrl(file)

}

}
)


urlFile.addEventListener(
"change",
()=>{

const file=
urlFile.files[0]

if(file){

processToUrl(file)

}

}
)


async function processToUrl(file){

const info=
document.getElementById(
"urlFileInfo"
)

const result=
document.getElementById(
"urlResult"
)

info.textContent=
`${file.name} • ${formatBytes(file.size)}`

result.innerHTML=
`
<div class="loading">
⏳ Upload sedang berjalan...
</div>
`

try{

const url=
await uploadFile(file)

result.innerHTML=
`
<div class="result-box">

<p>
Upload berhasil
</p>

<a
class="result-link"
href="${escapeHtml(url)}"
target="_blank"
rel="noopener">
${escapeHtml(url)}
</a>

<button
class="primary"
id="copyUrl">
Salin URL
</button>

</div>
`

document.getElementById(
"copyUrl"
)
.addEventListener(
"click",
async()=>{

try{

await navigator.clipboard
.writeText(url)

showToast(
"URL berhasil disalin"
)

}catch{

showToast(
"Clipboard tidak tersedia"
)

}

}
)

}catch(error){

result.innerHTML=
`
<div class="error">

❌ Failed fetch.

<br><br>

${escapeHtml(error.message)}

<br><br>

Server upload tidak mengizinkan
request langsung dari GitHub Pages
atau sedang tidak tersedia.

</div>
`

}

}


function formatBytes(bytes){

if(!bytes)
return "0 B"

const units=[
"B",
"KB",
"MB",
"GB"
]

const index=
Math.floor(
Math.log(bytes)/
Math.log(1024)
)

return(
(bytes/
Math.pow(1024,index))
.toFixed(
index?2:0
)+
" "+
units[index]
)

}


function initVisitor(){

let id=
localStorage.getItem(
"maxiel_visitor_id"
)

if(!id){

id=
crypto.randomUUID
?crypto.randomUUID()
:
Date.now()+"-"+Math.random()

localStorage.setItem(
"maxiel_visitor_id",
id
)

}

return id

}


function init(){

updateClock()

updateRuntime()

updateSystem()

updateStarted()

initVisitor()

setInterval(
updateClock,
1000
)

setInterval(
updateRuntime,
1000
)

setInterval(
updateSystem,
5000
)

window.addEventListener(
"resize",
updateSystem
)

document.addEventListener(
"visibilitychange",
()=>{

if(!document.hidden){

updateClock()

updateRuntime()

}

}
)

}


init()
