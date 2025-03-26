// reset-and-seed.js
require("dotenv").config();
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

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
  "Astoria Courts",
  "Chelsea Piers",
  "Flushing Meadows"
];
const statuses = ["pending", "accepted", "declined"];

function randomDate(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split("T")[0];
}

async function resetAndSeed() {
  try {
    console.log("🔄 Resetting database...");

    // Wipe existing data
    await pool.query("DELETE FROM matches");
    await pool.query("DELETE FROM challenges");
    await pool.query("DELETE FROM users");

    console.log("👥 Creating users...");
    const password = await bcrypt.hash("password", 10);
    const players = [
      { first: "Nick", last: "Player", email: "nick@example.com", skill: 4.5 },
      { first: "Alice", last: "Baseline", email: "alice@example.com", skill: 3.5 },
      { first: "Bob", last: "Netter", email: "bob@example.com", skill: 3.5 },
      { first: "Charlie", last: "Topspin", email: "charlie@example.com", skill: 4.0 },
      { first: "Dana", last: "Slice", email: "dana@example.com", skill: 4.0 },
      { first: "Eva", last: "Volley", email: "eva@example.com", skill: 4.5 },
      { first: "Frank", last: "Rally", email: "frank@example.com", skill: 4.5 },
      { first: "George", last: "Lob", email: "george@example.com", skill: 4.5 },
      { first: "Helen", last: "Smash", email: "helen@example.com", skill: 5.0 },
      { first: "Isaac", last: "Drop", email: "isaac@example.com", skill: 5.0 },
      { first: "James", last: "Serve", email: "james@example.com", skill: 5.0 },
      { first: "Test", last: "Admin", email: "admin@example.com", skill: 5.0 },
      { first: "Test", last: "Coach", email: "coach@example.com", skill: 3.5 },
      { first: "Demo", last: "User", email: "demo@example.com", skill: 4.0 },
    ];

    const userRows = [];
    for (const p of players) {
      const res = await pool.query(
        `INSERT INTO users (first_name, last_name, email, phone, street, city, zip, skill_level, password)
         VALUES ($1, $2, $3, '1234567890', 'Tennis Ln', 'New York', '10001', $4, $5)
         RETURNING id`,
        [p.first, p.last, p.email, p.skill, password]
      );
      userRows.push(res.rows[0]);
    }

    console.log("🎾 Seeding matches...");
    for (let i = 0; i < userRows.length - 1; i++) {
      const p1 = userRows[i].id;
      const p2 = userRows[i + 1].id;
      const location = locations[i % locations.length];

      // Past match with score
      await pool.query(
        `INSERT INTO matches (
           player1_id, player2_id, match_date, location,
           player1_score, player2_score, cancelled, sender_id, receiver_id
         )
         VALUES ($1, $2, $3, $4, 6, 3, FALSE, $1, $2)`,
        [p1, p2, randomDate(-5), location]
      );

      // Future scheduled match
      await pool.query(
        `INSERT INTO matches (
           player1_id, player2_id, match_date, location,
           player1_score, player2_score, cancelled, sender_id, receiver_id
         )
         VALUES ($1, $2, $3, $4, NULL, NULL, FALSE, $1, $2)`,
        [p2, p1, randomDate(3), location]
      );
    }

    console.log("📬 Seeding challenges...");
    for (let i = 0; i < userRows.length - 2; i++) {
      const sender = userRows[i].id;
      const receiver = userRows[i + 2].id;
      const status = statuses[i % statuses.length];
      const location = locations[(i + 1) % locations.length];

      await pool.query(
        `INSERT INTO challenges (sender_id, receiver_id, match_date, location, status)
         VALUES ($1, $2, $3, $4, $5)`,
        [sender, receiver, randomDate(2 + i), location, status]
      );
    }

    console.log("✅ Reset + seed complete.");
    process.exit();
  } catch (err) {
    console.error("❌ Failed to reseed:", err);
    process.exit(1);
  }
}

resetAndSeed();

