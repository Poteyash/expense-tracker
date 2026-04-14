import { useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";

export default function AddTransaction({ onAdd }) {
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    note: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔥 HANDLE CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // 🔥 FIX: amount → number
      const payload = {
        ...formData,
        amount: Number(formData.amount),
      };

      console.log("SENDING:", payload); // debug

      await API.post("/transactions", payload);

      // 🔥 RESET FORM
      setFormData({
        type: "expense",
        amount: "",
        category: "",
        note: "",
      });

      // 🔥 REFRESH DASHBOARD
      if (onAdd) onAdd();

    } catch (err) {
      console.error("ADD ERROR:", err.response?.data || err.message);

      alert(
        err.response?.data?.error ||
        err.response?.data?.msg ||
        err.message ||
        "Something went wrong"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-black/60 backdrop-blur-xl p-5 md:p-6 rounded-2xl border border-white/10 shadow-xl"
    >
      <h2 className="text-white text-lg md:text-xl font-semibold mb-5">
        Add Transaction
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* 🔥 TYPE */}
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className={`w-full p-3 rounded-lg border outline-none transition font-semibold
            ${formData.type === "income"
              ? "bg-green-500/20 text-green-400 border-green-400"
              : "bg-amber-500/20 text-amber-400 border-amber-400"
            }`}
        >
          <option value="expense" className="bg-black text-amber-400">
            Expense 💸
          </option>
          <option value="income" className="bg-black text-green-400">
            Income 💰
          </option>
        </select>

        {/* 🔥 AMOUNT */}
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          min="1"
          required
          className="w-full p-3 rounded-lg bg-white/5 text-white placeholder-gray-400 border border-white/10 focus:ring-1 focus:ring-green-400 outline-none"
        />

        {/* 🔥 CATEGORY */}
        <input
          name="category"
          placeholder="Category (e.g. food, petrol)"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg bg-white/5 text-white placeholder-gray-400 border border-white/10 focus:ring-1 focus:ring-blue-400 outline-none"
        />

        {/* 🔥 NOTE */}
        <input
          name="note"
          placeholder="Note (optional)"
          value={formData.note}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-white/5 text-white placeholder-gray-400 border border-white/10 focus:ring-1 focus:ring-purple-400 outline-none"
        />

        {/* 🔥 BUTTON */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          {loading ? "Adding..." : "Add Transaction"}
        </motion.button>

      </form>
    </motion.div>
  );
}