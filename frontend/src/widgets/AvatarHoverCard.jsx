// src/widgets/AvatarHoverCard.jsx
import React from "react";
import { motion } from "framer-motion";

export default function AvatarHoverCard({ player, position }) {
  if (!player) return null;

  const { first_name, last_name, city, skill_level, avatar_url } = player;

  return (
    <motion.div
      className="absolute z-10 w-64 p-4 bg-white shadow-xl rounded-xl border border-gray-200"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.15 }}
      style={{
        top: position?.top || 0,
        left: position?.left || 0,
      }}
    >
      <div className="flex items-center space-x-4">
        <img
          src={avatar_url || "/default-avatar.png"}
          alt={`${first_name}'s avatar`}
          className="w-12 h-12 rounded-full object-cover border"
        />
        <div>
          <div className="font-semibold">
            {first_name} {last_name}
          </div>
          <div className="text-sm text-gray-500">Skill: {skill_level}</div>
          <div className="text-sm text-gray-500">City: {city}</div>
        </div>
      </div>
    </motion.div>
  );
}

