import React, { useState } from "react";
import { useCategory } from "../../context/CategoryContext";
import { Card, List, Typography, Spin, Space, Divider, Pagination } from "antd";
import CategoryForm from "./CategoryForm";
import CategoryItem from "./CategoryItem";

const { Title } = Typography;

const CategoryList = () => {
  const { categories, loading, removeCategory } = useCategory();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3; // Số lượng danh mục trên mỗi trang

  // Tính toán danh mục hiện tại dựa trên phân trang
  const startIndex = (currentPage - 1) * pageSize;
  const currentCategories = categories.slice(startIndex, startIndex + pageSize);

  // Thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Card
      title={<Title level={2} style={{ margin: 0 }}>Category List</Title>}
      bordered={false}
      style={{ width: "100%", padding: "20px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
    >
      {loading ? (
        <Spin tip="Loading..." />
      ) : (
        <>
          <List
            dataSource={currentCategories}
            renderItem={(category) => (
              <List.Item style={{ padding: 0 }}>
                <CategoryItem
                  category={category}
                  onEdit={() => setSelectedCategory(category)}
                  onDelete={removeCategory}
                />
              </List.Item>
            )}
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={categories.length}
            onChange={handlePageChange}
            style={{ marginTop: "16px", textAlign: "center" }}
          />
        </>
      )}
      <Divider style={{ margin: "24px 0" }} />
      <Space direction="vertical" style={{ width: "100%" }}>
        <CategoryForm
          category={selectedCategory}
          onClear={() => setSelectedCategory(null)}
        />
      </Space>
    </Card>
  );
};

export default CategoryList;
