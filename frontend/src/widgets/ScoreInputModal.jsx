// src/widgets/ScoreInputModal.jsx
import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function ScoreInputModal({ isOpen, onClose, matchId, onSubmit }) {
  const [player1Score, setPlayer1Score] = useState("");
  const [player2Score, setPlayer2Score] = useState("");

  const handleSubmit = async () => {
    if (player1Score === "" || player2Score === "") {
      toast.error("Please enter scores for both players");
      return;
    }

    const res = await fetch(`http://localhost:5001/matches/${matchId}/score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        player1Score: parseInt(player1Score),
        player2Score: parseInt(player2Score),
      }),
    });

    if (res.ok) {
      toast.success("✅ Score submitted!");
      onSubmit();
      onClose();
    } else {
      toast.error("❌ Failed to submit score.");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white p-6 rounded-2xl shadow-xl z-10 w-full max-w-md space-y-4"
        >
          <Dialog.Title className="text-xl font-bold">Enter Match Score</Dialog.Title>
          <div className="flex space-x-4">
            <input
              type="number"
              placeholder="Player 1"
              value={player1Score}
              onChange={(e) => setPlayer1Score(e.target.value)}
              className="border rounded p-2 w-full"
            />
            <input
              type="number"
              placeholder="Player 2"
              value={player2Score}
              onChange={(e) => setPlayer2Score(e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={onClose}
              className="bg-gray-200 text-gray-700 rounded px-4 py-2 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </motion.div>
      </div>
    </Dialog>
  );
}
