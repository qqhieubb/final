import { useState, useCallback } from "react";
import axios from "axios";
import { server } from "../main";

const useCategoryAPI = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lấy tất cả danh mục
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${server}/api/categories`);
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Tạo mới một danh mục
  const createCategory = async (newCategory) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage
      const response = await axios.post(`${server}/api/category`, newCategory, {
        headers: {
          token: token, // Thêm token vào header với key là "token"
        },
      });
      setCategories((prevCategories) => [...prevCategories, response.data.category]);
    } catch (error) {
      console.error("Failed to create category:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật danh mục
  const updateCategory = async (id, updatedCategory) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage
      const response = await axios.put(`${server}/api/category/${id}`, updatedCategory, {
        headers: {
          token: token, // Thêm token vào header với key là "token"
        },
      });
      setCategories((prevCategories) =>
        prevCategories.map((category) => (category._id === id ? response.data.category : category))
      );
    } catch (error) {
      console.error("Failed to update category:", error);
    } finally {
      setLoading(false);
    }
  };

  // Xóa danh mục
  const deleteCategory = async (id) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage
      await axios.delete(`${server}/api/category/${id}`, {
        headers: {
          token: token, // Thêm token vào header với key là "token"
        },
      });
      setCategories((prevCategories) => prevCategories.filter((category) => category._id !== id));
    } catch (error) {
      console.error("Failed to delete category:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    loading,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};

export default useCategoryAPI;
