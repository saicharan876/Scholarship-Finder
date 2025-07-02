const mongoose = require("mongoose");

const scholarshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true, unique: true },
  amount: String,
  amountValue: Number,
  deadline: String,
  description: String,
  gpa: Number,
  locations: [String],
  courses: [String],
  eligibilityText: String,
  lastScraped: Date,
});

module.exports = mongoose.model("Scholarship", scholarshipSchema);
