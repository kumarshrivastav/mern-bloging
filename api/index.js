import express from "express";
import dotenv from "dotenv";
import ConnectDB from "./db.js";
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import cors from "cors"
dotenv.config();
const app = express();
const corsOption={
  credentials:true,
  origin:["http://localhost:5173"]
}
ConnectDB();
app.use(cors(corsOption))
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user/", userRouter);
app.use("/api/auth/", authRouter);

app.use(express.static("http://localhost:5173/"))
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
