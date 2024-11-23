import React, { useState, useEffect, useCallback } from "react";
import Layout from "../Utils/Layout";
import { useNavigate } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import "./admincourses.css";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../../main";
import { Pagination, Button } from "antd";
import uploadFileApi from "../../config/uploadFileApi";

const AdminCourses = ({ user }) => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [createdBy] = useState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user"))._id : "");
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

  // Điều hướng nếu user không có quyền
  useEffect(() => {
    console.log(user)
    // if (user) navigate("/");
  }, [user, navigate]);

  // Lấy danh sách khóa học khi component được mount
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Lấy danh sách Category từ API khi component được mount
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

  const editHandler = (course) => {
    setTitle(course.title);
    setDescription(course.description);
    setCategory(course.category?._id || course.category);
    setPrice(course.price);
    setDuration(course.duration);
    setImagePrev(course.image); // Assuming you have an image field
    setCurrentCourseId(course._id);
    setEditMode(true);
  };

  const submitHandler = useCallback(async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    const courseData = {
        title,
        description,
        category,
        price,
        createdBy,
        duration,
        userId: user._id,
        image,
    };

    try {
        if (editMode) {
            // Call update API
            const { data } = await axios.put(`${server}/api/course/${currentCourseId}`, courseData, {
                headers: {
                    token: localStorage.getItem("token"),
                    'Content-Type': 'application/json',
                },
            });
            toast.success(data.message);
        } else {
            // Call create API
            const { data } = await axios.post(`${server}/api/course/new`, courseData, {
                headers: {
                    token: localStorage.getItem("token"),
                    'Content-Type': 'application/json',
                },
            });
            toast.success(data.message);
        }

        await fetchCourses();
        // Reset form
        setTitle("");
        setDescription("");
        setPrice("");
        setCreatedBy("");
        setDuration("");
        setImage("");
        setImagePrev("");
        setCategory("");
        setEditMode(false);
        setCurrentCourseId(null);
    } catch (error) {
        console.log(error.response?.data?.message || "An error occurred");
    } finally {
        setBtnLoading(false);
    }
  }, [title, description, category, price, createdBy, duration, fetchCourses, editMode, currentCourseId, image]);

  const deleteHandler = useCallback(async (courseId) => {
    try {
      await axios.delete(`${server}/api/course/${courseId}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      toast.success("Course deleted successfully");
      await fetchCourses();
    } catch (error) {
      toast.error("Failed to delete the course");
    }
  }, [fetchCourses]);

  // Lấy danh sách khóa học cho trang hiện tại
  const currentCourses = user?.role === "Instructor" 
    ? courses.filter(course => course?.createdBy?._id === createdBy).slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      )
    : courses.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      );

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Layout>
      <div className="admin-courses">
        <div className="left">
          <h1>All Courses</h1>
          <div className="dashboard-content">
            {courses && courses.length > 0 ? (
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
                        {user && user.role === "Instructor" && (
                          <div className="actions-container">
                            <Button className="edit-btn" onClick={() => editHandler(course)}>
                              Edit
                            </Button>
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
                        )}
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
              {user && user.role === "Instructor" && ( // Chỉ hiển thị form cho Instructor
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
                  <input type="file" id="image" required onChange={changeImageHandler} />
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
