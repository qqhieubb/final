import React from "react";
import { Layout, Typography, Space, Row, Col, Divider } from "antd";
import {
  AiFillFacebook,
  AiFillTwitterSquare,
  AiFillInstagram,
} from "react-icons/ai";

const { Footer: AntFooter } = Layout;
const { Text, Link, Title } = Typography;

const Footer = () => {
  return (
    <AntFooter style={{ padding: "40px 50px", backgroundColor: "#001529", color: "#fff" }}>
      <Row gutter={16} justify="space-between">
        <Col xs={24} sm={12} md={8}>
          <Title level={4} style={{ color: "#fff" }}>Your E-Learning Platform</Title>
          <Text style={{ color: "#fff" }}>
            Empowering you to achieve your learning goals. Explore our platform for a wide range of courses that cater to your needs.
          </Text>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Title level={4} style={{ color: "#fff" }}>Quick Links</Title>
          <Link href="/" style={{ display: "block", color: "#fff" }}>Home</Link>
          <Link href="/courses" style={{ display: "block", color: "#fff" }}>Courses</Link>
          <Link href="/about" style={{ display: "block", color: "#fff" }}>About</Link>
          <Link href="/contact" style={{ display: "block", color: "#fff" }}>Contact</Link>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Title level={4} style={{ color: "#fff" }}>Contact Us</Title>
          <Text style={{ color: "#fff" }}>Email: <Link href="mailto:contact@yourplatform.com" style={{ color: "#fff" }}>contact@yourplatform.com</Link></Text><br />
          <Text style={{ color: "#fff" }}>Phone: (123) 456-7890</Text>
          <Space size="middle" style={{ marginTop: "10px" }}>
            <Link href="" style={{ color: "#fff" }} aria-label="Facebook"><AiFillFacebook size={24} /></Link>
            <Link href="" style={{ color: "#fff" }} aria-label="Twitter"><AiFillTwitterSquare size={24} /></Link>
            <Link href="" style={{ color: "#fff" }} aria-label="Instagram"><AiFillInstagram size={24} /></Link>
          </Space>
        </Col>
      </Row>

      <Divider style={{ borderColor: "#444" }} />

      <Row justify="center">
        <Text style={{ color: "#fff", fontSize: "14px" }}>
          &copy; 2024 Your E-Learning Platform. All rights reserved. Made with ❤️ by <Link href="" style={{ color: "#1890ff" }}>Truong Hoang Hieu</Link>
        </Text>
      </Row>
    </AntFooter>
  );
};

export default Footer;
