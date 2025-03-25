import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function MatchCalendar({ userId }) {
  const [matches, setMatches] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [matchesForDate, setMatchesForDate] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5001/dashboard/match-history/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMatches(data);
      } catch (err) {
        console.error("Failed to load match history for calendar.");
      }
    };
    fetchMatches();
  }, [userId]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const formatted = date.toISOString().split("T")[0];
    const filtered = matches.filter((match) =>
      match.match_date.startsWith(formatted)
    );
    setMatchesForDate(filtered);
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="font-bold mb-4">📆 Match Calendar</h2>
      <Calendar onChange={handleDateChange} value={selectedDate} />
      {selectedDate && (
        <div className="mt-4">
          <h3 className="font-semibold text-lg">
            Matches on {selectedDate.toDateString()}:
          </h3>
          {matchesForDate.length > 0 ? (
            <ul className="list-disc ml-6">
              {matchesForDate.map((m) => (
                <li key={m.id}>
                  {m.player1} vs {m.player2} — Winner: <strong>{m.winner}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600 mt-1">No matches recorded.</p>
          )}
        </div>
      )}
    </div>
  );
}

