import express from "express"
import cors from "cors"

const app=express()
app.use(cors())

app.get("/api/ai",async(req,res)=>{
  const query=String(req.query.query||"").trim()
  if(!query)return res.status(400).json({status:400,error:"query wajib diisi"})
  try{
    const target=`https://api.fromscratch.web.id/v1/api/ai/publicai?query=${encodeURIComponent(query)}`
    const response=await fetch(target)
    const text=await response.text()
    res.status(response.status).type("application/json").send(text)
  }catch(error){
    res.status(500).json({status:500,error:error.message})
  }
})

const port=process.env.PORT||3000
app.listen(port,()=>console.log(`Maxiel AI proxy running on port ${port}`))
