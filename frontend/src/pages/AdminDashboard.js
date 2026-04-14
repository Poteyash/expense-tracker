import { useEffect, useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";

export default function AdminDashboard() {

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalIncome: 0,
    totalExpense: 0
  });

  // 🔥 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  };

  // 🔥 LOAD DATA
  const loadData = async () => {
    try {
      const res1 = await API.get("/admin/users");
      const res2 = await API.get("/admin/stats");

      setUsers(res1.data);
      setStats(res2.data);

    } catch (err) {
      console.log("Admin Error:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 🔥 DELETE USER
  const handleDelete = async (id) => {
    try {
      await API.delete(`/admin/user/${id}`);
      loadData();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-10">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center">

        <h1 className="text-2xl font-bold">Admin Panel 🔥</h1>

        <motion.button
  whileTap={{ scale: 0.95 }}
  onClick={handleLogout}
  className="relative overflow-hidden px-5 py-2 rounded-lg font-semibold text-white bg-red-500 group"
>
  <span className="relative z-10">Logout 🚪</span>

  <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-500 
                   translate-x-[-100%] group-hover:translate-x-0 
                   transition duration-300"></span>
</motion.button>

      </div>

      {/* 🔥 STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white/5 p-5 rounded-xl border border-white/10">
          <p className="text-gray-400">Users</p>
          <h2 className="text-xl font-bold">{stats.totalUsers}</h2>
        </div>

        <div className="bg-white/5 p-5 rounded-xl border border-white/10">
          <p className="text-gray-400">Income</p>
          <h2 className="text-green-400 text-xl font-bold">
            ₹{stats.totalIncome}
          </h2>
        </div>

        <div className="bg-white/5 p-5 rounded-xl border border-white/10">
          <p className="text-gray-400">Expense</p>
          <h2 className="text-amber-400 text-xl font-bold">
            ₹{stats.totalExpense}
          </h2>
        </div>

      </div>

      {/* 🔥 USERS LIST */}
      <div className="bg-white/5 p-5 rounded-xl border border-white/10">

        <h2 className="text-lg font-semibold mb-4">All Users</h2>

        <div className="space-y-3">

          {users.map((user) => (
            <div
              key={user._id}
              className="flex justify-between items-center bg-black/40 p-3 rounded-lg"
            >
              <span>{user.email}</span>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleDelete(user._id)}
                className="bg-red-500 px-3 py-1 rounded-md hover:bg-red-600"
              >
                Delete
              </motion.button>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}