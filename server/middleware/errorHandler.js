// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error("Global error handler:", err);
    res.status(500).json({ error: 'Internal server error' });
  };
  
  module.exports = errorHandler;
  