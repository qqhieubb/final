import express from "express";
import { Courses } from "../models/Courses.js";
import { User } from "../models/User.js";
import { Order } from "../models/Order.js";
import dotenv from 'dotenv';
import paymentService from "../services/payment.service.js";
import { CourseSubscription } from "../models/CourseSubscription.js";

dotenv.config();

const router = express.Router();


// add shopping cart (thêm vào giỏ hàng)
router.post("/order-courses", async (req, res) => {
    try {
        const { userId, courseIds } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const courses = await Courses.find({ _id: { $in: courseIds } });
        if (courses.length !== courseIds.length) {
            return res.status(404).json({ message: "One or more courses not found." });
        }

        const totalAmount = courses.reduce((sum, course) => sum + course.price, 0);

        const order = new Order({
            userId,
            courseIds,
            status: "pending",
            price: totalAmount,
            createdAt: Date.now(),
        });

        const data = await order.save();
        res.status(200).json({ order_id: data._id })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred.", error: error.message });
    }
})

// payment order (thanh toán giỏ hàng)
router.post("/payment-courses", async (req, res) => {
    try {
        const { userId, orderId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const order = await Order.findById(orderId);
        const courses = await Courses.find({ _id: { $in: order.courseIds } });

        const responseCheckout = await paymentService.createCheckout({
            userId, courses, orderId
        });
        res.status(200).json({ url: responseCheckout.url })
    } catch (error) {
        return res.status(500).json({ message: error });
    }
})

// if payment success -> update stauts order and register courses
router.get("/register-courses/:orderId", async (req, res) => {
    const data = await paymentService.listenCheckout()
    const orderId = req.params.orderId
    try {
        if (data[0]?.payment_status == 'paid') {
            const coursesOrder = await Order.findByIdAndUpdate({ _id: orderId }, { status: data[0]?.payment_status }, { new: true });
            console.log("coursesOrder: ", coursesOrder)
            if (coursesOrder.status !== "paid") {
                throw error("Update status order failure")
            }
            const normalCourseSub = coursesOrder.courseIds.map(course => ({ userId: coursesOrder.userId, courseId: course._id }))
            console.log("normalCourseSub: ", normalCourseSub)
            await CourseSubscription.create(normalCourseSub);
            res.redirect("http://localhost:5173/")
        }
    } catch (err) {
        return res.status(500).json({ message: err });
    }
});

// update rating courses (cập nhật rating)
router.post("/courses/rating", async (req, res) => {
    const { orderId, courseId, userId, rating } = req.body;

    try {
        const course = await Order.findById(orderId);
        if (course.status == 'paid') {
            const updateRating = await CourseSubscription.findOneAndUpdate({ courseId, userId }, { rating }, { new: true });
            res.status(200).json(updateRating);
        }
    } catch (error) {
        return res.status(500).json({ message: error });
    }
});

export default router;
