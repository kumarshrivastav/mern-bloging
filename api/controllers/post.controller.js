import postModel from "../model/post.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";

class PostController {
  async CreatePost(req, res, next) {
    if (!req.isAdmin) {
      return next(ErrorHandler(403, "You are not allowed to create a post"));
    }
    if (!req.body.title || !req.body.content) {
      return next(ErrorHandler(400, "Please provide all required fields"));
    }
    const slug = req.body.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "-");
    const newPost = new postModel({
      ...req.body,
      slug,
      userId: req.userId,
    });
    try {
      const savedPost = await newPost.save();
      return res.status(201).send(savedPost);
    } catch (error) {
      next(error);
    }
  }
  async getPosts(req, res, next) {
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.order === "asc" ? 1 : -1;
      const posts = await postModel
        .find({
          ...(req.query.userId && { userId: req.query.userId }),
          ...(req.query.category && { category: req.query.category }),
          ...(req.query.slug && { slug: req.query.slug }),
          ...(req.query.postId && { _id: req.query.postId }),
          ...(req.query.searchTerm && {
            $or: [
              { title: { $regex: req.query.searchTerm, $options: "i" } },
              { content: { $regex: req.query.searchTerm, $options: "i" } },
            ],
          }),
        })
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        .limit(limit);
      const totalPost = await postModel.countDocuments();
      const now = new Date();
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      const lastMonthPosts = await postModel.countDocuments({
        createdAt: { $gte: oneMonthAgo },
      });
      return res.status(200).send({ posts, totalPost, lastMonthPosts });
    } catch (error) {
      return next(error);
    }
  }
  async deletePost(req, res, next) {
    if (!req.isAdmin || req.userId !== req.params.userId) {
      return next(ErrorHandler(403, "You are not allowed to delete this post"));
    }
    try {
      await postModel.findByIdAndDelete(req.params.postId);
      return res.status(200).send("The post has been deleted");
    } catch (error) {
      next(error);
    }
  }

  async updatePost(req, res, next) {
    if (!req.isAdmin || req.userId !== req.params.userId) {
      return next(ErrorHandler(403, "You are not allowed to update post"));
    }
    try {
      const updatedPost = await postModel.findByIdAndUpdate(
        req.params.postId,
        {
          $set: {
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            image: req.body.image,
          },
        },
        { new: true }
      );
      console.log(updatedPost)
      return res.status(200).send(updatedPost)
    } catch (error) {
    return next(error)
    }
  }
}

export default new PostController();
