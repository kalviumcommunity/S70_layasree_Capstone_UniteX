const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', authMiddleware, (req, res) => {
  // You can now access req.user
  res.json({ message: `Hello ${req.user.email}, you created an event!` });
});

module.exports = router;
