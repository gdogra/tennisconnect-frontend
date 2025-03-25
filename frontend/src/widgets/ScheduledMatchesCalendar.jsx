import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import toast from "react-hot-toast";

export default function ScheduledMatchesCalendar() {
  const [matches, setMatches] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [matchesForDay, setMatchesForDay] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5001/matches/scheduled", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setMatches(data);
        } else {
          toast.error("❌ Failed to load scheduled matches.");
        }
      } catch (err) {
        console.error("Error fetching matches:", err);
        toast.error("❌ Network error while loading scheduled matches.");
      }
    };

    fetchMatches();
  }, []);

  useEffect(() => {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    const dayMatches = matches.filter(m => m.date === formattedDate);
    setMatchesForDay(dayMatches);
  }, [selectedDate, matches]);

  return (
    <div className="bg-white p-4 rounded-lg shadow w-full">
      <h2 className="text-xl font-semibold mb-4">📅 Scheduled Matches</h2>
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        className="mx-auto"
      />
      <div className="mt-4">
        <h3 className="font-medium text-gray-700">
          Matches on {selectedDate.toDateString()}:
        </h3>
        {matchesForDay.length > 0 ? (
          <ul className="list-disc ml-6 mt-2 text-sm text-gray-800">
            {matchesForDay.map(match => (
              <li key={match.id}>
                {match.player1_name} vs {match.player2_name} at {match.location}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-600 mt-2">No matches scheduled.</p>
        )}
      </div>
    </div>
  );
}

