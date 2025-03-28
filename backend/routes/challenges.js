router.post("/:id/accept", async (req, res) => {
  const { id } = req.params;
  const { match_date, location } = req.body;
  try {
    // Update challenge status and create a match
    await pool.query("BEGIN");

    await pool.query(
      `UPDATE challenges
       SET status = 'accepted'
       WHERE id = $1`,
      [id]
    );

    const challenge = await pool.query(
      `SELECT sender_id, receiver_id FROM challenges WHERE id = $1`,
      [id]
    );

    const { sender_id, receiver_id } = challenge.rows[0];

    await pool.query(
      `INSERT INTO matches (
         player1_id, player2_id, match_date, location,
         cancelled, sender_id, receiver_id
       )
       VALUES ($1, $2, $3, $4, FALSE, $1, $2)`,
      [sender_id, receiver_id, match_date, location]
    );

    await pool.query("COMMIT");
    res.sendStatus(200);
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("Error accepting challenge:", err);
    res.status(500).json({ error: "Failed to accept challenge" });
  }
});

