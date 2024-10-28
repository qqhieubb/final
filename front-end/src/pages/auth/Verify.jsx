import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";
import ReCAPTCHA from "react-google-recaptcha";
import { Form, Input, Button, Typography, Space, Card } from "antd";

const { Title, Text } = Typography;

const Verify = () => {
  const [otp, setOtp] = useState("");
  const { btnLoading, verifyOtp } = UserData();
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  function onChange(value) {
    console.log("Captcha value:", value);
    setShow(true);
  }

  const submitHandler = async () => {
    await verifyOtp(Number(otp), navigate);
  };

  return (
    <div className="auth-page">
      <Space direction="vertical" align="center" style={{ width: "100%", marginTop: 50 }}>
        <Card bordered style={{ maxWidth: 400, width: "100%", textAlign: "center" }}>
          <Title level={3}>Verify Account</Title>
          <Form layout="vertical" onFinish={submitHandler}>
            <Form.Item label="OTP" required>
              <Input
                type="number"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                required
              />
            </Form.Item>
            <Form.Item>
              <ReCAPTCHA
                sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                onChange={onChange}
              />
            </Form.Item>
            {show && (
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={btnLoading}
                  block
                >
                  {btnLoading ? "Please Wait..." : "Verify"}
                </Button>
              </Form.Item>
            )}
          </Form>
          <Text>
            Go to <Link to="/login">Login</Link> page
          </Text>
        </Card>
      </Space>
    </div>
  );
};

export default Verify;
