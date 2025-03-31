import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ChallengeStats() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user || !token) return;

    fetch(`http://localhost:5001/dashboard/challenge-conversion/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch challenge stats");
        return res.json();
      })
      .then(({ challengesSent, matchesPlayed }) => {
        const notPlayed = challengesSent - matchesPlayed;
        const conversionRate =
          challengesSent > 0 ? ((matchesPlayed / challengesSent) * 100).toFixed(1) : "0.0";

        setData({
          chartData: {
            labels: ["Played", "Not Played"],
            datasets: [
              {
                data: [matchesPlayed, notPlayed],
                backgroundColor: ["#10b981", "#facc15"], // green + yellow
              },
            ],
          },
          conversionRate,
        });
      })
      .catch((err) => {
        console.error(err);
        setError("❌ Failed to load challenge conversion stats.");
      });
  }, [user, token]);

  return (
    <div className="bg-white shadow rounded p-4 mb-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">📈 Challenge Conversion</h2>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-sm text-blue-500 hover:underline"
        >
          {collapsed ? "+" : "−"}
        </button>
      </div>

      {!collapsed && (
        <div className="mt-4">
          {error && <p className="text-red-500">{error}</p>}
          {!data ? (
            <p>Loading...</p>
          ) : (
            <>
              <Pie
                data={data.chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
              />
              <p className="text-center text-sm mt-2 text-gray-600">
                🎯 Conversion Rate: {data.conversionRate}%
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
