const User = require("../models/userModel")
const createError = require("../utils/appError")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");

//Register
exports.register = async (req, res, next)=>{
    try{
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new createError("User already exists!", 400));
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const newUser = await User.create({
            name,
            email,
            role,
            password: hashedPassword,
        });

        // Generate token
        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });

        // Respond with user data and token
        res.status(201).json({
            status: "Success",
            data: {
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                },
                token,
            },
        });
    } catch(err){
        next(err)
    }
}

//Login 
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return next(new createError("Invalid email or password", 401));
        }

        // Compare passwords
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return next(new createError("Invalid email or password", 401));
        }

        // Generate token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });

        // Respond with user data and token
        res.status(200).json({
            status: "Success",
            message: "Login sucessfully!!!",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });
    } catch (err) {
        next(err);
    }
};