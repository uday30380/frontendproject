import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Navbar({ user, onLogout, theme, toggleTheme, notifications = [], markAsRead, markAllAsRead }) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // 🅰️ Font Size Logic
  const [fontSize, setFontSize] = useState(1);
  const toggleFontSize = () => {
    const newSize = fontSize >= 1.2 ? 1 : fontSize + 0.1;
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize * 16}px`;
    // Note: This relies on using 'rem' units in CSS.
  };

  const handleLogout = () => {
    onLogout();
    navigate("/signin");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* 🔹 Logo Section */}
        <div className="navbar-logo" onClick={() => navigate("/")} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && navigate("/")}>
          <div className="logo-icon">🩺</div>
          <span className="logo-text">WellnessHub</span>
        </div>

        {/* 🔹 Navigation Links */}
        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
            Home
          </NavLink>
          <NavLink to="/wellness-programs" className={({ isActive }) => (isActive ? "active" : "")}>
            Programs
          </NavLink>
          <NavLink to="/health-resources" className={({ isActive }) => (isActive ? "active" : "")}>
            Resources
          </NavLink>
          <NavLink to="/support-services" className={({ isActive }) => (isActive ? "active" : "")}>
            Support
          </NavLink>
        </div>

        {/* 🔹 Actions Section */}
        <div className="navbar-actions">
          {/* 🅰️ Font Size Toggle */}
          <button className="btn btn-sm btn-ghost" onClick={toggleFontSize} title="Toggle Font Size" style={{ fontWeight: 'bold' }}>
            A+
          </button>


          {/* Theme Toggle */}
          <button
            className="btn btn-sm btn-ghost"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            style={{ fontSize: "1.2rem", padding: "0.5rem", borderRadius: "50%", width: "40px", height: "40px" }}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {/* 🌐 Language Mock */}
          <div style={{ position: 'relative', marginRight: '0.5rem' }}>
            <button className="btn btn-sm btn-ghost" title="Select Language" onClick={() => toast.success("Language switched to English (US)")}>
              🌐 EN
            </button>
          </div>

          {/* Notification Bell */}
          <div className="notification-container" style={{ position: "relative" }}>
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
              style={{ fontSize: "1.2rem", padding: "0.5rem", position: "relative", borderRadius: "50%", width: "40px", height: "40px" }}
            >
              🔔
              {unreadCount > 0 && (
                <span
                  className="notification-badge"
                  style={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                    background: "var(--color-danger)",
                    color: "white",
                    fontSize: "0.7rem",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: '2px solid var(--color-background)'
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h4>Notifications</h4>
                  {unreadCount > 0 && (
                    <button className="btn-text" onClick={markAllAsRead}>
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="notification-list">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`notification-item ${n.read ? "read" : "unread"}`}
                        onClick={() => markAsRead(n.id)}
                      >
                        <p className="notification-text">{n.text}</p>
                        <span className="notification-time">{n.time}</span>
                      </div>
                    ))
                  ) : (
                    <p className="no-notifications">No notifications</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {user ? (
            <>
              <span
                className="navbar-user"
                onClick={() => navigate("/profile")}
                style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.4rem 0.8rem", borderRadius: "var(--radius-full)", background: "var(--color-surface-alt)" }}
                title="View Profile"
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '600' }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : (user.emailOrId ? user.emailOrId.charAt(0).toUpperCase() : 'U')}
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: '500', maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name || user.role}</span>
              </span>
              <button className="btn btn-sm btn-outline" onClick={handleLogout} style={{ borderRadius: "var(--radius-full)" }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-sm btn-ghost" onClick={() => navigate("/signin")}>
                Sign In
              </button>
              <button className="btn btn-sm btn-primary" onClick={() => navigate("/signup")}>
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
