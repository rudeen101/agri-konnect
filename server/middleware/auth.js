// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/users');


// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
	// JWT is typically sent in the Authorization header as Bearer token
	const authHeader =  req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ error: 'Unauthorized: No token provided' });
	}

	const token = authHeader.split(" ")[1];


	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {

			if (err.name === "TokenExpiredError") {
				return res.status(403).json({ error: "Token expired" });
			}
			return res.status(403).json({ error: "Invalid token" });
		}

		req.user = decoded;
		next();
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
      return res.status(403).json({ error: 'Forbidden' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  };
};

module.exports = { verifyToken, authorize };
