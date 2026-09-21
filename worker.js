const API_URL = "https://api.fromscratch.web.id/v1/api/ai/ishchat"
const API_MODEL = "gpt-oss-120b"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store"
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=UTF-8"
    }
  })
}

export default {
  async fetch(request) {
    const url = new URL(request.url)

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      })
    }

    if (url.pathname !== "/api/ai") {
      return new Response("Maxiel AI Proxy OK", {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "text/plain; charset=UTF-8"
        }
      })
    }

    if (request.method !== "GET") {
      return json({
        status: 405,
        error: "Method tidak diizinkan"
      }, 405)
    }

    const query = (url.searchParams.get("query") || "").trim()

    if (!query) {
      return json({
        status: 400,
        error: "Parameter query diperlukan"
      }, 400)
    }

    try {
      const target =
        `${API_URL}?query=${encodeURIComponent(query)}` +
        `&model=${encodeURIComponent(API_MODEL)}`

      const response = await fetch(target, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "User-Agent": "Maxiel-AI/1.0"
        }
      })

      const raw = await response.text()

      let result
      try {
        result = JSON.parse(raw)
      } catch {
        return new Response(raw, {
          status: response.status,
          headers: {
            ...corsHeaders,
            "Content-Type":
              response.headers.get("content-type") ||
              "text/plain; charset=UTF-8"
          }
        })
      }

      if (!response.ok) {
        return json({
          status: response.status,
          error:
            result?.error?.message ||
            result?.error ||
            result?.message ||
            "Request AI gagal",
          detail: result
        }, response.status)
      }

      // Normalisasi beberapa kemungkinan format respons agar app.js lama tetap kompatibel.
      const answer =
        result?.choices?.[0]?.message?.content ??
        result?.choices?.[0]?.text ??
        result?.data?.response ??
        result?.data?.answer ??
        result?.data?.text ??
        result?.response ??
        result?.answer ??
        result?.text ??
        result?.message?.content ??
        (typeof result?.message === "string" ? result.message : null)

      if (typeof answer === "string" && answer.trim()) {
        return json({
          status: 200,
          data: {
            response: answer.trim()
          },
          model: result?.model || API_MODEL,
          raw: result
        })
      }

      // Jika format upstream berubah dan belum bisa dinormalisasi,
      // kirim respons aslinya supaya mudah didiagnosis.
      return json({
        status: 502,
        error: "Respons API AI tidak berisi jawaban yang dikenali",
        detail: result
      }, 502)
    } catch (error) {
      return json({
        status: 500,
        error: error?.message || "Proxy AI gagal"
      }, 500)
    }
  }
}
