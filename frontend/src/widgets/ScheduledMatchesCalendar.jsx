// src/widgets/ScheduledMatchesCalendar.jsx
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { motion } from "framer-motion";
import AvatarHoverCard from "@/components/ui/AvatarHoverCard";
import axios from "axios";
import { toast } from "react-toastify";

export default function ScheduledMatchesCalendar({ userId }) {
  const [matches, setMatches] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchScheduledMatches = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/users/${userId}/calendar`);
      setMatches(res.data || []);
    } catch (err) {
      toast.error("Error loading match calendar");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchScheduledMatches();
  }, [userId]);

  const matchesOnDate = matches.filter((m) => m.match_date === selectedDate.toISOString().split("T")[0]);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Calendar value={selectedDate} onChange={setSelectedDate} />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded shadow p-4"
      >
        <h3 className="font-semibold text-lg mb-2">
          Matches on {selectedDate.toLocaleDateString()}
        </h3>
        {matchesOnDate.length ? (
          <ul className="space-y-2">
            {matchesOnDate.map((match) => (
              <li key={match.id} className="flex justify-between items-center border rounded px-3 py-2">
                <AvatarHoverCard player={match.opponent} />
                <div className="text-sm text-gray-600">
                  <div>{match.status}</div>
                  <div className="text-xs">{match.location}</div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-gray-500">No matches scheduled.</div>
        )}
      </motion.div>
    </div>
  );
}

