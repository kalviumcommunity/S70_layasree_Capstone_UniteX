const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  clientPhone: { type: String, required: true },
  eventType: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String },
  status: { type: String, enum: ["pending", "confirmed", "rejected"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
