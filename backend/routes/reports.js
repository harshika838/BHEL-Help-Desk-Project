// routes/reports.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { getReportSummary } = require('../controllers/reportController');

router.get('/summary', verifyToken, getReportSummary);

module.exports = router;