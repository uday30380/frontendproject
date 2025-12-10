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
      color: "rgba(255, 99, 71, 0.15)", // Custom danger light
      textColor: "#FF6347", // Custom danger
      action: "Call Now",
      isUrgent: true
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
    <div className="support-services fade-in">
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="support-hero">
        <div className="container">
          <h1 className="hero-title">Support Services</h1>
          <p className="hero-description">
            We care about your mental, emotional, and physical well-being.
            Access our comprehensive support network whenever you need help.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container">
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="card glass-panel feature-card-animated service-card">
              <div
                className="service-icon-wrapper"
                style={{
                  backgroundColor: service.color,
                  color: service.textColor,
                }}
              >
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-secondary mb-4 flex-1">{service.description}</p>
              <button
                className={`btn ${service.isUrgent ? "btn-danger" : "btn-outline"}`}
                style={{ alignSelf: "flex-start", width: "100%" }}
              >
                {service.action}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default SupportServices;
