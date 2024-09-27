const Course = require('../models/courseModel');

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { title, description, price, category, content } = req.body;
    const course = new Course({
      title,
      description,
      instructor: req.user._id, // Assuming you use JWT to get user
      price,
      category,
      content,
    });
    await course.save();
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'name');
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get a single course
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name');
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Update a course
exports.updateCourse = async (req, res) => {
  try {
    const { title, description, price, category, content } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Update course details
    course.title = title || course.title;
    course.description = description || course.description;
    course.price = price || course.price;
    course.category = category || course.category;
    course.content = content || course.content;

    await course.save();
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    await course.remove();
    res.status(200).json({ success: true, message: 'Course deleted' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
