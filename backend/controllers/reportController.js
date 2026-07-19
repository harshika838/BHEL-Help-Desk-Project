// controllers/reportController.js
const { getSummary } = require('../models/reportModel');

// GET /api/reports/summary
async function getReportSummary(req, res) {
  try {
    const summary = await getSummary();
    return res.status(200).json(summary);
  } catch (error) {
    console.error('Report summary error:', error);
    return res.status(500).json({ message: 'Could not generate report summary.' });
  }
}

module.exports = { getReportSummary };