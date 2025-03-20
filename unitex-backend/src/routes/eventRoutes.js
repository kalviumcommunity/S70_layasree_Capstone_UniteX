const express = require("express");
const Event = require("../models/Event");
const router = express.Router();

/** 
 * 🔹 GET All Events
 */
router.get("/", async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Error fetching events", error });
    }
});

/** 
 * 🔹 POST - Create a New Event
 */
router.post("/", async (req, res) => {
    try {
        const { title,  location, description } = req.body;
        const newEvent = new Event({ title,  location, description });
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(400).json({ message: "Error creating event", error });
    }
});

/**
 * 🔹 put - Update an Existing Event
 */
 
router.put("/:id", async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedEvent) return res.status(404).json({ message: "Event not found" });
        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: "Error updating event", error });
    }
});

module.exports = router;
