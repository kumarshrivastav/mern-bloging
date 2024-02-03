import express from "express"


const app=express()

const Server=app.listen(8000,()=>{
    console.log(`Server Started at http://localhost:${Server.address().port}`)
})