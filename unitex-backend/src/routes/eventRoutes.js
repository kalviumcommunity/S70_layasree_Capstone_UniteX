const express = require("express");
const { Event } = require("../mockMongoose");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

/** 
 * 🔹 GET All Events (with filters)
 */
router.get("/", async (req, res) => {
    try {
        const { search, category, location, date } = req.query;
        let query = {};
        
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }
        if (category && category !== "All") {
            query.category = category;
        }
        if (location) {
            query.location = { $regex: location, $options: "i" };
        }
        if (date) {
            query.date = { $gte: new Date(date) };
        }
        
        const events = await Event.find(query).populate("organizer", "username email");
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Error fetching events", error: error.message });
    }
});

/**
 * 🔹 GET Single Event
 */
router.get("/:id", async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate("organizer", "username email")
            .populate("rsvps", "username email");
        if (!event) return res.status(404).json({ message: "Event not found" });
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: "Error fetching event", error: error.message });
    }
});

/** 
 * 🔹 POST - Create a New Event
 */
router.post("/", authMiddleware, async (req, res) => {
    try {
                const { title, description, date, location, category, imageUrl, maxCapacity } = req.body;
        
        let parsedDate = undefined;
        if (date) {
            const d = new Date(date);
            if (!isNaN(d.getTime())) {
                parsedDate = d;
            }
        }

        const newEvent = new Event({
            title,
            description,
            date: parsedDate,
            location,
            category: category || "Other",
            imageUrl: imageUrl || "",
            maxCapacity: maxCapacity || 100,
            organizer: req.user.id
        });
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(400).json({ message: "Error creating event", error: error.message });
    }
});

/**
 * 🔹 PUT - Update an Existing Event
 */
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        // Check if organizer or admin
        if (event.organizer.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized to modify this event" });
        }

        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: "Error updating event", error: error.message });
    }
});

/**
 * 🔹 DELETE - Remove an Event
 */
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        // Check if organizer or admin
        if (event.organizer && event.organizer.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized to delete this event" });
        }

        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting event", error: error.message });
    }
});

/**
 * 🔹 POST - Toggle RSVP
 */
router.post("/:id/rsvp", authMiddleware, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        const userId = req.user.id;
        const index = event.rsvps.indexOf(userId);

        if (index > -1) {
            // Cancel RSVP
            event.rsvps.splice(index, 1);
        } else {
            // Add RSVP
            if (event.rsvps.length >= event.maxCapacity) {
                return res.status(400).json({ message: "Event capacity reached" });
            }
            event.rsvps.push(userId);
        }

        await event.save();
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: "Error toggling RSVP", error: error.message });
    }
});

module.exports = router;
