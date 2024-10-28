import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";
import { CourseData } from "../../context/CourseContext";
import { Form, Input, Button, Typography, Card, Space } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";


const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const { btnLoading, loginUser } = UserData();
  const { fetchMyCourse } = CourseData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async () => {
    await loginUser(email, password, navigate, fetchMyCourse);
  };

  return (
    <div className="auth-page" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
      <Card style={{ maxWidth: 400, width: "100%", padding: "20px 30px", borderRadius: 8, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
        <Title level={3} style={{ textAlign: "center" }}>Login</Title>
        <Form
          layout="vertical"
          onFinish={submitHandler}
          style={{ marginTop: 20 }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter your email!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={btnLoading} block>
              {btnLoading ? "Please Wait..." : "Login"}
            </Button>
          </Form.Item>
        </Form>

        <Space direction="vertical" size="small" style={{ textAlign: "center", width: "100%" }}>
          <Text>Don't have an account? <Link to="/register">Register</Link></Text>
          <Link to="/forgot">Forgot password?</Link>
        </Space>
      </Card>
    </div>
  );
};

export default Login;
