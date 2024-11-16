import React from "react";
import { MdDashboard } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import { Card, Button, Typography, Space } from "antd";
import { UserData } from "../../context/UserContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Account = ({ user }) => {
  const { setIsAuth, setUser } = UserData();
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.clear();
    setUser([]);
    setIsAuth(false);
    toast.success("Logged Out");
    navigate("/login");
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
      {user && (
        <Card
          title={<Title level={3}>My Profile</Title>}
          bordered={false}
          style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Text strong>Name: {user.name}</Text>
            <Text strong>Email: {user.email}</Text>

            <Button
              type="primary"
              icon={<MdDashboard />}
              onClick={() => navigate(`/${user._id}/dashboard`)}
              block
            >
              Dashboard
            </Button>

            {/* Hiển thị nút cho cả Admin và Instructor */}
            {(user.role === "Admin" || user.role === "Instructor") && (
              <Button
                type="dashed"
                icon={<MdDashboard />}
                onClick={() => navigate(`/admin/dashboard`)}
                block
              >
                Admin and Instructor Dashboard
              </Button>
            )}

            <Button
              type="primary"
              danger
              icon={<IoMdLogOut />}
              onClick={logoutHandler}
              block
            >
              Logout
            </Button>
          </Space>
        </Card>
      )}
    </div>
  );
};

export default Account;
