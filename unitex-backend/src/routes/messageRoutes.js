const express = require("express");
const { Message } = require("../mockMongoose");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// GET - retrieve messages for a specific event
router.get("/:eventId", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ event: req.params.eventId })
      .sort({ createdAt: 1 })
      .limit(100);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages", details: err.message });
  }
});

module.exports = router;
