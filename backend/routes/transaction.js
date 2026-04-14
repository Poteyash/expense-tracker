const router = require("express").Router();
const Transaction = require("../models/Transaction");
const auth = require("../middleware/auth");

// 🔥 ADD TRANSACTION
router.post("/", auth, async (req, res) => {
  try {
    const { type, amount, category, note } = req.body;

    // ✅ VALIDATION
    if (!type || !amount || !category) {
      return res.status(400).json({ msg: "All fields required" });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ msg: "Invalid type" });
    }

    if (amount <= 0) {
      return res.status(400).json({ msg: "Amount must be > 0" });
    }

    const newTransaction = new Transaction({
      user: req.user,
      type,
      amount,
      category,
      note,
    });

    await newTransaction.save();
    res.json(newTransaction);

  } catch (err) {
    console.log("ADD ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


// 🔥 GET ALL TRANSACTIONS
router.get("/", auth, async (req, res) => {
  try {
    const data = await Transaction.find({ user: req.user })
      .sort({ createdAt: -1 });

    res.json(data);

  } catch (err) {
    console.log("GET ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


// 🔥 DELETE TRANSACTION
router.delete("/:id", auth, async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });

  } catch (err) {
    console.log("DELETE ERROR:", err);
    res.status(500).json({ msg: "Delete failed" });
  }
});


// 🔥 UPDATE TRANSACTION
router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({ msg: "Update failed" });
  }
});


// 🔥 ANALYTICS (IMPORTANT 🔥)
router.get("/analytics", auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user });

    let income = {};
    let expense = {};

    transactions.forEach((t) => {
      if (t.type === "income") {
        income[t.category] = (income[t.category] || 0) + t.amount;
      } else {
        expense[t.category] = (expense[t.category] || 0) + t.amount;
      }
    });

    res.json({
      income,
      expense,
    });

  } catch (err) {
    console.log("ANALYTICS ERROR:", err);
    res.status(500).json({ msg: "Error fetching analytics" });
  }
});


// 🔥 SUMMARY (OPTIONAL BUT SAFE)
router.get("/summary", auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user });

    let income = 0;
    let expense = 0;

    transactions.forEach((t) => {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    });

    res.json({
      balance: income - expense,
      income,
      expense,
    });

  } catch (err) {
    console.log("SUMMARY ERROR:", err);
    res.status(500).json({ msg: "Error fetching summary" });
  }
});


module.exports = router;