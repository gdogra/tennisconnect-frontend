import React, { useState, useEffect } from "react";

export default function SubmitMatchResult({ userId }) {
  const [challenges, setChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState("");
  const [winnerId, setWinnerId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5001/challenges/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const accepted = data.filter((c) => c.status === "Accepted");
        setChallenges(accepted);
      } catch (err) {
        console.error("Failed to fetch challenges");
      }
    };
    fetchChallenges();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5001/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId: selectedChallenge,
          winnerId,
        }),
      });

      const data = await res.json();
      setMessage(data.message || "✅ Match result submitted!");
    } catch (err) {
      setMessage("❌ Error submitting match result.");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="font-bold mb-2">🎾 Submit Match Result</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <select
          className="w-full p-2 border rounded"
          value={selectedChallenge}
          onChange={(e) => setSelectedChallenge(e.target.value)}
        >
          <option value="">-- Select a Challenge --</option>
          {challenges.map((c) => (
            <option key={c.id} value={c.id}>
              {c.sender_name} vs {c.receiver_name}
            </option>
          ))}
        </select>

        <select
          className="w-full p-2 border rounded"
          value={winnerId}
          onChange={(e) => setWinnerId(e.target.value)}
        >
          <option value="">-- Select Winner --</option>
          {challenges
            .find((c) => c.id === parseInt(selectedChallenge))
            ?.players?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            )) || null}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Result
        </button>

        {message && <p className="text-sm text-green-600">{message}</p>}
      </form>
    </div>
  );
}
