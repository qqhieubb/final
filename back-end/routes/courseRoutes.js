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
  // paymentVerification,
} from "../controllers/courseController.js";
import { isAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/course/all", getAllCourses);
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

export default router;
