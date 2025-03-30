// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LandingPage from "./LandingPage";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import PlayerProfile from "./Profile";
import MatchDetail from "./widgets/MatchDetail";
import { ToastProvider } from "./ToastContext";

export default function App() {
  return (
    <Router>
      <ToastProvider>
        <div className="font-sans text-gray-900 bg-background min-h-screen">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile/:id" element={<PlayerProfile />} />
            <Route path="/dashboard/match-history/:id" element={<MatchDetail />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </ToastProvider>
    </Router>
  );
}

