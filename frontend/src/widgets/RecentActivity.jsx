import React, { useEffect, useState } from "react";

export default function RecentActivity({ user }) {
  const [activity, setActivity] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchActivity = async () => {
      try {
        const res = await fetch(`http://localhost:5001/dashboard/activity/${user.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setActivity(data);
        } else {
          setError(data.error || "Failed to fetch activity.");
        }
      } catch (err) {
        setError("❌ Network error while fetching activity");
      }
    };

    fetchActivity();
  }, [user]);

  return (
    <div className="bg-white p-4 shadow rounded mb-4 w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-2">📌 Recent Challenge Activity</h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : activity.length === 0 ? (
        <p>No recent activity.</p>
      ) : (
        <ul className="space-y-2">
          {activity.map((item) => (
            <li key={item.id} className="border-b pb-1 text-sm">
              <strong>
                {item.sender_first} {item.sender_last}
              </strong>{" "}
              challenged{" "}
              <strong>
                {item.receiver_first} {item.receiver_last}
              </strong>{" "}
              –{" "}
              <em
                className={`capitalize ${item.status === "pending" ? "text-yellow-600" : item.status === "accepted" ? "text-green-600" : "text-red-600"}`}
              >
                {item.status}
              </em>{" "}
              on {new Date(item.created_at).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
