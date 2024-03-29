import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table,Modal,Button} from "flowbite-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { deletepost, showmore } from "../http/api.config";
import {HiOutlineExclamationCircle} from "react-icons/hi"
const DashPosts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore,setShowMore]=useState(true)
  const [showModal,setShowModal]=useState(false)
  const [showPostId,setShowPostId]=useState('')
  // console.log(userPosts);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get(
          `/api/post/getposts?userId=${currentUser._id}`
        );
        setUserPosts(data.posts);
        if(data.posts.length<9){
          setShowMore(false)
        }
        console.log(data.posts)
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);
  const handleShowMore=async()=>{
    const startIndexex=userPosts.length;
    try {
      const {data}=await showmore(currentUser._id,startIndexex)
      setUserPosts((prev)=>[...prev,...data.posts])
      if(data.posts.length<9){
        setShowMore(false)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleDeletePost=async ()=>{
    setShowModal(false)
    try {
      const {data}=await deletepost(showPostId,currentUser._id)
      setUserPosts(prev=>prev.filter((post)=>post._id!==showPostId))
    } catch (error) {
      console.log(error.response.data.message)
    }
  }
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userPosts.map((post) => (
              <Table.Body className="divide-y" key={post._id}>
                <Table.Row className=" dark:border-gray-700 dark: bg-gray-800">
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="font-medium text-gray-500 dark:text-white line-clamp-1"
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span onClick={()=>{
                      setShowModal(true)
                      setShowPostId(post._id)
                    }} className="font-medium text-red-500 hover:underline cursor-pointer">
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="text-teal-500 hover:underline"
                      to={`/dashboard/update-post/${post._id}`}
                    >
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {
            showMore && (
              <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">Show More</button>
            )
          }
        </>
      ) : (
        <p>You have no posts yet!</p>
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
              Are you sure want to delete this post ?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
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

export default DashPosts;
