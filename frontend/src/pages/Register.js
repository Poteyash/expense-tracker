import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { motion } from "framer-motion";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match ❌");
    }

    try {
      setLoading(true);

      await API.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      alert("Registration successful ✅");

      navigate("/");

    } catch (err) {
      alert(err.response?.data?.msg || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">

      {/* 🔥 BACKGROUND GLOW */}
      <div className="absolute w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
      <div className="absolute w-[400px] h-[400px] bg-green-500/20 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>

      {/* 🔥 CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-white/10 w-[90%] max-w-md shadow-2xl"
      >

        {/* 🔥 TITLE */}
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Create Account 🚀
        </h1>

        {/* 🔥 TAGLINE */}
        <p className="text-gray-400 text-center mb-6 text-sm">
          Start your financial journey today.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NAME */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-black/40 text-white border border-white/10 focus:ring-2 focus:ring-purple-400 outline-none transition"
          />

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-black/40 text-white border border-white/10 focus:ring-2 focus:ring-green-400 outline-none transition"
          />

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-black/40 text-white border border-white/10 focus:ring-2 focus:ring-blue-400 outline-none transition"
          />

          {/* CONFIRM PASSWORD */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-black/40 text-white border border-white/10 focus:ring-2 focus:ring-pink-400 outline-none transition"
          />

          {/* BUTTON */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-400 to-green-500 py-3 rounded-lg font-semibold text-black shadow-lg hover:shadow-purple-500/30 transition"
          >
            {loading ? "Creating..." : "Register"}
          </motion.button>

        </form>

        {/* LOGIN LINK */}
        <p className="text-gray-400 text-center mt-5 text-sm">
          Already have an account?{" "}
          <Link to="/" className="text-green-400 hover:underline">
            Login
          </Link>
        </p>

      </motion.div>

    </div>
  );
}