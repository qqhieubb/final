import React, { useState, useEffect } from "react";
import { List, Form, Input, Button, Typography, Divider } from "antd";
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
  const { user } = UserData();
  const { comments, fetchComments, addComment } = CommentData();

  useEffect(() => {
    fetchComments(courseId);
  }, [courseId, fetchComments]);

  const handleAddComment = () => {
    if (commentText.trim()) {
      addComment(courseId, commentText).then(() => {
        fetchComments(courseId);
      });
      setCommentText("");
    } else {
      toast.error("Comment cannot be empty");
    }
  };

  return (
    <div className="comment-section" style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <Title level={4} style={{ marginBottom: "20px" }}>Comments</Title>

      <List
        dataSource={comments}
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
