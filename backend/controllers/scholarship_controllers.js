const Scholarship = require("../models/scholarship_mode.js");
const User = require("../models/user_model.js");
const scrapeScholarshipsCom = require("../scrapper/scholarship_scrapper.js");

function convertDeadlineToDate(deadlineStr) {
  return new Date(deadlineStr);
}

const getAllScholarships = async (req, res) => {
  try {
    const scholarships = await Scholarship.find();

    scholarships.sort(
      (a, b) =>
        convertDeadlineToDate(a.deadline) - convertDeadlineToDate(b.deadline)
    );

    res.status(200).json(scholarships);
  } catch (error) {
    console.error("Error fetching scholarships:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const fetchScholarshipsCom = async (req, res) => {
  try {
    const scraped = await scrapeScholarshipsCom();

    for (const item of scraped) {
      await Scholarship.updateOne(
        { title: item.title },
        { $set: item },
        { upsert: true }
      );
    }

    res.status(200).json({ inserted: scraped.length });
  } catch (error) {
    console.error("Scraping failed:", error);
    res.status(500).json({ error: error.message });
  }
};

const getScholarshipsForStudent = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { gpa, amount } = user;

    const query = {
      gpa: { $lte: gpa },
      amountValue: { $gte: amount },
    };

    const matchedScholarships = await Scholarship.find(query);

    matchedScholarships.sort(
      (a, b) =>
        convertDeadlineToDate(a.deadline) - convertDeadlineToDate(b.deadline)
    );

    res.status(200).json(matchedScholarships);
  } catch (err) {
    console.error("Error getting scholarships for student:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  fetchScholarshipsCom,
  getAllScholarships,
  getScholarshipsForStudent,
};
