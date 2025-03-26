// seed-future.js
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

const locations = [
  "Central Park Courts",
  "Brooklyn Tennis Club",
  "Riverside Court",
  "Astoria Courts",
  "Prospect Park Tennis Center"
];

function randomDateInNextWeek() {
  const today = new Date();
  const daysAhead = Math.floor(Math.random() * 7) + 1;
  today.setDate(today.getDate() + daysAhead);
  return today.toISOString().split("T")[0];
}

async function seedFutureMatches() {
  try {
    console.log("📅 Seeding future scheduled matches...");

    const users = await pool.query("SELECT id FROM users ORDER BY RANDOM() LIMIT 6");
    const userIds = users.rows.map((u) => u.id);

    const matchPromises = [];

    for (let i = 0; i < userIds.length - 1; i++) {
      const player1 = userIds[i];
      const player2 = userIds[i + 1];
      const date = randomDateInNextWeek();
      const location = locations[Math.floor(Math.random() * locations.length)];

      const promise = pool.query(
        `INSERT INTO matches (
           player1_id, player2_id, match_date, location,
           player1_score, player2_score, cancelled, sender_id, receiver_id
         )
         VALUES ($1, $2, $3, $4, NULL, NULL, FALSE, $1, $2)`,
        [player1, player2, date, location]
      );

      matchPromises.push(promise);
    }

    await Promise.all(matchPromises);
    console.log("✅ Future matches seeded successfully.");
    process.exit();
  } catch (err) {
    console.error("❌ Failed to seed future matches:", err);
    process.exit(1);
  }
}

seedFutureMatches();

