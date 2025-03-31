import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function StatsChart() {
  const [matchData, setMatchData] = useState(null);
  const [winLossData, setWinLossData] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user || !token) return;

    // Matches by opponent
    fetch(`http://localhost:5001/dashboard/match-stats/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stats");
        return res.json();
      })
      .then((stats) => {
        const labels = stats.map((row) => row.opponent);
        const values = stats.map((row) => parseInt(row.matches_played));

        setMatchData({
          labels,
          datasets: [
            {
              label: "Matches Played",
              data: values,
              backgroundColor: "rgba(59, 130, 246, 0.6)",
            },
          ],
        });
      })
      .catch((err) => {
        console.error(err);
        setError("❌ Failed to fetch match stats.");
      });

    // Win/Loss
    fetch(`http://localhost:5001/dashboard/win-loss/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch win/loss stats");
        return res.json();
      })
      .then(({ wins, losses }) => {
        setWinLossData({
          labels: ["Wins", "Losses"],
          datasets: [
            {
              label: "Win/Loss",
              data: [wins, losses],
              backgroundColor: ["#10b981", "#ef4444"],
            },
          ],
        });
      })
      .catch((err) => {
        console.error(err);
        setError("❌ Failed to fetch win/loss stats.");
      });
  }, [user, token]);

  const total = winLossData?.datasets[0]?.data?.reduce((a, b) => a + b, 0) || 0;
  const wins = winLossData?.datasets[0]?.data[0] || 0;
  const losses = winLossData?.datasets[0]?.data[1] || 0;
  const winPct = total > 0 ? ((wins / total) * 100).toFixed(1) : "0.0";
  const lossPct = total > 0 ? ((losses / total) * 100).toFixed(1) : "0.0";

  return (
    <div className="bg-white shadow rounded p-4 mb-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">📊 Match Stats</h2>
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="text-sm text-blue-500 hover:underline"
        >
          {collapsed ? "+" : "−"}
        </button>
      </div>

      {!collapsed && (
        <div className="mt-4 space-y-6">
          {error && <p className="text-red-500">{error}</p>}
          {!matchData ? (
            <p>Loading match breakdown...</p>
          ) : (
            <>
              <h3 className="text-md font-medium mb-2">Matches by Opponent</h3>
              <Bar
                data={matchData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: "Matches Played" },
                    },
                  },
                }}
              />
            </>
          )}

          {!winLossData ? (
            <p>Loading win/loss summary...</p>
          ) : (
            <>
              <h3 className="text-md font-medium mb-2">Win/Loss Summary</h3>
              <Pie
                data={winLossData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
              />
              <p className="text-center text-sm text-gray-600 mt-2">
                ✅ Win Rate: {winPct}% &nbsp;&nbsp; ❌ Loss Rate: {lossPct}%
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
