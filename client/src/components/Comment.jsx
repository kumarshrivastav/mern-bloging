import React, { useEffect, useState } from "react";
import { editcomment, getUser as getCommentUser } from "../http/api.config.js";
import { FaThumbsUp } from "react-icons/fa";
import moment from "moment";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";
const Comment = ({ comment, onLike,onEdit }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment?.content);
  console.log(comment);
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await getCommentUser(comment?.userId);
        setUser(data);
        console.log(data);
      } catch (error) {
        console.log(error?.response?.data?.message);
      }
    };
    getUser();
  }, [comment]);
  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content)
  };
  const handleSave=async ()=>{
    try {
      const {data}=await editcomment(comment?._id,{content:editedContent})
      setIsEditing(false)
      onEdit(comment,editedContent)
    } catch (error) {
      console.log(error.response.data.message)
    }
  }
  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment?.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
          <Textarea
            className="mb-2"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <div className="flex justify-end gap-2 text-xs">
            <Button type="button" size={'sm'} gradientDuoTone={'purpleToBlue'} onClick={handleSave} >Save</Button>
            <Button type="button" onClick={()=>setIsEditing(false)} size={'sm'} gradientDuoTone={'purpleToBlue'} outline >Cancle</Button>
          </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-2">{comment?.content}</p>
            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
              <button
                type="button"
                onClick={() => onLike(comment?._id)}
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment?.likes?.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="text-gray-400">
                {comment?.numberOfLikes > 0 &&
                  comment?.numberOfLikes +
                    " " +
                    (comment?.numberOfLikes === 1 ? "like" : "likes")}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="text-gray-400 hover:text-blue-500"
                  >
                    Edit
                  </button>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Comment;
