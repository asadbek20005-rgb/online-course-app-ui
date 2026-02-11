import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    roleId: 4,
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
    gender: 1,
  });

  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Parollar bir xil emas");
      return;
    }

    const data = new FormData();
    data.append("RoleId", form.roleId);
    data.append("FirstName", form.firstName);
    data.append("LastName", form.lastName);
    data.append("Username", form.username);
    data.append("Email", form.email);
    data.append("Password", form.password);
    data.append("ConfirmPassword", form.confirmPassword);
    data.append("Bio", form.bio);
    data.append("Gender", form.gender);
    if (photo) data.append("PhotoContent", photo);

    try {
      setLoading(true);
      await axios.post(
        "https://localhost:7265/api/public/Auth/Register",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      navigate("/login");
    } catch (err) {
      setError("Ro‘yxatdan o‘tishda xatolik yuz berdi 😕");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <form className="register-card" onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        {error && <div className="error">{error}</div>}

        {/* ROLE */}
        <div className="form-group">
          <label>Role</label>
          <select name="roleId" value={form.roleId} onChange={handleChange}>
            <option value={4}>Student</option>
            <option value={3}>Instructor</option>
          </select>
        </div>

        {/* FIRST & LAST NAME */}
        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input
              name="firstName"
              placeholder="First name"
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              name="lastName"
              placeholder="Last name"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* USERNAME */}
        <div className="form-group">
          <label>Username</label>
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        {/* EMAIL */}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* PASSWORD & CONFIRM */}
        <div className="form-row">
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* BIO */}
        <div className="form-group">
          <label>Bio (optional)</label>
          <textarea
            name="bio"
            placeholder="Write something about yourself"
            value={form.bio}
            onChange={handleChange}
          />
        </div>

        {/* GENDER & PHOTO */}
        <div className="form-row">
          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value={1}>Erkak</option>
              <option value={2}>Ayol</option>
            </select>
          </div>
          <div className="form-group">
            <label>Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
            />
          </div>
        </div>

        {/* REGISTER BUTTON */}
        <button disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        {/* LOGIN LINK */}
        <p className="login-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/")}>Login</span>
        </p>
      </form>
    </div>
  );
};
