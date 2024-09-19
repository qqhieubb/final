// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Layout, Typography, Button } from 'antd';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Student = () => {
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
        <Title level={2}>Welcome, Student!</Title>
        <Paragraph>
          Congratulations! You have successfully logged in as a student. Start exploring courses and track your learning progress now!
        </Paragraph>
        <Button type="primary" size="large" href="/student/dashboard" style={{ marginTop: '20px' }}>
          Go to Dashboard
        </Button>
      </Content>
    </Layout>
  );
};

export default Student;
