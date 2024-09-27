const mongoose = require('mongoose');

// TODO: Modify this after user created
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  content: String,
  coverImg: String,
  category: String,
  author: String,
  rating: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);