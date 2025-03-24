import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="text-center mt-40 space-y-4">
      <h1 className="text-4xl font-bold">Welcome to TennisConnect 🎾</h1>
      <div className="space-x-4">
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/register")}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
        >
          Register
        </button>
      </div>
    </div>
  );
}

