import { User } from "../models/User.js"
import { Courses } from "../models/Courses.js";
import { TeacherCourses } from "../models/TeacherCourses.js";
import { CourseSubscription } from "../models/CourseSubscription.js"
import mongoose from "mongoose";

class DashBoardService {
    totalRole = async (req, res) => {
        try {
            const [totalUsers, totalInstructors, totalAdmins] = await Promise.all([
                User.countDocuments({ role: "User" }),
                User.countDocuments({ role: "Instructor" }),
                User.countDocuments({ role: "Admin" }),
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

    
    totalRevenueByInstructor = async (req, res) => {
        try {
            // Aggregate revenue grouped by each instructor
            const revenueByInstructor = await TeacherCourses.aggregate([
                {
                    // Join TeacherCourses with CourseSubscription on courseId
                    $lookup: {
                        from: "coursesubscriptions",
                        localField: "courseId",
                        foreignField: "courseId",
                        as: "subscriptions",
                    },
                },
                {
                    // Unwind subscriptions to calculate total revenue for each entry
                    $unwind: "$subscriptions",
                },
                {
                    // Join CourseSubscription with Courses to get course price
                    $lookup: {
                        from: "courses",
                        localField: "subscriptions.courseId",
                        foreignField: "_id",
                        as: "courseDetails",
                    },
                },
                {
                    // Unwind courseDetails to access course price
                    $unwind: "$courseDetails",
                },
                {
                    // Group by teacherId and sum the revenue from each course price
                    $group: {
                        _id: "$teacherId",
                        totalRevenue: { $sum: "$courseDetails.price" },
                    },
                },
                {
                    // Join with the users collection to get instructor details (e.g., name)
                    $lookup: {
                        from: "users",
                        localField: "_id",
                        foreignField: "_id",
                        as: "instructorDetails",
                    },
                },
                {
                    // Unwind instructorDetails to access instructor information
                    $unwind: "$instructorDetails",
                },
                {
                    // Project fields for the response
                    $project: {
                        _id: 0,
                        instructor: "$instructorDetails.name",
                        totalRevenue: 1,
                    },
                },
            ]);

            return res.status(200).json(revenueByInstructor);
        } catch (error) {
            console.error("Error fetching total revenue by instructor:", error);
            return { message: "Error occurred.", error: error.message };
        }
    };


    acceptInstructor = async (req, res) => {
        const { userId } = req.body;

        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Toggle role between 'User' and 'Instructor'
            user.role = user.role === 'User' ? 'Instructor' : 'User';

            await user.save(); // Save the updated user role to the database

            res.status(200).json({ message: `User role updated successfully` });
        } catch (error) {
            console.error("Check instructor", error); // Log full error to console
            res.status(500).json({ message: "An error occurred.", error: error.message || error });
        }
    }
}

export default new DashBoardService()