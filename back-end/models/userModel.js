const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['Student', 'Instructor', 'Admin'], // Các vai trò có thể có
        default: 'Student',
      },
      password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 64,
      },
})

const User = mongoose.model("Student", userSchema)
module.exports = User