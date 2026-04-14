const router = require("express").Router();
const Budget = require("../models/Budget");
const auth = require("../middleware/authMiddleware");

// Set budget
router.post("/", auth, async (req, res) => {
  const { limit, month } = req.body;

  const budget = new Budget({
    userId: req.user,
    limit,
    month
  });

  await budget.save();
  res.json(budget);
});

module.exports = router;