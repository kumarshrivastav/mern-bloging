import axios from 'axios';
// import {useSelector} from "react-redux"
// const {currentUser}=useSelector(state=>state.user)
export const signUp=(data)=>axios.post("/api/user/signup",data)
export const signin=(data)=>axios.post("/api/auth/signin",data)
export const oauth=(data)=>axios.post("/api/auth/oauth",data)
export const signout=()=>axios.get("/api/user/signout")
export const createpost=(data)=>axios.post("/api/post/create-post",data)
// export const update=(data)=>axios.put(`/api/auth/update/${currentUser._id}`,data)
export const showmore=(currentUserId,startIndex)=>axios.get(`/api/post/getposts?userId${currentUserId}&startIndex=${startIndex}`)
export const deletepost=(postId,userId)=>axios.delete(`/api/post/deletepost/${postId}/${userId}`)
export const fetchpost=(postId)=>axios.get(`/api/post/getposts?postId=${postId}`)
export const updatepost=(postId,userId,data)=>axios.put(`/api/post/updatepost/${postId}/${userId}`,data)
export const fetchusers=()=>axios.get('/api/user/getusers')
export const showmoreusers=(startIndex)=>axios.get(`/api/user/getusers?startIndex=${startIndex}`)
export const deleteuser=(userId)=>axios.delete(`/api/user/delete/${userId}`)
export const deletebyadmin=(userId)=>axios.delete(`/api/user/deletebyadmin/${userId}`)
export const postslug=(postslug)=>axios.get(`/api/post/getposts?slug=${postslug}`)
export const createcomment=(data)=>axios.post('/api/comment/create',data)
export const fetchcommentpost=(postId)=>axios.get(`/api/comment/getpostcomment/${postId}`)
export const getUser=(userId)=>axios.get(`/api/user/${userId}`)