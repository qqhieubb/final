import { Category } from "../models/Category.js";
import TryCatch from "../middlewares/TryCatch.js";

// Tạo mới một danh mục
export const createCategory = TryCatch(async (req, res) => {
  const { name, description } = req.body;

  // Kiểm tra nếu danh mục đã tồn tại
  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    return res.status(400).json({ message: "Category already exists" });
  }

  // Tạo mới danh mục
  const category = await Category.create({ name, description });
  res.status(201).json({ message: "Category created successfully", category });
});

// Lấy tất cả danh mục
export const getAllCategories = TryCatch(async (req, res) => {
  const categories = await Category.find();
  res.json({ categories });
});

// Lấy chi tiết một danh mục
export const getCategory = TryCatch(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  res.json({ category });
});

// Cập nhật thông tin danh mục
export const updateCategory = TryCatch(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const category = await Category.findById(id);

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  // Cập nhật thông tin danh mục
  category.name = name || category.name;
  category.description = description || category.description;
  await category.save();

  res.json({ message: "Category updated successfully", category });
});

// Xóa danh mục
export const deleteCategory = TryCatch(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  await category.deleteOne();
  res.json({ message: "Category deleted successfully" });
});
