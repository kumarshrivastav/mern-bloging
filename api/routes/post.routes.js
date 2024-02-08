import express from "express"
const router=express.Router()
import verifyToken from "../middleware/verifyToken.js"
import postController from "../controllers/post.controller.js"
router.post("/create-post",verifyToken,postController.CreatePost)
router.get("/getposts",postController.getPosts)
export default router;