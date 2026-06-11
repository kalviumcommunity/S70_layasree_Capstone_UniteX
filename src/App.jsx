import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE from "./config";
import { 
  Home, Calendar, MessageSquare, Shield, User, LogOut, Search, MapPin, 
  Tag, Compass, Send, CalendarPlus, X, Users, BookOpen
} from "lucide-react";

import AuthModal from "./components/AuthModal";
import ChatWindow from "./components/ChatWindow";
import CalendarView from "./components/CalendarView";
import PrivateBookingForm from "./components/PrivateBookingForm";
import OrganizerDashboard from "./components/OrganizerDashboard";
import AdminPanel from "./components/AdminPanel";

const App = () => {
  // Navigation state
  const [currentView, setCurrentView] = useState("browse"); // browse, calendar, booking, organizer, admin

  // Auth State
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Search & filter state
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [locationQuery, setLocationQuery] = useState("");

  // Event detail modal state
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rsvpLoading, setRsvpLoading] = useState(false);

  // Load user profile on mount
  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  // Load events
  useEffect(() => {
    fetchEvents();
  }, [searchQuery, selectedCategory, locationQuery]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch (err) {
      console.error("Session expired");
      handleLogout();
    }
  };

  const fetchEvents = async () => {
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory && selectedCategory !== "All") params.category = selectedCategory;
      if (locationQuery) params.location = locationQuery;

      const res = await axios.get(`${API_BASE}/api/events`, { params });
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to fetch events", err);
    }
  };

  const handleAuthSuccess = (newToken, authUser) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(authUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setCurrentView("browse");
  };

  const toggleRSVP = async (eventId) => {
    if (!token) {
      setShowAuthModal(true);
      return;
    }
    setRsvpLoading(true);
    try {
      await axios.post(`${API_BASE}/api/events/${eventId}/rsvp`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh event detail state
      const updatedEventRes = await axios.get(`${API_BASE}/api/events/${eventId}`);
      setSelectedEvent(updatedEventRes.data);
      // Refresh event lists
      fetchEvents();
    } catch (err) {
      console.error("Failed to RSVP", err);
    } finally {
      setRsvpLoading(false);
    }
  };

  const getGoogleCalendarUrl = (evt) => {
    const title = encodeURIComponent(evt.title);
    const desc = encodeURIComponent(evt.description || "");
    const loc = encodeURIComponent(evt.location || "");
    const eventDate = evt.date ? new Date(evt.date) : new Date();
    const startDateStr = eventDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endDate = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000);
    const endDateStr = endDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateStr}/${endDateStr}&details=${desc}&location=${loc}`;
  };

  const categories = ["All", "Conference", "Festival", "Concert", "Wedding", "Birthday", "Corporate", "Other"];

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-violet-600 selection:text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col justify-between py-6 px-4 shrink-0">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-650 flex items-center justify-center shadow-lg shadow-violet-650/30">
              <span className="font-extrabold text-xl text-white tracking-tighter">U</span>
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tight text-white leading-none">
                Unite<span className="text-violet-400">X</span>
              </h1>
              <span className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase">Event Suite</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => setCurrentView("browse")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                currentView === "browse"
                  ? "bg-zinc-900 text-white border border-zinc-800"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/40"
              }`}
            >
              <Compass className="w-5 h-5 text-violet-400" />
              Discover Events
            </button>
            <button
              onClick={() => setCurrentView("calendar")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                currentView === "calendar"
                  ? "bg-zinc-900 text-white border border-zinc-800"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/40"
              }`}
            >
              <Calendar className="w-5 h-5 text-indigo-400" />
              Event Calendar
            </button>
            <button
              onClick={() => setCurrentView("booking")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                currentView === "booking"
                  ? "bg-zinc-900 text-white border border-zinc-800"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/40"
              }`}
            >
              <BookOpen className="w-5 h-5 text-emerald-400" />
              Private Bookings
            </button>

            {user?.role === "organizer" && (
              <button
                onClick={() => setCurrentView("organizer")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  currentView === "organizer"
                    ? "bg-zinc-900 text-white border border-zinc-800"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/40"
                }`}
              >
                <Users className="w-5 h-5 text-pink-400" />
                Organizer Console
              </button>
            )}

            {user?.role === "admin" && (
              <button
                onClick={() => setCurrentView("admin")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  currentView === "admin"
                    ? "bg-zinc-900 text-white border border-zinc-800"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/40"
                }`}
              >
                <Shield className="w-5 h-5 text-red-400" />
                Admin Panel
              </button>
            )}
          </nav>
        </div>

        {/* Footer Auth Info */}
        <div className="border-t border-zinc-900 pt-4">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-2">
                <div className="w-9 h-9 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-805">
                  <User className="w-4 h-4 text-violet-400" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-white truncate leading-none mb-1">{user.username}</p>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">{user.role}</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-xs font-bold transition duration-200"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full bg-gradient-to-r from-violet-650 to-indigo-650 hover:from-violet-600 hover:to-indigo-600 text-white font-semibold py-3 rounded-xl text-sm shadow-md transition duration-200"
            >
              Sign In / Sign Up
            </button>
          )}
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        {currentView === "browse" && (
          <div className="space-y-8">
            {/* Header & Filter */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-950 p-6 rounded-2xl border border-zinc-900">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-white">Discover Events</h2>
                <p className="text-zinc-500 text-sm mt-1">Explore and attend high-quality private and public gatherings.</p>
              </div>
              {/* Search fields */}
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                  <Search className="absolute left-3 top-3 w-4.5 h-4.5 text-zinc-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search event name..."
                    className="w-full md:w-56 bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-violet-500 transition"
                  />
                </div>
                <div className="relative flex-1 md:flex-none">
                  <MapPin className="absolute left-3 top-3 w-4.5 h-4.5 text-zinc-500" />
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder="Location..."
                    className="w-full md:w-40 bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-violet-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Category selection */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-900">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`py-2 px-4 rounded-xl text-xs font-bold whitespace-nowrap transition duration-200 border ${
                    selectedCategory === cat
                      ? "bg-violet-605/20 border-violet-500 text-violet-400"
                      : "bg-zinc-900/50 border-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Event Cards Grid */}
            {events.length === 0 ? (
              <div className="text-center text-zinc-500 py-16">
                No events found matching your search. Try adjusting filters or create a new event.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((evt) => (
                  <div
                    key={evt._id}
                    className="relative bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden hover:border-zinc-850 hover:shadow-xl transition duration-300 flex flex-col justify-between"
                  >
                    {/* Event Banner */}
                    <div className="relative h-44 w-full bg-gradient-to-br from-indigo-950 to-violet-950 border-b border-zinc-900 flex items-center justify-center overflow-hidden">
                      {evt.imageUrl ? (
                        <img src={evt.imageUrl} alt={evt.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 to-indigo-900/40 backdrop-blur-md flex flex-col justify-center items-center p-4">
                          <Tag className="w-8 h-8 text-violet-405/60 mb-2" />
                          <span className="text-[10px] uppercase font-bold tracking-widest text-violet-400">{evt.category}</span>
                        </div>
                      )}
                      <span className="absolute top-3 right-3 text-[10px] uppercase font-extrabold bg-zinc-950/80 backdrop-blur-sm border border-zinc-800 text-zinc-300 py-1 px-2.5 rounded-full">
                        {evt.category}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{evt.title}</h3>
                        <p className="text-zinc-400 text-xs line-clamp-3 mb-4 leading-relaxed">{evt.description}</p>
                        <div className="space-y-2 text-xs text-zinc-450 border-t border-zinc-900/50 pt-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-zinc-550" />
                            {evt.date ? new Date(evt.date).toLocaleString() : "Date To Be Declared"}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-zinc-550" />
                            {evt.location}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedEvent(evt)}
                        className="w-full mt-6 py-2.5 text-xs font-bold bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-750 rounded-xl transition duration-200 text-center"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentView === "calendar" && (
          <CalendarView events={events} onEventClick={(evt) => setSelectedEvent(evt)} />
        )}

        {currentView === "booking" && (
          <PrivateBookingForm token={token} />
        )}

        {currentView === "organizer" && user?.role === "organizer" && (
          <OrganizerDashboard token={token} user={user} />
        )}

        {currentView === "admin" && user?.role === "admin" && (
          <AdminPanel token={token} />
        )}
      </main>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col md:flex-row max-h-[85vh]">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Column: Details & RSVP */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
              {selectedEvent.imageUrl ? (
                <img
                  src={selectedEvent.imageUrl}
                  alt={selectedEvent.title}
                  className="w-full h-48 object-cover rounded-xl border border-zinc-900"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-violet-950 to-indigo-950 rounded-xl border border-zinc-900 flex items-center justify-center">
                  <Tag className="w-10 h-10 text-violet-400/40" />
                </div>
              )}

              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-violet-400 bg-violet-950/30 border border-violet-900/50 py-1 px-3 rounded-full">
                  {selectedEvent.category}
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-white mt-4">{selectedEvent.title}</h2>
                <p className="text-zinc-400 text-sm mt-3 leading-relaxed whitespace-pre-line">
                  {selectedEvent.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-zinc-900 pt-6 text-xs text-zinc-400">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-5 h-5 text-indigo-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase">Date & Time</p>
                    <p className="text-white font-medium">
                      {selectedEvent.date ? new Date(selectedEvent.date).toLocaleString() : "TBD"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-5 h-5 text-indigo-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase">Location</p>
                    <p className="text-white font-medium">{selectedEvent.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Users className="w-5 h-5 text-indigo-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase">Attendance Capacity</p>
                    <p className="text-white font-medium">
                      {selectedEvent.rsvps?.length || 0} / {selectedEvent.maxCapacity} RSVPs
                    </p>
                  </div>
                </div>
                {selectedEvent.organizer && (
                  <div className="flex items-center gap-2.5">
                    <User className="w-5 h-5 text-indigo-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase">Organizer</p>
                      <p className="text-white font-medium">{selectedEvent.organizer.username}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-zinc-900">
                <button
                  onClick={() => toggleRSVP(selectedEvent._id)}
                  disabled={rsvpLoading}
                  className={`flex-1 py-3 px-5 rounded-xl font-bold text-sm transition active:scale-95 flex items-center justify-center gap-2 ${
                    selectedEvent.rsvps?.some((r) => r._id === (user?.id || user?._id) || r === (user?.id || user?._id))
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                      : "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-605/20"
                  }`}
                >
                  {rsvpLoading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : selectedEvent.rsvps?.some((r) => r._id === (user?.id || user?._id) || r === (user?.id || user?._id)) ? (
                    "Registered (Click to Cancel)"
                  ) : (
                    "RSVP / Register"
                  )}
                </button>
                <a
                  href={getGoogleCalendarUrl(selectedEvent)}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 px-5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:border-zinc-750 text-sm font-bold rounded-xl transition flex items-center justify-center gap-2"
                >
                  <CalendarPlus className="w-4 h-4" />
                  Add to Calendar
                </a>
              </div>
            </div>

            {/* Right Column: Live Chat Room */}
            <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-zinc-900 flex flex-col h-[350px] md:h-auto">
              {token && user ? (
                <ChatWindow eventId={selectedEvent._id} user={user} token={token} />
              ) : (
                <div className="flex-1 flex flex-col justify-center items-center p-6 text-center bg-zinc-950 text-zinc-500 text-xs">
                  <MessageSquare className="w-10 h-10 mb-2 text-zinc-705" />
                  <p>Please log in to participate in the live event chat discussion.</p>
                  <button
                    onClick={() => {
                      setSelectedEvent(null);
                      setShowAuthModal(true);
                    }}
                    className="mt-4 py-2 px-4 bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-800 rounded-xl transition font-semibold"
                  >
                    Log In
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Authentication Dialog */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default App;
