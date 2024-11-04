import React, { createContext, useContext, useEffect } from "react";
import useCategoryAPI from "../hooks/useCategory";

const CategoryContext = createContext();

// Custom hook để dễ sử dụng Category Context
export const useCategory = () => useContext(CategoryContext);

export const CategoryProvider = ({ children }) => {
  // Sử dụng hook useCategoryAPI để quản lý API và trạng thái của Category
  const {
    categories,
    loading,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategoryAPI();

  // Lấy danh sách các Category khi component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Giá trị cung cấp cho CategoryContext
  const value = {
    categories,
    loading,
    addCategory: createCategory,
    editCategory: updateCategory,
    removeCategory: deleteCategory,
  };

  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
};
