import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ChallengeList({ user }) {
  const [challenges, setChallenges] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5001/challenges/${user?.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setChallenges(data);
        } else {
          setError(data.error || "Failed to fetch challenges");
        }
      } catch (err) {
        setError("Server error");
      }
    };

    if (user?.id) fetchChallenges();
  }, [user]);

  if (!user?.id) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🎯 Your Challenges</h2>
      {error && <div className="text-red-600">{error}</div>}
      <table className="table-auto w-full border mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Opponent</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Location</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {challenges.map((c) => (
            <tr key={c.id}>
              <td className="border px-4 py-2">{c.opponent_name}</td>
              <td className="border px-4 py-2">{c.match_date}</td>
              <td className="border px-4 py-2">{c.location}</td>
              <td className="border px-4 py-2">{c.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
