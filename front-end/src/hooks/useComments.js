import axios from "axios";
import { server } from "../main";
import toast from "react-hot-toast";

// Fetch all comments for a specific course
export const fetchComments = async (courseId) => {
  try {
    const { data } = await axios.get(`${server}/api/${courseId}/comments`);
    return data.comments;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to fetch comments");
    return [];
  }
};


// Add a new comment to a specific course
export const addComment = async (courseId, commentText) => {
  try {
    const { data } = await axios.post(
      `${server}/api/${courseId}/comments`, // Update route
      { commentText },
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );
    toast.success("Comment added successfully");
    return data.comment;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to add comment");
    return null;
  }
};

// Delete a comment
export const deleteComment = async (commentId) => {
  try {
    await axios.delete(`${server}/api/comments/${commentId}`, { // Update route
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    toast.success("Comment deleted successfully");
    return true;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to delete comment");
    return false;
  }
};

// Update a comment
export const updateComment = async (commentId, updatedText) => {
  try {
    const { data } = await axios.put(
      `${server}/api/comments/${commentId}`, // Update route
      { commentText: updatedText },
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );
    toast.success("Comment updated successfully");
    return data.comment;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to update comment");
    return null;
  }
};