import React from "react";
import { motion } from "framer-motion";
import { Tooltip } from "react-tooltip";
import { useNavigate } from "react-router-dom";

export default function AvatarHoverCard({ player, size = "md", color = "bg-blue-100" }) {
  const navigate = useNavigate();
  const initials = `${player?.first_name?.[0] || ""}${player?.last_name?.[0] || ""}`;
  const fallbackAvatar = (
    <div
      className={`rounded-full ${color} text-blue-800 font-bold flex items-center justify-center`}
      style={{ width: size === "lg" ? 64 : 40, height: size === "lg" ? 64 : 40 }}
    >
      {initials}
    </div>
  );

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="cursor-pointer"
      onClick={() => navigate(`/profile/${player?.id}`)}
      data-tooltip-id={`tooltip-${player?.id}`}
      data-tooltip-content={`${player?.first_name} ${player?.last_name}`}
    >
      {player?.avatar_url ? (
        <img
          src={player.avatar_url}
          alt={`${player.first_name}'s avatar`}
          className="rounded-full object-cover"
          style={{ width: size === "lg" ? 64 : 40, height: size === "lg" ? 64 : 40 }}
        />
      ) : fallbackAvatar}
      <Tooltip id={`tooltip-${player?.id}`} place="top" />
    </motion.div>
  );
}

