// src/components/ChallengeModal.jsx
import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

const ChallengeModal = ({ opponent, onClose, onSubmit }) => {
  const [matchDate, setMatchDate] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    if (!matchDate || !location || !phone) {
      setError("All fields are required.");
      return;
    }

    onSubmit(matchDate, location, phone);
    setSuccess(true);
    toast.success("🎉 Challenge sent successfully!");
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <motion.div
          className="relative bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto z-50"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <Dialog.Title className="text-lg font-semibold mb-2">
            Challenge {opponent.first_name} {opponent.last_name}
          </Dialog.Title>

          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          {success && <div className="text-green-600 text-sm mb-2">✅ Challenge sent!</div>}

          <div className="mb-4">
            <label className="block text-sm font-medium">Match Date</label>
            <input
              type="datetime-local"
              value={matchDate}
              onChange={(e) => setMatchDate(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded px-2 py-1"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Court address or area"
              className="w-full mt-1 border border-gray-300 rounded px-2 py-1"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Contact Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              className="w-full mt-1 border border-gray-300 rounded px-2 py-1"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={success}>Send Challenge</Button>
          </div>
        </motion.div>
      </div>
    </Dialog>
  );
};

export default ChallengeModal;

