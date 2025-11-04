import React from 'react';

const HomePage = ({ onNavigate }) => {
  return (
    <div className="homepage">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Your Health, Your Success – <span className="highlight">All in One Place</span>
          </h1>
          <p className="hero-description">
            Comprehensive health and wellness support designed specifically for students. 
            Access mental health resources, fitness programs, and personalized wellness 
            tracking and personal growth.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => onNavigate('signup')}>
              Get Started Free
            </button>
            <button className="btn btn-outline">Learn More</button>
          </div>
          <div className="trust-indicators">
            <div className="trust-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Fast Access</span>
            </div>
            <div className="trust-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>24/7 Support</span>
            </div>
            <div className="trust-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Privacy First</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&h=400&fit=crop" alt="Yoga class" />
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">Empowering Student Wellness</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon" style={{backgroundColor: 'var(--color-bg-1)'}}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Mental Health</h3>
            <p>24/7 access to licensed counselors and mental health resources</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{backgroundColor: 'var(--color-bg-3)'}}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Fitness Programs</h3>
            <p>Personalized workout and activity tracking tailored to your goals</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{backgroundColor: 'var(--color-bg-2)'}}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
              </svg>
            </div>
            <h3>Nutrition Advice</h3>
            <p>Our dietitians and healthy eating guides for optimal performance</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{backgroundColor: 'var(--color-bg-5)'}}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>Support Services</h3>
            <p>Counseling, appointments, and emergency contacts at your fingertips</p>
          </div>
        </div>
      </div>

      <div className="yoga-section">
        <h2 className="section-title">Yoga Poses to Reduce Stress</h2>
        <p className="section-description">
          Try these calming yoga poses designed to alleviate stress and anxiety during your academic journey
        </p>
        <div className="yoga-grid">
          {[
            { name: 'Easy Pose', duration: '10 min', level: 'Beginner' },
            { name: 'Child Pose', duration: '8 min', level: 'Beginner' },
            { name: 'Forward Fold', duration: '12 min', level: 'Intermediate' },
            { name: 'Flow Pose', duration: '15 min', level: 'Intermediate' },
            { name: 'Child Pose', duration: '10 min', level: 'Beginner' },
            { name: 'Side Stretch', duration: '8 min', level: 'Beginner' }
          ].map((pose, index) => (
            <div key={index} className="yoga-card">
              <div className="yoga-number">{index + 1}</div>
              <h4>{pose.name}</h4>
              <div className="yoga-meta">
                <span className="yoga-duration">⏱ {pose.duration}</span>
                <span className="yoga-level">{pose.level}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="yoga-image">
          <div className="verified-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Verified Safe</span>
          </div>
          <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop" alt="Yoga class" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;

