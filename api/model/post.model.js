import mongoose from "mongoose";
const postSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    content: { type: String, required: true },
    title: { type: String, required: true, unique: true },
    image: {
      type: String,
      default:
        "https://th.bing.com/th/id/OIP.EJZMfDLglW1yeJsfOA3rWAHaFj?rs=1&pid=ImgDetMain",
    },
    category: { type: String, default: "uncategorized" },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const postModel = mongoose.models.posts || mongoose.model("posts", postSchema);
export default postModel;
