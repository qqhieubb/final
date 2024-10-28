import React, { useState } from "react";
import Layout from "../Utils/Layout";
import { useNavigate } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../../main";
import { Typography, Form, Input, Button, Select, Upload, Spin, Row, Col, Card, Table } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

const categories = [
  "Web Development",
  "App Development",
  "Game Development",
  "Data Science",
  "Artificial Intelligence",
  "Marketing",
  "Business Management",
  "Graphic Design",
  "Photography",
  "Health & Fitness",
  "Music",
  "Language Learning",
  "Personal Development",
  "Cooking",
  "Finance & Investment",
  "Art & Crafts",
];


const AdminCourses = ({ user }) => {
  const navigate = useNavigate();

  if (user && user.role !== "admin") return navigate("/");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState("");
  const [imagePrev, setImagePrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const changeImageHandler = (e) => {
    const file = e.file.originFileObj;
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setImagePrev(reader.result);
      setImage(file);
    };
  };

  const { courses, fetchCourses } = CourseData();

  const submitHandler = async () => {
    setBtnLoading(true);
    const myForm = new FormData();

    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("category", category);
    myForm.append("price", price);
    myForm.append("createdBy", createdBy);
    myForm.append("duration", duration);
    myForm.append("file", image);

    try {
      const { data } = await axios.post(`${server}/api/course/new`, myForm, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      toast.success(data.message);
      setBtnLoading(false);
      await fetchCourses();
      setImage("");
      setTitle("");
      setDescription("");
      setDuration("");
      setImagePrev("");
      setCreatedBy("");
      setPrice("");
      setCategory("");
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
    },
    {
      title: "Duration (hrs)",
      dataIndex: "duration",
      key: "duration",
    },
  ];

  return (
    <Layout>
      <Row gutter={16} style={{ padding: '20px' }}>
        <Col span={14}>
          <Title level={2}>All Courses</Title>
          <Table
            columns={columns}
            dataSource={courses}
            rowKey={(record) => record._id}
            pagination={{ pageSize: 5 }}
          />
        </Col>

        <Col span={10}>
          <Card title="Add Course" bordered={false}>
            <Form layout="vertical" onFinish={submitHandler}>
              <Form.Item label="Title" required>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </Form.Item>

              <Form.Item label="Description" required>
                <Input.TextArea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Item>

              <Form.Item label="Price" required>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </Form.Item>

              <Form.Item label="Created By" required>
                <Input
                  value={createdBy}
                  onChange={(e) => setCreatedBy(e.target.value)}
                />
              </Form.Item>

              <Form.Item label="Category" required>
                <Select
                  value={category}
                  onChange={(value) => setCategory(value)}
                  placeholder="Select Category"
                >
                  {categories.map((cat) => (
                    <Option key={cat} value={cat}>
                      {cat}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Duration (in hours)" required>
                <Input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </Form.Item>

              <Form.Item label="Upload Image" required>
                <Upload
                  beforeUpload={() => false}
                  onChange={changeImageHandler}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
                {imagePrev && (
                  <img src={imagePrev} alt="Course Preview" style={{ width: '100%', marginTop: '10px' }} />
                )}
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={btnLoading}
                  block
                >
                  {btnLoading ? <Spin /> : "Add Course"}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default AdminCourses;
