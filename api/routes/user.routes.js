import express from "express"
import userController from "../controllers/user.controller.js";
const router=express();
router.get("/test",userController.test)
router.post("/signup",userController.SingUp)

export default router;