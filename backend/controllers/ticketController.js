// controllers/ticketController.js
const {
  getAllTickets,
  getTicketsRaisedBy,
  getTicketsAssignedTo,
  getTicketById,
  createTicket,
  updateTicketStatus,
  addComment,
  assignTicket
} = require('../models/ticketModel');


// GET /api/tickets
async function listAllTickets(req, res) {
  try {
    const tickets = await getAllTickets();
    return res.status(200).json(tickets);
  } catch (error) {
    console.error('List tickets error:', error);
    return res.status(500).json({ message: 'Could not fetch tickets.' });
  }
}

// GET /api/tickets/mine
async function listMyTickets(req, res) {
  try {
    const tickets = await getTicketsRaisedBy(req.user.userId);
    return res.status(200).json(tickets);
  } catch (error) {
    console.error('List my tickets error:', error);
    return res.status(500).json({ message: 'Could not fetch your tickets.' });
  }
}

// GET /api/tickets/assigned
async function listAssignedTickets(req, res) {
  try {
    const tickets = await getTicketsAssignedTo(req.user.userId);
    return res.status(200).json(tickets);
  } catch (error) {
    console.error('List assigned tickets error:', error);
    return res.status(500).json({ message: 'Could not fetch assigned tickets.' });
  }
}

// GET /api/tickets/:id
async function getTicket(req, res) {
  try {
    const { id } = req.params;
    const ticket = await getTicketById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }
    return res.status(200).json(ticket);
  } catch (error) {
    console.error('Get ticket error:', error);
    return res.status(500).json({ message: 'Could not fetch ticket.' });
  }
}

// POST /api/tickets
async function raiseTicket(req, res) {
  try {
    const { title, description, priority } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required.' });
    }

    const newTicketId = await createTicket({
      raisedBy: req.user.userId,
      title,
      description,
      priority
    });

    return res.status(201).json({ message: 'Ticket raised successfully.', ticketId: newTicketId });
  } catch (error) {
    console.error('Raise ticket error:', error);
    return res.status(500).json({ message: 'Could not raise ticket.' });
  }
}

// PATCH /api/tickets/:id/status
async function changeTicketStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required.' });
    }

    await updateTicketStatus(id, status);
    return res.status(200).json({ message: 'Ticket status updated.' });
  } catch (error) {
    console.error('Update ticket status error:', error);
    return res.status(500).json({ message: 'Could not update ticket status.' });
  }
}
// PATCH /api/tickets/:id/assign
async function assignTicketToEngineer(req, res) {
  try {
    const { id } = req.params;
    const { engineerId } = req.body;

    if (!engineerId) {
      return res.status(400).json({ message: 'Engineer ID is required.' });
    }

    await assignTicket(id, engineerId);
    return res.status(200).json({ message: 'Ticket assigned successfully.' });
  } catch (error) {
    console.error('Assign ticket error:', error);
    return res.status(500).json({ message: 'Could not assign ticket.' });
  }
}

// POST /api/tickets/:id/comments
async function commentOnTicket(req, res) {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({ message: 'Comment text is required.' });
    }

    const newCommentId = await addComment(id, req.user.userId, comment);
    return res.status(201).json({ message: 'Comment added.', commentId: newCommentId });
  } catch (error) {
    console.error('Add comment error:', error);
    return res.status(500).json({ message: 'Could not add comment.' });
  }
}
module.exports = {
  listAllTickets,
  listMyTickets,
  listAssignedTickets,
  getTicket,
  raiseTicket,
  changeTicketStatus,
  commentOnTicket,
  assignTicketToEngineer
};
