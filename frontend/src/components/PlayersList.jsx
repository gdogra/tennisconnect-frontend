import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AvatarHoverCard from "./AvatarHoverCard";

export default function PlayersList() {
  const [players, setPlayers] = useState([]);
  const [filter, setFilter] = useState("All");
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5001/players", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPlayers(data))
      .catch((err) => console.error("Failed to fetch players", err));
  }, [token]);

  const handleProfileClick = (id) => {
    navigate(`/players/${id}`);
  };

  const handleChallenge = (opponent) => {
    alert(`🎾 Initiate challenge with ${opponent.first_name} ${opponent.last_name}`);
  };

  const filtered = players
    .filter((p) => p.id !== user.id && !isNaN(p.skill_level))
    .filter((p) =>
      filter === "All" ? true : Number(p.skill_level).toFixed(1) === filter
    )
    .sort((a, b) => b.skill_level - a.skill_level);

  const skillOptions = ["All", "3.5", "4.0", "4.5", "5.0"];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🎾 Players List</h1>

      <div className="flex items-center gap-4 mb-4">
        <label className="text-sm font-medium">Filter by Skill:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {skillOptions.map((lvl) => (
            <option key={lvl} value={lvl}>
              {lvl}
            </option>
          ))}
        </select>
      </div>

      <table className="w-full table-auto border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-3 py-2">#</th>
            <th className="text-left px-3 py-2">Player</th>
            <th className="text-left px-3 py-2">Skill Level</th>
            <th className="text-left px-3 py-2">City</th>
            <th className="text-left px-3 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((player, idx) => {
            const isSuggested =
              Math.abs(Number(player.skill_level) - Number(user.skill_level)) <= 0.5;
            return (
              <tr key={player.id} className="border-t hover:bg-gray-50">
                <td className="px-3 py-2">{idx + 1}</td>
                <td className="px-3 py-2 flex items-center gap-2 cursor-pointer text-blue-600 underline"
                    onClick={() => handleProfileClick(player.id)}>
                  <AvatarHoverCard player={player} size={32} />
                  {player.first_name} {player.last_name}
                </td>
                <td className="px-3 py-2">{Number(player.skill_level).toFixed(1)}</td>
                <td className="px-3 py-2">{player.city}</td>
                <td className="px-3 py-2">
                  {isSuggested ? (
                    <button
                      onClick={() => handleChallenge(player)}
                      className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600"
                    >
                      Challenge
                    </button>
                  ) : (
                    <span className="text-gray-400 text-sm">Too far</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

