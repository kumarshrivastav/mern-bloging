import express from "express"
import dotenv from "dotenv"
import ConnectDB from "./db.js"
import userRouter from "./routes/user.routes.js"
dotenv.config();
const app=express()
ConnectDB()

app.use("/api/users/",userRouter);
const Server=app.listen(8000,()=>{
    console.log(`Server Started at http://localhost:${Server.address().port}`)
})
