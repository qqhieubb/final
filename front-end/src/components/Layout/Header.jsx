import { Layout, Menu, Button } from 'antd';
import { Link } from 'react-router-dom';

const { Header } = Layout;

const AppHeader = () => {
  return (
    <Header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="logo" style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>
        My LMS
      </div>
      <Menu theme="dark" mode="horizontal" style={{ flexGrow: 1, marginLeft: '20px' }}>
        {/* Menu items can be added here */}
      </Menu>
      <div>
        <Button type="primary" style={{ marginRight: '10px' }}>
          <Link to="/login">Login</Link>
        </Button>
        <Button type="default">
          <Link to="/register">Register</Link>
        </Button>
      </div>
    </Header>
  );
};

export default AppHeader;