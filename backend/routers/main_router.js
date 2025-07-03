const express = require("express");
const {
  fetchScholarshipsCom,
  getAllScholarships,
  getScholarshipsForStudent,
} = require("../controllers/scholarship_controllers.js");
const {Auth} = require('../middleware/auth.js');

const router = express.Router();

router.get("/fetch",fetchScholarshipsCom);
router.get("/all",getAllScholarships);
router.get("/myschl",Auth,getScholarshipsForStudent);

module.exports = router;
