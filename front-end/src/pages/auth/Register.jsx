import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";
import { Form, Input, Button, Typography, Space } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const { btnLoading, registerUser } = UserData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const submitHandler = async () => {
    await registerUser(name, email, password, navigate);
  };

  return (
    <div className="auth-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Space direction="vertical" align="center" style={{ width: '100%', maxWidth: 400, padding: 24, borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', background: '#fff' }}>
        <Title level={2}>Register</Title>
        <Form onFinish={submitHandler} layout="vertical" style={{ width: '100%' }}>
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
            <Input
              prefix={<UserOutlined />}
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}>
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={btnLoading} block>
              {btnLoading ? "Please Wait..." : "Register"}
            </Button>
          </Form.Item>
        </Form>
        <Text>
          Already have an account? <Link to="/login">Login</Link>
        </Text>
      </Space>
    </div>
  );
};

export default Register;
