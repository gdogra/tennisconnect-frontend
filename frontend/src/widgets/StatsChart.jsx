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

export default function StatsChart() {
  const [data, setData] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user || !token) return;

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

        setData({
          labels,
          datasets: [
            {
              label: "Matches Played",
              data: values,
              backgroundColor: "rgba(59, 130, 246, 0.6)", // Tailwind's blue-500
            },
          ],
        });
      })
      .catch((err) => {
        console.error(err);
        setError("❌ Failed to fetch match stats.");
      });
  }, [user, token]);

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
        <div className="mt-4">
          {error && <p className="text-red-500">{error}</p>}
          {!data ? (
            <p>Loading chart...</p>
          ) : (
            <Bar
              data={data}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  tooltip: { enabled: true },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: { display: true, text: "Matches Played" },
                  },
                },
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

