import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import Layout from "../Utils/Layout";
import toast from "react-hot-toast";
import { Table, Button, Typography, Modal } from "antd";

const { Title } = Typography;

const AdminUsers = ({ user }) => {
  const navigate = useNavigate();

  if (user && user.mainrole !== "Admin") return navigate("/");

  const [users, setUsers] = useState([]);

  async function fetchUsers() {
    try {
      const { data } = await axios.get(`${server}/api/users`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setUsers(data.users);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id) => {
    Modal.confirm({
      title: "Are you sure you want to update this user's role?",
      onOk: async () => {
        try {
          const { data } = await axios.put(
            `${server}/api/user/${id}`,
            {},
            {
              headers: {
                token: localStorage.getItem("token"),
              },
            }
          );
          toast.success(data.message);
          fetchUsers();
        } catch (error) {
          toast.error(error.response?.data?.message || "Error updating role");
        }
      },
    });
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Update Role",
      key: "updateRole",
      render: (_, record) => (
        <Button type="primary" onClick={() => updateRole(record._id)}>
          Update Role
        </Button>
      ),
    },
  ];

  return (
    <Layout>
      <div style={{ padding: "20px" }}>
        <Title level={2}>All Users</Title>
        <Table
          dataSource={users.map((user, index) => ({ ...user, key: user._id, index }))}
          columns={columns}
          pagination={{ pageSize: 5 }}
          bordered
        />
      </div>
    </Layout>
  );
};

export default AdminUsers;
