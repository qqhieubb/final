//import { instance } from "../index.js";
import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { User } from "../models/User.js";
import crypto from "crypto";
import { Payment } from "../models/Payment.js";
import { Progress } from "../models/Progress.js";
import { Comment } from "../models/Comments.js";


export const getAllCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find();
  res.json({
    courses,
  });
});

export const getSingleCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);

  res.json({
    course,
  });
});

export const fetchLectures = TryCatch(async (req, res) => {
  const lectures = await Lecture.find({ course: req.params.id });

  const user = await User.findById(req.user._id);

  if (user.role === "Instructor") {
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

// export const paymentVerification = TryCatch(async (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
//     req.body;

//   const body = razorpay_order_id + "|" + razorpay_payment_id;

//   const expectedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_SECRET)
//     .update(body)
//     .digest("hex");

//   const isAuthentic = expectedSignature === razorpay_signature;

//   if (isAuthentic) {
//     await Payment.create({
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//     });

//     const user = await User.findById(req.user._id);

//     const course = await Courses.findById(req.params.id);

//     user.subscription.push(course._id);

//     await Progress.create({
//       course: course._id,
//       completedLectures: [],
//       user: req.user._id,
//     });

//     await user.save();

//     res.status(200).json({
//       message: "Course Purchased Successfully",
//     });
//   } else {
//     return res.status(400).json({
//       message: "Payment Failed",
//     });
//   }
// });

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

  if (comment.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
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

