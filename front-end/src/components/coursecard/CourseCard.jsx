import React from "react";
import { Card, Button, Typography, Rate } from "antd";
import { useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";

const { Title, Text } = Typography;

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const { user, isAuth } = UserData(); // Lấy thông tin người dùng

  return (
    <Card
      hoverable
      cover={<img alt="course" src={course.image} />}
      actions={[
        isAuth && user.subscription.includes(course._id) ? (
          <Button type="primary" onClick={() => navigate(`/course/study/${course._id}`)}>
            Study
          </Button>
        ) : (
          <Button type="primary" onClick={() => navigate(`/course/${course._id}`)}>
            Register Course
          </Button>
        ),
      ]}
    >
      <Title level={4}>{course.title}</Title>
      <Text type="secondary">Instructor: {course?.createdBy?.name}</Text>
      <br />
      <Text>Duration: {course.duration} hours</Text>
      <br />
      {/* Hiển thị rating trung bình */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Rate allowHalf disabled value={course.averageRating || 0} />
        <Text>({course.averageRating?.toFixed(1) || "No ratings"})</Text>
      </div>
      <br />
      <Text strong>Price: VND {course.price}</Text>
    </Card>
  );
};

export default CourseCard;
