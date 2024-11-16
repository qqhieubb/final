import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    course: {
      type: "String",
      ref: "Courses",
    },
    completedLectures: [
      {
        type: "String",
        ref: "Lecture",
      },
    ],
    user: {
      type: "String",
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Progress = mongoose.model("Progress", schema);
