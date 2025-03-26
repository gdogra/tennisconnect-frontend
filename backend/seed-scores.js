// seed-scores.js
require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

async function seedScores() {
  try {
    console.log("📊 Seeding scores for existing matches...");

    const matches = await pool.query(`
      SELECT id FROM matches
      WHERE player1_score IS NULL OR player2_score IS NULL
      LIMIT 10
    `);

    for (const match of matches.rows) {
      const player1_score = Math.floor(Math.random() * 3) + 4; // 4–6
      const player2_score = Math.floor(Math.random() * 4);     // 0–3

      await pool.query(
        `UPDATE matches
         SET player1_score = $1, player2_score = $2
         WHERE id = $3`,
        [player1_score, player2_score, match.id]
      );

      console.log(`✅ Match ${match.id} updated: ${player1_score}-${player2_score}`);
    }

    console.log("🏁 Done seeding match scores.");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding match scores:", err);
    process.exit(1);
  }
}

seedScores();

