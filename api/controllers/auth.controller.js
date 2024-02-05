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
        id: validUser._id,
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
          id: user._id,
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
            name.toLowerCase().split(" ").join("") + Math.random().toString(9).slice(-4),
            email,
            password:hashedPassword,
            profilePicture:googlePhotoUrl

        });
        await newUser.save();
        const { accessToken, refreshToken } = TokenService.generateToken({
            id: newUser._id,
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
          return res.status(201).send(rest)
      }
    } catch (error) {
      return next(error);
    }
  }
}

export default new AuthController();
