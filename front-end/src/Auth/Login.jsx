import { Card, Flex, Typography, Form, Input, Button, Alert, Spin } from "antd";
import { Link } from "react-router-dom";
    
const handleLogin = async(values) => {
  console.log(values);
};

    const Login = () => {
      return (
        <Card title="Register" className="form-container">
        <Flex gap="large" align="center">
          {/*form*/}
          <Flex vertical flex={1}>
            <Typography.Title level={1} strong className="title">Log In</Typography.Title>
            
            <Typography.Title type="secondary" strong className="slogan" >Login your account to get some brilliant course!</Typography.Title>
          </Flex>
          <Form layout="vertical" onFinish={handleLogin} autoComplete="off">
            
            <Form.Item label="Email" name="email" rules={[{ type: "email", message: 'Please input valid Email!' }]}>
              <Input size="large" placeholder="Enter your email" />
            </Form.Item>
            <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
              <Input.Password   size="large" placeholder="Enter your password" />
            </Form.Item>
  
            
            {/* {
              error && <Alert description={error} type="error" showIcon closable className="alert"/>
            } */}
  
          <Form.Item>
            <Button //type={loading ? "" : "primary"} 
            htmlType="submit" size="large" className="btn">
              {/* {loading ? <Spin /> : "Create Account"} */}
  
             Login
            </Button>
          </Form.Item>
  
            
            <Form.Item>
              <Link to="/register">
              <Button className="btn" size="large">Do not have an account?? Register now!!</Button>
              </Link>
              
            </Form.Item>
          </Form>
           
          
        </Flex>
       
      </Card>
      )
    }
    
    export default Login