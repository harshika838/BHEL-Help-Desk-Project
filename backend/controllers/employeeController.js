// controllers/employeeController.js
const bcrypt = require('bcryptjs');
const {
  getAllEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee
} = require('../models/employeeModel');
const { findRoleByName } = require('../models/userModel');

// GET /api/employees
async function listEmployees(req, res) {
  try {
    const employees = await getAllEmployees();
    return res.status(200).json(employees);
  } catch (error) {
    console.error('List employees error:', error);
    return res.status(500).json({ message: 'Could not fetch employees.' });
  }
}

// POST /api/employees
async function createEmployee(req, res) {
  try {
    const { employeeId, fullName, email, password, role, department } = req.body;

    if (!employeeId || !fullName || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const roleRecord = await findRoleByName(role);
    if (!roleRecord) {
      return res.status(400).json({ message: 'Invalid role provided.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUserId = await addEmployee({
      employeeId,
      fullName,
      email,
      passwordHash,
      roleId: roleRecord.role_id,
      department
    });

    return res.status(201).json({ message: 'Employee added successfully.', userId: newUserId });
  } catch (error) {
    console.error('Create employee error:', error);
    return res.status(500).json({ message: 'Could not add employee.' });
  }
}

// PUT /api/employees/:id
async function editEmployee(req, res) {
  try {
    const { id } = req.params;
    const { fullName, email, department, status, role } = req.body;

    const roleRecord = await findRoleByName(role);
    if (!roleRecord) {
      return res.status(400).json({ message: 'Invalid role provided.' });
    }

    await updateEmployee(id, {
      fullName,
      email,
      department,
      status,
      roleId: roleRecord.role_id
    });

    return res.status(200).json({ message: 'Employee updated successfully.' });
  } catch (error) {
    console.error('Edit employee error:', error);
    return res.status(500).json({ message: 'Could not update employee.' });
  }
}

// DELETE /api/employees/:id
async function removeEmployee(req, res) {
  try {
    const { id } = req.params;
    await deleteEmployee(id);
    return res.status(200).json({ message: 'Employee removed successfully.' });
  } catch (error) {
    console.error('Delete employee error:', error);
    return res.status(500).json({ message: 'Could not delete employee.' });
  }
}

module.exports = { listEmployees, createEmployee, editEmployee, removeEmployee };