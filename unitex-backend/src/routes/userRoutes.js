const express = require("express");
const { User, Event, Booking, Message } = require("../mockMongoose");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Middleware to verify admin role
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Admins only." });
  }
};

// GET - retrieve all users
router.get("/", authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users", details: err.message });
  }
});

// DELETE - delete user
router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) {
      return res.status(404).json({ error: "User not found" });
    }

    if (userToDelete.role === "admin") {
      return res.status(400).json({ error: "Cannot delete admin users" });
    }

    // Delete the user
    await User.findByIdAndDelete(req.params.id);

    // Clean up user's data (optional, but clean)
    await Event.deleteMany({ organizer: req.params.id });
    await Booking.deleteMany({ organizer: req.params.id });
    await Message.deleteMany({ user: req.params.id });

    res.json({ message: "User and related content deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user", details: err.message });
  }
});

module.exports = router;
