import axios from 'axios';
export const signUp=(data)=>axios.post("/api/user/signup",data)