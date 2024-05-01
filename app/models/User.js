const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  specialist: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  password: { type: String, required: true },
  personalPhoto: { type: String, required: true },
  createdDate: { type: Date, required: true },
  courses: {
    type: [Number], // Assuming Courses is an array of strings, modify the type accordingly if needed
    default: [],    // Default value is an empty array, change it as needed
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
