// config/db.js
// This file is responsible for ONE thing: connecting to MySQL.
// We create a "pool" of connections instead of a single connection,
// because a real app handles many requests at once, and a pool
// lets multiple queries run without waiting in a single line.

const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,   // max 10 simultaneous connections
  queueLimit: 0
});

// Small helper to check the connection works when the server starts
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL connected successfully');
    connection.release();
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
  }
}

module.exports = { pool, testConnection };
