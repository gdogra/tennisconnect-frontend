// backend/routes/dashboard.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /dashboard/upcoming-matches/:id
router.get("/upcoming-matches/:id", async (req, res) => {
  const playerId = req.params.id;
  try {
    const result = await pool.query(
      `
      SELECT c.id AS challenge_id, c.match_date, c.location, c.status,
             u.id AS opponent_id, u.first_name, u.last_name, u.avatar_url, u.skill_level
      FROM challenges c
      JOIN users u ON (u.id = CASE
                                WHEN c.sender_id = $1 THEN c.receiver_id
                                WHEN c.receiver_id = $1 THEN c.sender_id
                              END)
      WHERE (c.sender_id = $1 OR c.receiver_id = $1)
        AND c.status = 'accepted'
        AND c.match_date >= CURRENT_DATE
      ORDER BY c.match_date ASC
      `,
      [playerId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching upcoming matches:", err);
    res.status(500).json({ error: "Failed to fetch upcoming matches" });
  }
});

// GET /dashboard/player-rankings
router.get("/player-rankings", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, first_name, last_name, avatar_url, skill_level
      FROM users
      ORDER BY skill_level DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching player rankings:", err);
    res.status(500).json({ error: "Failed to fetch player rankings" });
  }
});

module.exports = router;

