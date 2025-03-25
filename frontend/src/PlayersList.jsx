import React, { useEffect, useState } from "react";

export default function PlayersList() {
  const [players, setPlayers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    const fetchPlayers = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:5001/players", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setPlayers(data);
        setFiltered(data);
      } catch (err) {
        console.error("❌ Error fetching players", err);
      }
    };
    fetchPlayers();
  }, []);

  useEffect(() => {
    let filteredList = players;

    if (search) {
      filteredList = filteredList.filter((p) =>
        `${p.first_name} ${p.last_name}`.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (level) {
      filteredList = filteredList.filter((p) => p.skill_level === level);
    }
    if (city) {
      filteredList = filteredList.filter((p) => p.city.toLowerCase().includes(city.toLowerCase()));
    }

    setFiltered(filteredList);
  }, [search, level, city, players]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">🎾 Players List</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/3"
        />
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/4"
        >
          <option value="">All Skill Levels</option>
          <option value="3.6">3.6</option>
          <option value="4.0">4.0</option>
          <option value="4.5">4.5</option>
          <option value="5.0">5.0</option>
          <option value="6.0">6.0</option>
        </select>
        <input
          type="text"
          placeholder="Filter by city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/3"
        />
      </div>

      <table className="w-full table-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Skill Level</th>
            <th className="px-4 py-2 text-left">City</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((player) => (
            <tr key={player.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{player.first_name} {player.last_name}</td>
              <td className="px-4 py-2">{player.skill_level}</td>
              <td className="px-4 py-2">{player.city}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No players found.</p>
      )}
    </div>
  );
}

