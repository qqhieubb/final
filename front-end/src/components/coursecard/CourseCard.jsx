import React from "react";
import { Card, Button, Typography } from "antd";
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
      <Text>Average Rating: {course.averageRating}</Text>
      <br />
      <Text strong>Price: USD {course.price}</Text>
    </Card>
  );
};

export default CourseCard;
