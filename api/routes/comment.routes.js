import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import commentController from "../controllers/comment.controller.js";
const router = express.Router();

router.post("/create", verifyToken, commentController.create);
router.get("/getpostcomment/:postId", commentController.getpostcomment);
router.get(
  "/likecomment/:commentId",
  verifyToken,
  commentController.likecomment
);
router.put(
  "/editcomment/:commentId",
  verifyToken,
  commentController.editcomment
);
router.delete(
  "/deletecomment/:commentId",
  verifyToken,
  commentController.deletecomment
);
router.get('/getcomments',verifyToken,commentController.getComments)
export default router;
