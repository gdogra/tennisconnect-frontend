// src/widgets/MatchHistory.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import AvatarHoverCard from "./AvatarHoverCard";
import { toast } from "react-toastify";

export default function MatchHistory() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5001/users/${user.id}/history`
      );
      setMatches(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching match history:", err);
      toast.error("Failed to load match history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading) return <div>Loading match history...</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">📜 Match History</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {matches.map((match) => {
          const opponent =
            match.opponent?.id === user.id ? match.user : match.opponent;
          return (
            <motion.div
              key={match.id}
              className="border rounded p-4 shadow bg-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <AvatarHoverCard player={opponent} />
              <div className="mt-2">
                <div className="font-semibold">
                  {opponent?.first_name} {opponent?.last_name}
                </div>
                <div className="text-sm text-gray-600">
                  📅 {match.match_date || "Date unknown"}
                </div>
                <div className="text-sm text-gray-600">
                  📍 {match.location || "Location unknown"}
                </div>
                <div className="text-sm text-gray-600">
                  🏆 {match.winner_id === user.id ? "You won!" : "You lost."}
                </div>
                <div className="text-sm text-gray-600">
                  Score: {match.score || "N/A"}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

