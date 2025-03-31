// src/widgets/Dashboard.jsx
import React from "react";
import ReceivedChallenges from "./ReceivedChallenges";
import SentChallenges from "./SentChallenges";
import MatchHistory from "./MatchHistory";

export default function Dashboard() {
  return (
    <div className="p-4 space-y-6">
      <ReceivedChallenges />
      <SentChallenges />
      <MatchHistory />
    </div>
  );
}

