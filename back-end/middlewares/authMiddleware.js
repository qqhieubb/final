import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

// Middleware xác thực người dùng đã đăng nhập
export const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(403).json({
        message: "Please Login",
      });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData._id);

    next();
  } catch (error) {
    res.status(500).json({
      message: "Login First",
    });
  }
};

// Middleware kiểm tra quyền Admin
export const isAdmin = (req, res, next) => {
  try {
    if (req.user.mainrole !== "Admin") {
      return res.status(403).json({
        message: "Access denied. Admins only.",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Middleware kiểm tra quyền Instructor
export const isInstructor = (req, res, next) => {
  try {
    if (req.user.role !== "Instructor") {
      return res.status(403).json({
        message: "Access denied. Instructors only.",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Middleware kiểm tra quyền sở hữu comment
export const isCommentOwner = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (comment.userId.toString() !== req.user._id.toString() && req.user.role !== "Instructor") {
      return res.status(403).json({
        message: "You are not authorized to modify this comment",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
