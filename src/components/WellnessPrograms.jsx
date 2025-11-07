import React from "react";

function WellnessPrograms() {
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Wellness Programs</h1>
        <p>Discover programs that promote student health, happiness, and balance.</p>
      </div>

      <div className="card-grid">
        <div className="info-card">
          <div className="info-card-icon">🧘‍♀️</div>
          <h3>Yoga & Meditation</h3>
          <p>Guided sessions to improve mindfulness and reduce stress.</p>
        </div>
        <div className="info-card">
          <div className="info-card-icon">🏃‍♂️</div>
          <h3>Fitness Sessions</h3>
          <p>Participate in weekly fitness challenges and stay active.</p>
        </div>
        <div className="info-card">
          <div className="info-card-icon">💧</div>
          <h3>Hydration Drive</h3>
          <p>Encouraging daily water intake for better focus and health.</p>
        </div>
      </div>
    </div>
  );
}

export default WellnessPrograms;
