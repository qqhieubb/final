import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { isAuth, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route tạo mới một danh mục (chỉ dành cho Admin)
router.post("/category", isAuth, isAdmin, createCategory);

// Route lấy tất cả danh mục (mở cho mọi người dùng)
router.get("/categories", getAllCategories);

// Route lấy chi tiết một danh mục (mở cho mọi người dùng)
router.get("/category/:id", getCategory);

// Route cập nhật thông tin danh mục (chỉ dành cho Admin)
router.put("/category/:id", isAuth, isAdmin, updateCategory);

// Route xóa danh mục (chỉ dành cho Admin)
router.delete("/category/:id", isAuth, isAdmin, deleteCategory);

export default router;
