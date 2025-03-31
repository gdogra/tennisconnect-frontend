// backend/routes/auth.js (debug-enhanced version)
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

// POST /register
router.post("/register", async (req, res) => {
  const { first_name, last_name, email, password, skill_level, city } = req.body;
  console.log("📥 Registering:", req.body);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password, skill_level, city)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, first_name, last_name, email, skill_level, city`,
      [first_name, last_name, email, hashedPassword, skill_level, city]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error registering user:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// POST /login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("🔐 Login attempt for:", email);

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    console.log("🔍 User lookup result:", user);

    if (!user) {
      console.warn("⚠️ No user found with email:", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn("⚠️ Password mismatch for:", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const { password: _, ...userWithoutPassword } = user;
    console.log("✅ Login success:", userWithoutPassword);
    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error("❌ Error logging in:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;

