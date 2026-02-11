import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MyCourses.css";

export const MyCourses = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyCourses = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.post(
          "https://localhost:7265/api/student/Course/GetAll",
          {}, // ⚠️ filter yo‘q bo‘lsa {} yuboriladi
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setCourses(res.data.rows || []);
      } catch (err) {
        setError("My courses yuklanmadi 😕");
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [navigate]);

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="my-courses-page">
      <h1>My Courses</h1>

      {courses.length === 0 ? (
        <div className="empty">Siz hali hech qaysi kursga yozilmagansiz 📭</div>
      ) : (
        <div className="my-course-grid">
          {courses.map((course) => (
            <div key={course.id} className="my-course-card">
              <img
                src={`https://localhost:7265/api/public/Content/DownloadFile/${course.photoContentUrl}`}
                alt={course.title}
                onClick={() => navigate(`/courses/${course.id}`)} // rasm bosilganda ham ochilishi mumkin
                style={{ cursor: "pointer" }}
              />

              <div className="content">
                <h3>{course.title}</h3>
                <p className="meta">
                  {course.categoryName} • {course.levelName}
                </p>
                <p className="rating">⭐ {course.rating}/5</p>

                {/* ===== DETAILS BUTTON ===== */}
                <button
                  className="details-btn"
                  onClick={() => navigate(`/student/my-courses/${course.id}`)}
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/** Button bolish kerak details degan */

/**Navigate qilish: /student/my-courses/:courseId */
