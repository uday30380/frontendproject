import React from "react";

function About() {
  return (
    <div className="about-page fade-in">
      <div className="container" style={{ padding: "4rem 2rem" }}>
        {/* Header */}
        <div className="text-center" style={{ marginBottom: "4rem" }}>
          <h1 style={{ fontSize: "3.5rem", marginBottom: "1.5rem" }}>Our Mission</h1>
          <p style={{ fontSize: "1.25rem", maxWidth: "800px", margin: "0 auto", opacity: 0.9, lineHeight: "1.6" }}>
            The <strong>Student Health and Wellness Platform</strong> is designed to empower students with tools,
            resources, and programs that promote physical, mental, and emotional well-being.
          </p>
        </div>

        {/* Vision Section */}
        <div className="glass-panel" style={{ padding: "3rem", marginBottom: "4rem", borderRadius: "var(--radius-xl)", textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Why We Exist</h2>
          <p style={{ fontSize: "1.1rem", maxWidth: "900px", margin: "0 auto", opacity: 0.8 }}>
            We believe that a healthy student community is the foundation for academic success and personal growth.
            Our mission is to encourage mindfulness, foster community connections, and provide easy access to
            wellness activities, support services, and expert guidance.
          </p>
        </div>

        {/* Values Grid */}
        <div className="features-grid">
          <div className="card glass-panel feature-card-animated" style={{ padding: "2.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>🌱</div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Holistic Health</h3>
            <p style={{ opacity: 0.8 }}>We focus on nurturing the body, mind, and spirit through balanced wellness practices.</p>
          </div>

          <div className="card glass-panel feature-card-animated" style={{ padding: "2.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>💡</div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Empowerment</h3>
            <p style={{ opacity: 0.8 }}>Students are encouraged to take charge of their well-being with self-awareness and confidence.</p>
          </div>

          <div className="card glass-panel feature-card-animated" style={{ padding: "2.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>🤝</div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Community</h3>
            <p style={{ opacity: 0.8 }}>We foster a supportive environment where everyone is heard, respected, and cared for.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
