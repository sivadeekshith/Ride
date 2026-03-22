const express = require('express');
const { login, signup, forgotPassword } = require('../controllers/authController');
const { loginRules, signupRules, validate } = require('../middleware/validation');

const router = express.Router();

router.post('/login', loginRules, validate, login);
router.post('/signup', signupRules, validate, signup);
router.post('/forgot', forgotPassword);

module.exports = router;