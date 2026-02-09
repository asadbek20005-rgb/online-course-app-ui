import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./Lesson.css";

export const Lesson = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  // ===== GET LESSONS =====
  const [lessons, setLessons] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===== CREATE LESSONS =====
  const [showForm, setShowForm] = useState(false);
  const [models, setModels] = useState([
    { file: null, title: "", description: "" },
  ]);

  // ===== VIDEO MODAL =====
  const [showVideo, setShowVideo] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [videoSrc, setVideoSrc] = useState("");

  // ===== FETCH LESSONS =====
  useEffect(() => {
    if (courseId) getLessons();
  }, [courseId]);

  const getLessons = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        `https://localhost:7265/api/instructor/Lesson/GetAll/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      setLessons(data.rows || []);
      setPagination({
        page: data.page,
        pageSize: data.pageSize,
        total: data.total,
      });
    } catch (err) {
      console.error(err);
      setError("Lessons yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  // ===== VIDEO FETCH =====
  useEffect(() => {
    const loadVideo = async () => {
      if (showVideo && activeLessonId) {
        try {
          const response = await fetch(
            `https://localhost:7265/api/instructor/Lesson/WatchVideo/${courseId}/${activeLessonId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) throw new Error("Video yuklanmadi");

          const blob = await response.blob();
          setVideoSrc(URL.createObjectURL(blob));
        } catch (err) {
          console.error(err);
          alert("Video yuklashda xatolik");
        }
      }
    };

    loadVideo();

    return () => {
      if (videoSrc) {
        URL.revokeObjectURL(videoSrc);
        setVideoSrc("");
      }
    };
  }, [showVideo, activeLessonId, courseId, token]);

  // ===== OPEN VIDEO =====
  const watchVideo = (lessonId) => {
    setActiveLessonId(lessonId);
    setShowVideo(true);
  };

  // ===== FORM HANDLERS =====
  const addLessonForm = () => {
    setModels([...models, { file: null, title: "", description: "" }]);
  };

  const removeLessonForm = (index) => {
    setModels(models.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const updated = [...models];
    updated[index][field] = value;
    setModels(updated);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("CourseId", courseId);

      models.forEach((m, index) => {
        formData.append(`Models[${index}].File`, m.file);
        formData.append(`Models[${index}].Title`, m.title);
        formData.append(`Models[${index}].Description`, m.description || "");
      });

      await axios.post(
        "https://localhost:7265/api/instructor/Lesson/CreateLessons",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Lessons muvaffaqiyatli qo‘shildi");
      setShowForm(false);
      setModels([{ file: null, title: "", description: "" }]);
      getLessons();
    } catch (err) {
      console.error(err);
      alert("Lesson qo‘shishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  // ===== BACK HANDLER =====
  const handleBack = () => {
    if (showVideo) {
      setShowVideo(false);
    } else {
      navigate(-1);
    }
  };

  if (loading) return <p>Yuklanmoqda...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="lesson-page">
      {/* ===== HEADER ===== */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button onClick={handleBack}>⬅ Back</button>
        <h2>Lessons (Course ID: {courseId})</h2>
      </div>

      <p>
        Page: {pagination.page} | Total: {pagination.total}
      </p>

      <button onClick={() => setShowForm(!showForm)}>➕ Add Lessons</button>

      {/* ===== CREATE FORM ===== */}
      {showForm && (
        <div className="lesson-form">
          <h3>Create Lessons</h3>

          {models.map((model, index) => (
            <div key={index} className="lesson-form-item">
              <input
                type="file"
                onChange={(e) =>
                  handleChange(index, "file", e.target.files[0])
                }
              />

              <input
                type="text"
                placeholder="Title"
                value={model.title}
                onChange={(e) =>
                  handleChange(index, "title", e.target.value)
                }
              />

              <textarea
                placeholder="Description"
                value={model.description}
                onChange={(e) =>
                  handleChange(index, "description", e.target.value)
                }
              />

              {models.length > 1 && (
                <button onClick={() => removeLessonForm(index)}>❌</button>
              )}
            </div>
          ))}

          <button onClick={addLessonForm}>➕ Add another</button>
          <button onClick={handleSubmit}>🚀 Submit</button>
        </div>
      )}

      {/* ===== LESSON LIST ===== */}
      <div className="lesson-grid">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="lesson-card"
            onClick={() => watchVideo(lesson.id)}
          >
            <h3>{lesson.title}</h3>
            <p>{lesson.description || "Tavsif yo‘q"}</p>
            <span className="lesson-status">▶ Watch</span>
          </div>
        ))}
      </div>

      {/* ===== VIDEO MODAL ===== */}
      {showVideo && activeLessonId && (
        <div className="video-modal">
          <div className="video-box">
            <button
              className="video-close"
              onClick={() => setShowVideo(false)}
            >
              ✕
            </button>

            {videoSrc ? (
              <video
                controls
                autoPlay
                controlsList="nodownload"
                src={videoSrc}
              />
            ) : (
              <p>Video yuklanmoqda...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


/** */