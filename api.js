const API_KEY = "Bell409"
const API_BASE = "https://api.termai.cc"

export const API = {
  key: API_KEY,
  base: API_BASE,

  facebook: (url) =>
    `${API_BASE}/api/downloader/facebook?url=${encodeURIComponent(url)}&key=${API_KEY}`,

  instagram: (url) =>
    `${API_BASE}/api/downloader/instagram?url=${encodeURIComponent(url)}&key=${API_KEY}`,

  youtube: (url, type = "mp3") =>
    `${API_BASE}/api/downloader/youtube?key=${API_KEY}&url=${encodeURIComponent(url)}&type=${type}`,

  youtubeSearch: (query) =>
    `${API_BASE}/api/search/youtube?query=${encodeURIComponent(query)}&key=${API_KEY}`
}

export const TIKTOK_API = "https://www.tikwm.com/api/"

export const AI_WORKER_DEFAULT = ""//"https://api.fromscratch.web.id/v1/api/"

export function aiWorkerUrl(worker, query){
  const base = String(worker || AI_WORKER_DEFAULT).trim().replace(/\/$/, "")
  return `${base}/ai?query=${encodeURIComponent(query)}`
}
