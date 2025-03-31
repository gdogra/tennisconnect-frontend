// src/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow px-4 py-3 flex justify-between items-center sticky top-0 z-50">
      <div className="flex gap-4 items-center">
        <Link to="/dashboard" className="text-lg font-semibold text-blue-600 hover:underline">
          Dashboard
        </Link>
        <Link to="/players" className="text-sm text-gray-700 hover:text-blue-600">
          Players
        </Link>
      </div>
      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user.first_name}</span>
          <button onClick={handleLogout} className="text-sm text-red-500 hover:underline">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
