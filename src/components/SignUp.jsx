import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = ({ onSignUp }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    accountType: "Student Account",
    fullName: "",
    studentId: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
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

    if (formData.password !== formData.confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }

    if (!formData.agreeToTerms) {
      alert("⚠ Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    // Trigger optional callback
    if (onSignUp) onSignUp(formData);

    alert("✅ Account created successfully!");

    // Navigate based on account type
    if (formData.accountType === "Admin Account") {
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
            <h2>Join Our Community</h2>
            <p>
              Start your wellness journey with health resources, fitness
              programs, and mental health support designed for students.
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
            <h2>Create Account</h2>
            <div className="trust-badge">⭐⭐⭐⭐⭐ Trusted by 10,000+ students</div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Account Type</label>
                <select
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="Student Account">Student Account</option>
                  <option value="Admin Account">Admin Account</option>
                </select>
                <p className="form-help-text">
                  Access wellness programs, resources, and track your progress
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Student ID</label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="Enter your student ID"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
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
                  placeholder="Create a password"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-checkbox">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  id="terms"
                  required
                />
                <label htmlFor="terms">
                  I agree to the{" "}
                  <a href="#terms">Terms of Service</a> and{" "}
                  <a href="#privacy">Privacy Policy</a>
                </label>
              </div>

              <button type="submit" className="btn btn-primary btn-full-width">
                Create Account
              </button>

              <div className="auth-footer">
                Already have an account?{" "}
                <span
                  onClick={() => navigate("/signin")}
                  style={{
                    color: "var(--color-primary)",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Sign In
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
