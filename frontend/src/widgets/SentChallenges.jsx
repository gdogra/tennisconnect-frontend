import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ChallengeCard from "./ChallengeCard";

export default function SentChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchSentChallenges = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const res = await axios.get(`/challenges/sent/${user.id}?status=${statusFilter}`);
        if (Array.isArray(res.data)) {
          setChallenges(res.data);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err) {
        console.error("❌ Error fetching sent challenges:", err);
        toast.error("Failed to load sent challenges");
      }
    };

    fetchSentChallenges();
  }, [statusFilter]);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">Sent Challenges</h2>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
        </select>
      </div>
      {Array.isArray(challenges) && challenges.length > 0 ? (
        challenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            type="sent"
          />
        ))
      ) : (
        <p className="text-gray-500 text-sm">No challenges to display.</p>
      )}
    </div>
  );
}

