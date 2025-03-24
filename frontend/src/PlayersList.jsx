import React, { useEffect, useState } from "react";
import MatchHistory from "./widgets/MatchHistory";
import UpcomingMatches from "./widgets/UpcomingMatches";
import PlayerRankings from "./widgets/PlayerRankings";
import SentChallenges from "./widgets/SentChallenges";
import ReceivedChallenges from "./widgets/ReceivedChallenges";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  if (!user) return <div className="p-4">Loading user...</div>;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">
        🎾 Welcome, {user.first_name}!
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <MatchHistory userId={user.id} />
        <UpcomingMatches userId={user.id} />
        <PlayerRankings />
        <SentChallenges userId={user.id} />
        <ReceivedChallenges userId={user.id} />
      </div>
    </div>
  );
};

export default Dashboard;

