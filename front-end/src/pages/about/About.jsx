import React from "react";
import { Row, Col, Typography, Divider, Card } from "antd";
import { TeamOutlined, BulbOutlined, SolutionOutlined } from "@ant-design/icons";


const { Title, Text } = Typography;

const About = () => {
  return (
    <div className="about" style={{ padding: "50px", backgroundColor: "#f0f2f5" }}>
      <Row justify="center" style={{ textAlign: "center", marginBottom: "40px" }}>
        <Col>
          <Title level={2}>About Us</Title>
          <Text style={{ fontSize: "16px", color: "#555" }}>
            We are dedicated to providing high-quality online courses to help individuals learn and grow in their desired fields.
            Our experienced instructors ensure that each course is tailored for effective learning and practical application.
          </Text>
        </Col>
      </Row>

      <Divider />

      <Row gutter={[16, 16]} justify="center">
        {/* Vision Section */}
        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            style={{ textAlign: "center" }}
            cover={<TeamOutlined style={{ fontSize: "48px", color: "#1890ff", marginTop: "20px" }} />}
          >
            <Title level={4}>Our Vision</Title>
            <Text>Empowering individuals worldwide to achieve their learning goals.</Text>
          </Card>
        </Col>

        {/* Mission Section */}
        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            style={{ textAlign: "center" }}
            cover={<BulbOutlined style={{ fontSize: "48px", color: "#1890ff", marginTop: "20px" }} />}
          >
            <Title level={4}>Our Mission</Title>
            <Text>To offer high-quality courses that emphasize practical application and real-world skills.</Text>
          </Card>
        </Col>

        {/* Values Section */}
        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            style={{ textAlign: "center" }}
            cover={<SolutionOutlined style={{ fontSize: "48px", color: "#1890ff", marginTop: "20px" }} />}
          >
            <Title level={4}>Our Values</Title>
            <Text>Integrity, innovation, and commitment to providing excellent educational experiences.</Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default About;
