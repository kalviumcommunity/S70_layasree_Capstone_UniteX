import React, { useState, useEffect } from "react";
import axios from "axios";
import { Mail, User, Phone, Calendar, Briefcase, FileText, Sparkles } from "lucide-react";
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
    <div className="w-full max-w-4xl mx-auto bg-zinc-950 border border-zinc-900 rounded-2xl p-6 md:p-10 text-white shadow-2xl relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="mb-8 border-b border-zinc-900 pb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/40 border border-violet-800/40 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Direct Organizer Booking
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white">
            Private Event Booking Request
          </h2>
          <p className="text-zinc-400 text-sm mt-1.5 leading-relaxed">
            Directly request event hosting from professional organizers (Weddings, Birthdays, Corporate, etc.).
          </p>
        </div>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-xl text-sm mb-6 border font-medium ${
            message.isError
              ? "bg-red-950/40 border-red-800 text-red-300"
              : "bg-emerald-950/40 border-emerald-800 text-emerald-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Organizer Selector */}
          <div className="md:col-span-2">
            <label className="block text-zinc-300 text-xs font-bold uppercase tracking-wider mb-2">
              Select Organizer
            </label>
            <div className="relative">
              <select
                name="organizerId"
                value={formData.organizerId}
                onChange={handleChange}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition duration-200"
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
          </div>

          {/* Client Name */}
          <div>
            <label className="block text-zinc-300 text-xs font-bold uppercase tracking-wider mb-2">
              Your Name
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none z-10" />
              <input
                type="text"
                name="clientName"
                required
                value={formData.clientName}
                onChange={handleChange}
                placeholder="John Doe"
                style={{ paddingLeft: "2.75rem" }}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition duration-200"
              />
            </div>
          </div>

          {/* Client Email */}
          <div>
            <label className="block text-zinc-300 text-xs font-bold uppercase tracking-wider mb-2">
              Your Email
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none z-10" />
              <input
                type="email"
                name="clientEmail"
                required
                value={formData.clientEmail}
                onChange={handleChange}
                placeholder="john@example.com"
                style={{ paddingLeft: "2.75rem" }}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition duration-200"
              />
            </div>
          </div>

          {/* Client Phone */}
          <div>
            <label className="block text-zinc-300 text-xs font-bold uppercase tracking-wider mb-2">
              Phone Number
            </label>
            <div className="relative flex items-center">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none z-10" />
              <input
                type="tel"
                name="clientPhone"
                required
                value={formData.clientPhone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                style={{ paddingLeft: "2.75rem" }}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition duration-200"
              />
            </div>
          </div>

          {/* Event Date */}
          <div>
            <label className="block text-zinc-300 text-xs font-bold uppercase tracking-wider mb-2">
              Preferred Date
            </label>
            <div className="relative flex items-center">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none z-10" />
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                style={{ paddingLeft: "2.75rem" }}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pr-4 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition duration-200"
              />
            </div>
          </div>

          {/* Event Type */}
          <div className="md:col-span-2">
            <label className="block text-zinc-300 text-xs font-bold uppercase tracking-wider mb-2">
              Event Type
            </label>
            <div className="relative flex items-center">
              <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none z-10" />
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                style={{ paddingLeft: "2.75rem" }}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pr-4 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition duration-200"
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
            <label className="block text-zinc-300 text-xs font-bold uppercase tracking-wider mb-2">
              Event Details & Requirements
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400 pointer-events-none z-10" />
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us about the estimated guest count, theme, audio-visual needs, or caterers..."
                style={{ paddingLeft: "2.75rem" }}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition duration-200"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-violet-600/20 active:scale-[0.98] transition duration-200 flex items-center justify-center cursor-pointer"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Send Booking Inquiry"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PrivateBookingForm;
