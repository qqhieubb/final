import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import CourseCard from "../../components/coursecard/CourseCard";
import { Typography, Row, Col, Card, Empty, Pagination, Spin, Select, Slider } from "antd";
import queryString from "query-string";

const { Title } = Typography;
const { Option } = Select;

const Courses = () => {
  const location = useLocation();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;
  const [sortOption, setSortOption] = useState("price-asc");
  const [priceRange, setPriceRange] = useState([0, 500]);

  const { category } = queryString.parse(location.search);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        // Gọi API với category và tiêu chí sắp xếp, lọc
        const { data } = await axios.get(
          `${server}/api/course/all${category ? `?category=${encodeURIComponent(category)}` : ""}`,
          {
            params: {
              sort: sortOption,
              minPrice: priceRange[0],
              maxPrice: priceRange[1],
            },
          }
        );
        setCourses(data.courses);
      } catch (error) {
        console.error("Failed to fetch courses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [category, sortOption, priceRange]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentCourses = courses.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSortChange = (value) => {
    setSortOption(value);
    setCurrentPage(1);
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
    setCurrentPage(1);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2} style={{ textAlign: "center" }}>
        {category ? `Courses in ${category}` : "All Available Courses"}
      </Title>

      {/* Bộ lọc và sắp xếp */}
      <Row justify="center" style={{ marginBottom: "20px" }}>
        <Col span={8}>
          <div>
            <span>Sort By: </span>
            <Select defaultValue="price-asc" onChange={handleSortChange} style={{ width: 150 }}>
              <Option value="price-asc">Price: Low to High</Option>
              <Option value="price-desc">Price: High to Low</Option>
              <Option value="newest">Newest</Option>
              <Option value="oldest">Oldest</Option>
            </Select>
          </div>
        </Col>
        <Col span={8}>
          <div>
            <span>Price Range: </span>
            <Slider
              range
              defaultValue={priceRange}
              max={500}
              onAfterChange={handlePriceChange}
              style={{ width: 200 }}
            />
          </div>
        </Col>
      </Row>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <Spin tip="Loading Courses..." />
        </div>
      ) : (
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
                  {/* Additional course details */}
                </Card>
              </Col>
            ))
          ) : (
            <Col span={24}>
              <Empty description="No Courses Found" style={{ padding: "20px 0" }} />
            </Col>
          )}
        </Row>
      )}

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
