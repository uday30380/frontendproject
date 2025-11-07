import React from "react";

function About() {
  return (
    <div className="about-section">
      <h2>About Us</h2>
      <p>
        The <strong>Student Health and Wellness Platform</strong> is designed to empower students with tools,
        resources, and programs that promote physical, mental, and emotional well-being. We believe that a
        healthy student community is the foundation for academic success and personal growth.
      </p>

      <p>
        Our mission is to encourage mindfulness, foster community connections, and provide easy access to
        wellness activities, support services, and expert guidance.
      </p>

      <div className="about-values">
        <div className="value-card">
          <h4>🌱 Holistic Health</h4>
          <p>We focus on nurturing the body, mind, and spirit through balanced wellness practices.</p>
        </div>
        <div className="value-card">
          <h4>💡 Empowerment</h4>
          <p>Students are encouraged to take charge of their well-being with self-awareness and confidence.</p>
        </div>
        <div className="value-card">
          <h4>🤝 Community</h4>
          <p>We foster a supportive environment where everyone is heard, respected, and cared for.</p>
        </div>
      </div>
    </div>
  );
}

export default About;
