import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MatchHistory({ user }) {
  const [matches, setMatches] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5001/dashboard/match-history/${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMatches(res.data);
      } catch (err) {
        setError("❌ Failed to fetch match history.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [user]);

  if (loading) return <div className="text-gray-500">Loading match history...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="border p-4 rounded shadow-md bg-white">
      <h2
        className="text-xl font-bold cursor-pointer flex justify-between items-center"
        onClick={() => setCollapsed(!collapsed)}
      >
        📜 Match History
        <span>{collapsed ? "+" : "−"}</span>
      </h2>
      {!collapsed && (
        <ul className="mt-2 space-y-2">
          {matches.map((match) => (
            <li key={match.id} className="bg-gray-100 p-2 rounded">
              {match.opponent_name} ({match.opponent_level}) - {match.score} on{" "}
              {new Date(match.date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

