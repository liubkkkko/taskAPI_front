import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString();
}

function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const workspaceId = params.get("workspaceId");
  const [authorId, setAuthorId] = useState(null);

  // Отримати id автора через токен
  useEffect(() => {
    if (workspaceId) return; // не треба, якщо workspaceId є
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
  }, [workspaceId]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        let url = "";
        if (workspaceId) {
          url = `https://localhost:443/jobs?workspaceId=${workspaceId}`;
        } else if (authorId) {
          url = `https://localhost:443/jobs?authorId=${authorId}`;
        } else {
          setLoading(false);
          return;
        }
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Не вдалося отримати задачі");
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        setError("Помилка отримання задач");
      } finally {
        setLoading(false);
      }
    };
    if (workspaceId || authorId) fetchJobs();
  }, [workspaceId, authorId]);

  if (loading) return <div>Завантаження...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h2>
        {workspaceId
          ? `Задачі для workspace #${workspaceId}`
          : "Ваші задачі"}
      </h2>
      {jobs.length === 0 ? (
        <p>Немає задач для відображення.</p>
      ) : (
        jobs.map(job => (
          <div className="job-card" key={job.id}>
            <div className="job-title">{job.title}</div>
            <div className="job-meta">
              Статус: <b>{job.status}</b> | Автор: {job.author_id} | Створено: {formatDate(job.created_at)}
            </div>
            <div className="job-content">{job.content}</div>
          </div>
        ))
      )}
    </div>
  );
}

export default JobsPage;