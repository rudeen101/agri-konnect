// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/users');


// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken; // Get token from cookies

  if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
          return res.status(401).json({ error: "Forbidden: Invalid token" });
      }
      req.user = decoded; // Attach user info to request
      next(); // Proceed to the next middleware or route
  });
};

// Middleware for role-based authorization. Accepts a single role or array of roles.
const authorize = (roles) => {
  if (typeof roles === 'string') roles = [roles];
  return async (req, res, next) => {
    // Ensure req.user is set by verifyToken
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    try {

      const user = await User.findById(req.user.id);

      if (user && roles.some(role => user.roles.includes(role))) {
        return next();
      }
      return res.status(401).json({ error: 'Forbidden' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  };
};

module.exports = { verifyToken, authorize };
