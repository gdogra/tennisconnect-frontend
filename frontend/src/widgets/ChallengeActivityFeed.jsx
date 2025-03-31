import React, { useEffect, useState } from "react";

export default function ChallengeActivity() {
  const [activity, setActivity] = useState([]);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`http://localhost:5001/challenges/activity/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setActivity(data))
      .catch(() => setError("⚠️ Failed to load challenge activity."));
  }, []);

  return (
    <div className="bg-white rounded shadow p-4 mt-6">
      <h3 className="text-lg font-semibold mb-2">📊 Recent Challenge Activity</h3>
      {error && <p className="text-red-500">{error}</p>}
      {activity.length === 0 ? (
        <p>No recent activity.</p>
      ) : (
        <ul className="space-y-2">
          {activity.map((item) => (
            <li key={item.id} className="border-b pb-2">
              <strong>
                {item.sender_name} ➡ {item.receiver_name}
              </strong>{" "}
              on <em>{new Date(item.scheduled_date).toLocaleDateString()}</em> —{" "}
              <span className="italic">{item.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
