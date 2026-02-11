import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./CourseDetails.css";

export const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [instructor, setInstructor] = useState(null);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [loadingInstructor, setLoadingInstructor] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState("");

  // ===== FETCH COURSE =====
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
          `https://localhost:7265/api/public/Course/GetById/${courseId}`,
        );
        setCourse(res.data);
      } catch (err) {
        console.error("Course fetch error:", err);
        setError("Course yuklanmadi 😕");
      } finally {
        setLoadingCourse(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  // ===== FETCH INSTRUCTOR =====
  useEffect(() => {
    if (!course) return;

    const fetchInstructor = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("Avval login qiling");
        setLoadingInstructor(false);
        return;
      }

      try {
        const res = await axios.get(
          `https://localhost:7265/api/student/Course/GetInstructorInfo/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setInstructor(res.data);
      } catch (err) {
        console.error("Instructor fetch error:", err);
        setError("Instructor yuklanmadi 😕");
      } finally {
        setLoadingInstructor(false);
      }
    };

    fetchInstructor();
  }, [course, courseId]);

  // ===== ENROLL HANDLER =====
  const handleEnroll = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Avval login qiling");
      navigate("/");
      return;
    }

    try {
      setEnrolling(true);

      await axios.post(
        `https://localhost:7265/api/student/Course/Enroll?courseId=${courseId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      navigate("/student/my-courses");
    } catch (err) {
      alert("Enroll qilishda xatolik yuz berdi 😕");
    } finally {
      setEnrolling(false);
    }
  };

  if (loadingCourse) return <div className="loader">Loading course...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="course-page">
      {/* ===== HERO ===== */}
      <div
        className="course-hero"
        style={{
          backgroundImage: `url(https://localhost:7265/api/public/Content/DownloadFile/${course.photoContentUrl})`,
        }}
      >
        <div className="overlay">
          <h1>{course.title}</h1>
          <p>
            {course.categoryName} • {course.levelName}
          </p>
        </div>
      </div>

      {/* ===== BODY ===== */}
      <div className="course-body">
        {/* LEFT */}
        <div className="course-main">
          <h2>What you’ll learn</h2>
          <p className="curriculum">{course.curriculum}</p>

          {/* ===== INSTRUCTOR INFO ===== */}
          {loadingInstructor && <p>Loading instructor...</p>}
          {instructor && (
            <div className="instructor-section">
              <h2>Instructor Info</h2>
              <div className="instructor-card">
                {/* Photo */}
                <div className="instructor-photo-wrapper">
                  {instructor.photoUrl ? (
                    <img
                      src={`https://localhost:7265/api/public/Content/DownloadFile/${instructor.photoUrl}`}
                      alt={instructor.firstName}
                      className="instructor-photo"
                    />
                  ) : (
                    <div className="instructor-photo-placeholder">No Photo</div>
                  )}
                </div>

                {/* Info */}
                <div className="instructor-info">
                  <h3>
                    {instructor.firstName} {instructor.lastName}
                  </h3>
                  <p>
                    <b>Username:</b> {instructor.username}
                  </p>
                  <p>
                    <b>Email:</b> {instructor.email}
                  </p>
                  <p>
                    <b>Gender:</b> {instructor.gender || "Not specified"}
                  </p>
                  <p className="bio">
                    <b>Bio:</b> {instructor.bio || "No bio available"}
                  </p>
                  <div className="timestamps">
                    <p>
                      <b>Created At:</b>{" "}
                      {new Date(instructor.createdAt).toLocaleString()}
                    </p>
                    <p>
                      <b>Updated At:</b>{" "}
                      {instructor.updatedAt
                        ? new Date(instructor.updatedAt).toLocaleString()
                        : "Not updated yet"}
                    </p>
                  </div>
                  {instructor.createdUserId && (
                    <p>
                      <b>Created By:</b> {instructor.createdUserId}
                    </p>
                  )}
                  {instructor.updatedUserId && (
                    <p>
                      <b>Updated By:</b> {instructor.updatedUserId}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="course-side">
          <div className="info-box">
            <p>
              <b>Status:</b> {course.statusName}
            </p>
            <p>
              <b>Level:</b> {course.levelName}
            </p>
            <p>
              <b>Rating:</b> ⭐ {course.rating}/5
            </p>

            <button
              className="enroll-btn"
              onClick={handleEnroll}
              disabled={enrolling}
            >
              {enrolling ? "Enrolling..." : "Enroll Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
