import bcryptjs from "bcryptjs";
import { userModel, verifyUser } from "../model/user.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";

class UserController {
  test(req, res) {
    return res.json({ message: "API is Working..." });
  }
  async SingUp(req, res, next) {
    try {
      const error = verifyUser(req.body);
      if (error) {
        return next(ErrorHandler(400, error.details[0].message));
      }
      const { username, email, password } = req.body;
      const presentUsername = await userModel.find({ username });
      if (presentUsername.length !== 0) {
        return next(ErrorHandler(400, "username already present!"));
      }
      const presentEmail = await userModel.find({ email });
      if (presentEmail.length !== 0) {
        return next(ErrorHandler(400, "email already present!"));
      }
      const user = new userModel({ username, email, password });
      const salt = await bcryptjs.genSalt(10);
      user.password = await bcryptjs.hash(req.body.password, salt);
      await user.save();
      return res.status(201).send("User Registred Successfully!");
    } catch (error) {
      return next(error);
    }
  }
  async Delete(req, res, next) {
    if (req.userId !== req.params.userId) {
      return next(ErrorHandler(403, "You are not allowed to delete this user"));
    }
    try {
      await userModel.findByIdAndDelete(req.params.userId);
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res.status(200).send("User had been deleted");
    } catch (error) {
      return next(error);
    }
  }
  async SingOut(req, res, next) {
    try {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res.status(200).send("User signout successfully");
    } catch (error) {
      next(error);
    }
  }
  async getUsers(req, res, next) {
    if (!req.isAdmin) {
      return next(ErrorHandler(403, "You are not allowed to see all users"));
    }

    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.sort === "asc" ? 1 : -1;
      const users = await userModel
        .find()
        .sort({ createdAt: sortDirection })
        .skip(startIndex)
        .limit(limit);
      const usersWithoutPwd = users.map((user) => {
        const { password, ...rest } = user._doc;
        return rest;
      });
      const totalUsers = await userModel.countDocuments();
      const now = new Date();
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      const lastMonthUsers = await userModel.countDocuments({
        createdAt: { $gte: oneMonthAgo },
      });
      return res
        .status(200)
        .send({ users: usersWithoutPwd, totalUsers, lastMonthUsers });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
