import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, MapPin, Users, Tag, Plus, Check, X, FileText, Image as ImageIcon } from "lucide-react";
import API_BASE from "../config";

const OrganizerDashboard = ({ token, user }) => {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "Conference",
    maxCapacity: 100,
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [activeTab, setActiveTab] = useState("events"); // events or bookings

  useEffect(() => {
    fetchOrganizerData();
  }, [token]);

  const fetchOrganizerData = async () => {
    try {
      // Fetch events
      const eventsRes = await axios.get(`${API_BASE}/api/events`);
      // Filter events where organizer._id is this user's id
      const filteredEvents = eventsRes.data.filter(
        (evt) => evt.organizer?._id === (user?.id || user?._id)
      );
      setEvents(filteredEvents);

      // Fetch bookings
      const bookingsRes = await axios.get(`${API_BASE}/api/bookings/organizer`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(bookingsRes.data);
    } catch (err) {
      console.error("Error fetching organizer data", err);
    }
  };

  const handleTextChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setUploading(true);

    try {
      let imageUrl = "";
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await axios.post(`${API_BASE}/api/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrl = `${API_BASE}/${uploadRes.data.filePath}`;
      }

      await axios.post(
        `${API_BASE}/api/events`,
        { ...eventData, imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Clear form
      setEventData({
        title: "",
        description: "",
        date: "",
        location: "",
        category: "Conference",
        maxCapacity: 100,
      });
      setFile(null);
      setShowCreateForm(false);
      fetchOrganizerData();
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Failed to create event");
    } finally {
      setUploading(false);
    }
  };

  const handleBookingAction = async (bookingId, action) => {
    try {
      await axios.put(
        `${API_BASE}/api/bookings/${bookingId}`,
        { status: action === "approve" ? "confirmed" : "rejected" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrganizerData();
    } catch (err) {
      console.error("Failed to update booking status", err);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await axios.delete(`${API_BASE}/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrganizerData();
    } catch (err) {
      console.error("Failed to delete event", err);
    }
  };

  return (
    <div className="space-y-8 text-white">
      {/* Header */}
      <div className="flex justify-between items-center bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Organizer Console
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Manage your events, analyze RSVPs, and respond to private booking requests.
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 px-5 rounded-xl transition duration-200 active:scale-95 shadow-lg shadow-violet-600/20"
        >
          <Plus className="w-5 h-5" />
          Create Event
        </button>
      </div>

      {/* Create Event Modal / Form */}
      {showCreateForm && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 relative">
          <button
            onClick={() => setShowCreateForm(false)}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
          <h3 className="text-xl font-bold mb-6 text-violet-400">Create New Event</h3>
          {submitError && (
            <div className="p-3 bg-red-950/40 border border-red-800 text-red-300 rounded-xl mb-4 text-sm">
              {submitError}
            </div>
          )}
          <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 text-xs font-semibold uppercase mb-2">Event Title</label>
              <input
                type="text"
                name="title"
                required
                value={eventData.title}
                onChange={handleTextChange}
                placeholder="e.g. UniteX Dev Summit 2026"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-semibold uppercase mb-2">Category</label>
              <select
                name="category"
                value={eventData.category}
                onChange={handleTextChange}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-violet-500"
              >
                <option value="Conference">Conference</option>
                <option value="Festival">Festival</option>
                <option value="Concert">Concert</option>
                <option value="Wedding">Wedding</option>
                <option value="Birthday">Birthday</option>
                <option value="Corporate">Corporate</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-semibold uppercase mb-2">Date & Time</label>
              <input
                type="datetime-local"
                name="date"
                required
                value={eventData.date}
                onChange={handleTextChange}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-sm text-zinc-400 focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-semibold uppercase mb-2">Location</label>
              <input
                type="text"
                name="location"
                required
                value={eventData.location}
                onChange={handleTextChange}
                placeholder="e.g. San Francisco Tech Center / Remote"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-semibold uppercase mb-2">Max Capacity</label>
              <input
                type="number"
                name="maxCapacity"
                required
                value={eventData.maxCapacity}
                onChange={handleTextChange}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-semibold uppercase mb-2">Event Banner</label>
              <div className="relative flex items-center bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-sm">
                <ImageIcon className="w-5 h-5 text-zinc-500 mr-2" />
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full file:hidden cursor-pointer focus:outline-none text-zinc-400"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-zinc-400 text-xs font-semibold uppercase mb-2">Description</label>
              <textarea
                name="description"
                rows="4"
                value={eventData.description}
                onChange={handleTextChange}
                placeholder="Describe your event agenda, guest speakers, key benefits..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-violet-500"
              ></textarea>
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="py-2.5 px-6 rounded-xl border border-zinc-800 hover:bg-zinc-900 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="py-2.5 px-6 rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold active:scale-95 transition"
              >
                {uploading ? "Uploading..." : "Publish Event"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-zinc-850">
        <button
          onClick={() => setActiveTab("events")}
          className={`pb-4 px-6 font-semibold border-b-2 text-sm transition ${
            activeTab === "events"
              ? "border-violet-500 text-violet-400"
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          My Listed Events ({events.length})
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`pb-4 px-6 font-semibold border-b-2 text-sm transition ${
            activeTab === "bookings"
              ? "border-violet-500 text-violet-400"
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          Private Booking Requests ({bookings.length})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "events" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.length === 0 ? (
            <div className="col-span-full text-center text-zinc-500 py-12">
              You haven't listed any events yet. Click "Create Event" to publish one.
            </div>
          ) : (
            events.map((evt) => (
              <div
                key={evt._id}
                className="relative bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition duration-300 flex flex-col justify-between"
              >
                {evt.imageUrl && (
                  <img
                    src={evt.imageUrl}
                    alt={evt.title}
                    className="w-full h-40 object-cover border-b border-zinc-850"
                  />
                )}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase text-violet-400 tracking-wider mb-2">
                      <Tag className="w-3.5 h-3.5" />
                      {evt.category}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{evt.title}</h3>
                    <p className="text-zinc-400 text-xs line-clamp-3 mb-4">{evt.description}</p>
                    <div className="space-y-2 text-xs text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-zinc-500" />
                        {evt.date ? new Date(evt.date).toLocaleString() : "Date TBD"}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-zinc-500" />
                        {evt.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-zinc-500" />
                        RSVPs: {evt.rsvps?.length || 0} / {evt.maxCapacity}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-6">
                    <button
                      onClick={() => handleDeleteEvent(evt._id)}
                      className="w-full py-2 text-sm bg-red-950/20 border border-red-900/50 hover:bg-red-950/50 text-red-300 font-semibold rounded-xl transition duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center text-zinc-500 py-12">
              No private booking requests received yet.
            </div>
          ) : (
            bookings.map((bk) => (
              <div
                key={bk._id}
                className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold">{bk.eventType}</span>
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                        bk.status === "confirmed"
                          ? "bg-emerald-950/50 border-emerald-800 text-emerald-300"
                          : bk.status === "rejected"
                          ? "bg-red-950/50 border-red-800 text-red-300"
                          : "bg-amber-950/50 border-amber-805 text-amber-300"
                      }`}
                    >
                      {bk.status}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-sm">
                    Inquirer: <span className="text-white font-medium">{bk.clientName}</span> ({bk.clientEmail} | {bk.clientPhone})
                  </p>
                  <p className="text-zinc-400 text-xs">
                    Target Date: <span className="text-white font-medium">{new Date(bk.date).toLocaleDateString()}</span>
                  </p>
                  {bk.description && (
                    <div className="flex items-start gap-2 bg-zinc-900 p-3 rounded-xl max-w-xl text-zinc-300 text-xs">
                      <FileText className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                      <span>{bk.description}</span>
                    </div>
                  )}
                </div>

                {bk.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBookingAction(bk._id, "reject")}
                      className="p-3 bg-red-955/20 border border-red-900/50 hover:bg-red-950 text-red-300 rounded-xl transition duration-200 active:scale-95"
                      title="Decline Request"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleBookingAction(bk._id, "approve")}
                      className="p-3 bg-emerald-955/20 border border-emerald-900/50 hover:bg-emerald-950 text-emerald-300 rounded-xl transition duration-200 active:scale-95"
                      title="Accept Request"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
