import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { server } from "../main";
import toast from "react-hot-toast";

const CommentContext = createContext();

export const CommentContextProvider = ({ children }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all comments for a specific course
  const fetchComments = useCallback(async (courseId) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/${courseId}/comments`);
      setComments(data.comments);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Add a new comment to a specific course
  async function addComment(courseId, commentText) {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/api/${courseId}/comments`,
        { commentText },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      setComments((prev) => [...prev, data.comment]);
      toast.success("Comment added successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add comment");
    } finally {
      setLoading(false);
    }
  }

  // Add a reply to a specific comment
  async function addReply(commentId, replyText) {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/api/comments/${commentId}/replies`,
        { replyText },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      setComments((prev) =>
        prev.map((comment) => 
          comment._id === commentId ? { ...comment, replies: [...comment.replies, data.reply] } : comment
        )
      );
      toast.success("Reply added successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add reply");
    } finally {
      setLoading(false);
    }
  }

  // Delete a comment
  async function deleteComment(commentId) {
    setLoading(true);
    try {
      await axios.delete(`${server}/api/comments/${commentId}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setComments((prev) => prev.filter((comment) => comment._id !== commentId));
      toast.success("Comment deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete comment");
    } finally {
      setLoading(false);
    }
  }

  // Update a comment
  async function updateComment(commentId, updatedText) {
    setLoading(true);
    try {
      const { data } = await axios.put(
        `${server}/api/comments/${commentId}`,
        { commentText: updatedText },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      setComments((prev) =>
        prev.map((comment) => (comment._id === commentId ? data.comment : comment))
      );
      toast.success("Comment updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update comment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <CommentContext.Provider
      value={{ comments, fetchComments, addComment, addReply, deleteComment, updateComment, loading }}
    >
      {children}
    </CommentContext.Provider>
  );
};

export const CommentData = () => useContext(CommentContext);
