import bcryptjs from "bcryptjs";
import { userModel, verifyUser } from "../model/user.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";

class UserController{
    test(req,res){
        return res.json({message:"API is Working..."})
    }
    async SingUp(req,res,next){
        try {
            const error=verifyUser(req.body)
            if(error){
                return next(ErrorHandler(400,error.details[0].message))
                
            }
            const {username,email,password}=req.body
            const presentUsername=await userModel.find({username})
            if(presentUsername.length!==0){
                return next(ErrorHandler(400,"username already present!"))
            }
            const presentEmail=await userModel.find({email})
            if(presentEmail.length!==0){
                return next(ErrorHandler(400,"email already present!"))
                
            }
            const user=new userModel({username,email,password})
            const salt=await bcryptjs.genSalt(10)
            user.password=await bcryptjs.hash(req.body.password,salt)
            await user.save()
            return res.status(201).send("User Registred Successfully!")
        } catch (error) {
            return next(error)
        }

    }
}

export default new UserController;