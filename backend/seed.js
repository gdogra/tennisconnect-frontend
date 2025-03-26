// seed.js
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

async function seed() {
  try {
    console.log("🔄 Seeding database...");

    await pool.query("DELETE FROM matches");
    await pool.query("DELETE FROM challenges");
    await pool.query("DELETE FROM users");

    const passwordHash = await bcrypt.hash("password", 10);

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

    for (const player of players) {
      const res = await pool.query(
        `INSERT INTO users (first_name, last_name, email, phone, street, city, zip, skill_level, password)
         VALUES ($1, $2, $3, '1234567890', '123 Tennis Ln', 'New York', '10001', $4, $5)
         RETURNING id`,
        [player.first, player.last, player.email, player.skill, passwordHash]
      );
      userRows.push(res.rows[0]);
    }

    const nick = userRows[0];
    const alice = userRows[1];
    const charlie = userRows[3];
    const helen = userRows[8];
    const george = userRows[7];
    const admin = userRows[11];
    const coach = userRows[12];
    const demo = userRows[13];

    await pool.query(
      `INSERT INTO challenges (sender_id, receiver_id, match_date, location, status)
       VALUES 
       ($1, $2, '2025-03-20', 'Central Park Courts', 'accepted'),
       ($1, $3, '2025-03-22', 'Brooklyn Tennis Club', 'pending'),
       ($2, $1, '2025-03-25', 'Riverbank Park', 'accepted'),
       ($4, $1, '2025-03-28', 'Astoria Courts', 'declined')`,
      [nick.id, alice.id, charlie.id, helen.id]
    );

    await pool.query(
      `INSERT INTO matches (
         player1_id, player2_id, match_date, location,
         player1_score, player2_score, cancelled, sender_id, receiver_id
       )
       VALUES 
       ($1, $2, '2025-03-15', 'Test Court A', 6, 3, FALSE, $1, $2)`,
      [admin.id, nick.id]
    );

    await pool.query(
      `INSERT INTO challenges (sender_id, receiver_id, match_date, location, status)
       VALUES ($1, $2, '2025-04-01', 'Coach Court', 'pending')`,
      [coach.id, alice.id]
    );

    await pool.query(
      `INSERT INTO matches (
         player1_id, player2_id, match_date, location,
         player1_score, player2_score, cancelled, sender_id, receiver_id
       )
       VALUES 
       ($1, $2, '2025-04-03', 'Demo Stadium', NULL, NULL, FALSE, $1, $2)`,
      [demo.id, george.id]
    );

    console.log("✅ Database seeded with players + test users + demo matches.");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seed();

