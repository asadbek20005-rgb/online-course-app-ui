import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Layout.css";

export const StudentLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    // Token yo‘q bo‘lsa
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const decoded = jwtDecode(token);

      // role_id 4 bo‘lmasa
      if (decoded.role_id !== "4" && decoded.role_id !== 4) {
        navigate("/unauthorized"); // yoki /login
      }
    } catch (error) {
      // Token invalid bo‘lsa
      localStorage.removeItem("accessToken");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  return (
    <div className="layout">
      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">EduPanel</h2>

        <button onClick={() => navigate("/student/enroll")}>
          📘 Enroll Course
        </button>

        <button onClick={() => navigate("/student/my-courses")}>
          🎓 My Courses
        </button>

        <button className="logout" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* RIGHT CONTENT */}
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};
