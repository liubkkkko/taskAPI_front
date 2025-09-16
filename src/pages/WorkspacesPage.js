import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString();
}

function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authorId, setAuthorId] = useState(null);
  const navigate = useNavigate();

  // Отримати id автора через токен
  useEffect(() => {
    const fetchAuthorId = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://localhost:443/author", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Не вдалося отримати автора");
        const data = await res.json();
        setAuthorId(data.id);
      } catch (err) {
        setError("Помилка отримання автора");
        setLoading(false);
      }
    };
    fetchAuthorId();
  }, []);

  // Отримати воркспейси автора
  useEffect(() => {
    if (!authorId) return;
    const fetchWorkspaces = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`https://localhost:443/workspaces/authors/${authorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Не вдалося отримати воркспейси");
        const data = await res.json();
        setWorkspaces(data);
      } catch (err) {
        setError("Помилка отримання воркспейсів");
      } finally {
        setLoading(false);
      }
    };
    fetchWorkspaces();
  }, [authorId]);

  if (loading) return <div>Завантаження...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h2>Ваші робочі простори</h2>
      {workspaces.length === 0 ? (
        <p>У вас немає робочих просторів.</p>
      ) : (
        workspaces.map(ws => (
          <div className="workspace-card" key={ws.id}>
            <div
              className="workspace-title"
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => navigate(`/jobs?workspaceId=${ws.id}`)}
            >
              {ws.name}
            </div>
            <div className="workspace-meta">
              Статус: <b>{ws.status}</b> | Створено: {formatDate(ws.created_at)} | Оновлено: {formatDate(ws.updated_at)}
            </div>
            <div className="workspace-description">{ws.description}</div>
            <div className="workspace-authors">
              <b>Автори:</b>{" "}
              {ws.Authors && ws.Authors.length > 0
                ? ws.Authors.map(a => a.nickname).join(", ")
                : <span style={{ color: "#888" }}>немає авторів</span>}
            </div>
            <div>
              <b>Кількість задач:</b>{" "}
              {ws.Jobs && ws.Jobs.length > 0
                ? ws.Jobs.length
                : <span style={{ color: "#888" }}>немає задач</span>}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default WorkspacesPage;