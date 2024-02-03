import express from "express"
import authController from "../controllers/auth.controller.js";

const router=express.Router();

router.post("/signin",authController.SingIn)

export default router;