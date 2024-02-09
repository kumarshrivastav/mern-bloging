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
