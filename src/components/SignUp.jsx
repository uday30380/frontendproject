import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SignUp = ({ onSignUp }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    accountType: "Student Account",
    // Common Fields
    fullName: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    // Student Fields
    age: "",
    gender: "",
    department: "",
    year: "",
    email: "",
    phone: "",
    // Admin Fields
    adminId: "",
    designation: "",
    authorizationCode: "",
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

    // Basic Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    // Admin Authorization Check
    if (formData.accountType === "Admin Account" && formData.authorizationCode !== "ADMIN123") {
      toast.error("Invalid Authorization Code!");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);

      // Construct User Object based on Role
      let newUser = {
        name: formData.fullName,
        password: formData.password,
        role: formData.accountType === "Admin Account" ? "Admin" : "Student",
      };

      if (formData.accountType === "Student Account") {
        newUser = {
          ...newUser,
          email: formData.email,
          age: formData.age,
          gender: formData.gender,
          department: formData.department,
          year: formData.year,
          phone: formData.phone,
          studentId: "S" + Math.floor(Math.random() * 10000), // Generate random ID
        };
      } else {
        newUser = {
          ...newUser,
          email: formData.adminId, // Use Admin ID as primary identifier
          adminId: formData.adminId,
          designation: formData.designation,
        };
      }

      // Save to localStorage
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

      // Check for duplicates
      const identifier = formData.accountType === "Student Account" ? formData.email : formData.adminId;
      if (existingUsers.find(u => u.email === identifier || u.adminId === identifier)) {
        toast.error("User already registered!");
        return;
      }

      existingUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(existingUsers));

      toast.success("Account created successfully! Please sign in.");

      if (onSignUp) {
        onSignUp(formData);
      }

      navigate("/signin");
    }, 1500);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Info Section */}
        <div className="auth-left">
          <button className="btn btn-ghost back-btn" onClick={() => navigate("/")}>
            ← Back to Home
          </button>

          <div className="auth-branding">
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
                <path d="M9 12L11 14L15 10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="brand-name">WellnessHub</h1>
            <p className="brand-tagline">Your wellness journey starts here</p>
          </div>

          <div className="community-info">
            <h2>Join Our Community</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)' }}>
              Start your wellness journey with comprehensive health resources,
              fitness programs, and mental health support designed specifically
              for students.
            </p>

            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-dot" style={{ backgroundColor: "#34D399" }}></div>
                <span>24/7 Mental Health Support</span>
              </div>
              <div className="feature-item">
                <div className="feature-dot" style={{ backgroundColor: "#60A5FA" }}></div>
                <span>Personalized Fitness Programs</span>
              </div>
              <div className="feature-item">
                <div className="feature-dot" style={{ backgroundColor: "#F87171" }}></div>
                <span>Expert Nutrition Guidance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="auth-right">
          <div className="auth-form-container" style={{ maxWidth: '500px' }}>
            <h2>Create Account</h2>
            <div className="trust-badge" style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#F59E0B' }}>⭐⭐⭐⭐⭐</span> Trusted by 10,000+ students
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {/* Account Type */}
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
              </div>

              {/* Common Fields */}
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

              {/* Student Specific Fields */}
              {formData.accountType === "Student Account" && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div className="form-group">
                      <label className="form-label">Age</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="Age"
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="form-control"
                        required
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div className="form-group">
                      <label className="form-label">Department</label>
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        placeholder="Dept (e.g. CSE)"
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Year</label>
                      <select
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="form-control"
                        required
                      >
                        <option value="">Select</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                      </select>
                    </div>
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
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="form-control"
                      required
                    />
                  </div>
                </>
              )}

              {/* Admin Specific Fields */}
              {formData.accountType === "Admin Account" && (
                <>
                  <div className="form-group">
                    <label className="form-label">Admin ID</label>
                    <input
                      type="text"
                      name="adminId"
                      value={formData.adminId}
                      onChange={handleChange}
                      placeholder="Enter Admin ID"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Designation</label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      placeholder="e.g. Counselor, Faculty"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Authorization Code</label>
                    <input
                      type="password"
                      name="authorizationCode"
                      value={formData.authorizationCode}
                      onChange={handleChange}
                      placeholder="Enter Auth Code (Hint: ADMIN123)"
                      className="form-control"
                      required
                    />
                  </div>
                </>
              )}

              {/* Password Fields */}
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

              {/* Terms Agreement */}
              <div className="form-checkbox" style={{ marginBottom: '1.5rem' }}>
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  id="terms"
                  required
                />
                <label htmlFor="terms" style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                  I agree to the <a href="#terms" style={{ color: 'var(--color-primary)' }}>Terms of Service</a> and{" "}
                  <a href="#privacy" style={{ color: 'var(--color-primary)' }}>Privacy Policy</a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary btn-full-width"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>

              <div className="auth-footer">
                Already have an account?{" "}
                <span
                  onClick={() => navigate("/signin")}
                  style={{
                    color: "var(--color-primary)",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  Sign in
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
