require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

app.get("/", (req, res) => {
  res.send("🎾 TennisConnect API is running!");
});

// Helper function
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ error: "Invalid token" });
  }
};

// Register
app.post("/register", async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    street,
    city,
    zip,
    skill_level,
    password,
  } = req.body;

  try {
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "❌ Email already exists. Please log in." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users 
        (first_name, last_name, email, phone, street, city, zip, skill_level, password)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id, first_name, last_name, email, skill_level, city`,
      [first_name, last_name, email, phone, street, city, zip, skill_level, hashedPassword]
    );

    res.json({ message: "✅ Registration successful!", user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ error: "❌ Invalid credentials." });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ error: "❌ Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user.rows[0].id, email: user.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user.rows[0].id,
        first_name: user.rows[0].first_name,
        last_name: user.rows[0].last_name,
        skill_level: user.rows[0].skill_level,
        city: user.rows[0].city,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get players list
app.get("/players", authenticateToken, async (req, res) => {
  try {
    const players = await pool.query(
      "SELECT id, first_name, last_name, skill_level, city FROM users"
    );
    res.json(players.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Scheduled matches for calendar
app.get("/scheduled-matches/:userId", authenticateToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT m.id, m.scheduled_date, 
              u1.first_name AS player1, 
              u2.first_name AS player2 
         FROM matches m
    LEFT JOIN users u1 ON m.player1_id = u1.id
    LEFT JOIN users u2 ON m.player2_id = u2.id
        WHERE m.player1_id = $1 OR m.player2_id = $1
        ORDER BY m.scheduled_date`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

