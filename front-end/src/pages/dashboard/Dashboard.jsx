import React, { useEffect, useState } from "react";
import { Typography, Row, Col, Card, Empty } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import CourseCard from "../../components/coursecard/CourseCard";
import { server } from "../../main";

const { Title } = Typography;

const Dashboard = () => {
  const { id } = useParams(); // Get user ID from the route
  const [mycourse, setMyCourse] = useState([]);

  useEffect(() => {
    const fetchUserCourseSubscription = async () => {
      try {
        const { data } = await axios.get(
          `${server}/api/user/get_course_payment?userId=${id}`,
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );

        const mapData = data.courses.map(c => (
          {
            ...c.courseId
          }
        ))
        setMyCourse(mapData);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchUserCourseSubscription();
  }, []); // Only re-run the effect if `id` changes

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
        All Enrolled Courses
      </Title>
      <div className="dashboard-content">
        {mycourse && mycourse.length > 0 ? (
          <Row gutter={[16, 16]}>
            {mycourse.map((course) => (
              <Col key={course._id} xs={24} sm={12} md={8} lg={6}>
                <Card hoverable>
                  <CourseCard course={course} />
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Empty
            description="No course Enrolled Yet"
            style={{ marginTop: "50px" }}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
