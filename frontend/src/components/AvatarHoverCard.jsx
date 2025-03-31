import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AvatarHoverCard({
  player,
  backgroundColor = "bg-blue-100",
  borderColor = "border-blue-300",
  size = "md",
  showTooltip = true,
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (player?.id) navigate(`/profile/${player.id}`);
  };

  const initials = player?.first_name?.[0]?.toUpperCase() + player?.last_name?.[0]?.toUpperCase() || "??";
  const avatarUrl = player?.avatar_url || null;

  const sizeClasses = {
    sm: "w-10 h-10 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-16 h-16 text-lg",
  };

  const fallbackAvatar = (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold text-gray-700",
        sizeClasses[size],
        backgroundColor,
        `border ${borderColor}`
      )}
    >
      {initials}
    </div>
  );

  const avatarContent = (
    <motion.div
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.96 }}
      onClick={handleClick}
      className="cursor-pointer relative"
      data-tooltip-id={`player-tooltip-${player?.id}`}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={`${player?.first_name} ${player?.last_name}`}
          className={cn("rounded-full object-cover", sizeClasses[size], `border ${borderColor}`)}
          onError={(e) => (e.target.style.display = "none")}
        />
      ) : (
        fallbackAvatar
      )}
      {showTooltip && (
        <Tooltip id={`player-tooltip-${player?.id}`} place="top" effect="solid">
          {player?.first_name} {player?.last_name}
        </Tooltip>
      )}
    </motion.div>
  );

  return avatarContent;
}

