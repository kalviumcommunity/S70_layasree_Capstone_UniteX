const express = require("express");
const { Booking } = require("../mockMongoose");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// POST - submit a booking request
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { organizerId, clientName, clientEmail, clientPhone, eventType, date, description } = req.body;
    
    if (!organizerId || !clientName || !clientEmail || !clientPhone || !eventType || !date) {
      return res.status(400).json({ error: "Missing required booking details" });
    }

    const newBooking = new Booking({
      organizer: organizerId,
      clientName,
      clientEmail,
      clientPhone,
      eventType,
      date: new Date(date),
      description,
      status: "pending"
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(500).json({ error: "Booking submission failed", details: err.message });
  }
});

// GET - retrieve booking requests for organizer
router.get("/organizer", authMiddleware, async (req, res) => {
  try {
    // If not organizer or admin, reject
    if (req.user.role !== "organizer" && req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Only organizers/admins can view requests." });
    }

    const bookings = await Booking.find({ organizer: req.user.id })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings", details: err.message });
  }
});

// PUT - approve or decline booking
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["confirmed", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid booking status" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Check permissions (must be the assigned organizer or admin)
    if (booking.organizer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized access to update this booking" });
    }

    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: "Failed to update booking status", details: err.message });
  }
});

module.exports = router;
