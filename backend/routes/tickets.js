// routes/tickets.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
  listAllTickets,
  listMyTickets,
  listAssignedTickets,
  getTicket,
  raiseTicket,
  changeTicketStatus,
  commentOnTicket,
  assignTicketToEngineer
} = require('../controllers/ticketController');


// IMPORTANT: specific routes (/mine, /assigned) must come BEFORE /:id,
// otherwise Express will treat "mine" or "assigned" as an :id value
router.get('/', verifyToken, listAllTickets);
router.get('/mine', verifyToken, listMyTickets);
router.get('/assigned', verifyToken, listAssignedTickets);
router.get('/:id', verifyToken, getTicket);
router.post('/', verifyToken, raiseTicket);
router.patch('/:id/assign', verifyToken, assignTicketToEngineer);
router.patch('/:id/status', verifyToken, changeTicketStatus);
router.post('/:id/comments', verifyToken, commentOnTicket);

module.exports = router;