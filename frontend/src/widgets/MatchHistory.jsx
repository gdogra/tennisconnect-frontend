// src/widgets/MatchHistory.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

export default function MatchHistory() {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/matches/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res?.data;
        if (Array.isArray(data)) {
          setMatches(data);
        } else {
          console.warn("Unexpected response format:", data);
          setMatches([]);
        }
      } catch (err) {
        console.error("Failed to fetch match history:", err);
        setError("Unable to load match history.");
        setMatches([]);
      }
    };

    fetchMatches();
  }, []);

  const renderPlayer = (player) => {
    const fallback = player?.first_name?.[0]?.toUpperCase() || "?";
    const fullName = player?.first_name && player?.last_name
      ? `${player.first_name} ${player.last_name}`
      : "Unknown Player";

    return (
      <div className="flex items-center gap-2">
        <Avatar className="w-8 h-8">
          <AvatarImage src={player?.avatar_url || ""} alt={fullName} />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
        <span className="text-sm text-gray-800">{fullName}</span>
      </div>
    );
  };

  if (error) {
    return (
      <Card className="p-4 text-sm text-red-500">
        {error}
      </Card>
    );
  }

  if (!Array.isArray(matches) || matches.length === 0) {
    return (
      <Card className="p-4 text-sm text-gray-500">
        No matches found in history.
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-4">
      <h2 className="text-lg font-semibold mb-2">Match History</h2>
      {matches.map((match) => (
        <div key={match.id} className="flex justify-between items-center border-b pb-2">
          <div className="flex items-center gap-4">
            {renderPlayer(match.opponent)}
            <span className="text-sm text-gray-600">
              {match.score || "Score N/A"}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {match.played_at
              ? formatDistanceToNow(new Date(match.played_at), { addSuffix: true })
              : "unknown time"}
          </span>
        </div>
      ))}
    </Card>
  );
}

