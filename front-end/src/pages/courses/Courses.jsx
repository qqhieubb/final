import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import CourseCard from "../../components/coursecard/CourseCard";
import { Typography, Row, Col, Card, Empty, Pagination, Spin, Select, Input } from "antd";
import queryString from "query-string";

const { Title } = Typography;
const { Option } = Select;

const Courses = ({ user }) => {
  const location = useLocation();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const [keyword, setKeyword] = useState(""); // Thêm từ khóa tìm kiếm
  const pageSize = 3;
  const [sortOption, setSortOption] = useState("price-asc");
  const [priceRange, setPriceRange] = useState([0, 100000000000000000]);
  const { category } = queryString.parse(location.search);

  // Các tùy chọn cho Price Range
  const priceOptions = [
    { label: "All Prices", value: "all" },
    { label: "Below 500,000 VND", value: "0-500000" },
    { label: "500,000 - 1,000,000 VND", value: "500000-1000000" },
    { label: "Above 1,000,000 VND", value: "1000000" },
  ];

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/course/all`, {
        params: {
          category,
          sort: sortOption,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          page: currentPage,
          limit: pageSize,
          keyword, // Truyền keyword vào API
          role: user.role,
        },
      });
      setCourses(data.courses);
      setCurrentPage(data.pagination.currentPage);
      setTotalPages(data.pagination.totalPages);
      setTotalCourses(data.pagination.totalCourses);
    } catch (error) {
      console.error("Failed to fetch courses", error);
    } finally {
      setLoading(false);
    }
  }, [category, sortOption, priceRange, keyword, currentPage]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const handleSortChange = useCallback((value) => {
    if (value !== sortOption) {
      setSortOption(value);
      setCurrentPage(1); // Reset về trang đầu tiên khi thay đổi sắp xếp
    }
  }, [sortOption]);

  const handlePriceChange = useCallback((value) => {
    if (value === "all") {
      setPriceRange([0, 100000000000000000]); // Reset giá trị mặc định
    } else if (value.includes("-")) {
      const [min, max] = value.split("-").map(Number);
      setPriceRange([min, max]);
    } else {
      setPriceRange([Number(value), 100000000000000000]);
    }
    setCurrentPage(1); // Reset về trang đầu tiên khi thay đổi giá
  }, []);

  const handleSearch = useCallback((value) => {
    setKeyword(value);
    setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2} style={{ textAlign: "center" }}>
        {category ? `Courses in ${category}` : "All Available Courses"}
      </Title>

      {/* Thanh tìm kiếm */}
      <Row justify="center" style={{ marginBottom: "20px" }}>
        <Col span={8}>
          <Input.Search
            placeholder="Search courses by title or description..."
            enterButton="Search"
            onSearch={handleSearch}
            style={{ width: "100%" }}
          />
        </Col>
      </Row>

      {/* Bộ lọc và sắp xếp */}
      <Row justify="center" style={{ marginBottom: "20px" }}>
        <Col span={8}>
          <div>
            <span>Sort By: </span>
            <Select value={sortOption} onChange={handleSortChange} style={{ width: 150 }}>
              <Option value="price-asc">Price: Low to High</Option>
              <Option value="price-desc">Price: High to Low</Option>
              <Option value="newest">Newest</Option>
              <Option value="oldest">Oldest</Option>
              <Option value="name-asc">Name: A-Z</Option>
              <Option value="name-desc">Name: Z-A</Option>
            </Select>
          </div>
        </Col>
        <Col span={8}>
          <div>
            <span>Price Range: </span>
            <Select
              defaultValue="all"
              onChange={handlePriceChange}
              style={{ width: 200 }}
            >
              {priceOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>
        </Col>
      </Row>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <Spin tip="Loading Courses..." />
        </div>
      ) : (
        <Row gutter={[16, 16]} justify="center">
          {courses && courses.length > 0 ? (
            courses.map((course) => (
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
          total={totalCourses}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </Row>
    </div>
  );
};

export default Courses;
