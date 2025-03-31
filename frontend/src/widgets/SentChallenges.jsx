// src/widgets/SentChallenges.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import AvatarHoverCard from "./AvatarHoverCard";
import ConfirmationModal from "./ConfirmationModal";

export default function SentChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchSentChallenges = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5001/challenges/sent/${user.id}`
      );
      setChallenges(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching sent challenges:", err);
      toast.error("Failed to load sent challenges");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSentChallenges();
  }, []);

  const handleCancel = async (challengeId) => {
    try {
      await axios.post(
        `http://localhost:5001/challenges/${challengeId}/decline`
      );
      toast.success("Challenge cancelled");
      fetchSentChallenges();
    } catch (err) {
      console.error("Error cancelling challenge:", err);
      toast.error("Failed to cancel challenge");
    }
  };

  if (loading) return <div>Loading sent challenges...</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">📤 Sent Challenges</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {challenges.map((challenge) => (
          <motion.div
            key={challenge.id}
            className="border rounded p-4 shadow bg-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AvatarHoverCard player={challenge.receiver} />
            <div className="mt-2">
              <div className="font-semibold">
                {challenge.receiver?.first_name} {challenge.receiver?.last_name}
              </div>
              <div className="text-sm text-gray-600 capitalize">
                Status: {challenge.status}
              </div>
              <div className="text-sm text-gray-600">
                📍 {challenge.location || "No location"}
              </div>
              <div className="text-sm text-gray-600">
                📅 {challenge.match_date || "Not scheduled"}
              </div>
              <button
                className="mt-2 text-sm text-red-500 hover:underline"
                onClick={() => setSelectedChallenge(challenge)}
              >
                Cancel Challenge
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedChallenge && (
        <ConfirmationModal
          title="Cancel Challenge"
          message={`Are you sure you want to cancel your challenge to ${selectedChallenge.receiver?.first_name}?`}
          onConfirm={() => {
            handleCancel(selectedChallenge.id);
            setSelectedChallenge(null);
          }}
          onCancel={() => setSelectedChallenge(null)}
        />
      )}
    </div>
  );
}

