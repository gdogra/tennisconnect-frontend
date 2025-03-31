// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
const pool = require("./db");

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/challenges", require("./routes/challenges"));
app.use("/dashboard", require("./routes/dashboard"));
app.use("/players", require("./routes/players"));
app.use("/", require("./routes/auth"));
app.use("/matches", require("./routes/matches"));

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "Backend is running ✅" });
});

// Error handling
app.use((err, _req, res, _next) => {
  console.error("💥 Server Error:", err);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

