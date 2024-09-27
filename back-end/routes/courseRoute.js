const express = require('express');
const router = express.Router();
const Course = require("../models/courseModel")
const Comment = require("../models/commentModel")



// create a course post
router.post('/create-course', async (req, res) => {
    try {
      // console.log("Course data from api: ", req.body)
      const newPost = new Course({ ...req.body });
      await newPost.save();
      res.status(201).send({
        message: "Course created successfully",
        post: newPost
      });
    } catch (error) {
      console.error("Error creating course: ", error);
      res.status(500).send({ message: "Error creating course" });
    }
  });

// get all coure
router.get('/', async (req, res) => {
    try {

        const { search, category, location } = req.query;

        console.log(search);

        let query = {};

        if (search) {
        query = {
            ...query,
            $or: [
            { title: { $regex: search, $options: "i" } },
            { content: { $regex: search, $options: "i" } }
            ]
        };
        }

        if (category) {
            query = {
              ...query,
              category
            };
          }

          if (location) {
            query = {
              ...query,
              location
            };
          }
          
          

          const post = await Course.find(query).sort({ createdAt: -1 });
        res.status(200).send({
          message: "All courses retrieved successfully",
          posts: post
        });
      } catch (error) {
        console.error("Error retrieving courses: ", error);
        res.status(500).send({ message: "Error retrieving courses" });
      }
});

// get single course by id
router.get('/:id', async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await Course.findById(postId);
      if (!post) {
        return res.status(404).send({ message: "Course not found" });
      }

      const comment = await Comment.find({ postId: postId }).populate('user', 'username email');



      res.status(200).send({
        message: "Course retrieved successfully",
        post: post
      });
    } catch (error) {
      console.error("Error fetching single Course: ", error);
      res.status(500).send({ message: "Error fetching single Course" });
    }
  });
  
  // update a course post
router.patch('/update-course/:id', async (req, res) => {
    try {
      const postId = req.params.id;
      const updatedPost = await Course.findByIdAndUpdate(postId, { ...req.body }, { new: true });
  
      if (!updatedPost) {
        return res.status(404).send({ message: "Course not found" });
      }
  
      res.status(200).send({
        message: "Course updated successfully",
        post: updatedPost
      });
    } catch (error) {
      console.error("Error updating course: ", error);
      res.status(500).send({ message: "Error updating course" });
    }
  });
  
  // delete a course post
router.delete('/:id', async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await Course.findByIdAndDelete(postId);
      if (!post) {
        return res.status(404).send({ message: "Course not found" });
      }

      // delete related comments
      await Comment.deleteMany({ postId: postId });


  
      res.status(200).send({
        message: "Course deleted successfully",
        post: post
      });
    } catch (error) {
      console.error("Error deleting course: ", error);
      res.status(500).send({ message: "Error deleting course" });
    }
  });
  
  // related courses
router.get('/related/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({ message: "Course id is required" });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).send({ message: "Course is not found!" });
    }

        const titleRegex = new RegExp(course.title.split(' ').join('|'), 'i');

        const relatedQuery = {
          _id: { $ne: id }, // exclude the current blog by id
          title: { $regex: titleRegex }
        };

        const relatedCourse = await Course.find(relatedQuery);
        res.status(200).send({ message: "Related course found!", course: relatedCourse });


  } catch (error) {
    console.error("Error fetching related Course: ", error);
    res.status(500).send({ message: "Error fetching related Course" });
  }
});

  

module.exports = router;
