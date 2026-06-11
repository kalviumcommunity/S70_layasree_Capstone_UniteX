import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { Send, MessageSquare } from "lucide-react";
import API_BASE from "../config";

const ChatWindow = ({ eventId, user, token }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [socket, setSocket] = useState(null);
  const chatEndRef = useRef(null);

  // 1. Fetch previous messages and setup socket
  useEffect(() => {
    if (!eventId || !token) return;

    // Fetch message history from REST API
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/messages/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to load chat history", err);
      }
    };
    fetchHistory();

    // Connect socket
    const newSocket = io(API_BASE);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("joinEventRoom", { eventId });
    });

    newSocket.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [eventId, token]);

  // 2. Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !socket || !user) return;

    socket.emit("sendMessage", {
      eventId,
      userId: user.id || user._id,
      username: user.username,
      text: inputText.trim()
    });

    setInputText("");
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden text-white">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border-b border-zinc-800">
        <MessageSquare className="w-5 h-5 text-violet-400" />
        <div>
          <h3 className="font-semibold text-sm">Live Discussion</h3>
          <p className="text-zinc-500 text-xs">Real-time attendee chat</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[300px]">
        {messages.length === 0 ? (
          <div className="text-center text-zinc-500 py-8 text-sm">
            No messages yet. Say hello!
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.user === (user?.id || user?._id);
            return (
              <div
                key={msg._id || index}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <span className="text-[10px] text-zinc-500 mb-1 px-1">
                  {isMe ? "You" : msg.username}
                </span>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                    isMe
                      ? "bg-violet-600 text-white rounded-tr-none"
                      : "bg-zinc-800 text-zinc-200 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 bg-zinc-900 border-t border-zinc-800 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-violet-500 transition"
        />
        <button
          type="submit"
          className="bg-violet-650 hover:bg-violet-600 text-white p-2 rounded-xl active:scale-95 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
