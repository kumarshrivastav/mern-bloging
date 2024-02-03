import mongoose from "mongoose"
import Joi from "joi"
const userSchema=mongoose.Schema({
    username:{type:String,required:true,unique:true,min:5,max:20},
    email:{type:String,required:true,unique:true,min:5,max:20},
    password:{type:String,required:true,min:5}
},{timestamps:true})

const userModel=mongoose.models.users || mongoose.model("users",userSchema)

const verifyUser=(user)=>{
    const joiSchema=Joi.object({
        usernae:Joi.string().unique().min(5).max(20).required(),
        usernae:Joi.string().unique().email().min(5).max(20).required(),
        password:Joi.string().required().min(5)
    })

    const {error}=joiSchema.validate(user)
    return error
}

export {userModel,verifyUser};