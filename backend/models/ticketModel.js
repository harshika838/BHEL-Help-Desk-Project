// models/ticketModel.js
const { pool } = require('../config/db');

// All tickets (admin view)
async function getAllTickets() {
  const [rows] = await pool.query(`
    SELECT t.*, ru.full_name AS raised_by_name, au.full_name AS assigned_to_name
    FROM Tickets t
    JOIN Users ru ON t.raised_by = ru.user_id
    LEFT JOIN Users au ON t.assigned_to = au.user_id
    ORDER BY t.created_at DESC
  `);
  return rows;
}

// Tickets raised by a specific user
async function getTicketsRaisedBy(userId) {
  const [rows] = await pool.query(
    `SELECT * FROM Tickets WHERE raised_by = ? ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
}

// Tickets assigned to a specific engineer
async function getTicketsAssignedTo(userId) {
  const [rows] = await pool.query(
    `SELECT t.*, ru.full_name AS raised_by_name
     FROM Tickets t
     JOIN Users ru ON t.raised_by = ru.user_id
     WHERE t.assigned_to = ?
     ORDER BY t.created_at DESC`,
    [userId]
  );
  return rows;
}

// Single ticket + its comments
async function getTicketById(ticketId) {
  const [ticketRows] = await pool.query(
    `SELECT t.*, ru.full_name AS raised_by_name, au.full_name AS assigned_to_name
     FROM Tickets t
     JOIN Users ru ON t.raised_by = ru.user_id
     LEFT JOIN Users au ON t.assigned_to = au.user_id
     WHERE t.ticket_id = ?`,
    [ticketId]
  );
  if (!ticketRows[0]) return null;

  const [comments] = await pool.query(
    `SELECT c.*, u.full_name AS commenter_name
     FROM Ticket_Comments c
     JOIN Users u ON c.user_id = u.user_id
     WHERE c.ticket_id = ?
     ORDER BY c.created_at ASC`,
    [ticketId]
  );

  return { ...ticketRows[0], comments };
}

// Create a new ticket
async function createTicket({ raisedBy, title, description, priority }) {
  const [result] = await pool.query(
    `INSERT INTO Tickets (raised_by, title, description, priority, status)
     VALUES (?, ?, ?, ?, 'Open')`,
    [raisedBy, title, description, priority || 'Medium']
  );
  return result.insertId;
}

// Update ticket status
async function updateTicketStatus(ticketId, status) {
  const resolvedAt = status === 'Resolved' || status === 'Closed' ? new Date() : null;
  await pool.query(
    `UPDATE Tickets SET status = ?, resolved_at = ? WHERE ticket_id = ?`,
    [status, resolvedAt, ticketId]
  );
}
// Assign a ticket to an engineer
async function assignTicket(ticketId, engineerId) {
  await pool.query(
    `UPDATE Tickets SET assigned_to = ?, status = 'Assigned' WHERE ticket_id = ?`,
    [engineerId, ticketId]
  );
}

// Add a comment to a ticket
async function addComment(ticketId, userId, comment) {
  const [result] = await pool.query(
    `INSERT INTO Ticket_Comments (ticket_id, user_id, comment) VALUES (?, ?, ?)`,
    [ticketId, userId, comment]
  );
  return result.insertId;
}



module.exports = {
  getAllTickets,
  getTicketsRaisedBy,
  getTicketsAssignedTo,
  getTicketById,
  createTicket,
  updateTicketStatus,
  addComment,
  assignTicket
};