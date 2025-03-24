import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PlayersList() {
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:5001/players", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setPlayers(data))
      .catch(err => console.error("Error fetching players:", err));
  }, [navigate]);

  const handleChallenge = (opponentId) => {
    navigate(`/challenge/${opponentId}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🎾 Players List</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Skill Level</th>
            <th className="p-2 border">City</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {players.map(player => (
            <tr key={player.id}>
              <td className="p-2 border">{player.first_name} {player.last_name}</td>
              <td className="p-2 border">{player.skill_level}</td>
              <td className="p-2 border">{player.city}</td>
              <td className="p-2 border">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => handleChallenge(player.id)}
                >
                  Challenge
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

