import { CourseSubscription } from "../models/CourseSubscription.js";
import { Progress } from "../models/Progress.js";
import { Lecture } from "../models/Lecture.js";
import { Courses } from "../models/Courses.js";
import mongoose from "mongoose";

class UserService {
    getCoursePayment = async (req, res) => {
        const { userId } = req.query;
        try {
            const courses = await CourseSubscription.find({ userId }).populate({
                path: "courseId",
                model: Courses,
                select: "title description image price duration category createdBy createdAt", // Select specific fields if needed
            });
            res.status(200).json({ courses, message: "Get all courses register by user" });
        } catch (error) {
            // Error handling
            console.error(error);
            return {
                status: 500,
                message: 'Failed to get course register',
            };
        }
    }

    getCourseProgress = async (req, res) => {
        try {
            const { userId, course } = req.query;
            const progress = await Progress.findOne({ course, userId });
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
        } catch (error) {
            console.error("Error in getCourseProgress:", error);
            return res.status(500).json({ error: error.message });
        }

    }

    getCourseDetail = async (req, res) => {
        const { userId, courseId } = req.query;
        try {
            // Tìm kiếm thông tin khóa học dựa trên courseId
            const course = await Courses.findById({ _id: new mongoose.Types.ObjectId(courseId) });
    
            // Tìm kiếm subscription đặc biệt (nếu có) dựa trên courseId và userId
            const specialRate = await CourseSubscription.findOne({
                courseId: new mongoose.Types.ObjectId(courseId),
                userId: new mongoose.Types.ObjectId(userId),
            });
    
            // Nếu không tìm thấy khóa học hoặc specialRate, xử lý hợp lý
            if (!course) {
                return res.status(404).json({ message: "Khóa học không tồn tại." });
            }
    
            // Kiểm tra và gán giá trị `rating`, tránh lỗi null
            const data = {
                ...course._doc,
                rating: specialRate ? specialRate.rating : null, // Nếu specialRate null, gán `rating` là null
            };
    
            console.log(data);
    
            // Trả về thông tin khóa học
            res.status(200).json({ course: data });
        } catch (error) {
            console.error("Error in getCourseDetail:", error);
            return res.status(500).json({ error: error.message });
        }
    };
    
}

export default new UserService();