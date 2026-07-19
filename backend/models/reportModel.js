// models/reportModel.js
const { pool } = require('../config/db');

async function getSummary() {
  // Tickets grouped by status (e.g. Open, In Progress, Resolved, Closed)
  const [ticketsByStatus] = await pool.query(`
    SELECT status, COUNT(*) AS count FROM Tickets GROUP BY status
  `);

  // Tickets grouped by priority (Low, Medium, High)
  const [ticketsByPriority] = await pool.query(`
    SELECT priority, COUNT(*) AS count FROM Tickets GROUP BY priority
  `);

  // Assets grouped by status (Available, Assigned, etc.)
  const [assetsByStatus] = await pool.query(`
    SELECT status, COUNT(*) AS count FROM Assets GROUP BY status
  `);

  // Tickets raised per day, last 30 days (for a trend chart)
  const [ticketsOverTime] = await pool.query(`
    SELECT DATE(created_at) AS date, COUNT(*) AS count
    FROM Tickets
    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `);

  // Quick top-line totals, useful for summary cards
  const [[{ totalTickets }]] = await pool.query(`SELECT COUNT(*) AS totalTickets FROM Tickets`);
  const [[{ totalAssets }]] = await pool.query(`SELECT COUNT(*) AS totalAssets FROM Assets`);
  const [[{ totalEmployees }]] = await pool.query(`SELECT COUNT(*) AS totalEmployees FROM Users`);
  const [[{ openTickets }]] = await pool.query(`SELECT COUNT(*) AS openTickets FROM Tickets WHERE status = 'Open'`);

  return {
    totals: { totalTickets, totalAssets, totalEmployees, openTickets },
    ticketsByStatus,
    ticketsByPriority,
    assetsByStatus,
    ticketsOverTime
  };
}

module.exports = { getSummary };