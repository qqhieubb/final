import express from "express";
import { Courses } from "../models/Courses.js";
import { TeacherCourses } from "../models/TeacherCourses.js";
import mongoose from "mongoose";
import { CourseSubscription } from "../models/CourseSubscription.js";

const router = express.Router();


// API lấy tất cả khóa học mà giảng viên đã tạo
router.get("/teachers/course/:teacherId", async (req, res) => {
  const { teacherId } = req.params;

  try {
    // Tìm tất cả các bản ghi khóa học mà giảng viên này quản lý trong TeacherCourses
    const teacherCourses = await TeacherCourses.find({ teacherId }).populate("courseId");

    // Lấy danh sách khóa học từ kết quả của bảng trung gian
    const courses = teacherCourses.map((record) => record.courseId);

    res.status(200).json({ message: "Lấy danh sách khóa học thành công.", courses });
  } catch (error) {
    res.status(500).json({ message: "Đã xảy ra lỗi.", error });
  }
});

// API insert or update khóa học cho giảng viên
router.post("/teachers", async (req, res) => {
  const { userId, title, description, image, price, duration, category, createdBy, courseId } = req.body;

  try {
    // Kiểm tra xem giảng viên có quyền quản lý khóa học không
    const isAuthorized = await TeacherCourses.findOne({ teacherId: userId, courseId });
    if (!isAuthorized && courseId) {
      return res.status(403).json({ message: "Bạn không có quyền quản lý khóa học này." });
    }

    // Kiểm tra xem khóa học đã tồn tại chưa
    let course = await Courses.findById(courseId);

    if (course) {
      // Nếu khóa học đã tồn tại, thực hiện cập nhật
      course = await Courses.findByIdAndUpdate(courseId, { title, description, image, price, duration, category, createdBy }, { new: true });
      return res.status(200).json({ message: "Cập nhật khóa học thành công.", course });
    } else {
      // Nếu khóa học chưa tồn tại, thực hiện thêm mới
      const newCourse = new Courses({ title, description, image, price, duration, category, createdBy });
      await newCourse.save();

      // Thêm khóa học mới vào bảng TeacherCourses
      const newTeacherCourse = new TeacherCourses({
        teacherId: userId,
        courseId: newCourse._id
      });
      await newTeacherCourse.save();

      return res.status(201).json({ message: "Thêm mới khóa học thành công.", course: newCourse });
    }
  } catch (error) {
    res.status(500).json({ message: "Đã xảy ra lỗi.", error: error.message || error });
  }
});

// API lấy tổng tiền của giảng viên filter doanh thu ngày/tháng/năm - total revenue
router.get("/teachers/price", async (req, res) => {
  const { userId, startDate, endDate } = req.query;

  try {
    // lấy danh sách khóa học của teacher
    const getListCoursesTeacher = await TeacherCourses.find({ teacherId: userId }).select("courseId");
    
    // Ensure getListCoursesTeacher has data
    if (!getListCoursesTeacher || getListCoursesTeacher.length === 0) {
      return res.status(404).json({ message: "No courses found for the specified teacher." });
    }
    
    // Extract courseIds
    const courseIds = getListCoursesTeacher.map((c) => new mongoose.Types.ObjectId(c.courseId));

    // Date filter if provided
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    // lấy tiền của khóa học của teacher
    const courseSub = await CourseSubscription.find({
      courseId: { $in: courseIds },
      createdAt: dateFilter,
    }).populate({
      path: "courseId", // This is the field in CourseSubscription that references Courses
      select: "title price", // Choose specific fields you want from Courses
    });

    const totalRevenueCourseByTeacher = courseSub.reduce((acc, course) => acc + course.courseId.price, 0);

    res.json({ userId, totalRevenueCourseByTeacher });
  } catch (error) {
    console.error("Error fetching teacher's total price:", error); // Log full error to console
    res.status(500).json({ message: "Đã xảy ra lỗi.", error: error.message || error });
  }
});


export default router;
