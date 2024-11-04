import express from "express";
import { isAdmin, isAuth, isInstructor } from "../middlewares/authMiddleware.js";
import {
  addLectures,
  createCourse,
  deleteCourse,
  deleteLecture,
  getAllStats,
  getAllUser,
  updateRole,
} from "../controllers/adminController.js";
import { uploadFiles } from "../middlewares/multer.js";

const router = express.Router();

// Routes cho Instructor - CRUD Course và Lecture
router.post("/course/new", isAuth, isInstructor, uploadFiles, createCourse);
router.post("/course/:id", isAuth, isInstructor, uploadFiles, addLectures);
router.delete("/course/:id", isAuth, isInstructor, deleteCourse);
router.delete("/lecture/:id", isAuth, isInstructor, deleteLecture);

// Routes cho Admin - Quản lý thống kê và người dùng
router.get("/stats", isAuth, isAdmin, getAllStats);
router.put("/user/:id", isAuth, isAdmin, updateRole);
router.get("/users", isAuth, isAdmin, getAllUser);

export default router;
