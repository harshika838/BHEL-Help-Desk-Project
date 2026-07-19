// routes/employees.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
  listEmployees,
  createEmployee,
  editEmployee,
  removeEmployee
} = require('../controllers/employeeController');

router.get('/', verifyToken, listEmployees);
router.post('/', verifyToken, createEmployee);
router.put('/:id', verifyToken, editEmployee);
router.delete('/:id', verifyToken, removeEmployee);

module.exports = router;