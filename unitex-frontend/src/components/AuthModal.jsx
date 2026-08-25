import React, { useState } from "react";
import axios from "axios";
import { X, Lock, Mail, User as UserIcon } from "lucide-react";
import API_BASE from "../config";

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("user");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = isLogin
        ? `${API_BASE}/api/auth/login`
        : `${API_BASE}/api/auth/register`;

      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : { username: formData.username, email: formData.email, password: formData.password, role };

      const res = await axios.post(url, payload);

      if (isLogin) {
        onAuthSuccess(res.data.token, res.data.user);
        onClose();
      } else {
        setIsLogin(true);
        setError("Account created! Please log in.");
      }
    } catch (err) {
      setError(
        err.response?.data?.error || err.response?.data?.message || "Authentication failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl p-8 text-white">
        
        {/* Ambient background light */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-violet-600/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition duration-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            {isLogin ? "Welcome Back" : "Join UniteX"}
          </h2>
          <p className="text-zinc-400 text-sm mt-2">
            {isLogin ? "Log in to manage and join events" : "Create an account to get started"}
          </p>
        </div>

        {error && (
          <div className={`p-3 rounded-xl text-sm mb-4 border font-medium ${error.includes("created") ? "bg-emerald-950/50 border-emerald-800 text-emerald-300" : "bg-red-950/50 border-red-800 text-red-300"}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-zinc-300 text-xs font-bold uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative flex items-center">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none z-10" />
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  style={{ paddingLeft: "2.75rem" }}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition duration-200"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-zinc-300 text-xs font-bold uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none z-10" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                style={{ paddingLeft: "2.75rem" }}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 text-xs font-bold uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none z-10" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={{ paddingLeft: "2.75rem" }}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition duration-200"
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-zinc-300 text-xs font-bold uppercase tracking-wider mb-2">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("user")}
                  className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition duration-200 cursor-pointer ${
                    role === "user"
                      ? "bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-600/20"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  Attendee
                </button>
                <button
                  type="button"
                  onClick={() => setRole("organizer")}
                  className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition duration-200 cursor-pointer ${
                    role === "organizer"
                      ? "bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-600/20"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  Organizer
                </button>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-violet-600/20 active:scale-[0.98] transition duration-200 flex items-center justify-center cursor-pointer"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-zinc-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-violet-400 hover:text-violet-300 font-semibold underline transition duration-200 cursor-pointer"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
