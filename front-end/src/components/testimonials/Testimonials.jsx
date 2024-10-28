import React from "react";
import { Card, Avatar, Typography, Row, Col } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const Testimonials = () => {
  const testimonialsData = [
    {
      id: 1,
      name: "John Doe",
      position: "Student",
      message:
        "This platform helped me learn so effectively. The courses are amazing and the instructors are top-notch.",
      image:
        "https://th.bing.com/th?q=Current+Bachelor&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-IN&cc=IN&setlang=en&adlt=moderate&t=1&mw=247",
    },
    {
      id: 2,
      name: "Jane Smith",
      position: "Student",
      message:
        "I've learned more here than in any other place. The interactive lessons and quizzes make learning enjoyable.",
      image:
        "https://th.bing.com/th/id/OIP.GKAiW3oc2TWXVEeZAzrWOAHaJF?w=135&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    },
    {
      id: 3,
      name: "Emily Johnson",
      position: "Student",
      message:
        "An excellent platform with a great variety of courses. I’ve gained so much knowledge here.",
      image:
        "https://th.bing.com/th?q=Current+Bachelor&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-IN&cc=IN&setlang=en&adlt=moderate&t=1&mw=247",
    },
    {
      id: 4,
      name: "Michael Lee",
      position: "Student",
      message:
        "The platform has transformed my learning experience. Highly recommend it!",
      image:
        "https://th.bing.com/th/id/OIP.GKAiW3oc2TWXVEeZAzrWOAHaJF?w=135&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    },
  ];

  return (
    <section className="testimonials">
      
      <Row gutter={[16, 16]}>
        {testimonialsData.map((testimonial) => (
          <Col xs={24} sm={12} md={12} lg={8} xl={6} key={testimonial.id}>
            <Card
              hoverable
              style={{ width: "100%", borderRadius: "8px" }}
              bordered={false}
            >
              <Card.Meta
                avatar={
                  <Avatar
                    src={testimonial.image}
                    icon={<UserOutlined />}
                    size={64}
                  />
                }
                title={<Text strong>{testimonial.name}</Text>}
                description={<Text type="secondary">{testimonial.position}</Text>}
              />
              <p style={{ marginTop: "1rem" }}>{testimonial.message}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default Testimonials;
