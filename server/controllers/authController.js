const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "7d",
  });

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    const user = await User.create({
      name,
      email,
      password,
      role: role || "staff",
    });
    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

exports.seedAdmin = async (req, res) => {
  try {
    const existing = await User.findOne({ role: "admin" });
    if (existing)
      return res.json({
        success: true,
        message: "Admin already exists",
        email: existing.email,
      });
    const admin = await User.create({
      name: "Admin",
      email: "admin@techfixpro.in",
      password: "admin123",
      role: "admin",
    });
    res.json({
      success: true,
      message: "Admin created",
      email: admin.email,
      password: "admin123",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
