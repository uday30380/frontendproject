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

  const handleMoodClick = (mood) => {
    // Redirect to signup with a query param or state to personalize the welcome
    navigate('/signup', { state: { initialMood: mood } });
  };

  return (
    <div className="homepage fade-in">
      {/* Hero Section */}
      <div className="container" style={{ marginTop: '2rem' }}>
        <div className="home-hero-split glass-panel" style={{ padding: '3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div className="hero-content">
            <div className="badge badge-primary" style={{ marginBottom: '1rem', alignSelf: 'flex-start' }}>
              ✨ #1 Wellness Platform for Students
            </div>
            <h1 className="hero-title" style={{ fontSize: '3.5rem', lineHeight: '1.1' }}>
              Elevate Your <br />
              <span style={{
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Campus Life
              </span>
            </h1>
            <p className="hero-description" style={{ fontSize: '1.2rem', margin: '1.5rem 0 2rem' }}>
              Balance academics and well-being with a personalized platform designed for your success.
              Track mood, join fitness programs, and connect with counselors—all in one place.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/signup')}>
                Start Your Journey 🚀
              </button>
              <button className="btn btn-outline btn-lg" onClick={scrollToLearnMore}>
                Explore Features
              </button>
            </div>

            <div className="trust-indicators" style={{ marginTop: '3rem' }}>
              <div className="trust-item glass-panel" style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.5)' }}>
                <span style={{ color: 'var(--color-success)', fontSize: '1.2rem' }}>✓</span> 50+ Universities
              </div>
              <div className="trust-item glass-panel" style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.5)' }}>
                <span style={{ color: 'var(--color-success)', fontSize: '1.2rem' }}>✓</span> 10k+ Students
              </div>
            </div>
          </div>

          <div className="hero-visual" style={{ position: 'relative' }}>
            {/* Interactive Mood Widget */}
            <div className="mood-check-widget glass-panel" style={{ padding: '2.5rem', background: 'rgba(255,255,255,0.8)' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>How are you feeling today?</h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>Check in to get personalized tips.</p>
              </div>

              <div className="mood-options" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <button className="mood-option-btn glass-panel" onClick={() => handleMoodClick('Happy')} aria-label="Feeling Happy" style={{ padding: '1.5rem', fontSize: '2rem' }}>
                  😄
                </button>
                <button className="mood-option-btn glass-panel" onClick={() => handleMoodClick('Calm')} aria-label="Feeling Calm" style={{ padding: '1.5rem', fontSize: '2rem' }}>
                  😌
                </button>
                <button className="mood-option-btn glass-panel" onClick={() => handleMoodClick('Stressed')} aria-label="Feeling Stressed" style={{ padding: '1.5rem', fontSize: '2rem' }}>
                  😫
                </button>
                <button className="mood-option-btn glass-panel" onClick={() => handleMoodClick('Tired')} aria-label="Feeling Tired" style={{ padding: '1.5rem', fontSize: '2rem' }}>
                  😴
                </button>
                <button className="mood-option-btn glass-panel" onClick={() => handleMoodClick('Focused')} aria-label="Feeling Focused" style={{ padding: '1.5rem', fontSize: '2rem' }}>
                  🧠
                </button>
                <button className="mood-option-btn glass-panel" onClick={() => handleMoodClick('Anxious')} aria-label="Feeling Anxious" style={{ padding: '1.5rem', fontSize: '2rem' }}>
                  😰
                </button>
              </div>

              <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                  Join now to track your daily wellness trends.
                </p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div style={{
              position: 'absolute',
              top: '-30px',
              right: '-30px',
              width: '150px',
              height: '150px',
              background: 'var(--color-accent)',
              filter: 'blur(80px)',
              opacity: '0.4',
              zIndex: '-1'
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '-30px',
              left: '-30px',
              width: '200px',
              height: '200px',
              background: 'var(--color-primary)',
              filter: 'blur(100px)',
              opacity: '0.4',
              zIndex: '-1'
            }}></div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="learn-more" className="features-section" style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 4rem' }}>
            <h2 className="section-title">Everything You Need to Thrive</h2>
            <p className="section-description" style={{ fontSize: '1.2rem' }}>
              We've curated a suite of tools to support every aspect of your student life, from mental clarity to physical vitality.
            </p>
          </div>

          <div className="wellness-grid-dynamic" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="card glass-panel feature-card-animated" style={{ padding: '2.5rem' }}>
              <div className="feature-icon" style={{ background: 'var(--color-info-bg)', color: 'var(--color-info)', width: '60px', height: '60px', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                🧠
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Mental Wellness</h3>
              <p>Access guided meditations, stress management workshops, and 24/7 counseling support.</p>
            </div>

            <div className="card glass-panel feature-card-animated" style={{ padding: '2.5rem' }}>
              <div className="feature-icon" style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)', width: '60px', height: '60px', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                🏃‍♂️
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Physical Fitness</h3>
              <p>Join virtual yoga classes, track your steps, and participate in campus-wide fitness challenges.</p>
            </div>

            <div className="card glass-panel feature-card-animated" style={{ padding: '2.5rem' }}>
              <div className="feature-icon" style={{ background: 'var(--color-warning-bg)', color: 'var(--color-warning)', width: '60px', height: '60px', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                🥗
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Nutrition & Habits</h3>
              <p>Get healthy meal plans, track hydration, and build sustainable daily habits.</p>
            </div>

            <div className="card glass-panel feature-card-animated" style={{ padding: '2.5rem' }}>
              <div className="feature-icon" style={{ background: 'var(--color-accent-light)', color: 'var(--color-accent)', width: '60px', height: '60px', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                🤝
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Community Support</h3>
              <p>Connect with peer support groups and find study buddies who share your wellness goals.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="testimonial-section" style={{ padding: '6rem 0', background: 'linear-gradient(to bottom, transparent, rgba(var(--color-primary-rgb), 0.05))' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 className="section-title">Student Stories</h2>
            <p className="section-description" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
              Hear from students who are transforming their campus experience.
            </p>
          </div>

          <div className="testimonial-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <div className="card glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '1rem', lineHeight: 1 }}>❝</div>
              <p className="testimonial-quote" style={{ flex: 1, fontSize: '1.1rem', fontStyle: 'italic', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                WellnessHub helped me manage my exam stress. The guided meditations are a lifesaver during finals week! I feel so much more balanced now.
              </p>
              <div className="testimonial-author" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                <div className="author-avatar" style={{
                  width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-primary)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                }}>SJ</div>
                <div>
                  <strong style={{ display: 'block', fontSize: '1rem' }}>Sarah Jenkins</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Computer Science, Year 3</span>
                </div>
              </div>
            </div>

            <div className="card glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ fontSize: '2rem', color: 'var(--color-accent)', marginBottom: '1rem', lineHeight: 1 }}>❝</div>
              <p className="testimonial-quote" style={{ flex: 1, fontSize: '1.1rem', fontStyle: 'italic', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                I love the fitness challenges! It's so motivating to see my progress and compete with friends. It keeps me active even on busy days.
              </p>
              <div className="testimonial-author" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                <div className="author-avatar" style={{
                  width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-accent)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                }}>MP</div>
                <div>
                  <strong style={{ display: 'block', fontSize: '1rem' }}>Michael Park</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Business Admin, Year 2</span>
                </div>
              </div>
            </div>

            <div className="card glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ fontSize: '2rem', color: 'var(--color-success)', marginBottom: '1rem', lineHeight: 1 }}>❝</div>
              <p className="testimonial-quote" style={{ flex: 1, fontSize: '1.1rem', fontStyle: 'italic', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                The counseling booking system is so easy to use. I got the support I needed without any hassle. It's reassuring to know help is just a click away.
              </p>
              <div className="testimonial-author" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                <div className="author-avatar" style={{
                  width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-success)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                }}>AL</div>
                <div>
                  <strong style={{ display: 'block', fontSize: '1rem' }}>Anita Lopez</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Psychology, Year 4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div className="card" style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
          color: 'white',
          border: 'none',
          padding: '4rem 2rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background Pattern */}
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            pointerEvents: 'none'
          }}></div>

          <div style={{ position: 'relative', zIndex: '1', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '2.5rem' }}>Ready to prioritize your well-being?</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.25rem', marginBottom: '2.5rem' }}>
              Join thousands of students who are building healthier habits and achieving their goals with WellnessHub.
            </p>
            <button className="btn btn-lg" style={{ backgroundColor: 'white', color: 'var(--color-primary)', border: 'none', padding: '1rem 3rem' }} onClick={() => navigate('/signup')}>
              Create Free Account
            </button>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: '0.8' }}>No credit card required • Free for students</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
