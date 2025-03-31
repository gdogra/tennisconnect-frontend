// src/components/PlayerProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function PlayerProfile() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const res = await fetch(`http://localhost:5001/players/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setPlayer(data);
        } else {
          toast.error(data.error || "Failed to load profile");
        }
      } catch (err) {
        toast.error("Error loading profile");
      } finally {
        setLoading(false);
      }
    };
    fetchPlayer();
  }, [id, token]);

  if (loading) return <div className="p-6">Loading profile...</div>;
  if (!player) return <div className="p-6">Player not found.</div>;

  const initials = `${player.first_name[0]}${player.last_name[0]}`;

  return (
    <div className="max-w-md mx-auto bg-white rounded shadow p-6 mt-6">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        {player.profile_picture ? (
          <img
            src={player.profile_picture}
            alt="avatar"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default-avatar.png";
            }}
            style={{ filter: player.avatar_filter || "none" }}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border"
          />
        ) : (
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold">
            {initials}
          </div>
        )}

        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold mb-1">
            {player.first_name} {player.last_name}
          </h1>
          <p className="text-sm text-gray-700">🎾 Skill: {player.skill_level}</p>
          <p className="text-sm text-gray-700">📍 {player.city}</p>
          <p className="text-sm text-gray-500">{player.email}</p>
        </div>
      </div>
    </div>
  );
}
