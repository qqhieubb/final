import mongoose from "mongoose";

const courseSubscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Courses",
        required: true,
    },
    subscribedAt: {
        type: Date,
        default: Date.now,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5, // Giới hạn đánh giá từ 1 đến 5
        default: null, // Để null nếu chưa có đánh giá
    },
    deletedAt: {
      type: Date,
      default: null, // Set when subscription is deleted
    },

}, { timestamps: { createdAt: "createdAt", updatedAt: "updateAt" } });

export const CourseSubscription = mongoose.model("CourseSubscription", courseSubscriptionSchema);
