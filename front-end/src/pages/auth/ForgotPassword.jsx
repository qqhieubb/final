import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../../main";
import { Form, Input, Button, Typography, Spin } from "antd";

const { Title } = Typography;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/forgot`, { email });
      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <div style={{ width: 300, padding: 24, background: "#fff", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <Title level={3} style={{ textAlign: "center" }}>Forgot Password</Title>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Enter Email" name="email" rules={[{ required: true, message: 'Please enter your email!' }]}>
            <Input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="example@example.com" 
            />
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              disabled={btnLoading}
            >
              {btnLoading ? <Spin size="small" /> : "Forgot Password"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;
