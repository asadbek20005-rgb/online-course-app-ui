import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./Sidebar.css";

export const Sidebar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // tokenni o‘chiramiz
    navigate("/"); // login page ga qaytamiz
  };

 const token = localStorage.getItem("accessToken");

// Token bo'lsa decode qilish
let roleId = null;
if (token) {
  try {
    // JWT ni split qilib payload olish
    const payload = JSON.parse(atob(token.split('.')[1]));
    roleId = payload.role_id; // payload ichidagi role_id
  } catch (error) {
    console.error("Token parse error:", error);
  }
}

console.log("Role ID:", roleId);
const showSidebar = roleId === "2"; // string bilan taqqoslash

  return (
    <div className="layout-wrapper">
      {showSidebar && (
        <div className="sidebar-wrapper">
          <h3>Admin Panel</h3>
          <button onClick={() => navigate("/admin/category")}>Category</button>
          <button onClick={() => navigate("/admin/level")}>Level</button>
          <button onClick={() => navigate("/admin/role")}>Role</button>
          <button onClick={() => navigate("/admin/status")}>Status</button>
          <button onClick={() => navigate("/admin/content-type")}>Content Type</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}

      <div className="content-wrapper">
        <Outlet />
      </div>
    </div>
  );
};
