const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: false },
  location: { type: String, required: true },


  organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, //implementing the relationship between the event and the user

}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
