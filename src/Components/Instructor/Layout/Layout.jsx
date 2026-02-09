import React from "react";
import "./Layout.css";
import { Outlet, useNavigate } from "react-router-dom";

export const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // tokenni o‘chiramiz
    navigate("/"); // login page ga qaytamiz
  };

  return (
    <div className="admin-layout">
      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">Instructor</h2>

        <nav className="menu">
          <button
            onClick={() => navigate("/instructor/course")}
            className="menu-btn"
          >
            Courses
          </button>

          <button
            onClick={handleLogout}
            className="menu-btn"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};
