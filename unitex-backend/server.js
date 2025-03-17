const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json()); // Middleware for JSON data

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Define Mongoose Schema & Model
const eventSchema = new mongoose.Schema({
    name: String,
    date: String,
    location: String,
    description: String
});
const Event = mongoose.model("Event", eventSchema);

// **GET Endpoint: Fetch All Events**
app.get("/api/events", async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// **POST Endpoint: Add a New Event**
app.post("/api/events", async (req, res) => {
    try {
        const { name, date, location, description } = req.body;

        if (!name || !date || !location || !description) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newEvent = new Event({ name, date, location, description });
        await newEvent.save();

        res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// **Start Server**
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
