import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillHome, AiOutlineLogout } from "react-icons/ai";
import { FaBook, FaUserAlt, FaListAlt } from "react-icons/fa";
import { UserData } from "../../context/UserContext";
import { Layout, Menu } from "antd";

const { Sider } = Layout;

const Sidebar = () => {
  const { user } = UserData();
  const navigate = useNavigate();

  // Auto-navigate to Courses if role is Instructor
  useEffect(() => {
    if (user && user.role === "Instructor") {
      navigate("/admin/course");
    }
  }, [user, navigate]);

  return (
    <Sider
      width={250}
      style={{ height: "100vh", backgroundColor: "#001529" }}
    >
      <div
        className="logo"
        style={{
          margin: "16px",
          color: "white",
          fontSize: "24px",
          textAlign: "center",
        }}
      >
        Admin and Instructor Panel
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["/admin/dashboard"]}
        onClick={(e) => navigate(e.key)}
      >
        {/* Instructor Section */}
        {user && user.role === "Instructor" && (
          <Menu.ItemGroup key="instructor" title="Instructor Panel">
            <Menu.Item key="/admin/course" icon={<FaBook />}>
              <Link to={"/admin/course"}>Courses</Link>
            </Menu.Item>
          </Menu.ItemGroup>
        )}

        {/* Admin Section */}
        {user && user.role === "Admin" && (
          <Menu.ItemGroup key="admin" title="Admin Panel">
            <Menu.Item key="/admin/dashboard" icon={<AiFillHome />}>
              <Link to={"/admin/dashboard"}>Statistics</Link>
            </Menu.Item>
            <Menu.Item key="/admin/users" icon={<FaUserAlt />}>
              <Link to={"/admin/users"}>Users</Link>
            </Menu.Item>
            <Menu.Item key="/admin/categories" icon={<FaListAlt />}>
              <Link to={"/admin/categories"}>Categories</Link>
            </Menu.Item>
          </Menu.ItemGroup>
        )}

        {/* Common Section */}
        <Menu.Item key="/account" icon={<AiOutlineLogout />}>
          <Link to={"/account"}>Logout</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
