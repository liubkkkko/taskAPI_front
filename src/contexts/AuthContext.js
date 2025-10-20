import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username") || "");

  // Завантаження імені користувача при старті
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("https://localhost:443/author", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Не вдалося отримати користувача");
        const data = await res.json();
        if (data.nickname) {
          setUsername(data.nickname);
          localStorage.setItem("username", data.nickname);
        }
      } catch (e) {
        console.error(e);
        logout(); // якщо помилка — вихід
      }
    };

    if (isAuthenticated && !username) fetchUser();
  }, [isAuthenticated, username]);

  const login = (token, nickname) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setUsername("");
    navigate("/login"); // SPA-перехід після logout
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
