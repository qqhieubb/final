import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Card, Button, Modal, Input, Progress, Typography, List, message, Spin } from "antd";
import { CheckOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { server } from "../../main";
const { Title, Text } = Typography;

const Lecture = ({ user }) => {
  const [lectures, setLectures] = useState([]);
  const [lecture, setLecture] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lecLoading, setLecLoading] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [completedLec, setCompletedLec] = useState(0);
  const [lectLength, setLectLength] = useState(0);
  const [progress, setProgress] = useState([{ completedLectures: [] }]);
  const [courseName, setCourseName] = useState("");
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [videoPrev, setVideoPrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== "Instructor" && !user.subscription.includes(params.id)) {
      navigate("/");
    }
  }, [user, params.id, navigate]);

  useEffect(() => {
    fetchCourseDetails();
    fetchLectures();
    fetchProgress();
  }, []);

  async function fetchCourseDetails() {
    try {
      const { data } = await axios.get(`${server}/api/course/${params.id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      setCourseName(data.course.title);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch course details");
    }
  }

  async function fetchLectures() {
    try {
      const { data } = await axios.get(`${server}/api/lectures/${params.id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      setLectures(data.lectures);
      setLoading(false);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch lectures");
      setLoading(false);
    }
  }

  async function fetchProgress() {
    try {
      const { data } = await axios.get(
        `${server}/api/user/course_progress?course=${params.id}&userId=${user._id}`,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );

      setCompleted(data.courseProgressPercentage || 0);
      setCompletedLec(data.completedLectures || 0);
      setLectLength(data.allLectures || 0);

      if (data.progress) {
        setProgress([data.progress]);
      } else {
        setProgress([{ completedLectures: [] }]);
      }
    } catch (error) {
      console.error(error);
      setProgress([{ completedLectures: [] }]);
    }
  }

  const addProgress = async (id) => {
    try {
      const { data } = await axios.post(
        `${server}/api/user/progress?course=${params.id}&lectureId=${id}`,
        {},
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      message.success(data.message);
      fetchProgress();
    } catch (error) {
      console.error(error);
      message.error("Failed to update progress");
    }
  };

  async function fetchLecture(id) {
    setLecLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/lecture/${id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      setLecture(data.lecture);
      setLecLoading(false);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch lecture details");
      setLecLoading(false);
    }
  }

  const changeVideoHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideo(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => setVideoPrev(reader.result);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setVideo(null);
    setVideoPrev("");
    setShow(false);
  };

  const submitHandler = async () => {
    if (!video) {
      message.error("Please select a video before submitting");
      return;
    }

    setBtnLoading(true);
    const myForm = new FormData();
    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("file", video);

    try {
      const { data } = await axios.post(`${server}/api/course/${params.id}`, myForm, {
        headers: { token: localStorage.getItem("token") },
      });
      message.success(data.message);
      resetForm();
      fetchLectures();
    } catch (error) {
      message.error("Failed to add lecture");
    } finally {
      setBtnLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: "Are you sure you want to delete this lecture?",
      onOk: async () => {
        try {
          const { data } = await axios.delete(`${server}/api/lecture/${id}`, {
            headers: { token: localStorage.getItem("token") },
          });
          message.success(data.message);
          fetchLectures();
        } catch (error) {
          message.error("Failed to delete lecture");
        }
      },
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          <Title level={2} style={{ textAlign: "center", marginBottom: "10px" }}>
            {courseName}
          </Title>

          <Card style={{ textAlign: "center", marginBottom: "20px" }}>
            <Title level={4}>Course Progress</Title>
            <Progress percent={completed} />
            <Text>
              {completedLec} out of {lectLength} Lectures Completed ({completed}%)
            </Text>
          </Card>

          <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
            <div style={{ flex: 1 }}>
              {lecLoading ? (
                <Spin size="large" />
              ) : lecture.video ? (
                <Card
                  title={<Title level={4} style={{ marginBottom: "10px" }}>{lecture.title}</Title>}
                  extra={
                    <Button
                      onClick={() => addProgress(lecture._id)}
                      disabled={progress[0]?.completedLectures?.includes(lecture._id)}
                    >
                      Complete
                    </Button>
                  }
                  style={{
                    border: "3px solid #000", // Viền đậm hơn
                    borderRadius: "8px",
                    padding: "15px",
                  }}
                >
                  <video
                    src={`${server}/${lecture.video}`}
                    controls
                    style={{ width: "100%", borderRadius: "8px" }}
                  />
                  <p>{lecture.description}</p>
                </Card>
              ) : (
                <Text>Please select a lecture to view</Text>
              )}
            </div>

            <div style={{ width: "400px", textAlign: "center" }}>
              <Title level={4} style={{ marginBottom: "15px" }}>
                Contents
              </Title>
              {user?.role === "Instructor" && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setShow(true)}
                  block
                  style={{ marginBottom: "20px" }}
                >
                  Add Lecture
                </Button>
              )}

              <List
                bordered
                dataSource={lectures}
                renderItem={(item, index) => {
                  const isCompleted = progress[0]?.completedLectures?.includes(item._id);
                  return (
                    <List.Item
                      onClick={() => fetchLecture(item._id)}
                      style={{
                        cursor: "pointer",
                        padding: "10px 15px",
                        marginBottom: "10px", // Tách bài giảng ra
                        backgroundColor: isCompleted
                          ? "#d4f4d2"
                          : lecture._id === item._id
                          ? "#e6f7ff"
                          : "#fff",
                        borderRadius: "5px",
                        border: isCompleted
                          ? "2px solid green"
                          : lecture._id === item._id
                          ? "2px solid #1890ff"
                          : "1px solid #d9d9d9",
                      }}
                      actions={[
                        isCompleted && <CheckOutlined style={{ color: "green" }} />,
                        user?.role === "Instructor" && (
                          <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteHandler(item._id);
                            }}
                          />
                        ),
                      ]}
                    >
                      <strong>{index + 1}. {item.title}</strong>
                    </List.Item>
                  );
                }}
              />
            </div>
          </div>

          <Modal
            title="Add New Lecture"
            visible={show}
            onCancel={resetForm}
            footer={null}
          >
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ marginBottom: "10px" }}
            />
            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ marginBottom: "10px" }}
            />
            <input type="file" onChange={changeVideoHandler} style={{ marginBottom: "10px" }} />

            {videoPrev && (
              <video src={videoPrev} controls style={{ marginTop: "10px", width: "100%" }} />
            )}
            <Button
              type="primary"
              onClick={submitHandler}
              loading={btnLoading}
              style={{ marginTop: "20px", width: "100%" }}
            >
              Add Lecture
            </Button>
          </Modal>
        </>
      )}
    </div>
  );
};

export default Lecture;
