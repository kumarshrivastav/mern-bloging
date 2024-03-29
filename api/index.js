import express from "express";
import dotenv from "dotenv";
import ConnectDB from "./db.js";
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import postRouter from "./routes/post.routes.js"
import commentRouter from "./routes/comment.routes.js"
import path from "path"
import cors from "cors"
dotenv.config();
const app = express();
const corsOption={
  credentials:true,
  origin:["http://localhost:5173"]
}
ConnectDB();
const __dirname=path.resolve()
app.use(cors(corsOption))
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user/", userRouter);
app.use("/api/auth/", authRouter);
app.use("/api/post/", postRouter)
app.use("/api/comment",commentRouter)
app.use(express.static(path.join(__dirname,'/client/dist')))
app.get('*',(req,res)=>{
  return res.sendFile(path.join(__dirname,'client','dist','index.html'))
})
const Server = app.listen(8000, () => {
  console.log(`Server Started at http://localhost:${Server.address().port}`);
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Serverr Error";
  res
    .status(statusCode)
    .json({ Success: false, statusCode, message });
});
