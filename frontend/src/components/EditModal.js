import { useState, useEffect } from "react";
import API from "../services/api";
import { motion } from "framer-motion";

export default function EditModal({ isOpen, onClose, transaction, onUpdate }) {

  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    note: "",
  });

  // 🔥 load selected transaction
  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type || "expense",
        amount: transaction.amount || "",
        category: transaction.category || "",
        note: transaction.note || "",
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/transactions/${transaction._id}`, formData);
      onUpdate();
      onClose();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Update failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-black p-6 rounded-2xl w-[90%] max-w-md border border-white/10 shadow-2xl"
      >

        <h2 className="text-white text-xl font-semibold mb-5">
          Edit Transaction
        </h2>

        <form onSubmit={handleUpdate} className="space-y-4">

          {/* TYPE */}
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={`w-full p-3 rounded-lg border outline-none font-semibold
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

          {/* AMOUNT */}
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-white/5 text-white border border-white/10"
          />

          {/* CATEGORY */}
          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-white/5 text-white border border-white/10"
          />

          {/* NOTE */}
          <input
            name="note"
            value={formData.note}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/5 text-white border border-white/10"
          />

          {/* BUTTONS */}
          <div className="flex gap-3 mt-4">

            <button
              type="submit"
              className="flex-1 bg-white text-black py-2 rounded-lg font-semibold"
            >
              Update
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 text-white py-2 rounded-lg"
            >
              Cancel
            </button>

          </div>

        </form>
      </motion.div>
    </div>
  );
}