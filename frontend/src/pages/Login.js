import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    try {
      setLoading(true);

      const res = await API.post("/auth/login", formData);

      localStorage.setItem("accessToken", res.data.accessToken);

      const payload = JSON.parse(atob(res.data.accessToken.split(".")[1]));

      if (payload.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">

      {/* 🔥 BACKGROUND GLOW */}
      <div className="absolute w-[400px] h-[400px] bg-green-500/20 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
      <div className="absolute w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>

      {/* 🔥 CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-white/10 w-[90%] max-w-md shadow-2xl"
      >

        {/* 🔥 TITLE */}
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Welcome Back 👋
        </h1>

        {/* 🔥 TAGLINE */}
        <p className="text-gray-400 text-center mb-6 text-sm">
          Track every rupee. Control your future.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* EMAIL */}
<input
  type="email"
  name="email"
  placeholder="Enter your email"
  value={formData.email}
  onChange={handleChange}
  autoComplete="off"
  required
  className="w-full p-3 rounded-lg bg-black/40 text-white border border-white/10"
/>

{/* PASSWORD */}
<input
  type="password"
  name="password"
  placeholder="Enter your password"
  value={formData.password}
  onChange={handleChange}
  autoComplete="new-password"
  required
  className="w-full p-3 rounded-lg bg-black/40 text-white border border-white/10"
/>

          {/* BUTTON */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 py-3 rounded-lg font-semibold text-black shadow-lg hover:shadow-green-500/30 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>

        </form>

        {/* REGISTER */}
        <p className="text-gray-400 text-center mt-5 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-green-400 hover:underline">
            Register
          </Link>
        </p>

      </motion.div>

    </div>
  );
}