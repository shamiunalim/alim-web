export default {
  async fetch(request) {
    const url = new URL(request.url)
    if (url.pathname !== "/api/ai") {
      return new Response("Maxiel AI Worker OK", { status: 200 })
    }
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors() })
    }
    const query = url.searchParams.get("query")
    if (!query) return json({ status: 400, error: "query wajib diisi" }, 400)
    try {
      const target = "https://api.fromscratch.web.id/v1/api/ai/publicai?query=" + encodeURIComponent(query)
      const response = await fetch(target, { headers: { Accept: "application/json" } })
      const body = await response.text()
      return new Response(body, { status: response.status, headers: { ...cors(), "Content-Type": "application/json", "Cache-Control": "no-store" } })
    } catch (error) {
      return json({ status: 500, error: error?.message || String(error) }, 500)
    }
  }
}
function cors() {
  return { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET,OPTIONS", "Access-Control-Allow-Headers": "Content-Type" }
}
function json(data, status=200) {
  return new Response(JSON.stringify(data), { status, headers: { ...cors(), "Content-Type": "application/json" } })
}
