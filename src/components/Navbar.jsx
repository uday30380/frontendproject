import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../App.css"; // or specific Navbar CSS if you have one

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => navigate("/")}>
          <div className="logo-icon">🩺</div>
          <span className="logo-text">Student Wellness</span>
        </div>

        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
            Home
          </NavLink>
          <NavLink to="/wellness-programs" className={({ isActive }) => (isActive ? "active" : "")}>
            Wellness
          </NavLink>
          <NavLink to="/health-advice" className={({ isActive }) => (isActive ? "active" : "")}>
            Health Advice
          </NavLink>
          <NavLink to="/support-services" className={({ isActive }) => (isActive ? "active" : "")}>
            Support
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>
            About
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}>
            Contact
          </NavLink>
        </div>

        <div className="navbar-actions">
          <button className="btn btn-outline" onClick={() => navigate("/signin")}>
            Sign In
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
