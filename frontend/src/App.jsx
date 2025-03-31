// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import PlayerProfile from "./Profile";
import MatchDetail from "./widgets/MatchDetail";
import PlayersList from "./widgets/PlayersList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <Router>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile/:id" element={<PlayerProfile />} />
        <Route path="/dashboard/match-history/:id" element={<MatchDetail />} />
        <Route path="/players" element={<PlayersList />} />
      </Routes>
    </Router>
  );
}

