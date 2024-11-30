import { User } from "../models/User.js";
import { Courses } from "../models/Courses.js";

import { Order } from "../models/Order.js";

class DashBoardService {
    // Đếm tổng số người dùng theo vai trò
    totalRole = async (req, res) => {
        try {
            const [totalUsers, totalInstructors, totalAdmins] = await Promise.all([
                User.countDocuments({ role: "User" }),
                User.countDocuments({ role: "Instructor" }),
                User.countDocuments({ role: "Admin" }),
            ]);

            res.status(200).json({ totalUsers, totalInstructors, totalAdmins });
        } catch (error) {
            console.error("Error in totalRole:", error);
            res.status(500).send({ message: "Failed", error: error.message });
        }
    };

    // Đếm số lượng khóa học theo danh mục
    countCoursesByCategory = async (req, res) => {
        try {
            const counts = await Courses.aggregate([
                {
                    $group: {
                        _id: "$category", // Nhóm theo category
                        totalCourses: { $count: {} },
                    },
                },
                {
                    $lookup: {
                        from: "categories", // Tên collection category
                        localField: "_id",
                        foreignField: "_id",
                        as: "categoryDetails",
                    },
                },
                { $unwind: "$categoryDetails" },
                {
                    $project: {
                        _id: 0,
                        category: "$categoryDetails.name",
                        totalCourses: 1,
                    },
                },
            ]);

            res.status(200).json(counts);
        } catch (error) {
            console.error("Error in countCoursesByCategory:", error);
            res.status(500).send({ message: "Failed", error: error.message });
        }
    };

    // Tính tổng doanh thu theo từng tháng của từng giáo viên
    totalRevenueByInstructor = async (req, res) => {
        try {
            const revenueByInstructor = await Order.aggregate([
                {
                    $match: { status: "paid" }, // Chỉ lấy các đơn hàng đã thanh toán
                },
                {
                    $lookup: {
                        from: "courses", // Ghép nối với bảng Courses
                        localField: "courseIds",
                        foreignField: "_id",
                        as: "courses",
                    },
                },
                {
                    $unwind: "$courses", // Tách từng khóa học
                },
                {
                    $lookup: {
                        from: "users", // Ghép nối với bảng Users để lấy giáo viên
                        localField: "courses.createdBy",
                        foreignField: "_id",
                        as: "instructor",
                    },
                },
                {
                    $unwind: "$instructor", // Tách từng giáo viên
                },
                {
                    $group: {
                        _id: {
                            instructor: "$instructor.name", // Nhóm theo giáo viên
                            month: { $month: "$createdAt" }, // Nhóm theo tháng
                            year: { $year: "$createdAt" },   // Nhóm theo năm
                        },
                        totalRevenue: { $sum: "$price" }, // Tổng doanh thu
                    },
                },
                {
                    $project: {
                        _id: 0,
                        instructor: "$_id.instructor",
                        month: "$_id.month",
                        year: "$_id.year",
                        totalRevenue: 1,
                    },
                },
                { $sort: { year: 1, month: 1 } }, // Sắp xếp theo thời gian
            ]);
    
            res.status(200).json(revenueByInstructor);
        } catch (error) {
            console.error("Error in totalRevenueByInstructor:", error);
            res.status(500).json({ message: "Failed to calculate revenue", error: error.message });
        }
    };
    

    // Cập nhật vai trò user (giữa User và Instructor)
    acceptInstructor = async (req, res) => {
        const { userId } = req.body;

        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Chuyển đổi vai trò giữa User và Instructor
            user.role = user.role === "User" ? "Instructor" : "User";

            await user.save();

            res.status(200).json({ message: `User role updated successfully` });
        } catch (error) {
            console.error("Error in acceptInstructor:", error);
            res.status(500).json({ message: "An error occurred.", error: error.message || error });
        }
    };
}

export default new DashBoardService();
