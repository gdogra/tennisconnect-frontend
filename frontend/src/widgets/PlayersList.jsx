// src/widgets/PlayersList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AvatarHoverCard from "@/components/ui/AvatarHoverCard";
import ChallengeModal from "@/components/ChallengeModal";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";

export default function PlayersList() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOpponent, setSelectedOpponent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5001/players", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;
        if (Array.isArray(data)) {
          setPlayers(data);
        } else {
          console.warn("Unexpected players response format:", data);
          setPlayers([]);
        }
      } catch (err) {
        console.error("Error fetching players:", err);
        toast.error("Failed to fetch players");
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const handleChallenge = async (opponentId, date, location, phone) => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const res = await axios.post("http://localhost:5001/challenges", {
        sender_id: user.id,
        receiver_id: opponentId,
        match_date: date,
        location,
        contact_phone: phone,
      });
      toast.success("Challenge sent successfully!");
    } catch (err) {
      console.error("Error sending challenge:", err);
      toast.error("Failed to send challenge");
    }
  };

  if (loading) return <div>Loading players...</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">🎾 Available Players</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {players.map((player) => (
          <motion.div
            key={player.id}
            className="border rounded p-4 shadow-sm bg-white"
            whileHover={{ scale: 1.02 }}
          >
            <AvatarHoverCard player={player} />
            <div className="mt-2">
              <div className="font-semibold">{player.first_name} {player.last_name}</div>
              <div className="text-sm text-gray-600">Skill: {player.skill_level}</div>
              <div className="text-sm text-gray-600">City: {player.city}</div>
              <div className="mt-2 flex gap-2">
                <Button size="sm" onClick={() => navigate(`/profile/${player.id}`)}>View Profile</Button>
                <Button size="sm" onClick={() => setSelectedOpponent(player)}>Challenge</Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {selectedOpponent && (
        <ChallengeModal
          opponent={selectedOpponent}
          onClose={() => setSelectedOpponent(null)}
          onSubmit={(date, location, phone) => handleChallenge(selectedOpponent.id, date, location, phone)}
        />
      )}
    </div>
  );
}

