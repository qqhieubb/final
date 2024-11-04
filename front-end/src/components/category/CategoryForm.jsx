import React, { useState, useEffect } from "react";
import { useCategory } from "../../context/CategoryContext";
import { Form, Input, Button, Typography, Space } from "antd";

const { Title } = Typography;

const CategoryForm = ({ category, onClear }) => {
  const { addCategory, editCategory } = useCategory();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description);
    } else {
      setName("");
      setDescription("");
    }
  }, [category]);

  const handleSubmit = () => {
    if (category) {
      editCategory(category._id, { name, description });
    } else {
      addCategory({ name, description });
    }
    onClear();
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit}
      style={{ marginTop: "20px", padding: "20px", border: "1px solid #f0f0f0", borderRadius: "5px" }}
    >
      <Title level={4}>{category ? "Edit Category" : "Add Category"}</Title>
      <Form.Item
        label="Category Name"
        rules={[{ required: true, message: "Please enter the category name" }]}
      >
        <Input
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Item>
      <Form.Item label="Description">
        <Input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Item>
      <Space>
        <Button type="primary" htmlType="submit">
          {category ? "Update" : "Add"}
        </Button>
        {category && (
          <Button onClick={onClear} type="default">
            Cancel
          </Button>
        )}
      </Space>
    </Form>
  );
};

export default CategoryForm;
