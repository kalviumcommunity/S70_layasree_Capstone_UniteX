import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users, Calendar, Trash2, ShieldAlert } from "lucide-react";

const AdminPanel = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      // Fetch users
      const usersRes = await axios.get("http://localhost:5000/api/users", { headers });
      setUsers(usersRes.data);

      // Fetch events
      const eventsRes = await axios.get("http://localhost:5000/api/events");
      setEvents(eventsRes.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? All their events, bookings, and chat history will be deleted.")) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to moderate (delete) this event?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (err) {
      setError("Failed to delete event");
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 text-white space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <ShieldAlert className="w-8 h-8 text-red-500" />
        <div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-zinc-400 text-xs mt-0.5">Moderate system content, manage accounts, and view statistics.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-95/40 border border-red-800 text-red-300 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 gap-4">
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 pb-3 px-4 font-semibold text-sm border-b-2 transition ${
            activeTab === "users"
              ? "border-red-500 text-red-400"
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          <Users className="w-4 h-4" />
          Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab("events")}
          className={`flex items-center gap-2 pb-3 px-4 font-semibold text-sm border-b-2 transition ${
            activeTab === "events"
              ? "border-red-500 text-red-400"
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          <Calendar className="w-4 h-4" />
          Events ({events.length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-zinc-400">Loading data...</div>
      ) : activeTab === "users" ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Created At</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-zinc-900 hover:bg-zinc-900/50 text-sm">
                  <td className="py-3 px-4 font-medium">{u.username}</td>
                  <td className="py-3 px-4 text-zinc-400">{u.email}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                        u.role === "admin"
                          ? "bg-red-950/50 border-red-800 text-red-300"
                          : u.role === "organizer"
                          ? "bg-violet-950/50 border-violet-800 text-violet-300"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-zinc-450 text-xs">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {u.role !== "admin" && (
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-950/20 border border-transparent hover:border-red-900/40 rounded-lg transition"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Organizer</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((evt) => (
                <tr key={evt._id} className="border-b border-zinc-900 hover:bg-zinc-900/50 text-sm">
                  <td className="py-3 px-4 font-medium">{evt.title}</td>
                  <td className="py-3 px-4 text-zinc-400">
                    {evt.organizer ? evt.organizer.username : "Unknown"}
                  </td>
                  <td className="py-3 px-4 text-zinc-400">{evt.location}</td>
                  <td className="py-3 px-4 text-zinc-450 text-xs">
                    {evt.date ? new Date(evt.date).toLocaleDateString() : "TBD"}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDeleteEvent(evt._id)}
                      className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-955/20 border border-transparent hover:border-red-900/40 rounded-lg transition"
                      title="Moderate/Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
