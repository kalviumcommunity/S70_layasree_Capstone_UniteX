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
import LandingPage from "./components/LandingPage";

const App = () => {
  // Landing page state
  const [showLanding, setShowLanding] = useState(!localStorage.getItem("token"));

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
    setShowLanding(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setCurrentView("browse");
    setShowLanding(true);
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

  // Category → relevant image mapping (Unsplash CDN, no API key required)
  const categoryImages = {
    Conference: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
    Festival:   "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80",
    Concert:    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&q=80",
    Wedding:    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80",
    Birthday:   "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&q=80",
    Corporate:  "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&q=80",
    Other:      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&q=80",
  };

  if (showLanding) {
    return (
      <LandingPage
        onEnter={() => setShowLanding(false)}
        onSignIn={() => {
          setShowLanding(false);
          setShowAuthModal(true);
        }}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-violet-600 selection:text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col justify-between h-screen sticky top-0 py-6 px-4 shrink-0 selection:bg-violet-600 overflow-y-auto">
        <div className="flex flex-col w-full">
          {/* Logo Header (Separated Card) */}
          <div 
            onClick={() => setShowLanding(true)}
            className="flex items-center justify-between pb-5 border-b border-zinc-900 px-2 cursor-pointer group mb-40"
            title="Click to view Landing Page"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-600/30 ring-1 ring-white/10 group-hover:scale-105 transition-transform">
                <span className="font-black text-xl text-white tracking-tighter">U</span>
              </div>
              <div>
                <h1 className="font-black text-xl tracking-tight text-white leading-none">
                  Unite<span className="text-violet-400">X</span>
                </h1>
                <span className="text-[10px] text-violet-400/80 font-extrabold tracking-widest uppercase mt-1 block">
                  EVENT SUITE
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links — Distinct Styled Button Tabs */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2 block">
              Navigation
            </span>
            <nav className="space-y-2.5">
              {/* Discover Events Button */}
              <button
                onClick={() => setCurrentView("browse")}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition duration-200 cursor-pointer border ${
                  currentView === "browse"
                    ? "bg-gradient-to-r from-violet-600/20 to-purple-600/10 border-violet-500/80 text-white shadow-lg shadow-violet-600/10"
                    : "bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-900 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${currentView === "browse" ? "bg-violet-600 text-white" : "bg-zinc-800 text-violet-400"}`}>
                    <Compass className="w-4 h-4" />
                  </div>
                  <span>Discover Events</span>
                </div>
                {currentView === "browse" && (
                  <span className="w-2 h-2 rounded-full bg-violet-400 shadow-sm shadow-violet-400"></span>
                )}
              </button>

              {/* Event Calendar Button */}
              <button
                onClick={() => setCurrentView("calendar")}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition duration-200 cursor-pointer border ${
                  currentView === "calendar"
                    ? "bg-gradient-to-r from-indigo-600/20 to-blue-600/10 border-indigo-500/80 text-white shadow-lg shadow-indigo-600/10"
                    : "bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-900 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${currentView === "calendar" ? "bg-indigo-600 text-white" : "bg-zinc-800 text-indigo-400"}`}>
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span>Event Calendar</span>
                </div>
                {currentView === "calendar" && (
                  <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400"></span>
                )}
              </button>

              {/* Private Bookings Button */}
              <button
                onClick={() => setCurrentView("booking")}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition duration-200 cursor-pointer border ${
                  currentView === "booking"
                    ? "bg-gradient-to-r from-emerald-600/20 to-teal-600/10 border-emerald-500/80 text-white shadow-lg shadow-emerald-600/10"
                    : "bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-900 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${currentView === "booking" ? "bg-emerald-600 text-white" : "bg-zinc-800 text-emerald-400"}`}>
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span>Private Bookings</span>
                </div>
                {currentView === "booking" && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span>
                )}
              </button>

              {/* Organizer Console Button */}
              {user?.role === "organizer" && (
                <button
                  onClick={() => setCurrentView("organizer")}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition duration-200 cursor-pointer border ${
                    currentView === "organizer"
                      ? "bg-gradient-to-r from-pink-600/20 to-rose-600/10 border-pink-500/80 text-white shadow-lg shadow-pink-600/10"
                      : "bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-900 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${currentView === "organizer" ? "bg-pink-600 text-white" : "bg-zinc-800 text-pink-400"}`}>
                      <Users className="w-4 h-4" />
                    </div>
                    <span>Organizer Console</span>
                  </div>
                  {currentView === "organizer" && (
                    <span className="w-2 h-2 rounded-full bg-pink-400 shadow-sm shadow-pink-400"></span>
                  )}
                </button>
              )}

              {/* Admin Panel Button */}
              {user?.role === "admin" && (
                <button
                  onClick={() => setCurrentView("admin")}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition duration-200 cursor-pointer border ${
                    currentView === "admin"
                      ? "bg-gradient-to-r from-red-600/20 to-rose-600/10 border-red-500/80 text-white shadow-lg shadow-red-600/10"
                      : "bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-900 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${currentView === "admin" ? "bg-red-600 text-white" : "bg-zinc-800 text-red-400"}`}>
                      <Shield className="w-4 h-4" />
                    </div>
                    <span>Admin Panel</span>
                  </div>
                  {currentView === "admin" && (
                    <span className="w-2 h-2 rounded-full bg-red-400 shadow-sm shadow-red-400"></span>
                  )}
                </button>
              )}
            </nav>
          </div>
        </div>

        {/* Account / Auth CTA Button */}
        <div className="border-t border-zinc-900 pt-5">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {user.username?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-white truncate leading-none mb-1">{user.username}</p>
                  <span className="text-[9px] text-violet-400 bg-violet-950/60 border border-violet-800/40 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    {user.role}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700 text-xs font-bold transition duration-200 cursor-pointer text-zinc-300 hover:text-white"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl text-xs shadow-lg shadow-violet-600/25 active:scale-[0.98] transition duration-200 cursor-pointer"
            >
              <User className="w-4 h-4" />
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
              <div className="flex flex-wrap gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none flex items-center">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none z-10" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search event name..."
                    style={{ paddingLeft: "2.75rem" }}
                    className="w-full md:w-60 bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
                  />
                </div>
                <div className="relative flex-1 md:flex-none flex items-center">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none z-10" />
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder="Location..."
                    style={{ paddingLeft: "2.75rem" }}
                    className="w-full md:w-44 bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
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
                    <div className="relative h-44 w-full border-b border-zinc-900 flex items-center justify-center overflow-hidden bg-zinc-900">
                      <img
                        src={evt.imageUrl || categoryImages[evt.category] || "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&q=80"}
                        alt={evt.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
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
