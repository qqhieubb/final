import React from "react";
import { Card, Typography, Button, Space } from "antd";

const { Text } = Typography;

const CategoryItem = ({ category, onEdit, onDelete }) => {
  return (
    <Card
      style={{
        width: "100%", // Đặt chiều rộng tối đa
        marginBottom: "12px",
        borderRadius: "8px",
        border: "1px solid #f0f0f0",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
      }}
      bodyStyle={{ padding: "16px" }}
    >
      <Space direction="horizontal" style={{ width: "100%", justifyContent: "space-between" }}>
        <div>
          <Text strong style={{ fontSize: "16px" }}>{category.name}</Text>
          <Text type="secondary" style={{ display: "block", fontSize: "14px", marginTop: "4px" }}>
            {category.description}
          </Text>
        </div>
        <Space>
          <Button type="link" onClick={() => onEdit(category)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => onDelete(category._id)}>
            Delete
          </Button>
        </Space>
      </Space>
    </Card>
  );
};

export default CategoryItem;
