//import { instance } from "../index.js";
import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { User } from "../models/User.js";
import { Category } from "../models/Category.js";

import { Progress } from "../models/Progress.js";
import { Comment } from "../models/Comments.js";
import mongoose from "mongoose";
import { TeacherCourses } from "../models/TeacherCourses.js";

export const getAllCourses = TryCatch(async (req, res) => {
  const { category, sort, minPrice, maxPrice, page = 1, limit = 10, role, userId } = req.query;

  let query = {};

  if (category) {
    const categoryDoc = await Category.findOne({ name: new RegExp(`^${category}$`, "i") });
    if (!categoryDoc) {
      return res.status(404).json({ message: "Category not found" });
    }
    query.category = categoryDoc._id;
  }
  // Lọc theo khoảng giá
  if (minPrice && maxPrice) {
    query.price = { $gte: minPrice, $lte: maxPrice };
  }


  // Tạo tùy chọn sắp xếp
  let sortOption = {};
  switch (sort) {
    case "price-asc":
      sortOption.price = 1; // Sắp xếp tăng dần theo giá
      break;
    case "price-desc":
      sortOption.price = -1; // Sắp xếp giảm dần theo giá
      break;
    case "newest":
      sortOption.createdAt = -1; // Sắp xếp giảm dần theo ngày tạo (mới nhất)
      break;
    case "oldest":
      sortOption.createdAt = 1;
      break;
    default:
      break;
  }

  // Chuyển đổi page và limit thành số nguyên
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const skip = (pageNumber - 1) * limitNumber;


  let totalCourses = ""
  let courses = ""
  if (role && role == "Instructor" && userId) {
    totalCourses = await TeacherCourses.countDocuments({teacherId: userId});

    // Get instructor's courses with pagination
    const teacherCourses = await TeacherCourses.find({teacherId: userId})
      .populate("courseId")
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);
      const user = await User.findById(userId)

  console.log(user)
    // Extract course details from TeacherCourses
    courses = teacherCourses.map((record) => record.courseId);
    return res.status(200).json({
      courses,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCourses / limitNumber),
        totalCourses,
      },
    });
  }


  totalCourses = await Courses.countDocuments();
  // Lấy danh sách khóa học theo query, sắp xếp và phân trang
  
  courses = await Courses.find(query)
    .populate("category", "name")
    .sort(sortOption)
    .skip(skip)
    .limit(limitNumber);

  return res.status(200).json({
    courses,
    pagination: {
      currentPage: pageNumber,
      totalPages: Math.ceil(totalCourses / limitNumber),
      totalCourses,
    },
  });
});


export const getSingleCourse = TryCatch(async (req, res) => {
  try {
    console.log("req.params infinite: ", req.params)
    const { id } = req.params

    const course = await Courses.findById({ _id: new mongoose.Types.ObjectId(id) });
    // const singleCourse = await CourseSubscription.find
    res.status(200).json({
      course,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred.", error: error.message || error });
  }
});

export const getFullInfoCourse = async (req, res) => {
  try {
    const course = await Courses.findById({ _id: new mongoose.Types.ObjectId(req.params.id) });
    res.status(200).json({
      course,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred.", error: error.message || error });
  }
};

export const fetchLectures = TryCatch(async (req, res) => {
  const lectures = await Lecture.find({ course: new mongoose.Types.ObjectId(req.params.id) });
  const user = await User.findById(req.user._id);
  if (user.role === "Instructor" || user.role == 'User') {
    return res.json({ lectures });
  }

  if (!user.subscription.includes(req.params.id))
    return res.status(400).json({
      message: "You have not subscribed to this course",
    });

  res.json({ lectures });
});

export const fetchLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);

  const user = await User.findById(req.user._id);

  if (user.role === "Instructor") {
    return res.json({ lecture });
  }

  if (!user.subscription.includes(lecture.course))
    return res.status(400).json({
      message: "You have not subscribed to this course",
    });

  res.json({ lecture });
});

export const getMyCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find({ _id: req.user.subscription });

  res.json({
    courses,
  });
});

export const checkout = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);

  const course = await Courses.findById(req.params.id);

  if (user.subscription.includes(course._id)) {
    return res.status(400).json({
      message: "You already have this course",
    });
  }

  const options = {
    amount: Number(course.price * 100),
    currency: "VND",
  };

  const order = await instance.orders.create(options);

  res.status(201).json({
    order,
    course,
  });
});



export const addProgress = TryCatch(async (req, res) => {
  const { lectureId, course } = req.query;

  // Kiểm tra các tham số
  if (!lectureId || !course) {
    return res.status(400).json({ message: "Missing lectureId or course parameter" });
  }

  console.log("User ID:", req.user._id);
  console.log("Course ID:", course);
  console.log("Lecture ID:", lectureId);

  // Tìm kiếm tiến độ của người dùng cho khóa học
  let progress = await Progress.findOne({
    user: req.user._id,
    course: course,
  });

  // Nếu không tìm thấy tiến độ, tạo mới
  if (!progress) {
    progress = new Progress({
      user: req.user._id,
      course: course,
      completedLectures: [],
    });
  }

  // Kiểm tra xem lecture đã được hoàn thành chưa
  if (progress.completedLectures.includes(lectureId)) {
    return res.json({
      message: "Progress already recorded",
    });
  }

  // Thêm lectureId vào danh sách hoàn thành và lưu tiến độ
  progress.completedLectures.push(lectureId);
  await progress.save();

  res.status(201).json({
    message: "New progress added",
  });
});



export const getYourProgress = TryCatch(async (req, res) => {
  // Tìm kiếm tiến độ của người dùng cho khóa học cụ thể
  const progress = await Progress.findOne({
    user: req.user._id,
    course: req.query.course,
  });

  // Nếu không tìm thấy tiến độ, trả về thông báo lỗi
  if (!progress) return res.status(404).json({ message: "Progress not found" });

  // Lấy số lượng bài giảng cho khóa học
  const allLectures = await Lecture.countDocuments({ course: req.query.course });

  // Kiểm tra xem allLectures có bằng 0 không để tránh phép chia cho 0
  if (allLectures === 0) {
    return res.status(404).json({
      message: "No lectures found for this course",
    });
  }

  // Tính số bài giảng đã hoàn thành
  const completedLectures = progress.completedLectures.length;

  // Tính phần trăm tiến độ khóa học
  const courseProgressPercentage = (completedLectures * 100) / allLectures;

  // Trả về thông tin tiến độ
  res.json({
    courseProgressPercentage,
    completedLectures,
    allLectures,
    progress,
  });
});


// Add Comment Functionality

export const addComment = TryCatch(async (req, res) => {
  const { commentText } = req.body;
  const { courseId } = req.params;

  if (!commentText) {
    return res.status(400).json({ message: "Comment text is required" });
  }

  const comment = await Comment.create({
    userId: req.user._id,
    courseId,
    commentText,
  });

  res.status(201).json({
    message: "Comment added successfully",
    comment,
  });
});

export const getComments = TryCatch(async (req, res) => {
  const { courseId } = req.params;

  const comments = await Comment.find({ courseId }).populate("userId", "name");

  res.json({
    comments,
  });
});

export const deleteComment = TryCatch(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    return res.status(404).json({
      message: "Comment not found",
    });
  }

  if (comment.userId.toString() !== req.user._id.toString() && req.user.role !== "Instructor") {
    return res.status(403).json({
      message: "You are not authorized to delete this comment",
    });
  }

  await comment.remove();

  res.json({
    message: "Comment deleted successfully",
  });
});

export const updateComment = TryCatch(async (req, res) => {
  const { commentId } = req.params;
  const { commentText } = req.body;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    return res.status(404).json({
      message: "Comment not found",
    });
  }

  if (comment.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      message: "You are not authorized to update this comment",
    });
  }

  comment.commentText = commentText;

  await comment.save();

  res.json({
    message: "Comment updated successfully",
    comment,
  });
});

