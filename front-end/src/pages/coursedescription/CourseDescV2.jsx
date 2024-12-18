import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Typography, Button, Spin, Space, Divider, List, Form, Input, Row, Col } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { CourseData } from "../../context/CourseContext";
import { CommentData } from "../../context/CommentContext";
import axios from "axios";
import toast from "react-hot-toast";
import { server } from "../../main";
import { useCart } from "../../context/CartContext";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const CustomComment = ({ author, content, datetime }) => (
  <div style={{ marginBottom: "20px", borderBottom: "1px solid #f0f0f0", paddingBottom: "10px" }}>
    <Text strong>{author}</Text>
    <p>{content}</p>
    <Text type="secondary">{datetime}</Text>
  </div>
);

const CourseDescV2 = ({ user }) => {
  const params = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [relatedCourses, setRelatedCourses] = useState([]); // Thêm state cho khóa học liên quan
  const { fetchCourse, course } = CourseData();
  const { fetchComments, addComment, comments, loading: commentsLoading } = CommentData();
  const { cartItems, addToCart, removeFromCart } = useCart();
  const { id } = useParams(); // Lấy ID từ URL

  useEffect(() => {
    fetchCourse(id);
    fetchRelatedCourses(id); // Gọi API lấy khóa học liên quan
  }, [id]);

  // API lấy khóa học liên quan
  const fetchRelatedCourses = async (courseId) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/course/recommended/${courseId}`);
      setRelatedCourses(data.relatedCourses);
    } catch (error) {
      console.error("Failed to fetch related courses", error);
    } finally {
      setLoading(false);
    }
  };

  if (!course) return <Spin />;

  const isInCart = cartItems.some((item) => item._id === course._id);

  const handleCartToggle = () => {
    if (isInCart) {
      removeFromCart(course._id);
      toast.info("Course removed from cart");
    } else {
      addToCart(course);
      toast.success("Course added to cart");
    }
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      addComment(params.id, commentText);
      setCommentText("");
    } else {
      toast.error("Comment cannot be empty");
    }
  };

  return (
    <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
      {course && (
        <Card
          style={{
            maxWidth: 800,
            margin: "auto",
            padding: 20,
            borderRadius: 10,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <Title level={2} style={{ textAlign: "center", color: "#8a4baf" }}>
              {course.title}
            </Title>
            <Text type="secondary">Instructor: {course?.createdBy?.name}</Text>
            <Text type="secondary">Duration: {course.duration} hour(s)</Text>
            <Divider />
            <Paragraph>{course.description}</Paragraph>
            <Title level={4} style={{ color: "#52c41a" }}>
              Price: VND {course.price}
            </Title>
            <Button
              type="primary"
              size="large"
              block
              onClick={handleCartToggle}
              style={{
                backgroundColor: isInCart ? "#1890ff" : "#8a4baf",
                border: "none",
              }}
            >
              {isInCart ? "Remove from Cart" : "Add to Cart"}
            </Button>
            <Divider />

            {/* Comments Section */}
            <Title level={4}>Comments</Title>
            <Spin spinning={commentsLoading} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
              <List
                dataSource={comments}
                renderItem={(comment) => (
                  <CustomComment
                    author={comment.userId?.name}
                    content={comment.commentText}
                    datetime={new Date(comment.createdAt).toLocaleString()}
                  />
                )}
              />
            </Spin>
            {user && (
              <Form.Item>
                <TextArea
                  rows={4}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                />
                <Button type="primary" onClick={handleAddComment} style={{ marginTop: 10 }}>
                  Add Comment
                </Button>
              </Form.Item>
            )}

            {/* Related Courses Section */}
            <Divider />
            <Title level={4}>Related Courses</Title>
            {relatedCourses.length > 0 ? (
              <Row gutter={[16, 16]}>
                {relatedCourses.map((relatedCourse) => (
                  <Col xs={24} sm={12} md={8} key={relatedCourse._id}>
                    <Card
                      hoverable
                      onClick={() => navigate(`/course/${relatedCourse._id}`)}
                      style={{ borderRadius: "10px" }}
                    >
                      <Title level={5}>{relatedCourse.title}</Title>
                      <Text>Price: VND {relatedCourse.price}</Text>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Text type="secondary">No related courses available</Text>
            )}
          </Space>
        </Card>
      )}
    </Spin>
  );
};

export default CourseDescV2;
