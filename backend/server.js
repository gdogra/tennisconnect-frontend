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

// ✅ Health Check
app.get("/", (req, res) => {
  res.send("🎾 TennisConnect API is running!");
});

// ✅ Register
app.post("/register", async (req, res) => {
  const { first_name, last_name, email, phone, street, city, zip, skill_level, password } = req.body;

  try {
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, email, phone, street, city, zip, skill_level, password)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id, first_name, last_name, email, skill_level, city`,
      [first_name, last_name, email, phone, street, city, zip, skill_level, hashedPassword]
    );

    res.json({ message: "Registration successful", user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) return res.status(400).json({ error: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.rows[0].id, email: user.rows[0].email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

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

// ✅ Get Player Profile
app.get("/players/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, first_name, last_name, email, city, skill_level FROM users WHERE id = $1",
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Player not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get All Players
app.get("/players", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, first_name, last_name, skill_level, city FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Match History
app.get("/users/:id/history", async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await pool.query(
      `SELECT m.id, m.match_date, m.location,
              u.first_name AS opponent,
              m.player1_score, m.player2_score
       FROM matches m
       JOIN users u ON (
         u.id = CASE
           WHEN m.player1_id = $1 THEN m.player2_id
           ELSE m.player1_id
         END
       )
       WHERE (m.player1_id = $1 OR m.player2_id = $1)
         AND m.player1_score IS NOT NULL
         AND m.player2_score IS NOT NULL
         AND m.cancelled = FALSE
       ORDER BY m.match_date DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching match history:", err.message);
    res.status(500).json({ error: "Failed to fetch match history" });
  }
});

// ✅ Player Rankings
app.get("/dashboard/player-rankings", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name, skill_level
       FROM users
       ORDER BY skill_level DESC, last_name ASC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Upcoming Matches
app.get("/dashboard/upcoming-matches/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await pool.query(
      `SELECT m.id, m.match_date, m.location,
              u.first_name AS opponent, m.player1_id, m.player2_id
       FROM matches m
       JOIN users u ON (u.id = CASE 
         WHEN m.player1_id = $1 THEN m.player2_id 
         ELSE m.player1_id END)
       WHERE (m.player1_id = $1 OR m.player2_id = $1)
         AND m.cancelled = FALSE
         AND m.match_date >= CURRENT_DATE
       ORDER BY m.match_date ASC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ All Matches for Calendar
app.get("/matches", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.*, sender.first_name AS sender_name, receiver.first_name AS receiver_name
      FROM matches m
      JOIN users sender ON m.sender_id = sender.id
      JOIN users receiver ON m.receiver_id = receiver.id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Submit Match Score
app.put("/matches/:id/score", async (req, res) => {
  const matchId = req.params.id;
  const { score } = req.body;

  try {
    await pool.query("UPDATE matches SET score = $1, completed = TRUE WHERE id = $2", [score, matchId]);
    res.json({ message: "Score submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Optional: Serve frontend (commented out during dev)
// const path = require("path");
// app.use(express.static(path.join(__dirname, "frontend", "dist")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
// });

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

