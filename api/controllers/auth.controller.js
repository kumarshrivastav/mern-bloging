import bcryptjs from "bcryptjs";
import { userModel, verifyAuth } from "../model/user.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import TokenService from "../TokenService/TokenService.js";
class AuthController {
  async SingIn(req, res, next) {
    const error = verifyAuth(req.body);
    if (error) {
      return next(ErrorHandler(400, error.details[0].message));
    }
    try {
      const { email, password } = req.body;
      const validUser = await userModel.findOne({ email });
      if (!validUser) {
        return next(ErrorHandler(404, "User not found"));
      }
      const validPwd = await bcryptjs.compare(password, validUser.password);
      if (!validPwd) {
        return next(ErrorHandler(400, "Invalid Password"));
      }
      const { accessToken, refreshToken } = TokenService.generateToken({
        id: validUser._id,isAdmin:validUser.isAdmin
      });
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365,
      });
      const { password: pass, ...rest } = validUser._doc;

      return res.send(rest);
    } catch (error) {
      next(error);
    }
  }
  async oauth(req, res, next) {
    const { email, name, googlePhotoUrl } = req.body;
    try {
      const user = await userModel.findOne({ email });
      if (user) {
        const { accessToken, refreshToken } = TokenService.generateToken({
          id: user._id,isAdmin:user.isAdmin
        });
        const { password, ...rest } = user._doc;
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60,
        });
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 365,
        });
        res.status(200).send(rest);
      } else {
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);
        const hashedPassword = await bcryptjs.hash(generatedPassword, 10);
        const newUser = new userModel({
          username:
            name.toLowerCase().split(" ").join("") +
            Math.random().toString(9).slice(-4),
          email,
          password: hashedPassword,
          profilePicture: googlePhotoUrl,
        });
        await newUser.save();
        const { accessToken, refreshToken } = TokenService.generateToken({
          id: newUser._id,isAdmin:newUser.isAdmin
        });
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60,
        });
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 365,
        });
        const { password: pass, ...rest } = newUser._doc;
        return res.status(201).send(rest);
      }
    } catch (error) {
      return next(error);
    }
  }
  async updateUser(req, res, next) {
    // console.log(req.body)
    if (req.userId !== req.params.userId) {
      return next(ErrorHandler(403, "you are not allowed to update this user"));
    }
    if (req.body.password < 5) {
      return next(ErrorHandler(401, "Password must be >=5 digits"));
    }
    const salt = await bcryptjs.genSalt(10);
    if (req.body.password) {
      req.body.password = await bcryptjs.hash(req.body.password, salt);
    }
    if (req.body.username) {
      if (req.body.username.length < 5 || req.body.username.length > 30) {
        return next(
          ErrorHandler(400, "username length must be in between 5 - 30 ")
        );
      }
      if (req.body.username.includes(" ")) {
        return next(ErrorHandler(400, "username not contains space"));
      }
      if (req.body.username !== req.body.username.toLowerCase()) {
        return next(ErrorHandler(400, "username only contains lowercase"));
      }
      if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
        return next(
          ErrorHandler(400, "username only contains letter and number")
        );
      }
    }
    if (req.body.email) {
      if (req.body.email.length < 5 || req.body.email.length > 40) {
        return next(
          ErrorHandler(400, "email length must be in between 5 - 40")
        );
      }
      if (req.body.email !== req.body.email.toLowerCase()) {
        return next(ErrorHandler(400, "email only contains lowercase"));
      }
    }
    // userModel.findByIdAndUpdate(req.params.userId,{
    //   $set: {
    //     username: req.body.username,
    //     email: req.body.email,
    //     profilePicture: req.body.profilePicture,
    //     password: req.body.password,
    //   }
    // },{new:true},(err,doc)=>{
    //   if(err){
    //     return next(err)
    //   }
    //   console.log(doc)
    //   const {password,...rest}=doc._doc
    //   return res.status(200).send(rest)
    // })
    try {
      const updatedUser=await userModel.findByIdAndUpdate(
        { _id: req.params.userId },
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            profilePicture: req.body.profilePicture,
          },
        },
        { new: true }
      )
     
      // console.log(updatedUser);
      const { password, ...rest } = updatedUser._doc;
      return res.status(200).send(updatedUser);
    } catch (error) {
      return next(error);
    }
  }
}

export default new AuthController();
