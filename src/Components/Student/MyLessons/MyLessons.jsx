import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyLessons.css";

export const MyLessons = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===== Description short qilish =====
  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  useEffect(() => {
    const fetchLessons = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const res = await axios.post(
          `https://localhost:7265/api/student/Lesson/GetAll/${courseId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setLessons(res.data.rows || []);
      } catch (err) {
        setError("Lessonlar yuklanmadi 😕");
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [courseId, navigate]);

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="lessons-page">
      <h1>Lessons</h1>

      {lessons.length === 0 ? (
        <div className="empty">
          Bu kursda hali lessonlar mavjud emas 📭
        </div>
      ) : (
        <div className="lessons-grid">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="lesson-card">
              <div className="lesson-info">
                <h3>{lesson.title}</h3>
                <p className="status">{lesson.statusName}</p>

                {lesson.description && (
                  <p className="description">
                    {truncateText(lesson.description, 90)}
                  </p>
                )}
              </div>

              <button
                className="details-btn"
                onClick={() =>
                  navigate(
                    `/student/my-courses/${courseId}/my-lessons/${lesson.id}`
                  )
                }
              >
                Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

