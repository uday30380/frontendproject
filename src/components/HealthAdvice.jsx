import React from "react";

function HealthAdvice() {
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Health Advice</h1>
        <p>Practical tips and guidance to help students maintain a balanced and healthy lifestyle.</p>
      </div>

      <div className="card-grid">
        <div className="info-card">
          <div className="info-card-icon">🍎</div>
          <h3>Nutrition Tips</h3>
          <p>Eat a balanced diet filled with fruits, vegetables, and whole grains to boost energy and focus.</p>
        </div>
        <div className="info-card">
          <div className="info-card-icon">🛌</div>
          <h3>Sleep Well</h3>
          <p>Maintain a consistent sleep schedule of 7-8 hours for better concentration and mood.</p>
        </div>
        <div className="info-card">
          <div className="info-card-icon">💧</div>
          <h3>Stay Hydrated</h3>
          <p>Drink enough water daily to support brain function and physical performance.</p>
        </div>
      </div>
    </div>
  );
}

export default HealthAdvice;
