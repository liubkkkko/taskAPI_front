import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("https://localhost:443/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Login failed");

      const token = await res.json();  // бекенд повертає токен як рядок
      login(token);                    // викликаємо login з контексту

      navigate("/workspaces");
    } catch (err) {
      setError("Невірний email або пароль");
    }
  };

  return (
    <form className="login-form" onSubmit={handleLogin}>
      <h2>Log in</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Log in</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
}

export default LoginPage;
