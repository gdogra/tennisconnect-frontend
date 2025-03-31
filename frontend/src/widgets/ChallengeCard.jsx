import React from "react";
import { motion } from "framer-motion";
import AvatarHoverCard from "./AvatarHoverCard";
import { Button } from "@/components/ui/button";
import { CalendarIcon, XIcon } from "lucide-react";

export default function ChallengeCard({
  challenge,
  onAccept,
  onDecline,
  onSchedule,
  isReceived = false,
}) {
  const { id, sender, receiver, location, status, skill_difference, scheduled_date, match_id } =
    challenge;

  const opponent = isReceived ? sender : receiver;
  const opponentName = opponent?.first_name || "Unknown";
  const skillDiff = skill_difference !== undefined ? `±${skill_difference}` : "N/A";
  const avatarUrl = opponent?.avatar_url || "/fallback-avatar.png";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-2xl shadow-md p-4 border"
    >
      <div className="flex items-center gap-4 mb-2">
        <AvatarHoverCard player={opponent} />
        <div className="flex-1">
          <p className="text-lg font-semibold">{opponentName}</p>
          <p className="text-sm text-gray-500">Skill: {skillDiff}</p>
        </div>
        <span
          className={`text-sm px-2 py-1 rounded ${
            status === "accepted" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="text-sm text-gray-600 mb-3">
        📍 {location || "No location"} <br />
        📅 {scheduled_date ? new Date(scheduled_date).toLocaleDateString() : "Not scheduled"}
      </div>

      <div className="flex gap-2 mt-2">
        {isReceived && status === "pending" && (
          <>
            <Button onClick={() => onAccept(id)} size="sm" className="rounded-xl">
              Accept
            </Button>
            <Button onClick={() => onDecline(id)} variant="ghost" size="sm" className="rounded-xl">
              <XIcon className="w-4 h-4" /> Decline
            </Button>
            <Button
              onClick={() => onSchedule(id)}
              variant="outline"
              size="sm"
              className="rounded-xl"
            >
              <CalendarIcon className="w-4 h-4 mr-1" /> Schedule
            </Button>
          </>
        )}
        {!isReceived && status === "pending" && (
          <span className="text-xs text-gray-400">Waiting for response...</span>
        )}
        {status === "accepted" && match_id && (
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl"
            onClick={() => (window.location.href = `/dashboard/match-history/${match_id}`)}
          >
            View Match
          </Button>
        )}
      </div>
    </motion.div>
  );
}
