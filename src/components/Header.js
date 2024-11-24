import React from "react";
import { Link } from "react-router-dom";
import "./../styles/Header.css";

function Header({ isAuthenticated, onLogout }) {
  return (
    <header className="header">
      <Link to="/" className="header-logo">
        Task Manager
      </Link>
      <nav className="header-nav">
        {isAuthenticated ? (
          <>
            <Link to="/account" className="header-button">
              Account
            </Link>
            <button onClick={onLogout} className="header-button">
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="header-button">
              Login
            </Link>
            <Link to="/signup" className="header-button">
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
