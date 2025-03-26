// src/widgets/ScheduledMatchesCalendar.jsx
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../index.css";
import { toast } from "react-hot-toast";

export default function ScheduledMatchesCalendar() {
  const [matches, setMatches] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [rescheduling, setRescheduling] = useState(null);

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
    setRescheduling(match);
  };

  const handleReschedule = async () => {
    if (!rescheduling || !selectedDate) return;
    try {
      const res = await fetch(`http://localhost:5001/matches/${rescheduling.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date: selectedDate }),
      });

      if (res.ok) {
        toast.success("📅 Match rescheduled successfully");
        setRescheduling(null);
        fetchMatches();
      } else {
        toast.error("❌ Failed to reschedule");
      }
    } catch (err) {
      toast.error("❌ Network error");
    }
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
                match.status === "completed"
                  ? "bg-green-300"
                  : "bg-yellow-200 cursor-pointer"
              }`}
              onClick={() => handleMatchClick(match)}
            >
              {match.opponent} ({match.status === "completed" ? match.score : "vs"})
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

      {rescheduling && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <h3 className="text-lg font-bold mb-2">
            Rescheduling match with {rescheduling.opponent}
          </h3>
          <p>New date: {selectedDate.toDateString()}</p>
          <div className="mt-2 space-x-2">
            <button
              onClick={handleReschedule}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Confirm Reschedule
            </button>
            <button
              onClick={() => setRescheduling(null)}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

