const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  limit: Number,
  month: String
});

module.exports = mongoose.model("Budget", budgetSchema);