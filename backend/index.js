const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const pool = require("./db");

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || "*",
}));
app.use(express.json());
app.use(morgan("dev"));

// Routes
const challengeRoutes = require("./routes/challenges");
const playerRoutes = require("./routes/players"); // Add if implemented
const authRoutes = require("./routes/auth"); // Add if implemented

app.use("/challenges", challengeRoutes);
app.use("/players", playerRoutes);
app.use("/", authRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Backend is running ✅" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});

