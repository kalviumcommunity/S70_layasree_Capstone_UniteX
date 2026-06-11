const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: false },
  location: { type: String, required: true },
  category: { type: String, enum: ["Conference", "Festival", "Concert", "Wedding", "Birthday", "Corporate", "Other"], default: "Other" },
  imageUrl: { type: String, default: "" },
  maxCapacity: { type: Number, default: 100 },
  rsvps: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, //implementing the relationship between the event and the user
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
