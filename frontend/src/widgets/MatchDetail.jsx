// src/widgets/MatchDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function MatchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchDetail = async () => {
      try {
        const [matchRes, historyRes] = await Promise.all([
          axios.get(`/matches/${id}`),
          axios.get(`/challenges/history-by-match/${id}`),
        ]);
        setMatch(matchRes.data);
        setHistory(historyRes.data);
      } catch (err) {
        console.error("Failed to load match detail:", err);
        toast.error("Could not load match details.");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetail();
  }, [id, navigate]);

  if (loading) {
    return <div className="p-4 text-gray-500">Loading match details...</div>;
  }

  if (!match) {
    return <div className="p-4 text-red-500">Match not found.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Match Detail</h2>
      <Card className="p-4 space-y-2">
        <div>Date: {new Date(match.match_date).toLocaleDateString()}</div>
        <div>Location: {match.location}</div>
        <div>Score: {match.score ? match.score : "Not yet submitted"}</div>
      </Card>

      <h3 className="text-xl font-semibold mt-6">Challenge History</h3>
      <div className="space-y-2">
        {history.length === 0 ? (
          <div className="text-gray-500">No related challenge history found.</div>
        ) : (
          history.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 border rounded-md bg-white shadow"
            >
              <div>Status: {item.status}</div>
              <div>
                Challenger: {item.sender_first_name} ➡️ {item.receiver_first_name}
              </div>
              <div>
                Requested Date:{" "}
                {item.preferred_date ? new Date(item.preferred_date).toLocaleDateString() : "N/A"}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
