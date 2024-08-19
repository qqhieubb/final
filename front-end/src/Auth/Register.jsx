import { Card, Flex, Typography, Form, Input, Button, Alert, Spin } from "antd";
import { Link } from "react-router-dom";


const Register = () => {
  const handleRegister = (values) => {
    console.log(values);
  };


  return (
    <Card title="Register" className="form-container">
      <Flex gap="large" align="center">
        {/*form*/}
        <Flex vertical flex={1}>
          <Typography.Title level={1} strong className="title">Create an account</Typography.Title>
          
          <Typography.Title type="secondary" strong className="slogan" >Join for exclusive access!</Typography.Title>
        </Flex>
        <Form layout="vertical" onFinish={handleRegister} autoComplete="off">
          <Form.Item label="Full name" name="name" rules={[{ required: true, message: 'Please input your full name!' }]}>
            <Input size="large" placeholder="Enter your full name" />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ type: "email", message: 'Please input valid Email!' }]}>
            <Input size="large" placeholder="Enter your email" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password   size="large" placeholder="Enter your password" />
          </Form.Item>

          <Form.Item label="Confirm Password" name="passwordConfirm" rules={[{ required: true, message: 'Please input Re-password!' }]}>
            <Input.Password   size="large" placeholder="Enter confirm password" />
          </Form.Item>
          {/* {
            error && <Alert description={error} type="error" showIcon closable className="alert"/>
          } */}

        <Form.Item>
          <Button //type={loading ? "" : "primary"} 
          htmlType="submit" size="large" className="btn">
            {/* {loading ? <Spin /> : "Create Account"} */}

            Create Account
          </Button>
        </Form.Item>

          
          <Form.Item>
            <Link to="/login">
            <Button className="btn" size="large">Already has an account!! Login now!!</Button>
            </Link>
            
          </Form.Item>
        </Form>
         
        
      </Flex>
     
    </Card>
  );
};

export default Register;
