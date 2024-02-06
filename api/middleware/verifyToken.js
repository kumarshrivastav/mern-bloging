// import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler.js";
import TokenService from "../TokenService/TokenService.js";
const verifyToken=(req,res,next)=>{
    // console.log(req.cookies)
    try {
        const {accessToken}=req.cookies
        if(!accessToken){
            return next(ErrorHandler(401,'Unauthorized'))
        }
        const payload=TokenService.verifyAccessToken(accessToken)
        if(!payload.id){
            return next(ErrorHandler(401,'Unauthorized'))
        }
        req.userId=payload.id;
        return next()
    } catch (error) {
        return next(error)
    }
}

export default verifyToken;