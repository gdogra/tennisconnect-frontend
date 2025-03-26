import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PlayerProfile() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5001/players/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setPlayer(data);
        } else {
          setError(data.error || "Failed to load profile.");
        }
      } catch (err) {
        setError("Network error.");
      }
    };
    fetchPlayer();
  }, [id]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!player) return <div>Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">{player.first_name} {player.last_name}</h1>
      <p><strong>Skill Level:</strong> {player.skill_level}</p>
      <p><strong>City:</strong> {player.city}</p>
      <p><strong>Email:</strong> {player.email}</p>
      <p><strong>Phone:</strong> {player.phone}</p>
    </div>
  );
}

