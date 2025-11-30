import React from "react";

function SupportServices() {
  const services = [
    {
      icon: "💬",
      title: "Counseling Sessions",
      description: "Speak confidentially with trained counselors about stress, anxiety, or personal concerns. Available in-person or virtually.",
      color: "var(--color-primary-light)",
      textColor: "var(--color-primary)",
      action: "Book Session",
    },
    {
      icon: "🤝",
      title: "Peer Support Groups",
      description: "Join peer groups to share experiences and connect with fellow students who understand your journey.",
      color: "var(--color-success-bg)",
      textColor: "var(--color-success)",
      action: "Find a Group",
    },
    {
      icon: "📞",
      title: "24/7 Crisis Helpline",
      description: "Immediate emotional support for urgent situations. Reach out anytime, day or night.",
      color: "var(--color-danger-bg)",
      textColor: "var(--color-danger)",
      action: "Call Now",
    },
    {
      icon: "📚",
      title: "Academic Advising",
      description: "Get guidance on course loads, time management, and study strategies to reduce academic stress.",
      color: "var(--color-info-bg)",
      textColor: "var(--color-info)",
      action: "Schedule Appointment",
    },
    {
      icon: "🏥",
      title: "Health Clinic",
      description: "On-campus medical services for physical health checkups, vaccinations, and minor treatments.",
      color: "var(--color-warning-bg)",
      textColor: "var(--color-warning)",
      action: "View Hours",
    },
    {
      icon: "🧘",
      title: "Mindfulness Workshops",
      description: "Weekly workshops teaching meditation and relaxation techniques to manage daily stress.",
      color: "var(--color-primary-light)",
      textColor: "var(--color-primary)",
      action: "Register",
    },
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section" style={{ padding: "4rem 2rem", textAlign: "center", flexDirection: "column", gap: "1.5rem" }}>
        <div className="hero-content" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1 className="hero-title" style={{ fontSize: "3rem" }}>Support Services</h1>
          <p className="hero-description" style={{ margin: "0 auto" }}>
            We care about your mental, emotional, and physical well-being.
            Access our comprehensive support network whenever you need help.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="features-section" style={{ paddingTop: "2rem" }}>
        <div className="container">
          <div className="features-grid">
            {services.map((service, index) => (
              <div key={index} className="feature-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div
                  className="feature-icon"
                  style={{
                    backgroundColor: service.color,
                    color: service.textColor,
                    fontSize: "2rem",
                  }}
                >
                  {service.icon}
                </div>
                <h3>{service.title}</h3>
                <p style={{ flex: 1 }}>{service.description}</p>
                <button
                  className={`btn btn-sm ${service.title.includes("Crisis") ? "btn-danger" : "btn-outline"}`}
                  style={{ marginTop: "1.5rem", alignSelf: "flex-start" }}
                >
                  {service.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default SupportServices;
