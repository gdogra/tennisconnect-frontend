import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-700 text-white px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-xl font-semibold tracking-wide hover:text-yellow-300"
        >
          🎾 TennisConnect
        </Link>

        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="focus:outline-none"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="hover:text-yellow-300">
            Home
          </Link>
          <Link to="/players" className="hover:text-yellow-300">
            Players
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-yellow-300">
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-yellow-300">
                Login
              </Link>
              <Link to="/register" className="hover:text-yellow-300">
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 space-y-2 px-2">
          <Link to="/" className="block hover:text-yellow-300">
            Home
          </Link>
          <Link to="/players" className="block hover:text-yellow-300">
            Players
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className="block hover:text-yellow-300">
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="block w-full text-left bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block hover:text-yellow-300">
                Login
              </Link>
              <Link to="/register" className="block hover:text-yellow-300">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

