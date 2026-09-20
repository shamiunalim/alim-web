const CACHE_NAME = "maxiel-ai-v2"
const AI_API = "https://api.fromscratch.web.id/v1/api/ai/publicai"

const APP_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./api.js",
  "./developer.jpg",
  "./icon-192.png",
  "./icon-512.png",
  "./manifest.json",
  "./service-worker.js"
]

function corsHeaders(){
  return {
    "Access-Control-Allow-Origin":"*",
    "Cache-Control":"no-store"
  }
}

function json(data,status=200){
  return new Response(JSON.stringify(data),{
    status,
    headers:{
      "Content-Type":"application/json; charset=UTF-8",
      ...corsHeaders()
    }
  })
}

self.addEventListener("install",event=>{
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache=>cache.addAll(APP_FILES))
      .then(()=>self.skipWaiting())
  )
})

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys().then(keys=>
      Promise.all(
        keys
          .filter(key=>key !== CACHE_NAME)
          .map(key=>caches.delete(key))
      )
    ).then(()=>self.clients.claim())
  )
})

self.addEventListener("fetch",event=>{
  const request = event.request
  const url = new URL(request.url)

  // AI proxy internal: website cukup memanggil /ai?query=...
  if(request.method === "GET" && url.pathname === "/ai"){
    event.respondWith((async()=>{
      const query = (url.searchParams.get("query") || "").trim()

      if(!query){
        return json({status:400,error:"Parameter query wajib diisi"},400)
      }

      if(query.length > 4000){
        return json({status:400,error:"Query terlalu panjang"},400)
      }

      try{
        const upstream = await fetch(
          `${AI_API}?query=${encodeURIComponent(query)}`,
          {
            method:"GET",
            headers:{"Accept":"application/json"},
            cache:"no-store"
          }
        )

        const text = await upstream.text()
        let data

        try{
          data = JSON.parse(text)
        }catch{
          return json({
            status:502,
            error:"Public AI mengembalikan data tidak valid."
          },502)
        }

        if(!upstream.ok){
          return json({
            status:upstream.status,
            error:"Public AI gagal dipanggil."
          },upstream.status)
        }

        return json({
          status:200,
          data:{
            query,
            response:
              data?.data?.response ||
              data?.response ||
              "AI tidak memberikan jawaban."
          },
          source:"Maxiel Service Worker"
        })
      }catch(error){
        return json({
          status:500,
          error:"Service Worker gagal menghubungi Public AI.",
          detail:error?.message || "Unknown error"
        },500)
      }
    })())
    return
  }

  // Jangan cache API eksternal.
  if(url.origin !== location.origin){
    return
  }

  event.respondWith(
    fetch(request)
      .then(response=>{
        if(response.ok){
          const copy=response.clone()
          caches.open(CACHE_NAME)
            .then(cache=>cache.put(request,copy))
            .catch(()=>{})
        }
        return response
      })
      .catch(()=>caches.match(request).then(cached=>{
        return cached || caches.match("./index.html")
      }))
  )
})
