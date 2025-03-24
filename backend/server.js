require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

app.get('/', (req, res) => {
  res.send('🎾 TennisConnect is running!');
});

// AUTH: Register
app.post('/register', async (req, res) => {
  const {
    first_name, last_name, email, phone,
    street, city, zip, skill_level, password
  } = req.body;

  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: '❌ Email already exists. Please log in instead.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users 
      (first_name, last_name, email, phone, street, city, zip, skill_level, password) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) 
      RETURNING id, first_name, last_name, email, skill_level, city`,
      [first_name, last_name, email, phone, street, city, zip, skill_level, hashedPassword]
    );

    res.json({ message: '✅ Registration successful!', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AUTH: Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ error: '❌ Invalid credentials.' });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ error: '❌ Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.rows[0].id, email: user.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user.rows[0].id,
        first_name: user.rows[0].first_name,
        last_name: user.rows[0].last_name,
        skill_level: user.rows[0].skill_level,
        city: user.rows[0].city
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Players
app.get('/players', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).json({ error: '❌ No token provided.' });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    const players = await pool.query('SELECT id, first_name, last_name, skill_level, city FROM users');
    res.json(players.rows);
  } catch (err) {
    res.status(403).json({ error: '❌ Invalid token.' });
  }
});

// GET: Dashboard - Match History
app.get('/dashboard/match-history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const matches = await pool.query(`
      SELECT m.id, u1.first_name AS player1, u2.first_name AS player2, m.date, m.score, m.location
      FROM matches m
      JOIN users u1 ON m.player1_id = u1.id
      JOIN users u2 ON m.player2_id = u2.id
      WHERE m.player1_id = $1 OR m.player2_id = $1
      ORDER BY m.date DESC
    `, [userId]);

    res.json(matches.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Dashboard - Upcoming Matches
app.get('/dashboard/upcoming-matches/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const upcoming = await pool.query(`
      SELECT m.id, u1.first_name AS player1, u2.first_name AS player2, m.date, m.location
      FROM matches m
      JOIN users u1 ON m.player1_id = u1.id
      JOIN users u2 ON m.player2_id = u2.id
      WHERE (m.player1_id = $1 OR m.player2_id = $1) AND m.date >= NOW()
      ORDER BY m.date ASC
    `, [userId]);

    res.json(upcoming.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Dashboard - Player Rankings
app.get('/dashboard/player-rankings', async (_req, res) => {
  try {
    const rankings = await pool.query(`
      SELECT id, first_name, last_name, skill_level
      FROM users
      ORDER BY skill_level DESC
    `);

    res.json(rankings.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Submit a Challenge
app.post('/challenges', async (req, res) => {
  const { sender_id, receiver_id, date, location } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO challenges (sender_id, receiver_id, date, location, status) 
       VALUES ($1, $2, $3, $4, 'Pending') RETURNING *`,
      [sender_id, receiver_id, date, location]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH: Accept/Decline a Challenge & optionally create a match
app.patch('/challenges/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const challenge = await pool.query(
      `UPDATE challenges SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (status === 'Accepted') {
      const { sender_id, receiver_id, date, location } = challenge.rows[0];
      await pool.query(
        `INSERT INTO matches (player1_id, player2_id, date, location, score)
         VALUES ($1, $2, $3, $4, NULL)`,
        [sender_id, receiver_id, date, location]
      );
    }

    res.json({ message: `✅ Challenge ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Sent & Received Challenges
app.get('/challenges/sent/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(`
      SELECT c.id, c.date, c.location, c.status, u.first_name AS receiver
      FROM challenges c
      JOIN users u ON u.id = c.receiver_id
      WHERE c.sender_id = $1
      ORDER BY c.date DESC
    `, [userId]);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/challenges/received/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(`
      SELECT c.id, c.date, c.location, c.status, u.first_name AS sender
      FROM challenges c
      JOIN users u ON u.id = c.sender_id
      WHERE c.receiver_id = $1
      ORDER BY c.date DESC
    `, [userId]);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

