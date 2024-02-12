import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Modal, Button } from "flowbite-react";
import {  deletebyadmin, deletecomment, deleteuser, fetchcomments, fetchusers, showmoreusers } from "../http/api.config";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";
const DashComment = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [showMore, setShowMore] = useState(true);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");
  // console.log(userPosts);
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await fetchcomments();
        console.log(data)
        setComments(data.comments);

        if (data.comments.length < 9) {
          setShowMore(false);
        }
        console.log(data.comments);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]);
  const handleShowMore = async () => {
    const startIndexex = users.length;
    try {
      const { data } = await showmoreusers(startIndexex);
      setUsers((prev) => [...prev, ...data.users]);
      if (data.users.length < 9) {
        setShowMore(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
const handleDeleteComment=async ()=>{
    setShowModal(false)
    try {
        await deletecomment(commentIdToDelete)
        setComments((prev)=>prev.filter((comment)=>comment._id!==commentIdToDelete))
        setShowModal(false)
    } catch (error) {
        console.log(error.response.data.message)
    }
}
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Number of likes</Table.HeadCell>
              <Table.HeadCell>PostId</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {comments?.map((comment) => (
              <Table.Body className="divide-y" key={comment._id}>
                <Table.Row className=" dark:border-gray-700 dark: bg-gray-800">
                  <Table.Cell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <p className="line-clamp-2">{comment.content}</p>
                  </Table.Cell>
                  <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  <Table.Cell>{comment.postId}</Table.Cell>
                  <Table.Cell>
                    {comment.userId}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdToDelete(comment._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <p>You have no comments yet!</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure want to delete this comment ?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteComment}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashComment;
