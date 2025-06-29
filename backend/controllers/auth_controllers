const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user_model");

const SECRET = "!@#$%^&*()";

async function signup(req, res) {
  const { name, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id, email: user.email }, SECRET);

    res.status(201).json({
      token,
      user: { email: user.email, name: user.name },
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id, email: user.email }, SECRET);

    res.status(200).json({ message: "Logged in successfully", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function details(req, res) {
  try {
    const userId = req.user.id;
    const { location, gpa, course, amount } = req.body;

    if (!location || !gpa || !course || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { location, gpa: parseFloat(gpa), course, amount, Submit: true },
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function UserDetails(req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    console.error("User fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { signup, login, details, UserDetails };
