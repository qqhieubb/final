import express from "express";
import {
  getAllCourses,
  getSingleCourse,
  fetchLectures,
  fetchLecture,
  getMyCourses,
  checkout,
  addComment,
  getComments,
  
  createCourse,
  updateCourse,
  
  getRecommendedCourses, // Import API gợi ý khóa học
} from "../controllers/courseController.js";
import { isAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Course Management Routes
router.post("/course/new", createCourse);
router.put("/course/:id", isAuth, updateCourse); // Route để cập nhật khóa học
router.get("/course/all", getAllCourses); // Route để lấy tất cả các khóa học, có hỗ trợ lọc theo category, keyword, và price
router.get("/course/:id", getSingleCourse);
router.get("/lectures/:id", isAuth, fetchLectures);
router.get("/lecture/:id", isAuth, fetchLecture);
router.get("/mycourse", isAuth, getMyCourses);
router.post("/course/checkout/:id", isAuth, checkout);

// Comment Routes
router.post("/:courseId/comments", isAuth, addComment);
router.get("/:courseId/comments", getComments);

// Recommended Courses Route
router.get("/course/recommended/:id", getRecommendedCourses); // Route mới: Gợi ý khóa học liên quan

export default router;
