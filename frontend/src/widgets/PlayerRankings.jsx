import React, { useEffect, useState } from "react";

const PlayerRankings = () => {
  const [rankings, setRankings] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5001/dashboard/player-rankings", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch player rankings");
        return res.json();
      })
      .then((data) => setRankings(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="bg-white rounded shadow p-4 mb-4">
      <h2
        className="text-xl font-semibold cursor-pointer mb-2"
        onClick={() => setCollapsed(!collapsed)}
      >
        🏆 Player Rankings {collapsed ? "+" : "−"}
      </h2>
      {collapsed ? null : (
        <>
          {error && <p className="text-red-500">{error}</p>}
          {rankings.length === 0 && !error && <p>No rankings available.</p>}
          <ol className="list-decimal pl-4">
            {rankings.map((player, index) => (
              <li key={index}>
                {player.first_name} {player.last_name} – Level {player.skill_level}
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
};

export default PlayerRankings;

