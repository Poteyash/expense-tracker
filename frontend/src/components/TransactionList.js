import { useEffect, useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";

export default function TransactionList({ refresh, onUpdate }) {
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState(null);

  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    note: "",
  });

  // 🔥 FETCH DATA
  const fetchData = async () => {
    try {
      const res = await API.get("/transactions");
      setData(res.data);
    } catch (err) {
      console.log("FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  // 🔥 DELETE
  const handleDelete = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      fetchData();

      if (onUpdate) onUpdate(); // 🔥 REAL-TIME REFRESH
    } catch {
      alert("Delete failed");
    }
  };

  // 🔥 OPEN EDIT
  const openEdit = (t) => {
    setEditing(t);
    setFormData({
      type: t.type,
      amount: t.amount,
      category: t.category,
      note: t.note || "",
    });
  };

  // 🔥 HANDLE CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 UPDATE
  const handleUpdate = async () => {
    try {
      await API.put(`/transactions/${editing._id}`, {
        ...formData,
        amount: Number(formData.amount),
      });

      setEditing(null);
      fetchData();

      if (onUpdate) onUpdate(); // 🔥 REAL-TIME REFRESH
    } catch {
      alert("Update failed");
    }
  };

  return (
    <div className="mt-6">

      <h2 className="text-white text-xl font-semibold mb-4">
        Transactions
      </h2>

      {data.length === 0 ? (
        <p className="text-gray-400">No transactions yet</p>
      ) : (
        data.map((t) => (
          <motion.div
            key={t._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/50 backdrop-blur-xl border border-white/10 p-4 rounded-xl mb-3 flex justify-between items-center"
          >
            <div>
              <p className="text-white font-medium">
                {t.category}
              </p>
              <p className="text-sm text-gray-400">
                ₹{t.amount} • {t.type}
              </p>
            </div>

            <div className="flex gap-2">

              <button
                onClick={() => openEdit(t)}
                className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg hover:bg-blue-500/30 transition"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(t._id)}
                className="bg-red-500/20 text-red-400 px-3 py-1 rounded-lg hover:bg-red-500/30 transition"
              >
                Delete
              </button>

            </div>
          </motion.div>
        ))
      )}

      {/* 🔥 EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-black/70 backdrop-blur-xl p-6 rounded-2xl border border-white/10 w-80"
          >

            <h2 className="text-white text-lg mb-4">
              Edit Transaction
            </h2>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 mb-2 bg-white/10 text-white rounded"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <input
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Amount"
              className="w-full p-2 mb-2 bg-white/10 text-white rounded"
            />

            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
              className="w-full p-2 mb-2 bg-white/10 text-white rounded"
            />

            <input
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Note"
              className="w-full p-2 mb-2 bg-white/10 text-white rounded"
            />

            <div className="flex justify-between mt-3">

              <button
                onClick={handleUpdate}
                className="bg-green-500 px-3 py-1 rounded text-white"
              >
                Update
              </button>

              <button
                onClick={() => setEditing(null)}
                className="bg-gray-400 px-3 py-1 rounded"
              >
                Cancel
              </button>

            </div>

          </motion.div>
        </div>
      )}

    </div>
  );
}