const API_BASE = process.env.REACT_APP_API_URL || "https://localhost:443";

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(API_BASE + path, { ...options, headers });

  if (res.status === 401) {
    // Якщо токен протух — видаляємо й кидаємо помилку
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "API error");
  }

  return res.json();
}

export function apiGet(path) {
  return apiRequest(path, { method: "GET" });
}

export function apiPost(path, body) {
  return apiRequest(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
