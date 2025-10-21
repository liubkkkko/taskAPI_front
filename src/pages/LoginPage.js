import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { apiPost } from "../services/api";

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
      // Використовуємо apiPost (credentials: 'include' всередині)
      const data = await apiPost("/login", { email, password });
      // бекенд тепер ставить cookies і повертає { user: { ... } }
      const user = data.user || data;
      if (!user) throw new Error("Login failed");
      login(user);
      navigate("/workspaces");
    } catch (err) {
      console.error(err);
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