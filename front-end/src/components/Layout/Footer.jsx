
import { Layout } from 'antd';

const { Footer } = Layout;

const AppFooter = () => {
  return (
    <Footer style={{ textAlign: 'center', backgroundColor: '#001529', color: 'white', padding: '20px 0' }}>
      <div>
        <p>My LMS ©2024 Created by Your Company</p>
        <p>
          Contact us: <a href="mailto:info@mylms.com" style={{ color: '#1890ff' }}>info@mylms.com</a>
        </p>
      </div>
    </Footer>
  );
};

export default AppFooter;
