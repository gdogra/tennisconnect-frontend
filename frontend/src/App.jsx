// src/App.jsx
import React, { useEffect, useState, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastProvider } from "./ToastContext";
import Navbar from "./Navbar";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./App.css";

// Lazy-load pages
const LandingPage = lazy(() => import("./LandingPage"));
const Login = lazy(() => import("./Login"));
const Register = lazy(() => import("./Register"));
const Dashboard = lazy(() => import("./Dashboard"));
const PlayersList = lazy(() => import("./components/PlayersList"));
const PlayerProfile = lazy(() => import("./components/PlayerProfile"));

const AnimatedRoutes = ({ user, token }) => {
  const location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition key={location.key} classNames="fade" timeout={300}>
        <Routes location={location}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={user && token ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route path="/players" element={<PlayersList />} />
          <Route path="/players/:id" element={<PlayerProfile />} />
          <Route path="*" element={<div className="p-8">404 - Not Found</div>} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user/token once at startup
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading TennisConnect...
      </div>
    );
  }

  return (
    <Router>
      <ToastProvider>
        <div className="min-h-screen bg-gray-50 text-gray-900">
          <Navbar />
          <Suspense fallback={<div className="p-8">Loading...</div>}>
            <AnimatedRoutes user={user} token={token} />
          </Suspense>
        </div>
      </ToastProvider>
    </Router>
  );
};

export default App;

