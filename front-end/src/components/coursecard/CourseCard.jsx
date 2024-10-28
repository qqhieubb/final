import React from "react";
import { Card, Button, Typography, Modal } from "antd";
import { server } from "../../main";
import { UserData } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { CourseData } from "../../context/CourseContext";

const { Title, Text } = Typography;

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const { user, isAuth } = UserData();
  const { fetchCourses } = CourseData();

  const deleteHandler = async (id) => {
    Modal.confirm({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this course?",
      onOk: async () => {
        try {
          const { data } = await axios.delete(`${server}/api/course/${id}`, {
            headers: {
              token: localStorage.getItem("token"),
            },
          });
          toast.success(data.message);
          fetchCourses();
        } catch (error) {
          toast.error(error.response.data.message);
        }
      },
    });
  };

  return (
    <Card
      hoverable
      cover={<img alt="course" src={`${server}/${course.image}`} />}
      actions={[
        isAuth ? (
          user && user.role !== "admin" ? (
            user.subscription.includes(course._id) ? (
              <Button type="primary" onClick={() => navigate(`/course/study/${course._id}`)}>
                Study
              </Button>
            ) : (
              <Button type="primary" onClick={() => navigate(`/course/${course._id}`)}>
                Get Started
              </Button>
            )
          ) : (
            <Button type="primary" onClick={() => navigate(`/course/study/${course._id}`)}>
              Manage
            </Button>
          )
        ) : (
          <Button type="primary" onClick={() => navigate("/login")}>
            Get Started
          </Button>
        ),
        user && user.role === "admin" && (
          <Button danger onClick={() => deleteHandler(course._id)}>
            Delete
          </Button>
        ),
      ]}
    >
      <Title level={4}>{course.title}</Title>
      <Text type="secondary">Instructor: {course.createdBy}</Text>
      <br />
      <Text>Duration: {course.duration} hours</Text>
      <br />
      <Text strong>Price: USD {course.price}</Text>
    </Card>
  );
};

export default CourseCard;
