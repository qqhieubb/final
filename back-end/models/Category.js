import mongoose from "mongoose";

// Định nghĩa schema cho Category
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Đảm bảo không có category nào trùng tên
    trim: true, // Xóa khoảng trắng thừa
  },
  description: {
    type: String,
    trim: true, // Xóa khoảng trắng thừa
  },
  createdAt: {
    type: Date,
    default: Date.now, // Tự động thêm ngày tạo
  },
});

// Tạo model từ schema và export nó
export const Category = mongoose.model("Category", categorySchema);
