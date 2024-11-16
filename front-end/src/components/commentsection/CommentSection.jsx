import React, { useState, useEffect } from "react";
import { List, Form, Input, Button, Typography, Divider, Pagination } from "antd";
import { CommentData } from "../../context/CommentContext";
import { UserData } from "../../context/UserContext";
import toast from "react-hot-toast";

const { TextArea } = Input;
const { Text, Title } = Typography;

const CustomComment = ({ author, content, datetime }) => (
  <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#fafafa", borderRadius: "8px" }}>
    <Text strong style={{ display: "block", marginBottom: "5px" }}>{author}</Text>
    <Text style={{ display: "block", marginBottom: "5px" }}>{content}</Text>
    <Text type="secondary" style={{ fontSize: "12px" }}>{datetime}</Text>
  </div>
);

const CommentSection = ({ courseId }) => {
  const [commentText, setCommentText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3); // Set number of comments per page
  const { user } = UserData();
  const { comments, fetchComments, addComment } = CommentData();

  useEffect(() => {
    fetchComments(courseId);
  }, [courseId]); // Xóa fetchComments khỏi dependency để tránh gọi lại

  const handleAddComment = async () => {
    if (commentText.trim()) {
      try {
        await addComment(courseId, commentText);
        setCommentText("");
      } catch (error) {
        toast.error("Failed to add comment");
      }
    } else {
      toast.error("Comment cannot be empty");
    }
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  // Pagination calculation
  const paginatedComments = comments.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="comment-section" style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <Title level={4} style={{ marginBottom: "20px" }}>Comments</Title>

      <List
        dataSource={paginatedComments}
        renderItem={(comment) => (
          <CustomComment
            key={comment._id}
            author={comment.userId?.name}
            content={comment.commentText}
            datetime={new Date(comment.createdAt).toLocaleString()}
          />
        )}
        locale={{ emptyText: "Be the first to comment!" }}
      />

      {/* Pagination component */}
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={comments.length}
        onChange={handlePageChange}
        style={{ textAlign: "center", marginTop: "20px" }}
      />

      {user && (
        <div style={{ marginTop: "30px" }}>
          <Divider />
          <Form.Item>
            <TextArea
              rows={4}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              style={{ borderRadius: "8px" }}
            />
            <Button 
              type="primary" 
              onClick={handleAddComment} 
              style={{ marginTop: "10px", float: "right", borderRadius: "8px" }}
            >
              Add Comment
            </Button>
          </Form.Item>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
