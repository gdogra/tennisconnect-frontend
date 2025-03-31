// src/widgets/SentChallenges.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import AvatarHoverCard from "@/components/ui/AvatarHoverCard";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { Button } from "@/components/ui/button";

export default function SentChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeclineId, setConfirmDeclineId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchChallenges = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5001/challenges/sent/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (Array.isArray(res.data)) {
        setChallenges(res.data);
      } else {
        toast.warn("Unexpected response format for sent challenges");
        setChallenges([]);
      }
    } catch (err) {
      console.error("Error fetching sent challenges:", err);
      toast.error("Failed to fetch sent challenges");
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async (challengeId) => {
    try {
      await axios.post(
        `http://localhost:5001/challenges/${challengeId}/decline`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Challenge cancelled");
      fetchChallenges();
    } catch (err) {
      console.error("Error cancelling challenge:", err);
      toast.error("Failed to cancel challenge");
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  if (loading) return <div>Loading sent challenges...</div>;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">📤 Sent Challenges</h3>
      {challenges.length === 0 ? (
        <p className="text-gray-500">You haven't sent any challenges yet.</p>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {challenges.map((challenge) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="border rounded-lg p-4 shadow bg-white"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <AvatarHoverCard player={challenge.receiver} size="lg" />
                    <div>
                      <div className="font-semibold">
                        {challenge.receiver?.first_name}{" "}
                        {challenge.receiver?.last_name}
                      </div>
                      <div className="text-sm text-gray-600">
                        Skill: {challenge.receiver?.skill_level || "N/A"}
                      </div>
                      <div className="text-sm text-gray-600">
                        Status:{" "}
                        <span className="capitalize text-blue-600">
                          {challenge.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      📍 {challenge.location || "No location"}
                    </div>
                    <div className="text-sm text-gray-500">
                      📅{" "}
                      {challenge.match_date
                        ? new Date(challenge.match_date).toLocaleDateString()
                        : "Not scheduled"}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="mt-2"
                      onClick={() => setConfirmDeclineId(challenge.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <ConfirmationModal
        open={!!confirmDeclineId}
        title="Cancel Challenge"
        description="Are you sure you want to cancel this challenge?"
        onConfirm={() => {
          handleDecline(confirmDeclineId);
          setConfirmDeclineId(null);
        }}
        onCancel={() => setConfirmDeclineId(null)}
      />
    </div>
  );
}

