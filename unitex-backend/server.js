const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const http = require("http");
const socketIo = require("socket.io");

const eventRoutes = require("./src/routes/eventRoutes");
const uploadRoutes = require("./src/routes/uploadRoutes");
const authRoutes = require("./src/routes/auth");
const bookingRoutes = require("./src/routes/bookingRoutes");
const messageRoutes = require("./src/routes/messageRoutes");
const userRoutes = require("./src/routes/userRoutes");

dotenv.config(); // Load environment variables

const app = express();

// CORS — allow all origins in dev, allow Vercel domain in prod
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    // Allow all localhost ports for development
    if (origin.includes("localhost")) return callback(null, true);
    // Allow any vercel.app domain (frontend deployed on Vercel)
    if (origin.includes("vercel.app")) return callback(null, true);
    // Allow any kalviumcommunity domain
    if (origin.includes("kalviumcommunity")) return callback(null, true);
    callback(null, true); // Permissive for now — restrict in production if needed
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json()); // Middleware for JSON data

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/api/events", eventRoutes);
app.use("/api", uploadRoutes); 
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Connect to MongoDB
const connectDB = async () => {
  console.log("Mock Database System active. Local JSON persistence enabled.");
};

// Connect to DB
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Integrate Socket.io
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("Socket client connected:", socket.id);

  socket.on("joinEventRoom", ({ eventId }) => {
    socket.join(`event_${eventId}`);
    console.log(`Socket ${socket.id} joined room event_${eventId}`);
  });

  socket.on("sendMessage", async ({ eventId, userId, username, text }) => {
    try {
      const { Message } = require("./src/mockMongoose");
      const newMessage = await Message.create({
        event: eventId,
        user: userId,
        username,
        text
      });
      // Broadcast to all in the event room
      io.to(`event_${eventId}`).emit("message", newMessage);
    } catch (err) {
      console.error("Socket chat error:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket client disconnected:", socket.id);
  });
});

// **Start Server**
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});