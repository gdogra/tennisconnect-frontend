// backend/routes/dashboard.js
const express = require("express");
const pool = require("../db");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

// GET /dashboard/upcoming-matches/:id
router.get("/upcoming-matches/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT m.id, m.match_date AS date, m.location, u.first_name || ' ' || u.last_name AS opponent, u.profile_picture AS opponent_avatar, u.city
       FROM matches m
       JOIN users u ON u.id = CASE WHEN m.player1_id = $1 THEN m.player2_id ELSE m.player1_id END
       WHERE (m.player1_id = $1 OR m.player2_id = $1) AND m.status = 'scheduled'
       ORDER BY m.match_date ASC`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching upcoming matches:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /dashboard/player-rankings
router.get("/player-rankings", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name, skill_level, city, profile_picture
       FROM users
       WHERE role = 'player'
       ORDER BY skill_level DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching player rankings:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

