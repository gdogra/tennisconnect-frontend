import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    localStorage.clear();
    toast.success("👋 Logged out successfully!");
    navigate("/login");
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const isActive = (path) =>
    location.pathname === path
      ? "text-blue-600 font-semibold"
      : "text-gray-700 hover:text-blue-600";

  const initials = user ? `${user.first_name[0]}${user.last_name[0]}` : "??";
  const avatar = user?.profile_picture || null;

  return (
    <nav className="bg-white shadow-sm px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-xl font-bold text-green-600">🎾 TennisConnect</div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/" className={isActive("/")}>Home</Link>
          {user && token && (
            <>
              <Link to="/players" className={isActive("/players")}>Players</Link>
              <Link to="/dashboard" className={isActive("/dashboard")}>Dashboard</Link>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="w-9 h-9 rounded-full overflow-hidden bg-blue-500 text-white flex items-center justify-center"
                  title={`${user.first_name} ${user.last_name}`}
                >
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold">{initials}</span>
                  )}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-md z-50">
                    <div className="px-4 py-2 text-sm text-gray-600">
                      {user.first_name} {user.last_name}
                    </div>
                    <hr />
                    <Link
                      to={`/players/${user.id}`}
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
          {!user && !token && (
            <>
              <Link to="/login" className={isActive("/login")}>Login</Link>
              <Link to="/register" className={isActive("/register")}>Register</Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="text-gray-600 focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
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
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-3 px-4 space-y-2">
          <Link to="/" className={isActive("/")}>Home</Link>
          {user && token && (
            <>
              <Link to="/players" className={isActive("/players")}>Players</Link>
              <Link to="/dashboard" className={isActive("/dashboard")}>Dashboard</Link>
              <Link to={`/players/${user.id}`} className={isActive(`/players/${user.id}`)}>My Profile</Link>
              <button onClick={handleLogout} className="text-red-600">Logout</button>
            </>
          )}
          {!user && !token && (
            <>
              <Link to="/login" className={isActive("/login")}>Login</Link>
              <Link to="/register" className={isActive("/register")}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

