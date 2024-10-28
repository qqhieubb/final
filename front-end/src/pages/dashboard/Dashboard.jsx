import React from "react";
import { Typography, Row, Col, Card, Empty } from "antd";
import { CourseData } from "../../context/CourseContext";
import CourseCard from "../../components/coursecard/CourseCard";

const { Title } = Typography;

const Dashbord = () => {
  const { mycourse } = CourseData();

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

export default Dashbord;
