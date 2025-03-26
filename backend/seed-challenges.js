// seed-challenges.js
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

const statuses = ["pending", "accepted", "declined"];
const locations = [
  "Chelsea Piers",
  "Flushing Meadows",
  "Battery Park",
  "Harlem Tennis Center",
  "Red Hook Courts"
];

function randomFutureDate() {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * 10) + 1);
  return date.toISOString().split("T")[0];
}

async function seedChallenges() {
  try {
    console.log("🎾 Seeding challenges...");

    const users = await pool.query("SELECT id FROM users ORDER BY RANDOM() LIMIT 6");
    const userIds = users.rows.map((u) => u.id);
    const challengePromises = [];

    for (let i = 0; i < userIds.length - 1; i++) {
      const sender = userIds[i];
      const receiver = userIds[i + 1];
      const date = randomFutureDate();
      const location = locations[Math.floor(Math.random() * locations.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      const promise = pool.query(
        `INSERT INTO challenges (sender_id, receiver_id, match_date, location, status)
         VALUES ($1, $2, $3, $4, $5)`,
        [sender, receiver, date, location, status]
      );

      challengePromises.push(promise);
    }

    await Promise.all(challengePromises);
    console.log("✅ Challenges seeded.");
    process.exit();
  } catch (err) {
    console.error("❌ Failed to seed challenges:", err);
    process.exit(1);
  }
}

seedChallenges();

