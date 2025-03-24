import React, { useEffect, useState } from "react";

export default function ReceivedChallenges({ userId }) {
  const [challenges, setChallenges] = useState([]);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await fetch(`http://localhost:5001/challenges/received/${userId}`);
        const data = await res.json();
        if (res.ok) {
          setChallenges(data);
        } else {
          setError(data.error || "Unknown error");
        }
      } catch (err) {
        setError("Network error while fetching received challenges");
      }
    };
    fetchChallenges();
  }, [userId]);

  return (
    <div className="bg-white rounded shadow p-4 mt-6">
      <h2 className="text-xl font-semibold mb-2 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        📥 Received Challenges {expanded ? "−" : "+"}
      </h2>
      {expanded && (
        <>
          {error ? (
            <p className="text-red-500">❌ {error}</p>
          ) : challenges.length === 0 ? (
            <p className="text-gray-600">No challenges received.</p>
          ) : (
            <ul className="space-y-2">
              {challenges.map((ch, index) => (
                <li key={index} className="border p-2 rounded">
                  From: <strong>{ch.sender}</strong> | Status: {ch.status}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

