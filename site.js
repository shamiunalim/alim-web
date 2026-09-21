// Deteksi alamat website yang sedang dibuka.
// Tidak bergantung pada github.io, nama repository, atau domain tertentu.
export function getCurrentSiteInfo() {
  const url = new URL(window.location.href)
  url.search = ""
  url.hash = ""

  const baseUrl = new URL(".", url.href)
  baseUrl.search = ""
  baseUrl.hash = ""

  const cleanPath = url.pathname.replace(/^\\/+|\\/+$/g, "")
  const segments = cleanPath ? cleanPath.split("/").filter(Boolean) : []

  return {
    siteUrl: baseUrl.href,
    path: url.pathname,
    hostname: url.hostname,
    repository: segments[0] || "Root / User Site",
    pageName: String(
      document.title ||
      document.querySelector('meta[name="application-name"]')?.content ||
      "Maxiel"
    ).trim() || "Maxiel"
  }
}

export function getCurrentSiteUrl() {
  return getCurrentSiteInfo().siteUrl
}
