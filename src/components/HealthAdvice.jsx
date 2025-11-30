import React from "react";

function HealthAdvice() {
  const adviceList = [
    {
      icon: "🍎",
      title: "Balanced Nutrition",
      content: "Fuel your body with a mix of fruits, vegetables, lean proteins, and whole grains. Avoid skipping meals, especially breakfast, to maintain energy levels throughout the day.",
      color: "var(--color-success-bg)",
      textColor: "var(--color-success)",
    },
    {
      icon: "🛌",
      title: "Quality Sleep",
      content: "Aim for 7-9 hours of sleep. Create a bedtime routine, avoid screens before bed, and keep your room cool and dark to improve sleep quality.",
      color: "var(--color-primary-light)",
      textColor: "var(--color-primary)",
    },
    {
      icon: "💧",
      title: "Stay Hydrated",
      content: "Drink at least 8 glasses of water daily. Carry a reusable bottle and sip throughout the day to stay focused and prevent fatigue.",
      color: "var(--color-info-bg)",
      textColor: "var(--color-info)",
    },
    {
      icon: "🧘",
      title: "Mindful Breaks",
      content: "Take short 5-10 minute breaks every hour while studying. Stretch, breathe deeply, or walk around to reset your focus.",
      color: "var(--color-warning-bg)",
      textColor: "var(--color-warning)",
    },
    {
      icon: "📵",
      title: "Digital Detox",
      content: "Limit social media usage, especially in the morning and before bed. Disconnecting helps reduce anxiety and improves mental clarity.",
      color: "var(--color-danger-bg)",
      textColor: "var(--color-danger)",
    },
    {
      icon: "🤝",
      title: "Social Connection",
      content: "Spend time with friends and family. Strong social connections are vital for emotional support and mental well-being.",
      color: "var(--color-primary-light)",
      textColor: "var(--color-primary)",
    },
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section" style={{ padding: "4rem 2rem", textAlign: "center", flexDirection: "column", gap: "1.5rem" }}>
        <div className="hero-content" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1 className="hero-title" style={{ fontSize: "3rem" }}>Health Advice</h1>
          <p className="hero-description" style={{ margin: "0 auto" }}>
            Practical tips, expert guidance, and simple habits to help you maintain
            a balanced, healthy, and productive student lifestyle.
          </p>
        </div>
      </section>

      {/* Advice Grid */}
      <section className="features-section" style={{ paddingTop: "2rem" }}>
        <div className="container">
          <div className="features-grid">
            {adviceList.map((item, index) => (
              <div key={index} className="feature-card">
                <div
                  className="feature-icon"
                  style={{
                    backgroundColor: item.color,
                    color: item.textColor,
                    fontSize: "2rem",
                  }}
                >
                  {item.icon}
                </div>
                <h3>{item.title}</h3>
                <p>{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HealthAdvice;
