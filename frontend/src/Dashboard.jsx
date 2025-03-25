import React from "react";
import { useNavigate } from "react-router-dom";
import MatchHistory from "./widgets/MatchHistory";
import UpcomingMatches from "./widgets/UpcomingMatches";
import PlayerRankings from "./widgets/PlayerRankings";
import SentChallenges from "./widgets/SentChallenges";
import ReceivedChallenges from "./widgets/ReceivedChallenges";
import ChallengeForm from "./ChallengeForm";
import ScheduledMatchesCalendar from "./widgets/ScheduledMatchesCalendar";
import RecentActivity from "./widgets/RecentActivity";
import Navbar from "./Navbar";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  React.useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          🎾 {user?.first_name}'s Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <MatchHistory />
          <UpcomingMatches />
          <PlayerRankings />
          <ScheduledMatchesCalendar />
          <SentChallenges />
          <ReceivedChallenges />
          <ChallengeForm />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}

