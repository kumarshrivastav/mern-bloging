import commentModel from "../model/comment.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";

class CommentController{
    async create(req,res,next){
        const {content,postId,userId}=req.body
        if(userId !== req.userId){
            return next(ErrorHandler(403,'You are not allowed to create this comment'))
        }
        try {
            const newComment=await commentModel({content,postId,userId})
            const saveComment=await newComment.save();
            return res.status(201).send(saveComment)
        } catch (error) {
            return next(error)
        }
    }
}

export default new CommentController;