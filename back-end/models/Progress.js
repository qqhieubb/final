import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId, // Tham chiếu đến khóa học
      ref: "Courses",
      required: true, // Bắt buộc phải có khóa học
    },
    completedLectures: [
      {
        type: mongoose.Schema.Types.ObjectId, // Tham chiếu đến bài giảng
        ref: "Lecture",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId, // Tham chiếu đến user
      ref: "User",
      required: true, // Bắt buộc phải có user
    },
  },
  {
    timestamps: true, // Thêm thời gian tạo và cập nhật
  }
);

export const Progress = mongoose.model("Progress", schema);
