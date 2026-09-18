const started = Date.now()

const API_KEY = "Bell409"

const TERMAI = "https://api.termai.cc/api"

const menus = document.querySelectorAll(".menu")
const pages = document.querySelectorAll(".page")
const pageTitle = document.getElementById("pageTitle")
const sidebar = document.getElementById("sidebar")
const mobileMenu = document.getElementById("mobileMenu")

const titles = {
  dashboard: "Dashboard",
  tiktok: "TikTok Downloader",
  instagram: "Instagram Downloader",
  facebook: "Facebook Downloader",
  removebg: "Remove Background",
  tourl: "Upload to URL",
  runtime: "Web Runtime",
  system: "System Information",
  developer: "Developer"
}


function toast(text) {
  const el = document.getElementById("toast")

  if (!el) return

  el.textContent = text
  el.classList.add("show")

  clearTimeout(window.__toast)

  window.__toast =
    setTimeout(() => {
      el.classList.remove("show")
    }, 3500)
}


function setLoading(button, loading) {

  if (!button) return

  if (loading) {
    button.dataset.oldText =
      button.textContent

    button.textContent =
      "Memproses..."

    button.disabled = true
  } else {
    button.textContent =
      button.dataset.oldText ||
      "Download"

    button.disabled = false
  }
}


menus.forEach(menu => {

  menu.addEventListener("click", () => {

    const target =
      menu.dataset.page

    if (!target) return

    menus.forEach(item => {
      item.classList.remove("active")
    })

    pages.forEach(page => {
      page.classList.remove("active")
    })

    /*
     * Beberapa tombol menu ada di dalam
     * halaman dashboard. Jangan membuat
     * semuanya active sekaligus.
     */
    document
      .querySelectorAll(
        `.menu[data-page="${target}"]`
      )
      .forEach(item => {
        item.classList.add("active")
      })

    const page =
      document.getElementById(target)

    if (page) {
      page.classList.add("active")
    }

    pageTitle.textContent =
      titles[target] || "Maxiel"

    sidebar.classList.remove("open")

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  })

})


if (mobileMenu) {

  mobileMenu.addEventListener(
    "click",
    () => {
      sidebar.classList.toggle("open")
    }
  )

}


function updateClock() {

  const now = new Date()

  const time =
    now.toLocaleTimeString(
      "id-ID",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      }
    )

  const date =
    now.toLocaleDateString(
      "id-ID",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    )

  const clock =
    document.getElementById("clock")

  const dateEl =
    document.getElementById("date")

  const lastUpdate =
    document.getElementById("lastUpdate")

  if (clock)
    clock.textContent = time

  if (dateEl)
    dateEl.textContent = date

  if (lastUpdate)
    lastUpdate.textContent = time
}


function formatRuntime(ms) {

  let seconds =
    Math.floor(ms / 1000)

  const days =
    Math.floor(seconds / 86400)

  seconds %= 86400

  const hours =
    Math.floor(seconds / 3600)

  seconds %= 3600

  const minutes =
    Math.floor(seconds / 60)

  seconds %= 60

  return (
    String(days).padStart(2, "0") +
    ":" +
    String(hours).padStart(2, "0") +
    ":" +
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0")
  )
}


function updateRuntime() {

  const value =
    formatRuntime(
      Date.now() - started
    )

  const ids = [
    "runtime",
    "runtimeBig"
  ]

  ids.forEach(id => {

    const el =
      document.getElementById(id)

    if (el)
      el.textContent = value

  })

  const startedAt =
    document.getElementById("startedAt")

  if (startedAt) {

    startedAt.textContent =
      new Date(started)
        .toLocaleTimeString(
          "id-ID",
          {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
          }
        )
  }
}


function detectBrowser() {

  const ua =
    navigator.userAgent

  if (/Edg/i.test(ua))
    return "Microsoft Edge"

  if (/OPR/i.test(ua))
    return "Opera"

  if (/Chrome/i.test(ua))
    return "Google Chrome"

  if (/Firefox/i.test(ua))
    return "Mozilla Firefox"

  if (/Safari/i.test(ua))
    return "Safari"

  return "Unknown"
}


function detectPlatform() {

  const ua =
    navigator.userAgent

  if (/Android/i.test(ua))
    return "Android"

  if (/iPhone|iPad|iPod/i.test(ua))
    return "iOS"

  if (/Windows/i.test(ua))
    return "Windows"

  if (/Mac/i.test(ua))
    return "macOS"

  if (/Linux/i.test(ua))
    return "Linux"

  return navigator.platform || "Unknown"
}


function updateSystem() {

  const platform =
    detectPlatform()

  const browser =
    detectBrowser()

  const language =
    navigator.language || "-"

  const screenSize =
    `${screen.width} × ${screen.height}`

  const viewport =
    `${window.innerWidth} × ${window.innerHeight}`

  const timezone =
    Intl.DateTimeFormat()
      .resolvedOptions()
      .timeZone || "-"

  let connection = "Unknown"

  if (navigator.connection) {
    connection =
      navigator.connection.effectiveType ||
      "Connected"
  }

  const cookies =
    navigator.cookieEnabled
      ? "Enabled"
      : "Disabled"


  const data = {
    platform,
    browser,
    language,
    screen: screenSize,
    sysViewport: viewport,
    sysTimezone: timezone,
    sysConnection: connection,
    sysCookies: cookies
  }


  Object.entries(data)
    .forEach(([id, value]) => {

      const el =
        document.getElementById(id)

      if (el)
        el.textContent = value

    })
}


function escapeHtml(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}


function getMediaArray(data) {

  const result = []

  function push(value, type) {

    if (!value) return

    if (Array.isArray(value)) {

      value.forEach(item => {
        push(item, type)
      })

      return
    }

    if (typeof value === "object") {

      const possible =
        value.url ||
        value.download ||
        value.download_url ||
        value.play ||
        value.hd ||
        value.sd ||
        value.src

      if (possible) {
        push(possible, type)
      }

      return
    }

    if (
      typeof value === "string" &&
      /^https?:\/\//i.test(value)
    ) {

      result.push({
        url: value,
        type
      })
    }
  }


  push(data?.data?.video, "video")
  push(data?.data?.videos, "video")
  push(data?.data?.play, "video")
  push(data?.data?.videoUrl, "video")
  push(data?.data?.video_url, "video")

  push(data?.data?.images, "image")
  push(data?.data?.image, "image")
  push(data?.data?.photos, "image")

  push(data?.data?.audio, "audio")
  push(data?.data?.music, "audio")
  push(data?.data?.musicUrl, "audio")

  push(data?.video, "video")
  push(data?.videos, "video")
  push(data?.images, "image")
  push(data?.image, "image")
  push(data?.audio, "audio")
  push(data?.music, "audio")

  return result
}


function findAllUrls(value, found = []) {

  if (!value) return found

  if (typeof value === "string") {

    if (/^https?:\/\//i.test(value)) {
      found.push(value)
    }

    return found
  }

  if (Array.isArray(value)) {

    value.forEach(item => {
      findAllUrls(item, found)
    })

    return found
  }

  if (typeof value === "object") {

    Object.values(value)
      .forEach(item => {
        findAllUrls(item, found)
      })

  }

  return found
}


function renderDownloaderResult(
  container,
  data
) {

  if (!container) return

  const media =
    getMediaArray(data)

  /*
   * Jika struktur API berbeda,
   * cari URL langsung dari response.
   */
  if (!media.length) {

    const urls =
      [
        ...new Set(
          findAllUrls(data)
        )
      ]

    urls.forEach(url => {

      const lower =
        url.toLowerCase()

      let type = "link"

      if (
        /\.(mp4|webm|mov)(\?|$)/i.test(lower)
      ) {
        type = "video"
      }

      if (
        /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(lower)
      ) {
        type = "image"
      }

      if (
        /\.(mp3|m4a|ogg|wav)(\?|$)/i.test(lower)
      ) {
        type = "audio"
      }

      media.push({
        url,
        type
      })

    })

  }


  if (!media.length) {

    container.innerHTML = `
      <div class="result-box">
        <h4>Data ditemukan</h4>
        <p>
          API memberikan response tetapi format
          media belum dikenali oleh frontend.
        </p>
      </div>
    `

    return
  }


  let html = ""

  media.forEach((item, index) => {

    const url =
      escapeHtml(item.url)

    if (item.type === "video") {

      html += `
        <div class="result-box">
          <h4>Video ${index + 1}</h4>

          <video
            class="result-media"
            controls
            playsinline
            src="${url}"
          ></video>

          <br>

          <a
            href="${url}"
            target="_blank"
            rel="noopener"
          >
            Buka / Download Video
          </a>
        </div>
      `

      return
    }


    if (item.type === "image") {

      html += `
        <div class="result-box">
          <h4>Foto ${index + 1}</h4>

          <img
            class="result-media"
            src="${url}"
            loading="lazy"
          >

          <br>

          <a
            href="${url}"
            target="_blank"
            rel="noopener"
          >
            Buka / Download Foto
          </a>
        </div>
      `

      return
    }


    if (item.type === "audio") {

      html += `
        <div class="result-box">
          <h4>Audio ${index + 1}</h4>

          <audio
            controls
            style="width:100%"
            src="${url}"
          ></audio>

          <br>

          <a
            href="${url}"
            target="_blank"
            rel="noopener"
          >
            Download Audio
          </a>
        </div>
      `

      return
    }


    html += `
      <div class="result-box">
        <a
          href="${url}"
          target="_blank"
          rel="noopener"
        >
          Buka Media
        </a>
      </div>
    `

  })


  container.innerHTML = html
}


async function tiktok() {

  const input =
    document.getElementById("tiktokUrl")

  const button =
    document.getElementById("tiktokBtn")

  const result =
    document.getElementById("tiktokResult")

  const url =
    input.value.trim()

  if (!url) {
    toast("Masukkan URL TikTok terlebih dahulu.")
    return
  }

  setLoading(button, true)

  result.innerHTML =
    `<div class="result-box">Mengambil media TikTok...</div>`

  try {

    /*
     * TikTok memakai endpoint TikWM
     * sesuai plugin bot yang kamu berikan.
     */
    const response =
      await fetch(
        "https://www.tikwm.com/api/",
        {
          method: "POST",

          headers: {
            "content-type":
              "application/x-www-form-urlencoded; charset=UTF-8"
          },

          body:
            new URLSearchParams({
              url,
              count: 1,
              cursor: 0
            })
        }
      )

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`
      )
    }

    const data =
      await response.json()

    if (!data?.data) {
      throw new Error(
        "Media TikTok tidak ditemukan."
      )
    }

    renderDownloaderResult(
      result,
      data
    )

  } catch (error) {

    result.innerHTML = `
      <div class="result-box">
        ❌ Gagal mengambil TikTok.
        <br><br>
        ${escapeHtml(error.message)}
      </div>
    `

  } finally {

    setLoading(button, false)

  }
}


async function termaiDownloader(
  url,
  endpoint,
  result,
  button
) {

  if (!url) {
    toast("Masukkan URL terlebih dahulu.")
    return
  }

  setLoading(button, true)

  result.innerHTML =
    `<div class="result-box">Mengambil media...</div>`

  try {

    const apiUrl =
      `${TERMAI}${endpoint}` +
      `?url=${encodeURIComponent(url)}` +
      `&key=${encodeURIComponent(API_KEY)}`

    const response =
      await fetch(apiUrl)

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`
      )
    }

    const data =
      await response.json()

    renderDownloaderResult(
      result,
      data
    )

  } catch (error) {

    result.innerHTML = `
      <div class="result-box">
        ❌ Request gagal.
        <br><br>
        ${escapeHtml(error.message)}
      </div>
    `

  } finally {

    setLoading(button, false)

  }
}


document
  .getElementById("tiktokBtn")
  ?.addEventListener(
    "click",
    tiktok
  )


document
  .getElementById("instagramBtn")
  ?.addEventListener(
    "click",
    () => {

      const url =
        document
          .getElementById("instagramUrl")
          .value
          .trim()

      termaiDownloader(
        url,
        "/downloader/instagram",
        document.getElementById(
          "instagramResult"
        ),
        document.getElementById(
          "instagramBtn"
        )
      )
    }
  )


document
  .getElementById("facebookBtn")
  ?.addEventListener(
    "click",
    () => {

      const url =
        document
          .getElementById("facebookUrl")
          .value
          .trim()

      termaiDownloader(
        url,
        "/downloader/facebook",
        document.getElementById(
          "facebookResult"
        ),
        document.getElementById(
          "facebookBtn"
        )
      )
    }
  )


/*
 * ==========================
 * TO URL
 * ==========================
 */

let tourlFile = null

document
  .getElementById("tourlFile")
  ?.addEventListener(
    "change",
    event => {

      tourlFile =
        event.target.files?.[0] || null

      const name =
        document.getElementById("tourlName")

      const button =
        document.getElementById("tourlBtn")

      if (!tourlFile) {

        name.textContent = ""
        button.disabled = true

        return
      }

      name.textContent =
        `${tourlFile.name} • ` +
        `${(tourlFile.size / 1024 / 1024).toFixed(2)} MB`

      button.disabled = false
    }
  )


async function uploadToUrl() {

  if (!tourlFile) {
    toast("Pilih file terlebih dahulu.")
    return
  }

  const button =
    document.getElementById("tourlBtn")

  const result =
    document.getElementById("tourlResult")

  setLoading(button, true)

  result.innerHTML =
    `<div class="result-box">Mengupload file...</div>`

  try {

    const form =
      new FormData()

    form.append(
      "file",
      tourlFile,
      tourlFile.name
    )

    const response =
      await fetch(
        "https://cdn.nekohime.site/upload",
        {
          method: "POST",
          body: form
        }
      )

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`
      )
    }

    const data =
      await response.json()

    const url =
      data?.files?.[0]?.url

    if (!url) {
      throw new Error(
        "URL upload tidak ditemukan."
      )
    }

    result.innerHTML = `
      <div class="result-box">

        <h4>✅ Upload berhasil</h4>

        <p>
          ${escapeHtml(tourlFile.name)}
        </p>

        <a
          href="${escapeHtml(url)}"
          target="_blank"
          rel="noopener"
        >
          ${escapeHtml(url)}
        </a>

        <br><br>

        <button
          class="primary"
          onclick="copyText('${url.replace(/'/g, "\\'")}')"
        >
          Salin URL
        </button>

      </div>
    `

    toast(
      "File berhasil diupload."
    )

  } catch (error) {

    result.innerHTML = `
      <div class="result-box">
        ❌ Upload gagal.
        <br><br>
        ${escapeHtml(error.message)}
      </div>
    `

  } finally {

    setLoading(button, false)

  }
}


document
  .getElementById("tourlBtn")
  ?.addEventListener(
    "click",
    uploadToUrl
  )


/*
 * ==========================
 * REMOVE BACKGROUND
 * ==========================
 */

let removeFile = null


document
  .getElementById("removeFile")
  ?.addEventListener(
    "change",
    event => {

      removeFile =
        event.target.files?.[0] || null

      const preview =
        document.getElementById(
          "removePreview"
        )

      const button =
        document.getElementById(
          "removeBtn"
        )

      if (!removeFile) {

        preview.innerHTML = ""
        button.disabled = true

        return
      }

      if (!removeFile.type.startsWith("image/")) {

        toast(
          "File harus berupa gambar."
        )

        event.target.value = ""
        removeFile = null
        button.disabled = true

        return
      }

      const reader =
        new FileReader()

      reader.onload = () => {

        preview.innerHTML = `
          <img
            src="${reader.result}"
            alt="Preview"
          >
        `

      }

      reader.readAsDataURL(
        removeFile
      )

      button.disabled = false
    }
  )


async function removeBackground() {

  if (!removeFile) {
    toast("Pilih foto terlebih dahulu.")
    return
  }

  const button =
    document.getElementById(
      "removeBtn"
    )

  const result =
    document.getElementById(
      "removeResult"
    )

  setLoading(
    button,
    true
  )

  result.innerHTML =
    `<div class="result-box">Upload foto...</div>`

  try {

    /*
     * Upload foto sementara terlebih dahulu.
     */
    const form =
      new FormData()

    form.append(
      "file",
      removeFile,
      removeFile.name
    )

    const uploadResponse =
      await fetch(
        "https://cdn.nekohime.site/upload",
        {
          method: "POST",
          body: form
        }
      )

    if (!uploadResponse.ok) {
      throw new Error(
        "Upload foto gagal."
      )
    }

    const uploadData =
      await uploadResponse.json()

    const imageUrl =
      uploadData?.files?.[0]?.url

    if (!imageUrl) {
      throw new Error(
        "URL foto tidak ditemukan."
      )
    }


    result.innerHTML =
      `<div class="result-box">Menghapus background...</div>`


    const apiUrl =
      `${TERMAI}/tools/image-removebg` +
      `?url=${encodeURIComponent(imageUrl)}` +
      `&key=${encodeURIComponent(API_KEY)}`


    const response =
      await fetch(apiUrl)

    if (!response.ok) {
      throw new Error(
        `Remove BG HTTP ${response.status}`
      )
    }

    const data =
      await response.json()


    const urls =
      [
        ...new Set(
          findAllUrls(data)
        )
      ]


    const output =
      urls.find(url =>
        /\.(png|webp|jpg|jpeg)/i.test(url)
      ) ||
      urls[0]


    if (!output) {

      result.innerHTML = `
        <div class="result-box">
          ❌ Background berhasil diproses,
          tetapi URL hasil tidak ditemukan
          pada response API.
        </div>
      `

      return
    }


    result.innerHTML = `
      <div class="result-box">

        <h4>✅ Background berhasil dihapus</h4>

        <img
          class="result-media"
          src="${escapeHtml(output)}"
          alt="Result"
        >

        <br>

        <a
          href="${escapeHtml(output)}"
          target="_blank"
          rel="noopener"
        >
          Buka / Download Hasil
        </a>

      </div>
    `

    toast(
      "Remove background berhasil."
    )

    /*
     * File upload sementara pada layanan
     * tidak kita simpan di website.
     *
     * Penghapusan mengikuti kebijakan server
     * upload yang digunakan.
     */

  } catch (error) {

    result.innerHTML = `
      <div class="result-box">
        ❌ Remove background gagal.
        <br><br>
        ${escapeHtml(error.message)}
      </div>
    `

  } finally {

    setLoading(
      button,
      false
    )

  }
}


document
  .getElementById("removeBtn")
  ?.addEventListener(
    "click",
    removeBackground
  )


async function copyText(text) {

  try {

    await navigator.clipboard.writeText(
      text
    )

    toast(
      "URL berhasil disalin."
    )

  } catch {

    toast(
      "Gagal menyalin URL."
    )

  }
}


window.copyText =
  copyText


updateClock()
updateRuntime()
updateSystem()

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
  () => {

    if (!document.hidden) {

      updateClock()
      updateRuntime()

    }

  }
)