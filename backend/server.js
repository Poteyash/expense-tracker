const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();


// 🔐 SECURITY HEADERS
app.use(helmet());


// 🔐 CORS
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));


// 🔐 BODY PARSER
app.use(express.json());
app.use(cookieParser());


// 🔥 CUSTOM SANITIZER (MONGO INJECTION PROTECTION)
app.use((req, res, next) => {
  const sanitize = (obj) => {
    for (let key in obj) {
      if (key.startsWith("$") || key.includes(".")) {
        delete obj[key];
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);

  next();
});


// 🔥 BASIC XSS CLEANER (SAFE)
app.use((req, res, next) => {
  const clean = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === "string") {
        obj[key] = obj[key].replace(/<.*?>/g, "");
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        clean(obj[key]);
      }
    }
  };

  if (req.body) clean(req.body);
  if (req.query) clean(req.query);
  if (req.params) clean(req.params);

  next();
});


// 🔐 RATE LIMIT
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);


// 🔥 ROUTES (IMPORTANT)
app.use("/api/auth", require("./routes/auth"));
app.use("/api/transactions", require("./routes/transaction"));
app.use("/api/admin", require("./routes/admin"));


// 🔥 GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({ msg: "Something went wrong" });
});


// 🔥 DB CONNECT
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("DB ERROR:", err));


// 🔥 START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});