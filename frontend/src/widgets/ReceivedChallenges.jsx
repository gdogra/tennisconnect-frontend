// src/widgets/ReceivedChallenges.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import AvatarHoverCard from "@/components/ui/AvatarHoverCard";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { Button } from "@/components/ui/button";

export default function ReceivedChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmAcceptId, setConfirmAcceptId] = useState(null);
  const [confirmDeclineId, setConfirmDeclineId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchChallenges = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5001/challenges/received/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (Array.isArray(res.data)) {
        setChallenges(res.data);
      } else {
        toast.warn("Unexpected response format for received challenges");
        setChallenges([]);
      }
    } catch (err) {
      console.error("Error fetching received challenges:", err);
      toast.error("Failed to fetch received challenges");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (challengeId) => {
    try {
      await axios.post(
        `http://localhost:5001/challenges/${challengeId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Challenge accepted!");
      fetchChallenges();
    } catch (err) {
      console.error("Error accepting challenge:", err);
      toast.error("Failed to accept challenge");
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
      toast.info("Challenge declined");
      fetchChallenges();
    } catch (err) {
      console.error("Error declining challenge:", err);
      toast.error("Failed to decline challenge");
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  if (loading) return <div>Loading received challenges...</div>;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">📥 Received Challenges</h3>
      {challenges.length === 0 ? (
        <p className="text-gray-500">You have no incoming challenges.</p>
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
                    <AvatarHoverCard player={challenge.sender} size="lg" />
                    <div>
                      <div className="font-semibold">
                        {challenge.sender?.first_name}{" "}
                        {challenge.sender?.last_name}
                      </div>
                      <div className="text-sm text-gray-600">
                        Skill: {challenge.sender?.skill_level || "N/A"}
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
                    <div className="mt-2 flex gap-2 justify-end">
                      <Button
                        size="sm"
                        onClick={() => setConfirmAcceptId(challenge.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setConfirmDeclineId(challenge.id)}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <ConfirmationModal
        open={!!confirmAcceptId}
        title="Accept Challenge"
        description="Do you want to accept this challenge?"
        onConfirm={() => {
          handleAccept(confirmAcceptId);
          setConfirmAcceptId(null);
        }}
        onCancel={() => setConfirmAcceptId(null)}
      />
      <ConfirmationModal
        open={!!confirmDeclineId}
        title="Decline Challenge"
        description="Are you sure you want to decline this challenge?"
        onConfirm={() => {
          handleDecline(confirmDeclineId);
          setConfirmDeclineId(null);
        }}
        onCancel={() => setConfirmDeclineId(null)}
      />
    </div>
  );
}

