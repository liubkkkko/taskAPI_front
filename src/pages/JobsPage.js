import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { apiGet } from "../services/api";
import { AuthContext } from "../contexts/AuthContext";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString();
}

function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [authors, setAuthors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id: workspaceId } = useParams();
  const [authorId, setAuthorId] = useState(null);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // отримати id автора з токена
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

  // отримати задачі
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        let url = "";
        if (workspaceId) {
          url = `/jobs/${workspaceId}`;
        } else if (authorId) {
          url = `/jobs?authorId=${authorId}`;
        } else {
          return;
        }

        const data = await apiGet(url);

        // якщо authorId відомий, залишаємо лише свої завдання
        const filtered = authorId
          ? data.filter((job) => job.author_id === authorId)
          : data;

        setJobs(filtered);
      } catch (err) {
        if (err.message === "Unauthorized") {
          logout();
          navigate("/login");
        } else {
          setError("Помилка отримання задач");
        }
      } finally {
        setLoading(false);
      }
    };

    if (authorId) fetchJobs();
  }, [workspaceId, authorId, logout, navigate]);

  // підвантаження авторів
  useEffect(() => {
    const fetchAuthor = async (id) => {
      if (authors[id]) return;
      try {
        const data = await apiGet(`/author/${id}`);
        setAuthors((prev) => ({ ...prev, [id]: data }));
      } catch (err) {
        console.error("Помилка отримання автора", err);
      }
    };

    jobs.forEach((job) => fetchAuthor(job.author_id));
  }, [jobs, authors]);

  if (loading) return <div>Завантаження...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h2>
        {workspaceId
          ? `Ваші задачі у workspace #${workspaceId}`
          : "Всі ваші задачі"}
      </h2>
      {jobs.length === 0 ? (
        <p>Немає задач для відображення.</p>
      ) : (
        jobs.map((job) => {
          const author = authors[job.author_id];
          return (
            <div className="job-card" key={job.id}>
              <div className="job-title">{job.title}</div>
              <div className="job-meta">
                Статус: <b>{job.status}</b> | Автор:{" "}
                {author ? (
                  <Link to={`/author/${author.id}`}>{author.nickname}</Link>
                ) : (
                  job.author_id
                )}{" "}
                | Створено: {formatDate(job.created_at)}
              </div>
              <div className="job-content">{job.content}</div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default JobsPage;
