import express from "express"
import verifyToken from "../middleware/verifyToken.js"
import commentController from "../controllers/comment.controller.js"
const router=express.Router()

router.post("/create",verifyToken,commentController.create)
router.get("/getpostcomment/:postId",commentController.getpostcomment)
export default router