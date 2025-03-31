// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import ReceivedChallenges from "@/widgets/ReceivedChallenges";
import SentChallenges from "@/widgets/SentChallenges";
import MatchHistory from "@/widgets/MatchHistory";
import ScheduledMatchesCalendar from "@/widgets/ScheduledMatchesCalendar";
import UpcomingMatches from "@/widgets/UpcomingMatches";
import PlayerRankings from "@/widgets/PlayerRankings";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Dashboard() {
  const [refreshFlag, setRefreshFlag] = useState(false);

  const triggerRefresh = () => setRefreshFlag(prev => !prev);

  useEffect(() => {
    toast.success("Welcome to your dashboard! 🎾");
  }, []);

  return (
    <div className="p-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="colored" />
      <h1 className="text-2xl font-bold mb-6">🎾 Helen's Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">📥 Received Challenges</h2>
        <ReceivedChallenges refreshFlag={refreshFlag} triggerRefresh={triggerRefresh} />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">📤 Sent Challenges</h2>
        <SentChallenges refreshFlag={refreshFlag} triggerRefresh={triggerRefresh} />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">📅 Upcoming Matches</h2>
        <UpcomingMatches refreshFlag={refreshFlag} />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">🏆 Player Rankings</h2>
        <PlayerRankings />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">📆 Match & Challenge Calendar</h2>
        <ScheduledMatchesCalendar refreshFlag={refreshFlag} />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">📌 Recent Challenge Activity</h2>
        <MatchHistory refreshFlag={refreshFlag} />
      </section>
    </div>
  );
}

