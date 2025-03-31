// src/components/MatchHistoryDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function MatchHistoryDetail() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/matches/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setMatch(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load match details:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-6">Loading match details...</div>;

  if (!match) return <div className="p-6 text-red-500">Match not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Match Detail: #{id}</h2>
      <p>
        <strong>Opponent:</strong> {match.opponent_name}
      </p>
      <p>
        <strong>Date:</strong> {match.date}
      </p>
      <p>
        <strong>Score:</strong> {match.score}
      </p>
      <p>
        <strong>Status:</strong> {match.status}
      </p>
    </div>
  );
}
