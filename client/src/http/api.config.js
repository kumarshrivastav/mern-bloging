import axios from 'axios';
export const signUp=(data)=>axios.post("/api/user/signup",data)
export const signin=(data)=>axios.post("/api/auth/signin",data)
export const oauth=(data)=>axios.post("/api/auth/oauth",data)