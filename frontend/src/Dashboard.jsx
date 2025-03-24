import React from "react";
import MatchHistory from "./widgets/MatchHistory";
import UpcomingMatches from "./widgets/UpcomingMatches";
import PlayerRankings from "./widgets/PlayerRankings";
import SentChallenges from "./widgets/SentChallenges";
import ReceivedChallenges from "./widgets/ReceivedChallenges";

export default function Dashboard({ user }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        {user?.first_name}'s Dashboard 🎾
      </h2>

      <div className="space-y-6 max-w-4xl mx-auto">
        <MatchHistory user={user} />
        <UpcomingMatches user={user} />
        <PlayerRankings />
        <SentChallenges user={user} />
        <ReceivedChallenges user={user} />
      </div>
    </div>
  );
}

