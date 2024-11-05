import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Row, Typography, Statistic, Space, Spin } from "antd";
import { TeamOutlined, BookOutlined, RiseOutlined } from "@ant-design/icons";
import axios from "axios";
import { server } from "../../main"; // Đảm bảo đường dẫn chính xác
import Testimonials from "../../components/testimonials/Testimonials";

const { Title, Paragraph } = Typography;

const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${server}/api/categories`);
        setCategories(data.categories);
      } catch (error) {
        console.error("Failed to load categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Điều hướng đến trang Courses với query parameter
  const handleCategoryClick = (categoryName) => {
    navigate(`/courses?category=${encodeURIComponent(categoryName.toLowerCase())}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Header Section */}
      <div style={{ textAlign: "center", padding: "50px 0", backgroundColor: "#f0f2f5" }}>
        <Title level={1}>Welcome to our E-learning Platform</Title>
        <Paragraph>Learn, Grow, Excel - Your path to success starts here</Paragraph>
        <Button type="primary" size="large" onClick={() => navigate("/courses")}>
          Get Started
        </Button>
      </div>

      {/* Features Section */}
      <div style={{ padding: "50px 0" }}>
        <Title level={2} style={{ textAlign: "center" }}>Why Choose Us?</Title>
        <Row gutter={16} style={{ marginTop: "30px" }}>
          <Col xs={24} sm={12} md={8}>
            <Card title="Expert Instructors" bordered={false} hoverable>
              Learn from industry experts with years of experience in their fields.
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card title="Flexible Learning" bordered={false} hoverable>
              Study at your own pace with our flexible online courses.
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card title="Certifications" bordered={false} hoverable>
              Get certified and enhance your career opportunities.
            </Card>
          </Col>
        </Row>
      </div>

      {/* Statistics Section */}
      <div style={{ textAlign: "center", padding: "50px 0", backgroundColor: "#fafafa" }}>
        <Title level={2}>Our Achievements</Title>
        <Space size="large">
          <Statistic title="Students Enrolled" value={1200} prefix={<TeamOutlined />} />
          <Statistic title="Courses Available" value={150} prefix={<BookOutlined />} />
          <Statistic title="Success Rate" value="98%" prefix={<RiseOutlined />} />
        </Space>
      </div>

      {/* Categories Section */}
      <div style={{ padding: "50px 0" }}>
        <Title level={2} style={{ textAlign: "center" }}>Explore Our Categories</Title>
        {loading ? (
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <Spin tip="Loading Categories..." />
          </div>
        ) : (
          <Row gutter={[16, 16]} style={{ marginTop: "30px" }}>
            {categories.map((category) => (
              <Col xs={24} sm={12} md={8} lg={6} key={category._id}>
                <Card
                  hoverable
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <Title level={4}>{category.name}</Title>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* Testimonials Section */}
      <div style={{ padding: "50px 0", backgroundColor: "#f0f2f5" }}>
        <Title level={2} style={{ textAlign: "center" }}>What Our Students Say</Title>
        <Testimonials />
      </div>
    </div>
  );
};

export default Home;
