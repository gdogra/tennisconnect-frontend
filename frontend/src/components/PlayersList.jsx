import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function PlayersList() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5001/players", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setPlayers(data);
    };
    fetchPlayers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">🎾 Players List</h2>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Skill Level</th>
            <th className="border p-2">City</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p) => (
            <tr key={p.id}>
              <td className="border p-2">
                <Link to={`/profile/${p.id}`} className="text-blue-600 hover:underline">
                  {p.first_name} {p.last_name}
                </Link>
              </td>
              <td className="border p-2">{p.skill_level}</td>
              <td className="border p-2">{p.city}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

