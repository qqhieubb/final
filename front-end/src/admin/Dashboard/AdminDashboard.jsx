import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Typography, Statistic, Spin, Button, message } from "antd";
import Layout from "../Utils/Layout";
import axios from "axios";
import { server } from "../../main";
import UserRolePieChart from "./UserRolePieChart";
import TeacherRevenueChart from "./TeacherRevenueChart";
import CategoryPieChart from "./CategoryPieChart1";

const { Title } = Typography;

const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect users who are not Admin or Instructor
  useEffect(() => {
    if (user && user.role !== "Admin" && user.role !== "Instructor") {
      navigate("/"); // Điều hướng về trang chủ nếu không phải Admin hoặc Instructor
    }
  }, [user, navigate]);

  // Fetch statistics from API
  async function fetchStats() {
    setLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/stats`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setStats(data.stats);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError("Failed to load statistics.");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Layout>
      <div style={{ padding: "24px" }}>
        <Title level={3} style={{ marginBottom: "24px" }}>
          Admin and Instructor Dashboard
        </Title>

        {loading ? (
          <Spin size="large" style={{ display: "block", margin: "0 auto" }} />
        ) : error ? (
          <div style={{ textAlign: "center", color: "red" }}>{error}</div>
        ) : (
          <>
            {/* Statistics Cards */}
            <Row gutter={16} style={{ marginBottom: "24px" }}>
              <Col span={8}>
                <Card>
                  <Statistic title="Total Courses" value={stats.totalCourses || 0} precision={0} />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic title="Total Lectures" value={stats.totalLectures || 0} precision={0} />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic title="Total Users" value={stats.totalUsers || 0} precision={0} />
                </Card>
              </Col>
            </Row>

            {/* Pie Chart Section */}
            <Row gutter={16} style={{ marginBottom: "24px" }}>
              <Col span={12}>
                <Card
                  title="User Roles Distribution"
                  bodyStyle={{ display: "flex", justifyContent: "center", alignItems: "center", height: "500px" }}
                >
                  <UserRolePieChart />
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  title="Category Distribution"
                  bodyStyle={{ display: "flex", justifyContent: "center", alignItems: "center", height: "500px" }}
                >
                  <CategoryPieChart />
                </Card>
              </Col>
            </Row>

            {/* Revenue Chart Section */}
            <Row gutter={16} style={{ marginTop: "24px" }}>
              <Col span={24}>
                <Card title="Revenue by Instructor">
                  <TeacherRevenueChart />
                </Card>
              </Col>
            </Row>

            {/* Manage Courses Button */}
            {user && user.role === "Instructor" && (
              <div style={{ textAlign: "center", marginTop: "24px" }}>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => navigate("/admin/course")}
                >
                  Manage My Courses
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
