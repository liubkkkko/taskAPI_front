import React from "react";

function Header({ isAuthenticated, onLoginClick, onLogoutClick, onRegisterClick }) {
  return (
    <header className="header">
      <span className="header-title">Task Manager</span>
      <div className="header-actions">
        {!isAuthenticated ? (
          <>
            <button className="header-btn" onClick={onLoginClick}>Log in</button>
            <button className="header-btn" onClick={onRegisterClick}>Sign up</button>
          </>
        ) : (
          <button className="header-btn" onClick={onLogoutClick}>Sign out</button>
        )}
      </div>
    </header>
  );
}

export default Header;