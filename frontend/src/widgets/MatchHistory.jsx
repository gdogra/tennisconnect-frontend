import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function MatchHistory({ user }) {
  const [matches, setMatches] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5001/dashboard/match-history/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setMatches(data);
        } else {
          setError(data.error || "Failed to fetch match history.");
        }
      } catch (err) {
        setError("❌ Network error while fetching match history.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchMatches();
  }, [user]);

  const chartData = {
    labels: matches.map((m) => m.opponent || "Unknown"),
    datasets: [
      {
        label: "Match Scores",
        data: matches.map((m) => m.score || 0),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  return (
    <div className="border p-4 rounded shadow bg-white dark:bg-gray-800">
      <h2
        className="text-xl font-semibold cursor-pointer flex justify-between items-center"
        onClick={() => setCollapsed(!collapsed)}
      >
        📜 Match History{" "}
        <span>{collapsed ? "+" : "−"}</span>
      </h2>

      {!collapsed && (
        <div className="mt-4">
          {loading && <p className="text-gray-500">Loading match history...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && matches.length > 0 ? (
            <Bar data={chartData} />
          ) : (
            !loading && !error && <p>No match history yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

