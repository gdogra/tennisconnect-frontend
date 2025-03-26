import React, { useEffect, useState } from "react";

export default function SentChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await fetch(`http://localhost:5001/dashboard/sent-challenges/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setChallenges(data);
      } catch (err) {
        console.error("Error loading sent challenges:", err);
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
        📤 Sent Challenges <span>{collapsed ? "+" : "−"}</span>
      </h2>

      {!collapsed && (
        <ul className="mt-4 space-y-2">
          {challenges.length === 0 ? (
            <li>No challenges sent.</li>
          ) : (
            challenges.map((c) => {
              const initials = c.receiver_name?.split(" ").map(n => n[0]).join("");
              return (
                <li key={c.id} className="p-2 rounded bg-gray-100 flex items-center gap-2">
                  {c.receiver_avatar ? (
                    <img src={c.receiver_avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                      {initials}
                    </div>
                  )}
                  <span>
                    vs <strong>{c.receiver_name}</strong> on {c.match_date} at {c.location} ({c.status})
                  </span>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}

