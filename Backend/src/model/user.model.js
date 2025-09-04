const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true, // usernames should be unique
        trim: true,
        minlength: [3, "Username must be at least 3 characters long"],
        maxlength: [20, "Username cannot exceed 20 characters"]
    },
    email: {
        type: String,
        required: [true, "email is required"],
        trim: true,
        minlength: [8, "Name must be at least 2 characters long"],
        maxlength: [50, "Name cannot exceed 50 characters"]
    },
    fullName: {
        firstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
            minlength: [2, "First name must be at least 2 characters long"],
            maxlength: [30, "First name cannot exceed 30 characters"]
        },
        lastName: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
            minlength: [2, "Last name must be at least 2 characters long"],
            maxlength: [30, "Last name cannot exceed 30 characters"]
        }
    },
    role: {
        type: String,
        enum: ["seller", "user"],
        default: "user",
        required: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
        maxlength: [128, "Password cannot exceed 128 characters"]
    }
}, { timestamps: true });
const userModel = mongoose.model("User", userSchema);

module.exports = userModel;