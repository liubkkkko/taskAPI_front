import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../services/api";
import { AuthContext } from "../contexts/AuthContext";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString();
}

function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authorId, setAuthorId] = useState(null);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  // отримати id автора
  useEffect(() => {
    const fetchAuthorId = async () => {
      try {
        const data = await apiGet("/author");
        setAuthorId(data.id);
      } catch (err) {
        if (err.message === "Unauthorized") {
          logout();
          navigate("/login");
        } else {
          setError("Помилка отримання автора");
        }
        setLoading(false);
      }
    };
    fetchAuthorId();
  }, [logout, navigate]);

  // отримати воркспейси
  useEffect(() => {
    if (!authorId) return;
    const fetchWorkspaces = async () => {
      try {
        const data = await apiGet(`/workspaces/authors/${authorId}`);
        setWorkspaces(data);
      } catch (err) {
        if (err.message === "Unauthorized") {
          logout();
          navigate("/login");
        } else {
          setError("Помилка отримання воркспейсів");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchWorkspaces();
  }, [authorId, logout, navigate]);

  if (loading) return <div>Завантаження...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h2>Ваші робочі простори</h2>
      {workspaces.length === 0 ? (
        <p>У вас немає робочих просторів.</p>
      ) : (
        workspaces.map((ws) => (
          <div className="workspace-card" key={ws.id}>
            <div
              className="workspace-title"
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => navigate(`/jobs/${ws.id}`)}
            >
              {ws.name}
            </div>
            <div className="workspace-meta">
              Статус: <b>{ws.status}</b> | Створено: {formatDate(ws.created_at)} | Оновлено: {formatDate(ws.updated_at)}
            </div>
            <div className="workspace-description">
              <b>Опис:</b> {ws.description}
            </div>
            <div className="workspace-authors">
              <b>Автори:</b>{" "}
              {ws.Authors?.length > 0
                ? ws.Authors.map((a) => a.nickname).join(", ")
                : <span style={{ color: "#888" }}>немає авторів</span>}
            </div>
            <div>
              <b>Кількість задач:</b>{" "}
              {ws.Jobs?.length > 0
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
