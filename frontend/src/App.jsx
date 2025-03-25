import React, { useEffect, useState } from "react";
import MatchHistory from "./widgets/MatchHistory";
import UpcomingMatches from "./widgets/UpcomingMatches";
import PlayerRankings from "./widgets/PlayerRankings";
import SentChallenges from "./widgets/SentChallenges";
import ReceivedChallenges from "./widgets/ReceivedChallenges";

export default function Dashboard() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [notifications, setNotifications] = useState([]);
  const [toast, setToast] = useState(null);

  // Show toast for a few seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Add persistent notification
  const addNotification = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    const entry = `${timestamp}: ${message}`;
    setNotifications((prev) => [entry, ...prev.slice(0, 4)]); // keep last 5
  };

  const handleChallengeUpdate = (message) => {
    setToast(message);
    addNotification(message);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🎾 {user?.first_name}'s Dashboard
      </h1>

      {toast && (
        <div className="bg-green-500 text-white text-center py-2 rounded mb-4 shadow">
          {toast}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MatchHistory userId={user?.id} />
        <UpcomingMatches userId={user?.id} />
        <PlayerRankings />

        <SentChallenges userId={user?.id} onStatusUpdate={handleChallengeUpdate} />
        <ReceivedChallenges userId={user?.id} onStatusUpdate={handleChallengeUpdate} />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">🔔 Recent Activity</h2>
        {notifications.length > 0 ? (
          <ul className="space-y-1">
            {notifications.map((note, idx) => (
              <li key={idx} className="text-sm text-gray-700 bg-gray-100 rounded px-3 py-1 shadow-sm">
                {note}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No recent activity yet.</p>
        )}
      </div>
    </div>
  );
}

