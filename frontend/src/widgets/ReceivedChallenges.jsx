import React, { useEffect, useState } from "react";
import AvatarHoverCard from "../components/AvatarHoverCard";

export default function ReceivedChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await fetch(`http://localhost:5001/dashboard/received-challenges/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setChallenges(data);
      } catch (err) {
        console.error("Error loading received challenges:", err);
      }
    };

    fetchChallenges();
  }, [user.id, token]);

  return (
    <div className="border p-4 rounded shadow bg-white">
      <h2
        className="text-xl font-semibold cursor-pointer flex justify-between items-center"
        onClick={() => setCollapsed(!collapsed)}
      >
        📥 Received Challenges <span>{collapsed ? "+" : "−"}</span>
      </h2>

      {!collapsed && (
        <ul className="mt-4 space-y-2 text-sm">
          {challenges.length === 0 ? (
            <li>No challenges received.</li>
          ) : (
            challenges.map((c) => (
              <li key={c.id} className="p-2 rounded bg-gray-100 flex items-center gap-2">
                <AvatarHoverCard
                  player={{
                    id: c.sender_id,
                    first_name: c.sender_name?.split(" ")[0] || "?",
                    last_name: c.sender_name?.split(" ")[1] || "",
                    skill_level: c.sender_skill,
                    city: c.sender_city,
                    profile_picture: c.sender_avatar,
                  }}
                />
                <span>
                  from <strong>{c.sender_name}</strong> on {c.match_date} at {c.location} ({c.status})
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

