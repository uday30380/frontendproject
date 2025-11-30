import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const scrollToLearnMore = () => {
    const element = document.getElementById('learn-more');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="homepage fade-in">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Your Health, Your Success <br />
            <span style={{ color: 'var(--color-primary)' }}>All in One Place</span>
          </h1>
          <p className="hero-description">
            Comprehensive health and wellness support designed specifically for students.
            Access mental health resources, fitness programs, and personalized wellness
            tracking for your personal growth.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/signin')}>
              Get Started Free
            </button>
            <button className="btn btn-outline btn-lg" onClick={scrollToLearnMore}>
              Learn More
            </button>
          </div>

          <div className="trust-indicators" style={{ display: 'flex', gap: '2rem' }}>
            <div className="trust-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
              <div style={{ color: 'var(--color-success)' }}>✓</div>
              <span>Fast Access</span>
            </div>
            <div className="trust-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
              <div style={{ color: 'var(--color-success)' }}>✓</div>
              <span>24/7 Support</span>
            </div>
            <div className="trust-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
              <div style={{ color: 'var(--color-success)' }}>✓</div>
              <span>Privacy First</span>
            </div>
          </div>
        </div>

        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80" alt="Student Wellness" />
        </div>
      </div>

      {/* Features Section */}
      <div id="learn-more" className="features-section">
        <h2 className="section-title">Empowering Student Wellness</h2>
        <p className="section-description">
          We provide the tools and support you need to maintain a healthy balance between academic success and personal well-being.
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'var(--color-info-bg)', color: 'var(--color-info)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 17L12 22L22 17" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3>Mental Health</h3>
            <p>24/7 access to licensed counselors, meditation guides, and stress management resources.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3>Fitness Programs</h3>
            <p>Personalized workout routines, yoga sessions, and activity tracking tailored to your schedule.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'var(--color-warning-bg)', color: 'var(--color-warning)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <h3>Nutrition Advice</h3>
            <p>Expert dietitians providing healthy eating guides, meal plans, and hydration tracking.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8M12 8v8" strokeLinecap="round" />
              </svg>
            </div>
            <h3>Support Services</h3>
            <p>Easy appointment booking, emergency contacts, and community support groups.</p>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section (New Content) */}
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <h2 className="section-title">Why Choose WellnessHub?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Holistic Approach</h3>
            <p>We integrate mental, physical, and nutritional health into one seamless platform.</p>
          </div>
          <div className="feature-card">
            <h3>Data-Driven Insights</h3>
            <p>Track your progress with advanced analytics and personalized reports.</p>
          </div>
          <div className="feature-card">
            <h3>Community Focused</h3>
            <p>Connect with peers and mentors in a safe, supportive environment.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)', color: 'white', border: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
            <div style={{ textAlign: 'left', flex: 1 }}>
              <h2 style={{ color: 'white', marginBottom: '1rem' }}>Ready to start your journey?</h2>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem' }}>
                Join thousands of students who are prioritizing their wellness today.
              </p>
            </div>
            <button className="btn" style={{ backgroundColor: 'white', color: 'var(--color-primary)' }} onClick={() => navigate('/signin')}>
              Join Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

