const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /challenges/sent/:id?status=pending
router.get("/sent/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.query;

  try {
    let query = `
      SELECT c.*, u.first_name AS receiver_first_name, u.last_name AS receiver_last_name, u.skill_level AS receiver_skill_level, u.city AS receiver_city
      FROM challenges c
      JOIN users u ON c.receiver_id = u.id
      WHERE c.sender_id = $1
    `;
    const params = [id];

    if (status) {
      query += ` AND c.status = $2`;
      params.push(status);
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching sent challenges:", err);
    res.status(500).json({ error: "Failed to fetch sent challenges" });
  }
});

// GET /challenges/received/:id?status=pending
router.get("/received/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.query;

  try {
    let query = `
      SELECT c.*, u.first_name AS sender_first_name, u.last_name AS sender_last_name, u.skill_level AS sender_skill_level, u.city AS sender_city
      FROM challenges c
      JOIN users u ON c.sender_id = u.id
      WHERE c.receiver_id = $1
    `;
    const params = [id];

    if (status) {
      query += ` AND c.status = $2`;
      params.push(status);
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching received challenges:", err);
    res.status(500).json({ error: "Failed to fetch received challenges" });
  }
});

module.exports = router;

