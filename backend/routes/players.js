// backend/routes/players.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /players
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, first_name, last_name, email, skill_level, city, avatar_url
      FROM users
      ORDER BY skill_level DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching players:", err);
    res.status(500).json({ error: "Failed to fetch players" });
  }
});

// GET /players/:id
router.get("/:id", async (req, res) => {
  const playerId = req.params.id;
  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name, email, skill_level, city, bio, avatar_url
       FROM users WHERE id = $1`,
      [playerId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Player not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching player:", err);
    res.status(500).json({ error: "Failed to fetch player" });
  }
});

module.exports = router;

