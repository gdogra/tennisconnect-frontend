// routes/challenges.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// Get sent challenges
router.get("/sent/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await db.query(
      `SELECT c.*, u.first_name, u.last_name, u.avatar_url
       FROM challenges c
       JOIN users u ON u.id = c.receiver_id
       WHERE c.sender_id = $1
       ORDER BY c.created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching sent challenges:", err);
    res.status(500).json({ error: "Failed to fetch sent challenges" });
  }
});

// Get received challenges
router.get("/received/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await db.query(
      `SELECT c.*, u.first_name, u.last_name, u.avatar_url
       FROM challenges c
       JOIN users u ON u.id = c.sender_id
       WHERE c.receiver_id = $1
       ORDER BY c.created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching received challenges:", err);
    res.status(500).json({ error: "Failed to fetch received challenges" });
  }
});

// Accept a challenge
router.post("/:id/accept", async (req, res) => {
  const challengeId = req.params.id;
  try {
    const result = await db.query(
      `UPDATE challenges SET status = 'accepted'
       WHERE id = $1 RETURNING *`,
      [challengeId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Challenge not found" });
    }
    res.json({ success: true, challenge: result.rows[0] });
  } catch (err) {
    console.error("Error accepting challenge:", err);
    res.status(500).json({ error: "Failed to accept challenge" });
  }
});

// Decline a challenge
router.post("/:id/decline", async (req, res) => {
  const challengeId = req.params.id;
  try {
    const result = await db.query(
      `UPDATE challenges SET status = 'declined'
       WHERE id = $1 RETURNING *`,
      [challengeId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Challenge not found" });
    }
    res.json({ success: true, challenge: result.rows[0] });
  } catch (err) {
    console.error("Error declining challenge:", err);
    res.status(500).json({ error: "Failed to decline challenge" });
  }
});

module.exports = router;

