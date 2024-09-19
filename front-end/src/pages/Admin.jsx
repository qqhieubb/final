import React from 'react';
import { Layout, Typography, Button } from 'antd';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Admin = () => {
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
        <Title level={2}>Welcome, Admin!</Title>
        <Paragraph>
          Congratulations! You have successfully logged in as an administrator. You can now manage users, courses, and system settings.
        </Paragraph>
        <Button type="primary" size="large" href="/admin/dashboard" style={{ marginTop: '20px' }}>
          Go to Dashboard
        </Button>
      </Content>
    </Layout>
  );
};

export default Admin;