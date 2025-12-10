import React from "react";
import { useNavigate } from "react-router-dom";

const SignUp = ({ onGoogleLogin }) => {
  const navigate = useNavigate();

  return (
    <div className="auth-page-premium fade-in">
      <div className="auth-container-premium">
        {/* LEFT SIDE - Branding */}
        <div className="auth-left-premium">
          <div>
            <div className="brand-logo-premium" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
              <div className="logo-icon-premium">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
                  <path d="M9 12L11 14L15 10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h1 style={{ fontSize: '1.8rem', margin: 0, color: 'white' }}>WellnessHub</h1>
            </div>

            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'white' }}>
              Join the Community
            </h2>
            <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.6 }}>
              Start your wellness journey today. Get access to exclusive resources, expert guidance, and a supportive network of peers.
            </p>

            <div className="feature-list-premium">
              <div className="feature-item-premium">
                <div className="feature-icon-premium">✨</div>
                <span>Personalized Plans</span>
              </div>
              <div className="feature-item-premium">
                <div className="feature-icon-premium">🔒</div>
                <span>One-Click Access</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Form */}
        <div className="auth-right-premium">
          <div className="auth-form-wrapper" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <h2 className="auth-title">Create Account</h2>
            <p className="auth-subtitle">Join us instantly with your Google account.</p>

            <div style={{ padding: '2rem 0' }}>
              <button
                type="button"
                onClick={async () => {
                  try {
                    const user = await onGoogleLogin();
                    if (user) {
                      if (user.role === "Admin") {
                        navigate("/admin-dashboard");
                      } else {
                        navigate("/student-dashboard");
                      }
                    }
                  } catch (e) {
                    console.error("Sign up failed", e);
                  }
                }}
                className="btn btn-outline btn-full-width btn-lg"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  background: 'white',
                  color: '#333',
                  borderColor: '#ddd',
                  padding: '1rem',
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)'
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.52 12.29C23.52 11.43 23.44 10.61 23.3 9.81H12V14.45H18.45C18.17 15.93 17.33 17.18 16.06 18.02V21.01H19.96C22.24 18.9 23.52 15.82 23.52 12.29Z" fill="#4285F4" />
                  <path d="M12 24C15.24 24 17.96 22.92 19.96 21.01L16.06 18.02C14.98 18.74 13.6 19.16 12 19.16C8.87 19.16 6.22 17.05 5.27 14.19H1.24V17.31C3.25 21.3 7.37 24 12 24Z" fill="#34A853" />
                  <path d="M5.27 14.19C5.03 13.33 4.9 12.43 4.9 11.5C4.9 10.57 5.03 9.67 5.27 8.81V5.69H1.24C0.45 7.27 0 9.06 0 11.5C0 13.94 0.45 15.73 1.24 17.31L5.27 14.19Z" fill="#FBBC05" />
                  <path d="M12 4.84C13.76 4.84 15.34 5.45 16.58 6.63L20.04 3.17C17.96 1.23 15.24 0 12 0C7.37 0 3.25 2.7 1.24 6.69L5.27 9.81C6.22 6.95 8.87 4.84 12 4.84Z" fill="#EA4335" />
                </svg>
                Sign up with Google
              </button>
            </div>

            <p style={{ marginTop: '2rem', fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
              Already have an account?{' '}
              <span onClick={() => navigate("/signin")} style={{ color: 'var(--color-primary)', fontWeight: '600', cursor: 'pointer' }}>
                Sign In
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

