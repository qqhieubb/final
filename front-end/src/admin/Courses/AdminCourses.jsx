import React, { useState, useEffect, useCallback } from "react";
import Layout from "../Utils/Layout";
import { useNavigate } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { Pagination, Button } from "antd";
import "./admincourses.css";
import axios from "axios";
import { server } from "../../main";
import toast from "react-hot-toast";
import uploadFileApi from "../../config/uploadFileApi";

const AdminCourses = ({ user }) => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState("");
  const [imagePrev, setImagePrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState(null);

  const { courses, fetchCourses } = CourseData();

  // Lấy danh sách category
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${server}/api/categories`);
        setCategories(data.categories);
      } catch (error) {
        toast.error("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Lấy danh sách khóa học của Instructor hiện tại
  useEffect(() => {
    if (user?.role === "Instructor") {
      fetchCourses(user._id, user.role); // Lấy danh sách khóa học của user hiện tại
    }
  }, [fetchCourses, user]);

  // Xử lý thay đổi hình ảnh
  const changeImageHandler = async (e) => {
    const file = e.target.files[0];
    try {
      const downloadURL = await uploadFileApi.uploadFile(e);
      setImagePrev(downloadURL);
      setImage(downloadURL);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload image");
    }
  };

  // Chỉnh sửa khóa học
  const editHandler = (course) => {
    setTitle(course.title);
    setDescription(course.description);
    setCategory(course.category?._id || course.category);
    setPrice(course.price);
    setDuration(course.duration);
    setImagePrev(course.image);
    setCurrentCourseId(course._id);
    setEditMode(true);
  };

  // Gửi form thêm/sửa khóa học
  const submitHandler = useCallback(async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    const courseData = {
      title,
      description,
      category,
      price,
      createdBy: user._id,
      duration,
      image,
    };

    try {
      if (editMode) {
        // Cập nhật khóa học
        const { data } = await axios.put(`${server}/api/course/${currentCourseId}`, courseData, {
          headers: {
            token: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        });
        toast.success(data.message);
      } else {
        // Thêm mới khóa học
        const { data } = await axios.post(`${server}/api/course/new`, courseData, {
          headers: {
            token: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        });
        toast.success(data.message);
      }
      await fetchCourses(user._id, user.role); // Làm mới danh sách khóa học
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setBtnLoading(false);
    }
  }, [title, description, category, price, user, duration, fetchCourses, editMode, currentCourseId, image]);

  // Hàm đặt lại form
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setDuration("");
    setImage("");
    setImagePrev("");
    setCategory("");
    setEditMode(false);
    setCurrentCourseId(null);
  };

  // Xóa khóa học
  const deleteHandler = useCallback(async (courseId) => {
    try {
      await axios.delete(`${server}/api/course/${courseId}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      toast.success("Course deleted successfully");
      await fetchCourses(user._id, user.role);
    } catch (error) {
      toast.error("Failed to delete the course");
    }
  }, [fetchCourses, user]);

  // Xử lý phân trang
  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  // Lọc khóa học theo user hiện tại
  const currentCourses = courses
    .filter((course) => course.createdBy._id === user._id) // Lọc theo user hiện tại
    .slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Layout>
      <div className="admin-courses">
        <div className="left">
          <h1>All Courses</h1>
          <div className="dashboard-content">
            {courses.length > 0 ? (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Duration</th>
                      <th>Created By</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCourses.map((course) => (
                      <tr key={course._id}>
                        <td>{course.title}</td>
                        <td>{course.category?.name || course.category}</td>
                        <td>${course.price}</td>
                        <td>{course.duration} hours</td>
                        <td>{course?.createdBy?.name}</td>
                        <td>
                          <div className="actions-container">
                            <Button className="edit-btn" onClick={() => editHandler(course)}>Edit</Button>
                            <Button
                              className="delete-btn"
                              danger
                              onClick={() => {
                                if (window.confirm("Are you sure you want to delete this course?")) {
                                  deleteHandler(course._id);
                                }
                              }}
                            >
                              Delete
                            </Button>
                            <Button
                              className="manage-btn"
                              type="primary"
                              onClick={() => navigate(`/course/study/${course._id}`)}
                            >
                              Manage
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={courses.length}
                  onChange={onPageChange}
                  style={{ marginTop: "16px", textAlign: "center" }}
                />
              </>
            ) : (
              <p>No Courses Yet</p>
            )}
          </div>
        </div>
        <div className="right">
          <div className="add-course">
            <div className="course-form">
              <h2>{editMode ? "Edit Course" : "Add Course"}</h2>
              {user?.role === "Instructor" && (
                <form onSubmit={submitHandler}>
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />

                  <label htmlFor="description">Description</label>
                  <input
                    type="text"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />

                  <label htmlFor="price">Price</label>
                  <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />

                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">{loadingCategories ? "Loading categories..." : "Select Category"}</option>
                    {categories.map((cat) => (
                      <option value={cat._id} key={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>

                  <label htmlFor="duration">Duration</label>
                  <input
                    type="number"
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                  />

                  <label htmlFor="image">Image</label>
                  <input type="file" id="image" onChange={changeImageHandler} />
                  {imagePrev && <img src={imagePrev} alt="Preview" width={300} />}

                  <button
                    type="submit"
                    disabled={btnLoading}
                    className="common-btn"
                  >
                    {btnLoading ? "Please Wait..." : editMode ? "Update" : "Add"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminCourses;
