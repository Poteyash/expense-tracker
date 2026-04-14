const router = require("express").Router();
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const auth = require("../middleware/auth");

// 🔥 ADMIN CHECK
const adminOnly = (req, res, next) => {
  if (req.role !== "admin") {
    return res.status(403).json({ msg: "Access denied" });
  }
  next();
};


// 🔥 ADMIN STATS (ADD THIS ONLY 🔥)
router.get("/stats", auth, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const transactions = await Transaction.find();

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((t) => {
      if (t.type === "income") totalIncome += t.amount;
      else totalExpense += t.amount;
    });

    res.json({
      totalUsers,
      totalIncome,
      totalExpense,
    });

  } catch (err) {
    console.log("STATS ERROR:", err);
    res.status(500).json({ msg: "Error fetching stats" });
  }
});


// 🔥 GET USERS
router.get("/users", auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.log("GET USERS ERROR:", err);
    res.status(500).json({ msg: "Error fetching users" });
  }
});


// 🔥 DELETE USER
router.delete("/user/:id", auth, adminOnly, async (req, res) => {
  try {
    const userId = req.params.id;

    if (userId === req.user) {
      return res.status(400).json({ msg: "Cannot delete yourself" });
    }

    await User.findByIdAndDelete(userId);
    await Transaction.deleteMany({ user: userId });

    res.json({ msg: "User deleted successfully" });

  } catch (err) {
    console.log("DELETE USER ERROR:", err);
    res.status(500).json({ msg: "Delete failed" });
  }
});

module.exports = router;