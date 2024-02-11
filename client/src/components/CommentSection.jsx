import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Alert, Button, TextInput, Textarea } from "flowbite-react";
import { Link } from "react-router-dom";
import { createcomment, fetchcommentpost } from "../http/api.config";
import Comment from "./Comment";
const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  console.log(comments)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }
    try {
      setCommentError(null);
      const { data } = await createcomment({
        content: comment,
        postId,
        userId: currentUser._id,
      });
      setComment("");
      setComments([data,...comments])
      console.log(data);
    } catch (error) {
      setCommentError(error.response.data.message);
      console.log(error.response.data.message);
    }
  };
  useEffect(() => {
    const fetchPostComment = async () => {
      try {
        const { data } = await fetchcommentpost(postId);
        setComments(data);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    fetchPostComment();
  }, [postId]);
  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt="profilePicture"
          />
          <Link
            className="text-xs text-cyan-600 hover:underline"
            to="/dashboard?tab=profile"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to comment.
          <Link className="text-blue-500 hover:underline" to="/sign-in">
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            placeholder="Add a comment..."
            rows={3}
            maxLength={200}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} characters remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
        </form>
      )}
      {commentError && <Alert color="failure">{commentError}</Alert>}
        {comments.length===0 ? (
          <p className="text-sm my-5">No comments yet!</p>
        ):(
            <>
            <div className="text-sm my-5 flex items-center gap-1">
              <p>Comments:</p>
              <div className="border border-gray-400 py-1 px-2 rounded-sm">
                <p>{comments.length}</p>
              </div>
            </div>
            {comments.map((comment)=>(
              <Comment key={comment._id} comment={comment}/>
            ))}
            </>
        )}
    </div>
  );
};

export default CommentSection;
