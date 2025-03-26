import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import toast from "react-hot-toast";

export default function ReceivedChallenges({ userId }) {
  const [challenges, setChallenges] = useState([]);
  const [openCalendarId, setOpenCalendarId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    axios
      .get(`http://localhost:5001/dashboard/received-challenges/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setChallenges(res.data);
      })
      .catch(() => {
        toast.error("❌ Failed to fetch received challenges.");
      });
  }, [userId]);

  const handleSchedule = (challengeId) => {
    const token = localStorage.getItem("token");

    axios
      .post(
        "http://localhost:5001/schedule-match",
        {
          challenge_id: challengeId,
          scheduled_date: selectedDate.toISOString().split("T")[0],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        toast.success("✅ Match scheduled!");
        setOpenCalendarId(null);
        setChallenges((prev) =>
          prev.filter((c) => c.challenge_id !== challengeId)
        );
      })
      .catch(() => {
        toast.error("❌ Failed to schedule match.");
      });
  };

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h3 className="text-lg font-semibold mb-2">📥 Received Challenges</h3>
      {challenges.length === 0 ? (
        <p className="text-gray-500">No challenges received.</p>
      ) : (
        challenges.map((c) => (
          <div
            key={c.challenge_id}
            className="border p-2 mb-3 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-medium">
                From: {c.sender_first_name} {c.sender_last_name}
              </p>
              <p className="text-sm text-gray-600">
                Skill: {c.sender_skill_level} | City: {c.sender_city}
              </p>
            </div>
            <div className="text-right">
              <button
                onClick={() =>
                  setOpenCalendarId(
                    openCalendarId === c.challenge_id ? null : c.challenge_id
                  )
                }
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                {openCalendarId === c.challenge_id
                  ? "Cancel"
                  : "Schedule Match"}
              </button>
            </div>
            {openCalendarId === c.challenge_id && (
              <div className="mt-2 w-full">
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  className="mx-auto mt-2 border rounded"
                />
                <button
                  onClick={() => handleSchedule(c.challenge_id)}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Confirm Date
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

