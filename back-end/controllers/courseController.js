//import { instance } from "../index.js";
import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { User } from "../models/User.js";
import { Category } from "../models/Category.js";

import { Progress } from "../models/Progress.js";
import { Comment } from "../models/Comments.js";
import mongoose from "mongoose";


export const getAllCourses = TryCatch(async (req, res) => {
  const { category, sort, minPrice, maxPrice, keyword, page = 1, limit = 10, role, userId } = req.query;

  let query = {};

  // Lọc theo category nếu có
  if (category) {
    const categoryDoc = await Category.findOne({ name: new RegExp(`^${category}$`, "i") });
    if (!categoryDoc) {
      return res.status(404).json({ message: "Category not found" });
    }
    query.category = categoryDoc._id;
  }

  // Lọc theo khoảng giá cụ thể
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Tìm kiếm theo từ khóa (trong tiêu đề hoặc mô tả)
  if (keyword) {
    query.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ];
  }

  // Xử lý sắp xếp
  const sortOptions = {
    "price-asc": { price: 1 },
    "price-desc": { price: -1 },
    "newest": { createdAt: -1 },
    "oldest": { createdAt: 1 },
    "name-asc": { title: 1 },
    "name-desc": { title: -1 },
  };
  const sortQuery = sortOptions[sort] || { createdAt: -1 };

  // Xử lý phân trang
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const skip = (pageNumber - 1) * limitNumber;

  let totalCourses;
  let courses;

  // Nếu người dùng là Instructor
  if (role === "Instructor" && userId) {
    query.createdBy = userId; // Lọc các khóa học được tạo bởi Instructor
    totalCourses = await Courses.countDocuments(query);

    courses = await Courses.find(query)
      .populate("category", "name")
      .populate("createdBy", "name email") // Lấy thêm thông tin của người tạo
      .sort(sortQuery) // Sắp xếp theo yêu cầu
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
  }

  // Nếu người dùng không phải Instructor
  totalCourses = await Courses.countDocuments(query);
  courses = await Courses.find(query)
    .populate("category", "name")
    .populate("createdBy", "name email")
    .sort(sortQuery)
    .skip(skip)
    .limit(limitNumber);

  res.status(200).json({
    courses,
    pagination: {
      currentPage: pageNumber,
      totalPages: Math.ceil(totalCourses / limitNumber),
      totalCourses,
    },
  });
});

// Gợi ý các khóa học liên quan
export const getRecommendedCourses = TryCatch(async (req, res) => {
  const { id } = req.params;

  // Tìm khóa học hiện tại
  const course = await Courses.findById(id);
  if (!course) return res.status(404).json({ message: "Course not found" });

  // Tìm các khóa học cùng danh mục (loại trừ khóa học hiện tại)
  const relatedCourses = await Courses.find({
    category: course.category,
    _id: { $ne: id },
  })
    .limit(5)
    .sort({ createdAt: -1 });

  res.status(200).json({
    relatedCourses,
  });
});




export const getSingleCourse = TryCatch(async (req, res) => {
  try {
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
  const { role } = req.user;

  if (role === "Instructor") {
    const courses = await Courses.find({ createdBy: req.user._id })
      .populate("category", "name")
      .populate("createdBy", "name");

    return res.json({
      courses,
    });
  }

  const courses = await Courses.find({ _id: { $in: req.user.subscription } })
    .populate("category", "name")
    .populate("createdBy", "name");

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

  if (!lectureId || !course) {
    return res.status(400).json({ message: "Missing lectureId or course parameter" });
  }

  let progress = await Progress.findOne({ user: req.user._id, course });

  if (!progress) {
    progress = new Progress({
      user: req.user._id,
      course,
      completedLectures: [],
    });
  }

  if (progress.completedLectures.includes(lectureId)) {
    return res.json({ message: "Progress already recorded" });
  }

  progress.completedLectures.push(lectureId);
  await progress.save();

  // Tính lại tiến trình sau khi thêm
  const allLectures = await Lecture.countDocuments({ course });
  const completedLectures = progress.completedLectures.length;
  const courseProgressPercentage = (completedLectures * 100) / allLectures;

  res.status(201).json({
    message: "Progress updated successfully",
    courseProgressPercentage,
    completedLectures,
    allLectures,
  });
});




export const getYourProgress = TryCatch(async (req, res) => {
  const progress = await Progress.findOne({
    user: req.user._id,
    course: req.query.course,
  });

  if (!progress) {
    console.log("Progress not found for user:", req.user._id, "course:", req.query.course);
    return res.status(404).json({ message: "Progress not found" });
  }

  const allLectures = await Lecture.countDocuments({ course: req.query.course });
  if (allLectures === 0) {
    console.log("No lectures found for course:", req.query.course);
    return res.status(404).json({ message: "No lectures found for this course" });
  }

  const completedLectures = progress.completedLectures.length;
  const courseProgressPercentage = (completedLectures * 100) / allLectures;

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



export const createCourse = TryCatch(async (req, res) => {
  const { title, description, price, category, createdBy, duration, image } = req.body;

  if (!title || !description || !price || !category || !createdBy || !duration) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const defaultImage = "https://files.fullstack.edu.vn/f8-prod/courses/21/63e1bcbaed1dd.png";
  const courseImage = image || defaultImage;

  const newCourse = new Courses({
    title,
    description,
    price,
    category,
    createdBy, // Lưu ID của Instructor
    duration,
    image: courseImage,
    createdAt: new Date(),
  });

  await newCourse.save();

  res.status(201).json({
    message: "Course created successfully",
    course: newCourse,
  });
});


export const updateCourse = TryCatch(async (req, res) => {
  const { id } = req.params;
  const { title, description, price, category, duration, image } = req.body;

  // Tìm khóa học
  const course = await Courses.findById(id);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  // Cập nhật chỉ các trường có giá trị
  if (title) course.title = title;
  if (description) course.description = description;
  if (price) course.price = price;
  if (category) course.category = category;
  if (duration) course.duration = duration;
  if (image) course.image = image;

  await course.save();

  res.json({
    message: "Course updated successfully",
    course,
  });
});



