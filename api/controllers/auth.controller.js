import bcryptjs from "bcryptjs";
import { userModel, verifyAuth } from "../model/user.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import TokenService from "../TokenService/TokenService.js";
class AuthController{
    async SingIn(req,res,next){
        const error=verifyAuth(req.body)
        if(error){
            return next(ErrorHandler(400,error.details[0].message))
        }
        try {
            const {email,password}=req.body
            const validUser=await userModel.findOne({email})
            if(!validUser){
                return next(ErrorHandler(404,'User not found'))
            }
            const validPwd=await bcryptjs.compare(password,validUser.password)
            if(!validPwd){
                return next(ErrorHandler(400,"Invalid Password"))
            }
            const {accessToken,refreshToken}=TokenService.generateToken({id:validUser._id})
            res.cookie('accessToken',accessToken,{httpOnly:true,maxAge:1000*60*60})
            res.cookie('refreshToken',refreshToken,{httpOnly:true,maxAge:1000*60*60*24*365})
            const {password:pass,...rest}=validUser._doc

            return res.send(rest)

        } catch (error) {
            next(error)
        }
    }
}

export default new AuthController;