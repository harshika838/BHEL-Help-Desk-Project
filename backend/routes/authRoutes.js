// routes/authRoutes.js
// This file is the "map" — it says which URL triggers which function.
// It doesn't contain any logic itself, just points requests to authController.

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// POST /api/auth/register  -> runs the register function
router.post('/register', register);

// POST /api/auth/login  -> runs the login function
router.post('/login', login);

module.exports = router;