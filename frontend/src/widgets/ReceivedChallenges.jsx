import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import AvatarHoverCard from "../components/AvatarHoverCard";
import ScoreInputModal from "./ScoreInputModal"; // assumes modal exists
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";

export default function ReceivedChallenges({ onRefresh }) {
  const [challenges, setChallenges] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const res = await fetch(`http://localhost:5001/dashboard/received-challenges/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setChallenges(data);
    } catch (err) {
      console.error("Error loading received challenges:", err);
      toast.error("Failed to load challenges.");
    }
  };

  const handleAccept = (challenge) => {
    setSelectedChallenge(challenge);
    setShowCalendar(true);
  };

  const confirmDateAndAccept = async () => {
    if (!selectedDate || !selectedChallenge) return toast.warning("Select a date");

    try {
      const res = await fetch(`http://localhost:5001/challenges/${selectedChallenge.id}/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ matchDate: selectedDate }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Accept failed");

      toast.success("Challenge accepted and scheduled!");
      setShowCalendar(false);
      setSelectedChallenge(null);
      fetchChallenges();
      onRefresh?.(); // dashboard sync
    } catch (err) {
      console.error("Accept failed", err);
      toast.error("Error accepting challenge.");
    }
  };

  const handleScoreInput = (challenge) => {
    setSelectedChallenge(challenge);
    setShowScoreModal(true);
  };

  const submitScore = async (player1Score, player2Score) => {
    try {
      const res = await fetch(`http://localhost:5001/matches/${selectedChallenge.match_id}/score`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ player1Score, player2Score }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Score entry failed");

      toast.success("Score submitted!");
      setShowScoreModal(false);
      setSelectedChallenge(null);
      fetchChallenges();
      onRefresh?.();
    } catch (err) {
      toast.error("Error submitting score.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border p-4 shadow-sm bg-white"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">📥 Received Challenges</h2>
        <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? "Expand" : "Collapse"}
        </Button>
      </div>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {challenges.length === 0 ? (
              <p className="text-muted-foreground mt-2">No challenges received.</p>
            ) : (
              <ul className="divide-y mt-3">
                {challenges.map((ch) => (
                  <li key={ch.id} className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AvatarHoverCard user={ch.sender} />
                      <div>
                        <p className="font-medium">
                          {ch.sender.first_name} → You
                        </p>
                        <p className="text-sm text-muted-foreground">{ch.location}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleAccept(ch)}>Accept</Button>
                      <Button size="sm" variant="secondary" onClick={() => handleScoreInput(ch)}>Score</Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {showCalendar && (
        <div className="mt-4 border rounded-xl p-4 shadow bg-gray-50">
          <p className="mb-2 font-medium">Select Match Date:</p>
          <Calendar selected={selectedDate} onSelect={setSelectedDate} />
          <div className="flex justify-end mt-3 gap-2">
            <Button onClick={() => setShowCalendar(false)} variant="ghost">Cancel</Button>
            <Button onClick={confirmDateAndAccept}>Confirm</Button>
          </div>
        </div>
      )}

      {showScoreModal && selectedChallenge && (
        <ScoreInputModal
          matchId={selectedChallenge.match_id}
          onClose={() => setShowScoreModal(false)}
          onSubmit={submitScore}
        />
      )}
    </motion.div>
  );
}

