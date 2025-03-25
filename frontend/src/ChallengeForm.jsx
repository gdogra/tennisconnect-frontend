import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ChallengeForm() {
  const [players, setPlayers] = useState([]);
  const [opponentId, setOpponentId] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    const fetchPlayers = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:5001/players", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setPlayers(data);
      } catch (err) {
        console.error("❌ Error fetching players", err);
        toast.error("Failed to load players list.");
      }
    };
    fetchPlayers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !token) return;

    try {
      const res = await fetch("http://localhost:5001/challenges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sender_id: user.id,
          receiver_id: opponentId,
          match_date: date,
          location,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("🎯 Challenge sent!");
        setOpponentId("");
        setDate("");
        setLocation("");
      } else {
        toast.error(`❌ ${data.error || "Failed to send challenge"}`);
      }
    } catch (err) {
      console.error("❌ Error:", err);
      toast.error("❌ Network error");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4 text-center">🎯 Issue a Challenge</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Opponent</label>
          <select
            value={opponentId}
            onChange={(e) => setOpponentId(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select an opponent</option>
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.first_name} {p.last_name} – {p.city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Court name or address"
            required
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Send Challenge
          </button>
        </div>
      </form>
    </div>
  );
}

