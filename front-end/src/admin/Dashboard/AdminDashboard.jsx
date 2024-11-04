import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Typography, Statistic, message } from "antd";
import Layout from "../Utils/Layout";
import axios from "axios";
import { server } from "../../main";

const { Title } = Typography;

const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();

  if (user  && user.mainrole !== "Admin" && user.role !== "Instructor") return navigate("/");


  const [stats, setStats] = useState([]);

  async function fetchStats() {
    try {
      const { data } = await axios.get(`${server}/api/stats`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      setStats(data.stats);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Layout>
      <div style={{ padding: "24px" }}>
        <Title level={3} style={{ marginBottom: "24px" }}>Admin Dashboard</Title>
        <Row gutter={16}>
          <Col span={8}>
            <Card>
              <Statistic 
                title="Total Courses" 
                value={stats.totalCourses || 0} 
                precision={0} 
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic 
                title="Total Lectures" 
                value={stats.totalLectures || 0} 
                precision={0} 
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic 
                title="Total Users" 
                value={stats.totalUsers || 0} 
                precision={0} 
              />
            </Card>
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
