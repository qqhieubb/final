import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
import Razorpay from "razorpay";
import cors from "cors";

dotenv.config();

// export const instance = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY,
//   key_secret: process.env.RAZORPAY_SECRET,
// });

const app = express();

// using middlewares
app.use(express.json());
app.use(cors());

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Server is working");
});

app.use("/uploads", express.static("uploads"));

// importing routes
import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// using routes
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", adminRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDb();
});