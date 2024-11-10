import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
// importing routes
import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import coursesSubcription from "./routes/courseSubscriptionRoutes.js";
import instructorRoute from "./routes/teacherCoursesRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();

// using middlewares
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173',  // Allow only your React app to access the API
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Add all required methods
    credentials: true // If you're sending cookies or authorization headers
  })
);


const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Server is working");
});

app.use("/uploads", express.static("uploads"));
app.use(express.static("public"))

// using routes
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", adminRoutes);
app.use("/api", categoryRoutes);
app.use("/api", coursesSubcription);
app.use("/api", instructorRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDb();
});
