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

export default function PlayerRankings() {
  const [rankings, setRankings] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5001/dashboard/player-rankings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setRankings(data);
        } else {
          setError(data.error || "Failed to fetch rankings.");
        }
      } catch (err) {
        setError("❌ Network error while fetching player rankings.");
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  const chartData = {
    labels: rankings.map((player) => `${player.first_name} ${player.last_name}`),
    datasets: [
      {
        label: "Skill Level",
        data: rankings.map((player) => parseFloat(player.skill_level)),
        backgroundColor: "#10b981",
      },
    ],
  };

  return (
    <div className="border p-4 rounded shadow bg-white dark:bg-gray-800">
      <h2
        className="text-xl font-semibold cursor-pointer flex justify-between items-center"
        onClick={() => setCollapsed(!collapsed)}
      >
        🏆 Player Rankings{" "}
        <span>{collapsed ? "+" : "−"}</span>
      </h2>

      {!collapsed && (
        <div className="mt-4">
          {loading && <p className="text-gray-500">Loading rankings...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && rankings.length > 0 ? (
            <Bar data={chartData} />
          ) : (
            !loading && !error && <p>No player rankings to show.</p>
          )}
        </div>
      )}
    </div>
  );
}

