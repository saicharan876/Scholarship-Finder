const express = require("express");
const router = express.Router();
const { login, signup, details, UserDetails } = require("../controllers/auth_controllers");
const { Auth } = require("../middleware/auth.js"); 

router.post("/signup", signup);
router.post("/login", login);
router.post("/complete-profile", Auth, details);
router.get("/profile", Auth, UserDetails);

module.exports = router;
