import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AvatarHoverCard from "../components/AvatarHoverCard";

export default function MatchHistory() {
  const [matches, setMatches] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`http://localhost:5001/dashboard/match-history/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setMatches(data);
        } else {
          setError(data.error || "Failed to fetch match history");
        }
      } catch (err) {
        setError("❌ Network error while fetching match history");
      }
    };
    fetchHistory();
  }, [user.id, token]);

  return (
    <div className="border p-4 rounded shadow bg-white">
      <h2 className="text-xl font-semibold cursor-pointer flex justify-between items-center"
        onClick={() => setCollapsed(!collapsed)}>
        📜 Match History <span>{collapsed ? "+" : "−"}</span>
      </h2>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            className="mt-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error && <p className="text-red-500">{error}</p>}
            {!error && matches.length === 0 && <p>No match history found.</p>}
            <ul className="space-y-2 text-sm">
              {matches.map((m) => {
                const [p1, p2] = m.score?.split("-").map(Number) || [0, 0];
                const isPlayer1 = m.player1_id === user.id;
                const won = (isPlayer1 && p1 > p2) || (!isPlayer1 && p2 > p1);
                const result = won ? "W" : "L";
                const borderColor = won ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50";

                return (
                  <motion.li
                    key={m.id}
                    className={`flex items-center gap-3 p-3 rounded border-l-4 ${borderColor}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AvatarHoverCard player={{
                      id: m.opponent_id,
                      first_name: m.opponent_name?.split(" ")[0] || "?",
                      last_name: m.opponent_name?.split(" ")[1] || "",
                      skill_level: m.opponent_skill,
                      city: m.opponent_city,
                      profile_picture: m.opponent_avatar,
                    }} />
                    <div className="flex flex-col">
                      <span>
                        vs <strong>{m.opponent_name}</strong> — {result} {m.score}
                      </span>
                      <span className="text-xs text-gray-500">
                        {m.match_date} • {m.location}
                      </span>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

