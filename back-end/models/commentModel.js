const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  postID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
});





// Export the model
const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
