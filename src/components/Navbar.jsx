import React from 'react';

const Navbar = ({ onNavigate, isLoggedIn, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => onNavigate('home')}>
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="logo-text">WellnessHub</span>
        </div>
        
        <div className="navbar-links">
          <a href="#" onClick={() => onNavigate('home')}>Home</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
        
        <div className="navbar-actions">
          {!isLoggedIn ? (
            <>
              <button className="btn btn-outline" onClick={() => onNavigate('signin')}>
                Login
              </button>
              <button className="btn btn-primary" onClick={() => onNavigate('signup')}>
                Sign Up
              </button>
            </>
          ) : (
            <>
              <span className="admin-label">Admin</span>
              <button className="btn btn-outline" onClick={onLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
