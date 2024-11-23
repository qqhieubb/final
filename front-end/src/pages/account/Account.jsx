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

            {/* Dashboard chung cho tất cả người dùng */}
            <Button
              type="primary"
              icon={<MdDashboard />}
              onClick={() => navigate(`/${user._id}/dashboard`)}
              block
            >
              Enrolled Courses
            </Button>

            {/* Phần dành riêng cho Admin */}
            {user.role === "Admin" && (
              <div>
                <Button
                  type="dashed"
                  icon={<MdDashboard />}
                  onClick={() => navigate(`/admin/dashboard`)}
                  block
                >
                  Admin Dashboard
                </Button>
              </div>
            )}

            {/* Phần dành riêng cho Instructor */}
            {user.role === "Instructor" && (
              <div>
              
                <Button
                  type="dashed"
                  icon={<MdDashboard />}
                  onClick={() => navigate(`/admin/course`)}
                  block
                >
                  Manage Your Courses
                </Button>
              </div>
            )}

            {/* Logout */}
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
