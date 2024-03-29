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
    async getpostcomment(req,res,next){
        try {
            const comments=await commentModel.find({postId:req.params.postId}).sort({createdAt:-1})
            return res.status(200).send(comments)
        } catch (error) {
            return next(error)
        }
    }
    async likecomment(req,res,next){
        try {
            const comment=await commentModel.findById(req.params.commentId);
            if(!comment){
                
                return next(ErrorHandler(404,'Comment not found!'));
            }
            const userIndex=comment.likes.indexOf(req.userId)
            if(userIndex===-1){
                comment.numberOfLikes+=1
                comment.likes.push(req.userId)
            }else{
                comment.numberOfLikes-=1
                comment.likes.splice(userIndex,1)
            }
            const savedComment=await comment.save()
            return res.status(200).send(savedComment)
        } catch (error) {
            return next(error)
        }
    }
    async editcomment(req,res,next){
        try {
            const comment=await commentModel.findById(req.params.commentId)
            if(!comment){
                return next(ErrorHandler(404,'Comment not found'))
            }
            if(comment.userId !== req.userId && !req.isAdmin){
                return next(ErrorHandler(403,'You are not allowed to edit this comment'))
            }
            const editedComment=await commentModel.findByIdAndUpdate(req.params.commentId,{content:req.body.content},{new:true
            })
            return res.status(200).send(editedComment);
        } catch (error) {
            return next(error);
        }
    }
    async deletecomment(req,res,next){
        try {
            const comment=await commentModel.findById(req.params.commentId)
            if(!comment){
                return next(ErrorHandler(404,'Comment not found!'))
            }
            if(comment.userId !== req.userId && !req.isAdmin){
                return next(ErrorHandler(403,'You are not allowed to delete this comment'));
            }
            await commentModel.findByIdAndDelete(req.params.commentId);
            return res.status(200).send('Comment has been deleted')
        } catch (error) {
            return next(error)
        }
    }
    async getComments(req,res,next){
        if(!req.isAdmin){
            return next(ErrorHandler(403,'You are not allowed to get all comments'))
        }
        try {
            const startIndex=parseInt(req.query.startIndex) || 0;
            const limit=parseInt(req.query.limit) || 9;
            const sortDirection=req.query.sort ==='desc' ? -1:1;
            const comments=await commentModel.find().sort({createdAt:sortDirection}).skip(startIndex).limit(limit)
            const totalDocument=await commentModel.countDocuments();
            const now=new Date()
            const oneMonthAgo=new Date(now.getFullYear(),now.getMonth()-1,now.getDate())
            const lastMonthComments=await commentModel.countDocuments({createdAt:{$gte:oneMonthAgo}})
            return res.status(200).send({comments,totalDocument,lastMonthComments})
        } catch (error) {
            return next(error)
        }
    }
}

export default new CommentController;