const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Driver = require('../models/Driver');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// @desc    Login user/driver
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check employee/admin
    let user = await User.findOne({ username });
    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        token: generateToken(user._id),
        role: user.role,
        username: user.username,
        firstLogin: user.firstLogin,
      });
      return;
    }

    // Check driver
    const driver = await Driver.findOne({ name: username });
    if (driver && driver.password === password) {
      res.json({
        success: true,
        token: generateToken(driver._id),
        role: 'driver',
        username: driver.name,
      });
      return;
    }

    res.status(401).json({ success: false, message: 'Invalid credentials' });
  } catch (error) {
    next(error);
  }
};

// @desc    Register new employee
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const employeeId = `EMP-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    const user = await User.create({
      username,
      email,
      password,
      role: 'employee',
      employeeId,
      firstLogin: true,
    });

    res.status(201).json({
      success: true,
      employeeId: user.employeeId,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password (forgot)
// @route   POST /api/auth/forgot
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Email not found' });
    }
    user.password = newPassword;
    user.firstLogin = false;
    await user.save();
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, signup, forgotPassword };