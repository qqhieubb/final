import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Courses",
      required: true,
    }
  ],
  status: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },
  price: {
    type: Number,
    required: true,
  },
  sessionStripeId: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Order = mongoose.model("Order", orderSchema);
