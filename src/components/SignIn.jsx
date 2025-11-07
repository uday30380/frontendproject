import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = ({ onLogin }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    loginAs: "Student",
    emailOrId: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple client-side validation
    if (!formData.emailOrId || !formData.password) {
      alert("Please fill in all required fields.");
      return;
    }

    // Call onLogin if provided (optional)
    if (onLogin) {
      onLogin(formData.emailOrId, formData.password, formData.loginAs);
    }

    // Navigate based on login type
    if (formData.loginAs === "Admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/student-dashboard");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* LEFT SIDE */}
        <div className="auth-left">
          <button className="back-button" onClick={() => navigate("/")}>
            ← Back to Home
          </button>

          <div className="auth-branding">
            <div className="logo-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M9 12L11 14L15 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="brand-name">WellnessHub</h1>
            <p className="brand-tagline">Your wellness journey starts here</p>
          </div>

          <div className="community-info">
            <h2>Welcome Back!</h2>
            <p>
              Access your personalized wellness dashboard and continue your
              journey to better health and well-being.
            </p>

            <div className="feature-list">
              <div className="feature-item">
                <div
                  className="feature-dot"
                  style={{ backgroundColor: "#34D399" }}
                ></div>
                <span>24/7 Mental Health Support</span>
              </div>
              <div className="feature-item">
                <div
                  className="feature-dot"
                  style={{ backgroundColor: "#60A5FA" }}
                ></div>
                <span>Personalized Fitness Programs</span>
              </div>
              <div className="feature-item">
                <div
                  className="feature-dot"
                  style={{ backgroundColor: "#F87171" }}
                ></div>
                <span>Expert Nutrition Guidance</span>
              </div>
            </div>

            <div className="community-image">
              <div className="verified-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M9 12L11 14L15 10"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span>Verified Safe</span>
              </div>
              <img
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop"
                alt="Wellness community"
              />
              <div className="member-count">
                <div className="member-icon">👥</div>
                <div>
                  <div className="member-number">10,000+</div>
                  <div className="member-label">Active Members</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-right">
          <div className="auth-form-container">
            <h2>Sign In</h2>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Login As</label>
                <select
                  name="loginAs"
                  value={formData.loginAs}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="Student">Student</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Email / Student ID</label>
                <input
                  type="text"
                  name="emailOrId"
                  value={formData.emailOrId}
                  onChange={handleChange}
                  placeholder="Enter your email or student ID"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-checkbox">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    id="remember"
                  />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <a href="#forgot" className="forgot-link">
                  Forgot password?
                </a>
              </div>

              <button type="submit" className="btn btn-primary btn-full-width">
                Sign In
              </button>

              <div className="auth-footer">
                Don't have an account?{" "}
                <span
                  onClick={() => navigate("/signup")}
                  style={{
                    color: "var(--color-primary)",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Sign Up
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
