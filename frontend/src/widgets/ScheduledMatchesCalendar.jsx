// src/widgets/ScheduledMatchesCalendar.jsx
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../index.css";
import { toast } from "react-hot-toast";
import MatchModal from "./MatchModal";

export default function ScheduledMatchesCalendar() {
  const [matches, setMatches] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMatch, setSelectedMatch] = useState(null);

  const token = localStorage.getItem("token");

  const fetchMatches = async () => {
    try {
      const res = await fetch("http://localhost:5001/matches", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMatches(data);
    } catch (err) {
      console.error("Error fetching matches:", err);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleMatchClick = (match) => {
    setSelectedMatch(match);
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const tileContent = ({ date }) => {
    const formattedDate = date.toISOString().split("T")[0];
    const dayMatches = matches.filter((m) => m.date.startsWith(formattedDate));

    if (dayMatches.length > 0) {
      return (
        <ul className="text-xs text-center">
          {dayMatches.map((match, idx) => (
            <li
              key={idx}
              className={`px-1 py-0.5 rounded ${
                match.completed
                  ? "bg-green-300"
                  : "bg-yellow-200 cursor-pointer hover:bg-yellow-300"
              }`}
              onClick={() => handleMatchClick(match)}
              title={`vs ${match.opponent} at ${match.location}`}
            >
              {match.opponent} ({match.completed ? match.score : "vs"})
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  return (
    <div className="p-4 bg-white rounded shadow mt-4">
      <h2 className="text-xl font-semibold mb-4">📆 Match Calendar</h2>
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileContent={tileContent}
      />

      {selectedMatch && (
        <MatchModal
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
          onMatchUpdated={fetchMatches}
          token={token}
        />
      )}
    </div>
  );
}

