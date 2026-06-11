import React, { useState, useEffect } from "react";
import axios from "axios";
import { Mail, User, Phone, Calendar, Briefcase, FileText } from "lucide-react";
import API_BASE from "../config";

const PrivateBookingForm = ({ token }) => {
  const [organizers, setOrganizers] = useState([]);
  const [formData, setFormData] = useState({
    organizerId: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    eventType: "Corporate",
    date: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", isError: false });

  // Load organizers on mount
  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        // Fetch all events and extract unique organizers, or we can fetch all users with organizer role.
        // Wait, how do we find organizers? Let's search by looking up events or fetch all users and filter role === organizer.
        // Let's call GET /api/events to see who has organized events, or we can query our users list (if admin, but here we can query /api/events which is public and extract the organizers).
        const res = await axios.get(`${API_BASE}/api/events`);
        const uniqueOrgs = [];
        const seen = new Set();
        res.data.forEach((evt) => {
          if (evt.organizer && !seen.has(evt.organizer._id)) {
            seen.add(evt.organizer._id);
            uniqueOrgs.push(evt.organizer);
          }
        });
        setOrganizers(uniqueOrgs);
        if (uniqueOrgs.length > 0) {
          setFormData((prev) => ({ ...prev, organizerId: uniqueOrgs[0]._id }));
        }
      } catch (err) {
        console.error("Failed to load organizers", err);
      }
    };
    fetchOrganizers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setMessage({ text: "Please log in to submit a booking request.", isError: true });
      return;
    }
    if (!formData.organizerId) {
      setMessage({ text: "Please select an organizer.", isError: true });
      return;
    }

    setLoading(true);
    setMessage({ text: "", isError: false });

    try {
      await axios.post(`${API_BASE}/api/bookings`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ text: "Your booking request has been submitted successfully!", isError: false });
      // Reset some fields
      setFormData((prev) => ({
        ...prev,
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        date: "",
        description: "",
      }));
    } catch (err) {
      setMessage({
        text: err.response?.data?.error || "Failed to submit booking request. Try again.",
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-zinc-950 border border-zinc-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
          Private Event Booking Request
        </h2>
        <p className="text-zinc-400 text-sm mt-1">
          Directly request event hosting from professional organizers (Weddings, Birthdays, Corporate, etc.).
        </p>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-xl text-sm mb-6 border ${
            message.isError
              ? "bg-red-950/40 border-red-800 text-red-300"
              : "bg-emerald-950/40 border-emerald-800 text-emerald-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Organizer Selector */}
          <div className="md:col-span-2">
            <label className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Select Organizer
            </label>
            <select
              name="organizerId"
              value={formData.organizerId}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-indigo-500 transition duration-200"
            >
              {organizers.length === 0 ? (
                <option value="">No organizers available (Create events first)</option>
              ) : (
                organizers.map((org) => (
                  <option key={org._id} value={org._id}>
                    {org.username} ({org.email})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Client Name */}
          <div>
            <label className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Your Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-4.5 h-4.5 text-zinc-500" />
              <input
                type="text"
                name="clientName"
                required
                value={formData.clientName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition duration-200"
              />
            </div>
          </div>

          {/* Client Email */}
          <div>
            <label className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Your Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4.5 h-4.5 text-zinc-500" />
              <input
                type="email"
                name="clientEmail"
                required
                value={formData.clientEmail}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition duration-200"
              />
            </div>
          </div>

          {/* Client Phone */}
          <div>
            <label className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 w-4.5 h-4.5 text-zinc-500" />
              <input
                type="tel"
                name="clientPhone"
                required
                value={formData.clientPhone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition duration-200"
              />
            </div>
          </div>

          {/* Event Date */}
          <div>
            <label className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Preferred Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3.5 w-4.5 h-4.5 text-zinc-500" />
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition duration-200 text-zinc-350"
              />
            </div>
          </div>

          {/* Event Type */}
          <div className="md:col-span-2">
            <label className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Event Type
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3.5 w-4.5 h-4.5 text-zinc-500" />
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition duration-200"
              >
                <option value="Wedding">Wedding</option>
                <option value="Birthday">Birthday Party</option>
                <option value="Corporate">Corporate Gathering</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Other">Other Event</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Event Details & Requirements
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4.5 h-4.5 text-zinc-500" />
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us about the estimated guest count, theme, audio-visual needs, or caterers..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition duration-200"
              ></textarea>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition duration-200 flex items-center justify-center"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            "Send Booking Inquiry"
          )}
        </button>
      </form>
    </div>
  );
};

export default PrivateBookingForm;
