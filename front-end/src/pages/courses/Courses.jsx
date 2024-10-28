import React from "react";
import { CourseData } from "../../context/CourseContext";
import CourseCard from "../../components/coursecard/CourseCard";
import { Typography, Row, Col, Card, Empty } from "antd";

const { Title } = Typography;

const Courses = () => {
  const { courses } = CourseData();

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2} style={{ textAlign: "center" }}>
        Available Courses
      </Title>

      <Row gutter={[16, 16]} justify="center">
        {courses && courses.length > 0 ? (
          courses.map((course) => (
            <Col xs={24} sm={12} md={8} lg={6} key={course._id}>
              <Card
                hoverable
                bordered={false}
                style={{ borderRadius: "10px", overflow: "hidden" }}
                cover={<CourseCard course={course} />}
              >
                {/* You could add additional course details here */}
              </Card>
            </Col>
          ))
        ) : (
          <Col span={24}>
            <Empty description="No Courses Yet!" style={{ padding: "20px 0" }} />
          </Col>
        )}
      </Row>
    </div>
  );
};

export default Courses;
