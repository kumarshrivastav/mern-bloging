import express from "express"
import authController from "../controllers/auth.controller.js";

const router=express.Router();

router.post("/signin",authController.SingIn)
router.post("/oauth",authController.oauth)

export default router;