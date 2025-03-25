import React, { useEffect, useState } from "react";

export default function SentChallenges({ onToast, onActivity }) {
  const [challenges, setChallenges] = useState([]);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        const res = await fetch(
          `http://localhost:5001/dashboard/sent-challenges/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setChallenges(data);
      } catch (err) {
        setChallenges([]);
        onToast?.("❌ Network error while fetching sent challenges", "error");
      }
    };

    fetchChallenges();
  }, []);

  return (
    <div className="bg-white shadow-md rounded p-4 mt-4">
      <h2
        className="text-xl font-semibold cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        📤 Sent Challenges {collapsed ? "+" : "−"}
      </h2>
      {!collapsed &&
        (challenges.length === 0 ? (
          <p className="text-gray-500 mt-2">No challenges sent.</p>
        ) : (
          <ul className="mt-2 space-y-1">
            {challenges.map((c, idx) => (
              <li key={idx} className="text-gray-700">
                To {c.receiver_name} —{" "}
                <span className="italic text-sm">{c.status}</span>
              </li>
            ))}
          </ul>
        ))}
    </div>
  );
}

