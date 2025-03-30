import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import ChallengeCard from "./ChallengeCard";

export default function ReceivedChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchReceivedChallenges = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const { data } = await axios.get(`/challenges/received/${user.id}`);
        setChallenges(data);
      } catch (err) {
        console.error("Failed to load received challenges:", err);
        toast.error("Could not load received challenges.");
      }
    };

    fetchReceivedChallenges();
  }, []);

  const handleAccept = async (id) => {
    try {
      await axios.post(`/challenges/${id}/accept`, {
        match_date: new Date(),
        location: "TBD",
      });
      toast.success("Challenge accepted!");
      setChallenges((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "accepted" } : c))
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to accept challenge.");
    }
  };

  const handleDecline = (id) => {
    toast.info("Decline not implemented yet.");
  };

  const handleSchedule = (id) => {
    toast.info("Scheduling not implemented yet.");
  };

  const filtered = challenges.filter((c) =>
    filter === "all" ? true : c.status === filter
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Received Challenges</h2>
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 border px-2 py-1 rounded"
      >
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="accepted">Accepted</option>
      </select>

      {filtered.length > 0 ? (
        filtered.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            onAccept={handleAccept}
            onDecline={handleDecline}
            onSchedule={handleSchedule}
            isReceived
          />
        ))
      ) : (
        <p className="text-sm text-gray-500">No received challenges.</p>
      )}
      <ToastContainer />
    </div>
  );
}

