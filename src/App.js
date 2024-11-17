import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Додано CSS для стилів

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const login = async () => {
    try {
      const response = await axios.post("https://localhost:443/login", {
        email,
        password,
      });
      if (response.status === 200) {
        setLoggedIn(true);
        localStorage.setItem("token", response.data);
        console.log("Token saved:", response.data);
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed, please check your credentials");
    }
  };

  const logout = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "https://localhost:443/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setLoggedIn(false);
        localStorage.removeItem("token");
        console.log("Logged out and token removed");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed");
    }
  };

  return (
    <div className="login-container">
      {!loggedIn ? (
        <div className="login-form">
          <h2>Log in</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={login}>Log in</button>
        </div>
      ) : (
        <div className="logout-section">
          <h2>Welcome!</h2>
          <p>You are logged in!</p>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
