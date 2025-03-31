// src/widgets/ReceivedChallenges.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import AvatarHoverCard from "./AvatarHoverCard";
import ConfirmationModal from "../components/ConfirmationModal";

export default function ReceivedChallenges({ userId, refreshDashboard }) {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmAction, setConfirmAction] = useState(null);

  const fetchChallenges = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/challenges/received/${userId}`);
      setChallenges(res.data);
    } catch (err) {
      console.error("Error fetching received challenges:", err);
      toast.error("Failed to load received challenges");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, [userId]);

  const handleAccept = async (challengeId) => {
    try {
      await axios.post(`http://localhost:5001/challenges/${challengeId}/accept`);
      toast.success("Challenge accepted!");
      fetchChallenges();
      refreshDashboard();
    } catch (err) {
      console.error("Error accepting challenge:", err);
      toast.error("Could not accept challenge");
    }
  };

  const handleDecline = async (challengeId) => {
    try {
      await axios.post(`http://localhost:5001/challenges/${challengeId}/decline`);
      toast.info("Challenge declined");
      fetchChallenges();
      refreshDashboard();
    } catch (err) {
      console.error("Error declining challenge:", err);
      toast.error("Could not decline challenge");
    }
  };

  if (loading) return <div className="text-center py-4">Loading challenges...</div>;

  if (challenges.length === 0) return <div className="text-gray-500 italic text-center">No received challenges.</div>;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">📥 Received Challenges</h3>
      <AnimatePresence>
        {challenges.map((ch) => (
          <motion.div
            key={ch.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-4 border rounded shadow-sm bg-white mb-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <AvatarHoverCard player={ch.sender} />
              <div>
                <div className="font-medium">{ch.sender?.first_name} {ch.sender?.last_name}</div>
                <div className="text-sm text-gray-600">Skill: {ch.sender?.skill_level || 'N/A'}</div>
                <div className="text-sm text-gray-600">📍 {ch.location || 'No location'}</div>
                <div className="text-sm text-gray-600">📅 {ch.match_date || 'Not scheduled'}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmAction({ type: "accept", id: ch.id })}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Accept
              </button>
              <button
                onClick={() => setConfirmAction({ type: "decline", id: ch.id })}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Decline
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {confirmAction && (
        <ConfirmationModal
          title={confirmAction.type === "accept" ? "Accept Challenge" : "Decline Challenge"}
          message={`Are you sure you want to ${confirmAction.type} this challenge?`}
          onCancel={() => setConfirmAction(null)}
          onConfirm={() => {
            if (confirmAction.type === "accept") handleAccept(confirmAction.id);
            if (confirmAction.type === "decline") handleDecline(confirmAction.id);
            setConfirmAction(null);
          }}
        />
      )}
    </div>
  );
}

