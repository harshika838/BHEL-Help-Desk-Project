// models/employeeModel.js
const { pool } = require('../config/db');

// Get all employees (joins with Roles to show role name instead of just role_id)
async function getAllEmployees() {
  const [rows] = await pool.query(`
    SELECT u.user_id, u.employee_id, u.full_name, u.email, u.department, u.status, r.role_name
    FROM Users u
    JOIN Roles r ON u.role_id = r.role_id
    ORDER BY u.user_id DESC
  `);
  return rows;
}

// Add a new employee
async function addEmployee({ employeeId, fullName, email, passwordHash, roleId, department }) {
  const [result] = await pool.query(
    `INSERT INTO Users (employee_id, full_name, email, password_hash, role_id, department, status)
     VALUES (?, ?, ?, ?, ?, ?, 'Active')`,
    [employeeId, fullName, email, passwordHash, roleId, department]
  );
  return result.insertId;
}

// Update an employee
async function updateEmployee(userId, { fullName, email, department, status, roleId }) {
  await pool.query(
    `UPDATE Users SET full_name = ?, email = ?, department = ?, status = ?, role_id = ?
     WHERE user_id = ?`,
    [fullName, email, department, status, roleId, userId]
  );
}

// Delete an employee
async function deleteEmployee(userId) {
  await pool.query('DELETE FROM Users WHERE user_id = ?', [userId]);
}

module.exports = { getAllEmployees, addEmployee, updateEmployee, deleteEmployee };