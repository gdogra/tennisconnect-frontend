import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ChallengeForm({ user }) {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5001/challenges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          sender_id: user.id,
          receiver_id: playerId,
          date,
          location,
          message,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setFeedback("✅ Challenge sent successfully!");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setFeedback(`❌ ${data.error || "Error sending challenge."}`);
      }
    } catch (err) {
      setFeedback("❌ Network error. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-16 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">🎾 Send a Challenge</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
          placeholder="Match Date & Time"
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
          placeholder="Location"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="4"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
          placeholder="Add a message (optional)"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Send Challenge
        </button>
        {feedback && <p className="text-center mt-2">{feedback}</p>}
      </form>
    </div>
  );
}

