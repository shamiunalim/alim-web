export default {
  async fetch(request) {
    const url = new URL(request.url)
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors })
    }
    if (url.pathname !== "/api/ai") {
      return new Response("Maxiel AI Proxy OK", { status: 200, headers: cors })
    }
    const query = url.searchParams.get("query")?.trim()
    if (!query) {
      return new Response(JSON.stringify({ status: 400, error: "Parameter query wajib diisi" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json", "Cache-Control": "no-store" }
      })
    }
    try {
      const target = "https://api.fromscratch.web.id/v1/api/ai/publicai?query=" + encodeURIComponent(query)
      const upstream = await fetch(target, { headers: { Accept: "application/json" } })
      const body = await upstream.text()
      return new Response(body, {
        status: upstream.status,
        headers: { ...cors, "Content-Type": upstream.headers.get("content-type") || "application/json", "Cache-Control": "no-store" }
      })
    } catch (error) {
      return new Response(JSON.stringify({ status: 502, error: error?.message || "Upstream request failed" }), {
        status: 502,
        headers: { ...cors, "Content-Type": "application/json", "Cache-Control": "no-store" }
      })
    }
  }
}
