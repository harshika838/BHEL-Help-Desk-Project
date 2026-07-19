const { pool } = require('../config/db');

// Find a user by their email (kept for backward compatibility / duplicate checks)
async function findUserByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
  return rows[0];
}

// Find a user by their employee ID (used for login now)
async function findUserByEmployeeId(employeeId) {
  const [rows] = await pool.query('SELECT * FROM Users WHERE employee_id = ?', [employeeId]);
  return rows[0];
}

// Find a user by their ID
async function findUserById(userId) {
  const [rows] = await pool.query('SELECT * FROM Users WHERE user_id = ?', [userId]);
  return rows[0];
}

// Create a new user (used during registration)
async function createUser({ fullName, email, employeeId, passwordHash, roleId }) {
  const [result] = await pool.query(
    'INSERT INTO Users (full_name, email, employee_id, password_hash, role_id) VALUES (?, ?, ?, ?, ?)',
    [fullName, email, employeeId, passwordHash, roleId]
  );
  return result.insertId;
}

// Get a role's ID by its name (e.g. "Employee" -> 1)
async function findRoleByName(roleName) {
  const [rows] = await pool.query('SELECT * FROM Roles WHERE role_name = ?', [roleName]);
  return rows[0];
}

// Get a role's name by its ID (needed to return role name in login response)
async function findRoleById(roleId) {
  const [rows] = await pool.query('SELECT * FROM Roles WHERE role_id = ?', [roleId]);
  return rows[0];
}

module.exports = {
  findUserByEmail,
  findUserByEmployeeId,
  findUserById,
  createUser,
  findRoleByName,
  findRoleById
};