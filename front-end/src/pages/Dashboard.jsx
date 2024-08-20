
import { Button } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate(); // Use useNavigate hook

  const handleLogout = () => {
    logout(); // Call the logout function
    navigate('/login'); // Redirect to login page
  };

  return (
    <>
      <div>Dashboard</div>
      <Button onClick={handleLogout}>Logout</Button>
    </>
  );
};

export default Dashboard;
