import express from "express"
import dotenv from "dotenv"
import ConnectDB from "./db.js"
dotenv.config();
const app=express()
ConnectDB()
const Server=app.listen(8000,()=>{
    console.log(`Server Started at http://localhost:${Server.address().port}`)
})
