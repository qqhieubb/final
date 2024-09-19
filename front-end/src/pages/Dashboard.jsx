import { Button, Layout, Typography, Alert } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Layout style={{ minHeight: '100vh', padding: '50px', backgroundColor: '#f0f2f5' }}>
      <Content
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '50px',
          backgroundColor: 'white',
          borderRadius: '8px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        }}
      >
        <Alert
          message="Login Successful"
          description="You have successfully logged in to your dashboard."
          type="success"
          showIcon
          style={{ marginBottom: '20px' }}
        />
        <Title level={2}>Welcome to the Dashboard!</Title>
        <Paragraph>
          This is your control panel where you can manage your account, view courses, and much more.
        </Paragraph>
        <Button type="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Content>
    </Layout>
  );
};

export default Dashboard;
