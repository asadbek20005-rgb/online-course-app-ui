import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyLessonDetails.css";

export const MyLessonDetails = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [videoUrl, setVideoUrl] = useState(null);

  // ===== FETCH LESSON DETAILS =====
  useEffect(() => {
    const fetchLessonDetails = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const res = await axios.get(
          `https://localhost:7265/api/student/Lesson/GetById/${courseId}/${lessonId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setLesson(res.data);
      } catch (err) {
        setError("Lesson maʼlumotlari yuklanmadi 😕");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLessonDetails();
  }, [courseId, lessonId, navigate]);

  // ===== FETCH VIDEO AS BLOB =====
  useEffect(() => {
    const fetchVideo = async () => {
      if (!lesson?.videoContentUrl) return;

      const token = localStorage.getItem("accessToken");
      try {
        const response = await axios.get(
          `https://localhost:7265/api/public/Content/DownloadFile/${lesson.videoContentUrl}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            responseType: "blob",
          }
        );

        const url = URL.createObjectURL(response.data);
        setVideoUrl(url);
      } catch (err) {
        console.error("Video yuklanmadi 😕", err);
      }
    };

    fetchVideo();

    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl); // memory leak oldini olish
    };
  }, [lesson]);

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!lesson) return null;

  return (
    <div className="lesson-details-page">
      <div className="lesson-header">
        <h1>{lesson.title}</h1>
        <span className={`status-badge ${lesson.statusName.toLowerCase()}`}>
          {lesson.statusName}
        </span>
      </div>

      {videoUrl && (
        <video
          src={videoUrl}
          controls
          preload="metadata"
          className="lesson-video"
        />
      )}

      <div className="lesson-description">
        <h3>Description</h3>
        <p>{lesson.description || "Description mavjud emas."}</p>
      </div>

      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
    </div>
  );
};
