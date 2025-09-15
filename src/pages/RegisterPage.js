import React, { useState } from "react";

function RegisterPage({ onRegisterSuccess }) {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("https://localhost:443/authors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, email, password }),
      });
      if (!res.ok) throw new Error("Registration failed");
      onRegisterSuccess();
    } catch (err) {
      setError("Помилка реєстрації");
    }
  };

  return (
    <form className="login-form" onSubmit={handleRegister}>
      <h2>Sign up</h2>
      <input
        type="text"
        placeholder="Nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        required
      />
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
      <button type="submit">Sign up</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
}

export default RegisterPage;