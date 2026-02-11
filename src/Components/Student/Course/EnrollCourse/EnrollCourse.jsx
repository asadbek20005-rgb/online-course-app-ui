import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./EnrollCourse.css";

export const EnrollCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const getImageUrl = (filePath) => {
    if (!filePath) return "/no-image.png";
    return `https://localhost:7265/api/public/Content/DownloadFile/${filePath}`;
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.post(
          "https://localhost:7265/api/student/Course/GetUnEnrolledCourses",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (Array.isArray(res.data?.rows)) {
          setCourses(res.data.rows);
        } else {
          setCourses([]);
        }
      } catch (error) {
        console.error("GetAll error:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="enroll-container">
      <h2>Available Courses</h2>

      {loading ? (
        <p className="loading-text">Loading courses...</p>
      ) : courses.length > 0 ? (
        <div className="course-grid">
          {courses.map((course) => (
            <div className="course-card" key={course.id}>
              <div className="course-image-wrapper">
                <img
                  src={getImageUrl(course.photoContentUrl)}
                  alt={course.title}
                  className="course-image"
                />
              </div>

              <div className="course-info">
                <h3>{course.title}</h3>
                <p className="course-meta">
                  {course.categoryName} • {course.levelName}
                </p>
                <p className="course-status">{course.statusName}</p>
                <p className="course-rating">⭐ {course.rating}/5</p>

                <button
                  className="view-btn"
                  onClick={() =>
                    navigate(`/student/courses/${course.id}/details`)
                  }
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="loading-text">No courses found</p>
      )}
    </div>
  );
};
