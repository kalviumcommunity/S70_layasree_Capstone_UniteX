import React, { useEffect, useState } from "react";
import axios from "axios";

function EventList() {
  const [events, setEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [updatedEvent, setUpdatedEvent] = useState({ title: "", description: "" });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await axios.get("http://localhost:5000/api/events");
    setEvents(res.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/events/${id}`);
    fetchEvents();
  };

  const startEdit = (event) => {
    setEditingId(event._id);
    setUpdatedEvent({ title: event.title, description: event.description });
  };

  const handleUpdate = async () => {
    await axios.put(`http://localhost:5000/api/events/${editingId}`, updatedEvent);
    setEditingId(null);
    setUpdatedEvent({ title: "", description: "" });
    fetchEvents();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Events</h2>
      {events.map((event) => (
        <div key={event._id} className="border p-2 mb-2 rounded bg-white">
          {editingId === event._id ? (
            <>
              <input
                type="text"
                value={updatedEvent.title}
                onChange={(e) => setUpdatedEvent({ ...updatedEvent, title: e.target.value })}
                className="border p-1 mr-2"
              />
              <input
                type="text"
                value={updatedEvent.description}
                onChange={(e) => setUpdatedEvent({ ...updatedEvent, description: e.target.value })}
                className="border p-1 mr-2"
              />
              <button onClick={handleUpdate} className="bg-blue-500 text-white px-2 py-1 rounded">Save</button>
            </>
          ) : (
            <>
              <h3 className="text-lg">{event.title}</h3>
              <p>{event.description}</p>
              <button onClick={() => startEdit(event)} className="text-blue-500 mr-2">Edit</button>
              <button onClick={() => handleDelete(event._id)} className="text-red-500">Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default EventList;
