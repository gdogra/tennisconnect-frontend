import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MatchHistory from "./widgets/MatchHistory.jsx";
import UpcomingMatches from "./widgets/UpcomingMatches.jsx";
import PlayerRankings from "./widgets/PlayerRankings.jsx";
import SentChallenges from "./widgets/SentChallenges.jsx";
import ReceivedChallenges from "./widgets/ReceivedChallenges.jsx";
import ChallengeForm from "./ChallengeForm.jsx";
import ScheduledMatchesCalendar from "./widgets/ScheduledMatchesCalendar.jsx";
import RecentActivity from "./widgets/RecentActivity.jsx";
import Navbar from "./Navbar.jsx";
import { motion } from "framer-motion";

export default function Dashboard() {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading your dashboard...
      </div>
    );
  }

  if (!token || !user) {
    navigate("/login");
    return null;
  }

  const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">🎾 {user.first_name}'s Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <motion.div variants={fadeIn} initial="initial" animate="animate">
            <MatchHistory />
          </motion.div>
          <motion.div variants={fadeIn} initial="initial" animate="animate">
            <UpcomingMatches />
          </motion.div>
          <motion.div variants={fadeIn} initial="initial" animate="animate">
            <PlayerRankings />
          </motion.div>
          <motion.div variants={fadeIn} initial="initial" animate="animate">
            <ScheduledMatchesCalendar refreshTrigger={refreshKey} />
          </motion.div>
          <motion.div variants={fadeIn} initial="initial" animate="animate">
            <SentChallenges onActionComplete={triggerRefresh} />
          </motion.div>
          <motion.div variants={fadeIn} initial="initial" animate="animate">
            <ReceivedChallenges onActionComplete={triggerRefresh} />
          </motion.div>
          <motion.div variants={fadeIn} initial="initial" animate="animate">
            <ChallengeForm onSuccess={triggerRefresh} />
          </motion.div>
          <motion.div variants={fadeIn} initial="initial" animate="animate">
            <RecentActivity />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
