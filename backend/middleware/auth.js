// middleware/auth.js
// This checks that every protected request has a valid JWT token
// attached, and makes the decoded user info available as req.user

const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  // Header looks like: "Bearer eyJhbGciOi..."
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }

    // decoded contains whatever we signed in login: { userId, roleId }
    req.user = decoded;
    next();
  });
}

module.exports = { verifyToken };