import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { server } from "../../main";
import { Card, Typography, Button, Space, Divider, Rate, message } from "antd";
import CommentSection from "../../components/commentsection/CommentSection";
import axios from "axios";

const { Title, Text } = Typography;

const CourseStudy = ({ user }) => {
  const params = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null); // Set initial state to null
  const [rating, setRating] = useState(0);

  // Redirect if user lacks access
  if (user && user.role !== "Instructor" && !user.subscription.includes(params.id)) {
    navigate("/");
    return null;
  }

  useEffect(() => {
    const fetchCourse = async (courseId) => {
      try {
        const { data } = await axios.get(
          `${server}/api/user/course_detail?userId=${user._id}&courseId=${courseId}`
        );

        setCourse(data.course); // Update course state with fetched data
        setRating(data.course.rating || 0); // Initialize rating state if there's an existing rating
      } catch (error) {
        console.error("Error fetching course:", error);
        message.error("Failed to load course data.");
      }
    };

    if (params.id) {
      fetchCourse(params.id); // Fetch the course data on component mount
    }
  }, [params.id, user._id]);

  const handleRatingChange = async (value) => {
    try {
      await axios.post(`${server}/api/courses/rating`, {
        courseId: params.id,
        rating: value,
        userId: user._id,
      });

      setRating(value); // Update the rating state with the new rating
      message.success("Rating submitted successfully!");
    } catch (error) {
      message.error("Failed to submit rating. Please try again.");
      console.error("Rating submission error:", error);
    }
  };

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
              
              {/* Interactive 5-star rating component */}
              <Rate
                value={rating} // Set to current rating state
                count={5}
                onChange={handleRatingChange}
              />

              <Text type="secondary">{course.description}</Text>
              <Divider />
              <Text strong>Created by: {course?.createdBy?.name}</Text>
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
