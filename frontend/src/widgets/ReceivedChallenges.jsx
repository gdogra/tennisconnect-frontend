import React, { useEffect, useState } from "react";

export default function ReceivedChallenges({ onToast, onActivity }) {
  const [challenges, setChallenges] = useState([]);
  const [collapsed, setCollapsed] = useState(false);

  const fetchChallenges = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await fetch(
        `http://localhost:5001/dashboard/received-challenges/${user.id}`,
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
      onToast?.("❌ Network error while fetching received challenges", "error");
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleUpdateStatus = async (id, newStatus, senderName) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5001/dashboard/update-challenge/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      onToast?.(`✅ Challenge ${newStatus.toLowerCase()}`, "success");
      onActivity?.(`${newStatus} challenge`, senderName);
      fetchChallenges(); // Refresh
    } catch (err) {
      onToast?.("❌ Failed to update challenge", "error");
    }
  };

  return (
    <div className="bg-white shadow-md rounded p-4 mt-4">
      <h2
        className="text-xl font-semibold cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        📥 Received Challenges {collapsed ? "+" : "−"}
      </h2>
      {!collapsed &&
        (challenges.length === 0 ? (
          <p className="text-gray-500 mt-2">No challenges received.</p>
        ) : (
          <ul className="mt-2 space-y-3">
            {challenges.map((c) => (
              <li key={c.id} className="flex justify-between items-center">
                <div>
                  From {c.sender_name} —{" "}
                  <span className="italic text-sm">{c.status}</span>
                </div>
                {c.status === "Pending" && (
                  <div className="space-x-2">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                      onClick={() =>
                        handleUpdateStatus(c.id, "Accepted", c.sender_name)
                      }
                    >
                      Accept
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                      onClick={() =>
                        handleUpdateStatus(c.id, "Declined", c.sender_name)
                      }
                    >
                      Decline
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ))}
    </div>
  );
}

