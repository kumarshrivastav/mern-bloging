import postModel from "../model/post.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";

class PostController{
    async CreatePost(req,res,next){
        if(!req.isAdmin){
            return next(ErrorHandler(403,'You are not allowed to create a post'))
        }
        if(!req.body.title || !req.body.content){
            return next(ErrorHandler(400,'Please provide all required fields'))
        }
        const slug=req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g,'-')
        const newPost= new postModel({
            ...req.body,slug,userId:req.userId
        });
        try {
            const savedPost=await newPost.save();
            return res.status(201).send(savedPost)
        } catch (error) {
            next(error)
        }

    }
}

export default new PostController;