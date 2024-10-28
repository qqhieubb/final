import React from "react";
import { Link } from "react-router-dom";
import { Layout, Menu, Typography, Button, Space } from "antd";
import {
  HomeOutlined,
  BookOutlined,
  InfoCircleOutlined,
  UserOutlined,
  LoginOutlined,
} from "@ant-design/icons";

const { Header: AntHeader } = Layout;
const { Title } = Typography;

const Header = ({ isAuth }) => {
  return (
    <AntHeader style={{ display: "flex", alignItems: "center", padding: "0 50px", backgroundColor: "#001529", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
      
      {/* Logo Section */}
      <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
        <Title level={3} style={{ color: "#fff", margin: 0 }}>
          <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
            E-Learning
          </Link>
        </Title>
      </div>

      {/* Menu Items */}
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['home']} style={{ backgroundColor: "transparent", flex: 2 }}>
        <Menu.Item key="home" icon={<HomeOutlined />}>
          <Link to="/" style={{ color: "#fff", fontWeight: "500" }}>Home</Link>
        </Menu.Item>
        <Menu.Item key="courses" icon={<BookOutlined />}>
          <Link to="/courses" style={{ color: "#fff", fontWeight: "500" }}>Courses</Link>
        </Menu.Item>
        <Menu.Item key="about" icon={<InfoCircleOutlined />}>
          <Link to="/about" style={{ color: "#fff", fontWeight: "500" }}>About</Link>
        </Menu.Item>
      </Menu>

      {/* Auth Button */}
      <Space>
        {isAuth ? (
          <Button type="primary" icon={<UserOutlined />} shape="round" style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}>
            <Link to="/account" style={{ color: "#fff" }}>Account</Link>
          </Button>
        ) : (
          <Button type="primary" icon={<LoginOutlined />} shape="round" style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}>
            <Link to="/login" style={{ color: "#fff" }}>Login</Link>
          </Button>
        )}
      </Space>
    </AntHeader>
  );
};

export default Header;
