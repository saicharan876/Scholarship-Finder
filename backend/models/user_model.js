const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    gpa: {
      type: Number,
      min: 0,
      max: 4,
      validate: {
        validator: Number.isFinite,
        message: "GPA must be a valid number",
      },
    },

    amount: {
      type: Number,
    },

    location: {
      type: String,
      trim: true,
    },

    course: {
      type: String,
      trim: true,
    },

    Submit: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
