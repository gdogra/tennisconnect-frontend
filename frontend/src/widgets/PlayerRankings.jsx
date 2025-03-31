// src/widgets/PlayerRankings.jsx
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

function PlayerRankings() {
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
    <div className="border p-4 rounded shadow bg-white">
      <h2
        className="text-xl font-semibold cursor-pointer flex justify-between items-center"
        onClick={() => setCollapsed(!collapsed)}
      >
        🏆 Player Rankings <span>{collapsed ? "+" : "−"}</span>
      </h2>

      {!collapsed && (
        <div className="mt-4">
          {loading && <p className="text-gray-500">Loading rankings...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && rankings.length > 0 ? (
            <div className="flex gap-4">
              <div className="w-1/2">
                <Bar data={chartData} />
              </div>
              <ul className="w-1/2 max-h-64 overflow-y-auto space-y-2">
                {rankings.map((player) => {
                  const initials = `${player.first_name[0]}${player.last_name[0]}`;
                  return (
                    <li key={player.id} className="flex items-center gap-3">
                      {player.profile_picture ? (
                        <img
                          src={player.profile_picture}
                          alt="avatar"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">
                          {initials}
                        </div>
                      )}
                      <span className="text-sm">
                        {player.first_name} {player.last_name} —{" "}
                        {Number(player.skill_level).toFixed(1)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            !loading && !error && <p>No player rankings to show.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default PlayerRankings;

