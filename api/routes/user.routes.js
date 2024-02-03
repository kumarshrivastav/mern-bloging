import express from "express"
import userController from "../controllers/user.controller.js";
const router=express();
router.get("/test",userController.test)

export default router;