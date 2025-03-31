import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../index.css";
import AvatarHoverCard from "../components/AvatarHoverCard";
import { motion, AnimatePresence } from "framer-motion";

export default function ScheduledMatchesCalendar({ refreshTrigger }) {
  const [entries, setEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMatch, setSelectedMatch] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchData = async () => {
    try {
      const matchesRes = await fetch("http://localhost:5001/matches");
      if (!matchesRes.ok) throw new Error(`Failed /matches: ${matchesRes.status}`);
      const matches = await matchesRes.json();

      const sentRes = await fetch(`http://localhost:5001/challenges/sent/${user.id}`);
      if (!sentRes.ok) throw new Error(`Failed /challenges/sent: ${sentRes.status}`);
      const sent = await sentRes.json();

      const receivedRes = await fetch(`http://localhost:5001/challenges/received/${user.id}`);
      if (!receivedRes.ok) throw new Error(`Failed /challenges/received: ${receivedRes.status}`);
      const received = await receivedRes.json();

      const formatChallenge = (c, isSent) => ({
        ...c,
        isChallenge: true,
        match_date: c.match_date,
        opponent: isSent
          ? `${c.receiver_first_name} ${c.receiver_last_name}`
          : `${c.sender_first_name} ${c.sender_last_name}`,
        opponent_avatar: isSent ? c.receiver_avatar : c.sender_avatar,
        location: c.location || "TBD",
        opponent_id: isSent ? c.receiver_id : c.sender_id,
        opponent_skill: isSent ? c.receiver_skill_level : c.sender_skill_level,
        opponent_city: isSent ? c.receiver_city : c.sender_city,
      });

      const formattedChallenges = [
        ...sent.map((c) => formatChallenge(c, true)),
        ...received.map((c) => formatChallenge(c, false)),
      ];

      setEntries([...matches, ...formattedChallenges]);
    } catch (err) {
      console.error("Error fetching match/challenge data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const handleDateChange = (date) => setSelectedDate(date);
  const handleMatchClick = (match) => setSelectedMatch(match);

  const tileContent = ({ date }) => {
    const formattedDate = date.toISOString().split("T")[0];
    const dayEntries = entries.filter((m) => m.match_date?.startsWith(formattedDate));
    if (!dayEntries.length) return null;

    return (
      <ul className="text-[10px] text-center space-y-1">
        {dayEntries.map((match) => {
          const initials = match.opponent
            ?.split(" ")
            .map((n) => n[0])
            .join("");
          const bg = match.isChallenge
            ? "bg-orange-200"
            : match.player1_score != null
              ? "bg-green-200"
              : "bg-yellow-200";
          return (
            <motion.li
              key={`match-${match.id}-${match.isChallenge ? "c" : "m"}`}
              className={`${bg} px-1 py-0.5 rounded cursor-pointer`}
              onClick={() => handleMatchClick(match)}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {match.opponent_avatar ? (
                <img
                  src={match.opponent_avatar}
                  alt="avatar"
                  className="w-4 h-4 rounded-full inline-block mr-1 object-cover"
                />
              ) : (
                <span className="inline-block w-4 h-4 rounded-full bg-blue-500 text-white text-[8px] font-bold mr-1">
                  {initials}
                </span>
              )}
              {match.opponent}
            </motion.li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="p-4 bg-white rounded shadow mt-4">
      <h2 className="text-xl font-semibold mb-4">📆 Match & Challenge Calendar</h2>
      <Calendar onChange={handleDateChange} value={selectedDate} tileContent={tileContent} />

      <AnimatePresence>
        {selectedMatch && (
          <motion.div
            key={selectedMatch.id}
            className="mt-4 p-4 border rounded bg-gray-50"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <AvatarHoverCard
                player={{
                  id: selectedMatch.opponent_id,
                  first_name: selectedMatch.opponent?.split(" ")[0],
                  last_name: selectedMatch.opponent?.split(" ")[1],
                  skill_level: selectedMatch.opponent_skill,
                  city: selectedMatch.opponent_city,
                  profile_picture: selectedMatch.opponent_avatar,
                }}
              />

              <div className="text-sm">
                <div>
                  <strong>
                    {selectedMatch.isChallenge ? "Challenge vs" : "Match vs"}{" "}
                    {selectedMatch.opponent}
                  </strong>
                </div>
                <div className="text-gray-600">
                  {selectedMatch.match_date} • {selectedMatch.location}
                </div>
                {selectedMatch.player1_score != null && selectedMatch.player2_score != null && (
                  <div className="text-sm mt-1">
                    Final Score: {selectedMatch.player1_score}-{selectedMatch.player2_score}
                  </div>
                )}
                <button
                  onClick={() => setSelectedMatch(null)}
                  className="mt-2 text-xs text-blue-500 underline"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
