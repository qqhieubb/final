import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext"; // Đảm bảo đường dẫn đúng
import CategoryList from "../../components/category/CategoryList";
import CustomLayout from "../Utils/Layout"; // Đảm bảo đường dẫn đúng

const CategoryManagement = () => {
  const { user } = UserData(); // Sử dụng UserData để lấy thông tin người dùng
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.mainrole !== "Admin") {
      navigate("/"); // Chuyển hướng về trang chủ nếu không phải Admin
    }
  }, [user, navigate]);

  return (
    <CustomLayout>
      <h1 style={{ marginBottom: "24px" }}>Category Management</h1>
      <CategoryList />
    </CustomLayout>
  );
};

export default CategoryManagement;
