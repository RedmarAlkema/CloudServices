const express = require('express');
const router = express.Router();
const authController = require('./authController');
const authMiddleware = require('./authMiddleware');

// User Registration Route
router.post('/register', authController.register);

// User Login Route
router.post('/login', authController.login);

// Optionally, a protected route (if needed for testing)
router.get('/profile', authMiddleware.authenticate, (req, res) => {
    res.json({ message: `Hello ${req.user.role}, welcome to your profile` });
});

module.exports = router;