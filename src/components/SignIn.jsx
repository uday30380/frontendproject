import { useState } from "react";
import { useNavigate } from "react-router-dom";


const SignIn = ({ onLogin, trackLogin }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    loginAs: "Student",
    emailOrId: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Handle Submit (Refactored for Firebase)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.emailOrId || !formData.password) {
      alert("Please fill in all required fields.");
      return;
    }

    // Pass credentials to App.jsx -> firebaseApi.login
    if (onLogin) {
      try {
        await onLogin(formData.emailOrId, formData.password, formData.loginAs);
      } catch (err) {
        // Error handling is done in App.jsx (Toast)
        console.error("Login call failed", err);
      }
    }

    if (trackLogin) trackLogin();

    if (formData.loginAs === "Admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/student-dashboard");
    }
  };

  return (
    <div className="auth-page-premium fade-in">
      <div className="auth-container-premium">
        {/* LEFT SIDE - Branding */}
        <div className="auth-left-premium">
          <div>
            <div className="brand-logo-premium cursor-pointer" onClick={() => navigate("/")}>
              <div className="logo-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
                  <path d="M9 12L11 14L15 10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white m-0">WellnessHub</h1>
            </div>

            <h2 className="text-4xl text-white mb-6 font-bold">
              Welcome Back!
            </h2>
            <p className="text-lg text-white/90 leading-relaxed mb-8">
              Continue your journey to better health. Access your personalized dashboard, track your progress, and connect with your community.
            </p>

            <div className="feature-list-premium">
              <div className="feature-item-premium">
                <div className="feature-icon-premium">🧠</div>
                <span>Mental Health Support</span>
              </div>
              <div className="feature-item-premium">
                <div className="feature-icon-premium">🏃‍♂️</div>
                <span>Fitness Tracking</span>
              </div>
              <div className="feature-item-premium">
                <div className="feature-icon-premium">🤝</div>
                <span>Community Connection</span>
              </div>
            </div>
          </div>

          <div className="social-proof-premium">
            <div className="user-avatars">
              <div className="user-avatar" style={{ backgroundImage: 'url(https://randomuser.me/api/portraits/women/44.jpg)' }}></div>
              <div className="user-avatar" style={{ backgroundImage: 'url(https://randomuser.me/api/portraits/men/32.jpg)' }}></div>
              <div className="user-avatar" style={{ backgroundImage: 'url(https://randomuser.me/api/portraits/women/68.jpg)' }}></div>
              <div className="user-avatar bg-white flex items-center justify-center text-primary font-bold text-xs">
                +2k
              </div>
            </div>
            <p className="text-sm text-white/80 m-0">Join thousands of students improving their lives.</p>
          </div>
        </div>

        {/* RIGHT SIDE - Form */}
        <div className="auth-right-premium">
          <div className="auth-form-wrapper">
            <h2 className="text-3xl font-bold mb-2 text-center text-primary">Sign In</h2>
            <p className="text-center text-secondary mb-8">Please enter your details to access your account.</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Login As</label>
                <div className="flex gap-4 mb-4">
                  <button
                    type="button"
                    className={`btn flex-1 ${formData.loginAs === 'Student' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setFormData({ ...formData, loginAs: 'Student' })}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    className={`btn flex-1 ${formData.loginAs === 'Admin' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setFormData({ ...formData, loginAs: 'Admin' })}
                  >
                    Admin
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email or ID</label>
                <input
                  type="text"
                  name="emailOrId"
                  value={formData.emailOrId}
                  onChange={handleChange}
                  placeholder={formData.loginAs === 'Student' ? "Student ID or Email" : "Admin ID"}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group relative">
                <label className="form-label">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="form-control pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-xl opacity-60 p-0"
                    tabIndex="-1"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-secondary">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  Remember me
                </label>
                <a href="#" className="text-sm text-primary hover:underline" onClick={(e) => { e.preventDefault(); setIsForgotPasswordOpen(true); }}>Forgot Password?</a>
              </div>

              <button type="submit" className="btn btn-primary btn-full-width btn-lg">
                Sign In
              </button>

              <p className="text-center mt-8 text-sm">
                Don't have an account?{' '}
                <span
                  onClick={() => navigate("/signup")}
                  className="text-primary font-bold cursor-pointer hover:underline"
                >
                  Sign Up
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="modal-overlay">
          <div className="glass-panel bg-white p-8 max-w-sm w-[90%] rounded-xl">
            <h3 className="text-xl font-bold mb-2">Reset Password</h3>
            <p className="text-secondary mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <input type="email" placeholder="Enter your email" className="form-control mb-6" />
            <div className="flex justify-end gap-4">
              <button className="btn btn-outline" onClick={() => setIsForgotPasswordOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => {
                alert("Reset link sent to your email!");
                setIsForgotPasswordOpen(false);
              }}>Send Link</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignIn;
