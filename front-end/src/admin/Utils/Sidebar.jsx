import React from "react";
import { Link } from "react-router-dom";
import { AiFillHome, AiOutlineLogout } from "react-icons/ai";
import { FaBook, FaUserAlt, FaListAlt } from "react-icons/fa"; // Import thêm icon cho Category
import { UserData } from "../../context/UserContext";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = () => {
  const { user } = UserData();
  const navigate = useNavigate();

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
        <Menu.Item key="/admin/dashboard" icon={<AiFillHome />}>
          <Link to={"/admin/dashboard"}>Home</Link>
        </Menu.Item>
        <Menu.Item key="/admin/course" icon={<FaBook />}>
          <Link to={"/admin/course"}>Courses</Link>
        </Menu.Item>
        {user && user.mainrole === "Admin" && (
          <>
            <Menu.Item key="/admin/users" icon={<FaUserAlt />}>
              <Link to={"/admin/users"}>Users</Link>
            </Menu.Item>
            <Menu.Item key="/admin/categories" icon={<FaListAlt />}>
              <Link to={"/admin/categories"}>Categories</Link>
            </Menu.Item>
          </>
        )}
        <Menu.Item key="/account" icon={<AiOutlineLogout />}>
          <Link to={"/account"}>Logout of Instructor and Admin Panel</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
