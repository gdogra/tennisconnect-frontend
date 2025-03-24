import React, { useEffect, useState } from "react";

const UpcomingMatches = () => {
  const [matches, setMatches] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5001/dashboard/upcoming-matches", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch upcoming matches");
        return res.json();
      })
      .then((data) => setMatches(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="bg-white rounded shadow p-4 mb-4">
      <h2
        className="text-xl font-semibold cursor-pointer mb-2"
        onClick={() => setCollapsed(!collapsed)}
      >
        📅 Upcoming Matches {collapsed ? "+" : "−"}
      </h2>
      {collapsed ? null : (
        <>
          {error && <p className="text-red-500">{error}</p>}
          {matches.length === 0 && !error && <p>No upcoming matches.</p>}
          <ul className="space-y-2">
            {matches.map((match) => (
              <li key={match.id} className="border-b py-2">
                {match.player1} vs {match.player2} on {match.date} at {match.location}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default UpcomingMatches;

