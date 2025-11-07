import React from "react";

function SupportServices() {
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Support Services</h1>
        <p>We care about your mental, emotional, and physical well-being. Access our support services anytime you need help.</p>
      </div>

      <div className="card-grid">
        <div className="info-card">
          <div className="info-card-icon">💬</div>
          <h3>Counseling Sessions</h3>
          <p>Speak confidentially with trained counselors about stress, anxiety, or personal concerns.</p>
        </div>
        <div className="info-card">
          <div className="info-card-icon">🤝</div>
          <h3>Peer Support</h3>
          <p>Join peer groups to share experiences and connect with fellow students who understand your journey.</p>
        </div>
        <div className="info-card">
          <div className="info-card-icon">📞</div>
          <h3>24/7 Helpline</h3>
          <p>Reach out anytime through our helpline for immediate emotional or academic support.</p>
        </div>
      </div>
    </div>
  );
}

export default SupportServices;
