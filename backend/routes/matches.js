const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /matches
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM matches ORDER BY match_date DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch matches", err);
    res.status(500).json({ error: "Failed to fetch matches" });
  }
});

module.exports = router;

