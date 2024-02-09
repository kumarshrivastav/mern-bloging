import express from "express"
import verifyToken from "../middleware/verifyToken.js";
import userController from "../controllers/user.controller.js";
const router=express();
router.get("/test",userController.test)
router.post("/signup",userController.SingUp)
router.delete("/delete/:userId",verifyToken,userController.Delete)
router.get("/signout",userController.SingOut)
router.get("/getusers",verifyToken,userController.getUsers)
router.delete("/deletebyadmin/:userId",verifyToken,userController.deleteByAdmin)
export default router;