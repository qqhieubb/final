import express from "express";
import {
  forgotPassword,
  loginUser,
  myProfile,
  register,
  resetPassword,
  verifyUser,
} from "../controllers/userController.js";
import { isAuth } from "../middlewares/authMiddleware.js";
import { addProgress, getYourProgress } from "../controllers/courseController.js";
import sendMailInstructor from "../services/sendEmailInstructor.service.js";
import userService from "../services/user.service.js";

const router = express.Router();

router.post("/user/register", register);
router.post("/user/verify", verifyUser);
router.post("/user/login", loginUser);
router.get("/user/me", isAuth, myProfile);
router.post("/user/forgot", forgotPassword);
router.post("/user/reset", resetPassword);
router.post("/user/progress", isAuth, addProgress);
router.get("/user/progress", isAuth, getYourProgress);


router.post("/user/become_instructor", async (req, res) => {
  try {
    const { from } = req.body;
    await sendMailInstructor(from);
    res.status(200).json({ message: 'send email success' })
  } catch (error) {
    res.status(500).json({error, message: "failue become to instructor"});
  }
});
router.get("/user/get_course_payment", userService.getCoursePayment)
router.get("/user/course_progress", userService.getCourseProgress);
router.get("/user/course_detail", userService.getCourseDetail);
export default router;
