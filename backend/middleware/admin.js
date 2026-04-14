module.exports = function (req, res, next) {
  if (req.userRole !== "admin") {
    return res.status(403).json({ msg: "Access denied" });
  }
  next();
};