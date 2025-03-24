import React, { useEffect, useState } from "react";

export default function ReceivedChallenges({ userId, onActivity }) {
  const [challenges, setChallenges] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [error, setError] = useState(null);

  const fetchChallenges = () => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5001/dashboard/received-challenges/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setChallenges(data);
        }
      })
      .catch(() => setError("❌ Network error while fetching received challenges"));
  };

  useEffect(() => {
    fetchChallenges();
  }, [userId]);

  const handleResponse = (challengeId, status, opponentName) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5001/challenges/${challengeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    })
      .then(res => res.json())
      .then(data => {
        fetchChallenges();
        if (onActivity) onActivity(`${status} challenge`, opponentName);
      });
  };

  return (
    <div className="border rounded p-4">
      <div
        className="cursor-pointer font-semibold text-lg flex justify-between items-center"
        onClick={() => setCollapsed(!collapsed)}
      >
        📥 Received Challenges
        <span>{collapsed ? "+" : "−"}</span>
      </div>
      {!collapsed && (
        <div className="mt-2 space-y-2">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : challenges.length === 0 ? (
            <p className="text-gray-500">No challenges received.</p>
          ) : (
            challenges.map((c, i) => (
              <div
                key={i}
                className="flex justify-between items-center border p-2 rounded text-sm"
              >
                <span>
                  From: <strong>{c.sender}</strong> — <em>{c.status}</em>
                </span>
                {c.status === "Pending" && (
                  <div className="space-x-2">
                    <button
                      onClick={() => handleResponse(c.id, "Accepted", c.sender)}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleResponse(c.id, "Declined", c.sender)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

