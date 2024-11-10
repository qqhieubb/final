import { User } from "../models/User.js"
import { Courses } from "../models/Courses.js";
import { TeacherCourses } from "../models/TeacherCourses.js";
import mongoose from "mongoose";
import { CourseSubscription } from "../models/CourseSubscription.js"

class DashBoardService {
    totalRole = async (req, res) => {
        try {
            const [totalUsers, totalInstructors, totalAdmins] = await Promise.all([
                User.countDocuments({ role: "User" }),
                User.countDocuments({ role: "Instructor" }),
                User.countDocuments({ mainrole: "Admin" }),
            ]);

            res.status(200).json({ totalUsers, totalInstructors, totalAdmins });
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: 'Failed', error: error.message });
        }
    }

    countCoursesByCategory = async (req, res) => {
        try {
            const counts = await Courses.aggregate([
                {
                    $group: {
                        _id: "$category", // Nhóm theo trường "category"
                        totalCourses: { $count: {} }, // Đếm số lượng khóa học trong mỗi nhóm
                    },
                },
                {
                    $lookup: {
                        from: "categories", // Tên của collection Category
                        localField: "_id",
                        foreignField: "_id",
                        as: "categoryDetails",
                    },
                },
                {
                    $unwind: "$categoryDetails", // Giải nén mảng categoryDetails
                },
                {
                    $project: {
                        _id: 0, // Ẩn trường _id mặc định
                        category: "$categoryDetails.name", // Giả sử "name" là tên của category
                        totalCourses: 1,
                    },
                },
            ]);

            res.status(200).json(counts);
        } catch (error) {
            res.status(500).send({ message: 'Failed', error: error.message });
        }
    };

    totalRevenueTeacher = async (req, res) => {
        try {
            const { userId, startDate, endDate } = req.query;

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
            console.log(dateFilter.hasOwnProperty("$gte"))
            // lấy tiền của khóa học của teacher
            const courseSub = await CourseSubscription.find({
                courseId: { $in: courseIds },
                ...(dateFilter.hasOwnProperty("$gte") ? { createdAt: dateFilter } : {}), // Add createdAt filter only if $gte is present
            }).populate({
                path: "courseId", // This is the field in CourseSubscription that references Courses
                select: "title price", // Choose specific fields you want from Courses
            });
            const totalRevenueCourseByTeacher = courseSub.reduce((acc, course) => acc + course.courseId.price, 0);

            return { userId, totalRevenueCourseByTeacher }
        } catch (error) {
            console.error("Error fetching teacher's total price:", error); // Log full error to console
            res.status(500).json({ message: "Đã xảy ra lỗi.", error: error.message || error });
        }
    }
}

export default new DashBoardService()