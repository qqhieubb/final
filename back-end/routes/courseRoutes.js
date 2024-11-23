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
  deleteComment,
  updateComment,
  createCourse,
  updateCourse,
  addReply,
} from "../controllers/courseController.js";
import { isAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/course/new", createCourse);
router.put("/course/:id", isAuth, updateCourse); // Route để cập nhật khóa học
router.get("/course/all", getAllCourses); // Route để lấy tất cả các khóa học, có hỗ trợ lọc theo category
router.get("/course/:id", getSingleCourse);
router.get("/lectures/:id", isAuth, fetchLectures);
router.get("/lecture/:id", isAuth, fetchLecture);
router.get("/mycourse", isAuth, getMyCourses);
router.post("/course/checkout/:id", isAuth, checkout);

// Comment Routes
router.post("/:courseId/comments", isAuth, addComment);
router.get("/:courseId/comments", getComments);
router.delete("/comments/:commentId", isAuth, deleteComment);
router.put("/comments/:commentId", isAuth, updateComment);
router.post("/:courseId/comments/:commentId/replies", isAuth, addReply);

export default router;
