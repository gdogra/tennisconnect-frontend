import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onLogout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <div className="flex space-x-4">
        <Link to="/" className="hover:text-yellow-300 font-semibold">
          Home
        </Link>
        {user && (
          <>
            <Link to="/players" className="hover:text-yellow-300 font-semibold">
              Players
            </Link>
            <Link to="/dashboard" className="hover:text-yellow-300 font-semibold">
              Dashboard
            </Link>
          </>
        )}
      </div>
      <div>
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="mr-4 hover:text-yellow-300 font-semibold">
              Login
            </Link>
            <Link to="/register" className="hover:text-yellow-300 font-semibold">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

