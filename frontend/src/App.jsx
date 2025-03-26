// src/App.jsx
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { ToastProvider } from "./ToastContext";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./App.css";

// Lazy-loaded pages
const LandingPage = lazy(() => import("./LandingPage"));
const Login = lazy(() => import("./Login"));
const Register = lazy(() => import("./Register"));
const Dashboard = lazy(() => import("./Dashboard"));
const PlayersList = lazy(() => import("./components/PlayersList"));
const PlayerProfile = lazy(() => import("./components/PlayerProfile"));

const AnimatedRoutes = () => {
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
            element={
              localStorage.getItem("token") ? <Dashboard /> : <Navigate to="/login" />
            }
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
  return (
    <Router>
      <ToastProvider>
        <div className="min-h-screen bg-gray-50 text-gray-900">
          <Navbar />
          <Suspense fallback={<div className="p-8">Loading...</div>}>
            <AnimatedRoutes />
          </Suspense>
        </div>
      </ToastProvider>
    </Router>
  );
};

export default App;

