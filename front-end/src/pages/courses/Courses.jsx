import React, { useState } from "react";
import { CourseData } from "../../context/CourseContext";
import CourseCard from "../../components/coursecard/CourseCard";
import { Typography, Row, Col, Card, Empty, Pagination } from "antd";

const { Title } = Typography;

const Courses = () => {
  const { courses } = CourseData();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3; // Number of courses per page

  // Calculate the starting and ending index of the courses to display on the current page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentCourses = courses.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2} style={{ textAlign: "center" }}>
        Available Courses
      </Title>

      <Row gutter={[16, 16]} justify="center">
        {currentCourses && currentCourses.length > 0 ? (
          currentCourses.map((course) => (
            <Col xs={24} sm={12} md={8} lg={6} key={course._id}>
              <Card
                hoverable
                bordered={false}
                style={{ borderRadius: "10px", overflow: "hidden" }}
                cover={<CourseCard course={course} />}
              >
                {/* Additional course details can go here */}
              </Card>
            </Col>
          ))
        ) : (
          <Col span={24}>
            <Empty description="No Courses Yet!" style={{ padding: "20px 0" }} />
          </Col>
        )}
      </Row>

      {/* Pagination Component */}
      <Row justify="center" style={{ marginTop: "20px" }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={courses.length}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </Row>
    </div>
  );
};

export default Courses;
