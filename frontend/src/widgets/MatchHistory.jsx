// src/widgets/MatchHistory.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AvatarHoverCard from "@/components/ui/AvatarHoverCard";
import axios from "axios";
import { toast } from "react-toastify";

export default function MatchHistory({ userId }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/users/${userId}/history`);
        if (Array.isArray(res.data)) {
          setMatches(res.data);
        } else {
          toast.error("Invalid match history format");
        }
      } catch (err) {
        toast.error("Error fetching match history");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatchHistory();
  }, [userId]);

  if (loading) return <div className="text-center mt-4">Loading match history...</div>;
  if (!matches.length) return <div className="text-center mt-4">No match history yet.</div>;

  return (
    <div className="space-y-3">
      {matches.map((match, index) => (
        <motion.div
          key={match.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          className="bg-white p-3 rounded-lg shadow"
        >
          <div className="flex items-center justify-between">
            <AvatarHoverCard player={match.opponent} />
            <div className="text-sm text-gray-600">
              <div className="font-semibold">{match.result}</div>
              <div>{match.date}</div>
              <div className="text-xs">{match.location}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

