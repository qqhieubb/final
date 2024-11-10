import mongoose from "mongoose";

const teacherCourseSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Courses",
    required: true,
  },
}, {
  timestamps: true,
});

export const TeacherCourses = mongoose.model("TeacherCourses", teacherCourseSchema);
