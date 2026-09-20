const AI_API = "https://api.fromscratch.web.id/v1/api/ai/publicai"

function corsHeaders(){
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-store"
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

export default {
  async fetch(request){
    if(request.method === "OPTIONS"){
      return new Response(null,{status:204,headers:corsHeaders()})
    }

    const url = new URL(request.url)

    if(url.pathname !== "/ai" && url.pathname !== "/"){
      return json({status:404,error:"Endpoint tidak ditemukan"},404)
    }

    const query = (url.searchParams.get("query") || "").trim()

    if(!query){
      return json({status:400,error:"Parameter query wajib diisi"},400)
    }

    if(query.length > 4000){
      return json({status:400,error:"Query terlalu panjang"},400)
    }

    try{
      const apiUrl = `${AI_API}?query=${encodeURIComponent(query)}`
      const response = await fetch(apiUrl,{
        method:"GET",
        headers:{"Accept":"application/json"}
      })

      const text = await response.text()
      let data

      try{
        data = JSON.parse(text)
      }catch{
        return json({status:502,error:"Public AI mengembalikan data yang tidak valid"},502)
      }

      if(!response.ok){
        return json({
          status:response.status,
          error:"Public AI gagal dipanggil",
          upstream:data
        },response.status)
      }

      return json({
        status:200,
        data:{
          query,
          response:data?.data?.response || data?.response || "AI tidak memberikan jawaban."
        },
        source:"Maxiel AI Worker"
      })
    }catch(error){
      return json({
        status:500,
        error:"Worker gagal menghubungi Public AI",
        detail:error?.message || "Unknown error"
      },500)
    }
  }
}
