// server.js
// This is the file you run to start the whole backend.
// Think of it as the "front door" — it wires everything together.

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/db');

const app = express();

// ---- Middleware (things that run on EVERY request before it reaches a route) ----
app.use(cors());            // allows the React frontend (different port) to call this API
app.use(express.json());    // lets us read JSON data sent in requests (e.g. login form data)

// ---- Routes will be added here as we build each module ----
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/assets', require('./routes/assets'));
app.use('/api/tickets', require('./routes/tickets'));
app.use('/api/reports', require('./routes/reports'));

// Simple test route to confirm the server is alive
app.get('/', (req, res) => {
  res.json({ message: 'IT Asset & Help Desk API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await testConnection();
});
