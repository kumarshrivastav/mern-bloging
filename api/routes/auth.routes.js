import express from "express"
import authController from "../controllers/auth.controller.js";
import verifyToken from "../middleware/verifyToken.js";

const router=express.Router();

router.post("/signin",authController.SingIn)
router.post("/oauth",authController.oauth)
router.put("/update/:userId",verifyToken,authController.updateUser)

export default router;