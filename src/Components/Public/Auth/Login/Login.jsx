import React, { useState } from "react";
import {jwtDecode} from "jwt-decode"; // import tuzatildi
import { useNavigate, Link } from "react-router-dom";

import "./Login.css";

export const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://localhost:7265/api/public/Auth/Login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
          body: JSON.stringify({ identifier, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        const token = localStorage.getItem("accessToken");

        const decodedToken = jwtDecode(token);
        const roleId = decodedToken["role_id"];
        if (roleId === "2") {
          navigate("/admin");
        } else if (roleId === "3") {
          navigate("/instructor");
        } else if (roleId === "4") {
          navigate("/student");
        }
      } else {
        setMessage(data.message || "Login failed!");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {message && <p className="message">{message}</p>}
        <input
          type="text"
          placeholder="Email or Username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {/* Register link qo‘shildi */}
        <p className="register-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
};
