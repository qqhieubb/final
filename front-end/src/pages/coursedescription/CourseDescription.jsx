import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Typography, Button, Spin, Image, Space, Divider } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { CourseData } from "../../context/CourseContext";
import { UserData } from "../../context/UserContext";
import axios from "axios";
import toast from "react-hot-toast";
import { server } from "../../main";

const { Title, Paragraph, Text } = Typography;

const CourseDescription = ({ user }) => {
  const params = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { fetchUser } = UserData();
  const { fetchCourse, course, fetchCourses, fetchMyCourse } = CourseData();

  useEffect(() => {
    fetchCourse(params.id);
  }, [params.id]);

  const checkoutHandler = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const {
        data: { order },
      } = await axios.post(
        `${server}/api/course/checkout/${params.id}`,
        {},
        { headers: { token } }
      );

      const options = {
        key: "rzp_test_yOMeMyaj2wlvTt",
        amount: order.amount,
        currency: "USD",
        name: "E-learning",
        description: "Learn with us",
        order_id: order.id,
        handler: async function (response) {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;

          try {
            const { data } = await axios.post(
              `${server}/api/verification/${params.id}`,
              { razorpay_order_id, razorpay_payment_id, razorpay_signature },
              { headers: { token } }
            );

            await fetchUser();
            await fetchCourses();
            await fetchMyCourse();
            toast.success(data.message);
            setLoading(false);
            navigate(`/payment-success/${razorpay_payment_id}`);
          } catch (error) {
            toast.error(error.response.data.message);
            setLoading(false);
          }
        },
        theme: { color: "#8a4baf" },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error("Failed to process checkout.");
      setLoading(false);
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
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
          }}
          cover={
            <Image
              src={`${server}/${course.image}`}
              alt="Course Image"
              preview={false}
              style={{ borderRadius: "10px 10px 0 0" }}
            />
          }
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <Title level={2} style={{ textAlign: "center", color: "#8a4baf" }}>
              {course.title}
            </Title>
            <Text type="secondary">Instructor: {course.createdBy}</Text>
            <Text type="secondary">Duration: {course.duration} hour(s)</Text>
            <Divider />
            <Paragraph>{course.description}</Paragraph>
            <Title level={4} style={{ color: "#52c41a" }}>
              Price: USD {course.price}
            </Title>
            <Button
              type="primary"
              size="large"
              block
              onClick={
                user && user.subscription.includes(course._id)
                  ? () => navigate(`/course/study/${course._id}`)
                  : checkoutHandler
              }
              style={{ backgroundColor: user && user.subscription.includes(course._id) ? "#1890ff" : "#8a4baf", border: "none" }}
            >
              {user && user.subscription.includes(course._id) ? "Study" : "Buy Now"}
            </Button>
          </Space>
        </Card>
      )}
    </Spin>
  );
};

export default CourseDescription;
