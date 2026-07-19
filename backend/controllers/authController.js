// controllers/authController.js
// This file contains the actual LOGIC for registering and logging in users.
// Routes (later) will just point to these functions — this is where the real work happens.

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  findUserByEmail,
  findUserByEmployeeId,
  createUser,
  findRoleByName,
  findRoleById
} = require('../models/userModel');

// ---------------- REGISTER ----------------
// What happens when someone signs up for the first time
async function register(req, res) {
  try {
    const { fullName, email, employeeId, password, role } = req.body;
    // role will be something like "Employee", "IT Engineer", or "Admin"

    // 1. Basic validation — make sure nothing important is missing
    if (!fullName || !email || !employeeId || !password || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // 2. Check if this email is already registered
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    // 3. Look up the role's ID (e.g. "Employee" -> 1)
    const roleRecord = await findRoleByName(role);
    if (!roleRecord) {
      return res.status(400).json({ message: 'Invalid role provided.' });
    }

    // 4. Hash the password — NEVER store plain text passwords
    // "10" here is the "salt rounds" — basically how many times it scrambles the password.
    // Higher = more secure but slower. 10 is a solid, standard default.
    const passwordHash = await bcrypt.hash(password, 10);

    // 5. Save the new user to the database
    const newUserId = await createUser({
      fullName,
      email,
      employeeId,
      passwordHash,
      roleId: roleRecord.role_id
    });

    // 6. Respond with success (never send the password back, even hashed!)
    return res.status(201).json({
      message: 'Account created successfully.',
      userId: newUserId
    });

  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Something went wrong during registration.' });
  }
}

// ---------------- LOGIN ----------------
// What happens when an existing user tries to log in
async function login(req, res) {
  try {
    const { employeeId, password, role } = req.body;

    if (!employeeId || !password || !role) {
      return res.status(400).json({ message: 'Employee ID, password, and role are required.' });
    }

    // 1. Find the user by employee ID
    const user = await findUserByEmployeeId(employeeId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // 2. Compare the typed password against the stored hash
    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // 3. Confirm the role they selected matches their actual account role
    const actualRole = await findRoleById(user.role_id);
    if (!actualRole || actualRole.role_name.toLowerCase() !== role.toLowerCase()) {
      return res.status(403).json({ message: 'Invalid role for this account.' });
    }

    // 4. Create a JWT token
    const token = jwt.sign(
      {
        userId: user.user_id,
        roleId: user.role_id
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    // 5. Send back exactly what the frontend expects
    return res.status(200).json({
      token,
      role: actualRole.role_name,
      name: user.full_name
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Something went wrong during login.' });
  }
}

module.exports = { register, login };