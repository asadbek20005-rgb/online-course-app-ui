import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyCourseDetails.css";

export const MyCourseDetails = () => {
  const { courseId } = useParams(); // URL dan courseId olish
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(
          `https://localhost:7265/api/student/Course/GetById/${courseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCourse(res.data);
      } catch (err) {
        setError("Kurs ma’lumotlari yuklanmadi 😕");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, navigate]);

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!course) return null;

  return (
    <div className="course-details-page">
      <h1>{course.title}</h1>

      <div className="course-details-card">
        <img
          src={`https://localhost:7265/api/public/Content/DownloadFile/${course.photoContentUrl}`}
          alt={course.title}
        />

        <div className="course-info">
          <p><strong>Category:</strong> {course.categoryName}</p>
          <p><strong>Level:</strong> {course.levelName}</p>
          <p><strong>Status:</strong> {course.statusName}</p>
          <p><strong>Rating:</strong> ⭐ {course.rating}/5</p>
          <p><strong>Curriculum:</strong></p>
          <p className="curriculum">{course.curriculum}</p>

          <button
            className="lessons-btn"
            onClick={() => navigate(`/student/my-courses/${courseId}/my-lessons`)}
          >
            Lessons
          </button>
        </div>
      </div>
    </div>
  );
};
