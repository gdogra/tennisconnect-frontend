import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MatchHistory() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch("http://localhost:5001/matches");
        const data = await res.json();
        if (res.ok) {
          const user = JSON.parse(localStorage.getItem("user"));
          const completed = data.filter(
            (match) =>
              match.completed &&
              (match.sender_id === user.id || match.receiver_id === user.id)
          );
          const formatted = completed.map((match) => {
            const isSender = match.sender_id === user.id;
            const opponentName = isSender
              ? match.receiver_name
              : match.sender_name;
            const opponentId = isSender
              ? match.receiver_id
              : match.sender_id;
            return {
              id: match.id,
              date: new Date(match.date).toLocaleDateString(),
              location: match.location,
              city: match.city,
              score: match.score,
              opponentName,
              opponentId,
            };
          });
          setMatches(formatted);
        } else {
          setError(data.error || "Failed to fetch match history");
        }
      } catch (err) {
        setError("❌ Network error while fetching match history.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div className="border p-4 rounded shadow bg-white dark:bg-gray-800">
      <h2
        className="text-xl font-semibold cursor-pointer flex justify-between items-center"
        onClick={() => setCollapsed(!collapsed)}
      >
        📜 Match History <span>{collapsed ? "+" : "−"}</span>
      </h2>

      {!collapsed && (
        <div className="mt-4">
          {loading && <p className="text-gray-500">Loading match history...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && matches.length > 0 ? (
            <ul className="space-y-2">
              {matches.map((match) => (
                <li
                  key={match.id}
                  className="bg-green-100 dark:bg-green-900 p-3 rounded"
                >
                  <div className="font-medium">
                    vs{" "}
                    <Link
                      to={`/players/${match.opponentId}`}
                      className="text-blue-600 underline"
                    >
                      {match.opponentName}
                    </Link>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Score: {match.score} • {match.date} • {match.location},{" "}
                    {match.city}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            !loading &&
            !error && (
              <p className="text-center text-gray-500">
                No completed matches yet.
              </p>
            )
          )}
        </div>
      )}
    </div>
  );
}

