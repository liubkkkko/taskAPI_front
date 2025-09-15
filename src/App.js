import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import WorkspacesPage from "./pages/WorkspacesPage";
import JobsPage from "./pages/JobsPage";
import ProfilePage from "./pages/ProfilePage";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowRegister(false);
  };
  const handleRegisterClick = () => {
    setShowRegister(true);
    setShowLogin(false);
  };
  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setShowLogin(false);
    setShowRegister(false);
  };

  return (
    <Router>
      <Header
        isAuthenticated={isAuthenticated}
        onLoginClick={handleLoginClick}
        onLogoutClick={handleLogoutClick}
        onRegisterClick={handleRegisterClick}
      />
      <div className="app-layout">
        <Navigation />
        <main className="main-content">
          {showLogin && (
            <LoginPage
              onLogin={() => {
                setIsAuthenticated(true);
                setShowLogin(false);
              }}
            />
          )}
          {showRegister && (
            <RegisterPage
              onRegisterSuccess={() => {
                setShowRegister(false);
                setShowLogin(true);
              }}
            />
          )}
          {!showLogin && !showRegister && (
            <Routes>
              <Route
                path="/workspaces"
                element={isAuthenticated ? <WorkspacesPage /> : <Navigate to="/" />}
              />
              <Route
                path="/jobs"
                element={isAuthenticated ? <JobsPage /> : <Navigate to="/" />}
              />
              <Route
                path="/profile"
                element={isAuthenticated ? <ProfilePage /> : <Navigate to="/" />}
              />
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <Navigate to="/workspaces" />
                  ) : (
                    <div style={{ textAlign: "center", marginTop: 100 }}>
                      <h2>Welcome to Task Manager!</h2>
                      <p>Log in or sign up to get started.</p>
                    </div>
                  )
                }
              />
            </Routes>
          )}
        </main>
      </div>
      <footer className="footer">© 2025 Task Manager</footer>
    </Router>
  );
}

export default App;