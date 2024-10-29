import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";
import { Card, Typography, Button, Space, Divider } from "antd";
import CommentSection from "../../components/commentsection/CommentSection";

const { Title, Text } = Typography;

const CourseStudy = ({ user }) => {
  const params = useParams();
  const { fetchCourse, course } = CourseData();
  const navigate = useNavigate();

  if (user && user.role !== "Instructor" && !user.subscription.includes(params.id)) {
    navigate("/");
    return null;
  }

  useEffect(() => {
    fetchCourse(params.id);
  }, [params.id, fetchCourse]);

  return (
    <>
      {course && (
        <div className="course-study-page">
          <Card
            style={{ maxWidth: 600, margin: "20px auto" }}
            cover={
              <img
                alt={course.title}
                src={`${server}/${course.image}`}
                style={{ width: "100%", objectFit: "cover" }}
              />
            }
          >
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Title level={2}>{course.title}</Title>
              <Text type="secondary">{course.description}</Text>
              <Divider />
              <Text strong>Created by: {course.createdBy}</Text>
              <Text>Duration: {course.duration} weeks</Text>
              <Divider />
              <Link to={`/lectures/${course._id}`}>
                <Button type="primary" block>
                  Go to Lectures
                </Button>
              </Link>
            </Space>
          </Card>
          <Divider />
          <CommentSection courseId={params.id} />
        </div>
      )}
    </>
  );
};

export default CourseStudy;
