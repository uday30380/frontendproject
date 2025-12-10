import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function WellnessPrograms({ user, studentData, enrollInProgram, leaveProgram, programs }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProgram, setSelectedProgram] = useState(null);

  // Use programs passed from props, fallback to empty array if undefined
  const safePrograms = programs || [];

  const categories = ["All", "Physical", "Mental", "Lifestyle"];

  const filteredPrograms = safePrograms.filter((program) => {
    const matchesSearch = program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || program.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="homepage fade-in">
      {/* Hero Section */}
      <section className="hero-section" style={{ padding: "4rem 2rem", textAlign: "center", flexDirection: "column", gap: "1.5rem" }}>
        <div className="hero-content" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1 className="hero-title" style={{ fontSize: "3.5rem" }}>Wellness Programs</h1>
          <p className="hero-description" style={{ margin: "0 auto", fontSize: "1.2rem" }}>
            Discover a variety of programs designed to promote your physical health,
            mental well-being, and overall balance. Join a community of students
            striving for a healthier lifestyle.
          </p>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="container" style={{ marginBottom: "3rem" }}>
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)', display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "center", maxWidth: '900px', margin: '0 auto' }}>
          <input
            type="text"
            placeholder="🔍 Search programs..."
            className="form-control"
            style={{ maxWidth: "600px", fontSize: '1.1rem', padding: '0.8rem 1.5rem' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`btn ${selectedCategory === cat ? "btn-primary" : "btn-outline"}`}
                onClick={() => setSelectedCategory(cat)}
                style={{ borderRadius: '2rem', padding: '0.5rem 1.5rem' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="features-section" style={{ paddingTop: "1rem" }}>
        <div className="container">
          <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {filteredPrograms.length > 0 ? (
              filteredPrograms.map((program) => (
                <div key={program.id} className="card glass-panel feature-card-animated" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '2rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div
                    className="feature-icon"
                    style={{
                      backgroundColor: program.color,
                      color: program.textColor,
                      fontSize: "2.5rem",
                      width: '70px',
                      height: '70px',
                      borderRadius: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.5rem'
                    }}
                  >
                    {program.icon}
                  </div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{program.title}</h3>
                  <div className="badge badge-info" style={{ alignSelf: "flex-start", marginBottom: "1rem", borderRadius: '1rem', padding: '0.25rem 0.75rem' }}>{program.category}</div>
                  <p style={{ flex: 1, fontSize: '1.05rem', lineHeight: '1.6' }}>{program.description}</p>
                  <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                    <button
                      className="btn btn-outline"
                      style={{ flex: 1 }}
                      onClick={() => setSelectedProgram(program)}
                    >
                      Quick View
                    </button>
                    {studentData?.enrolledPrograms?.includes(program.id) ? (
                      <button
                        className="btn btn-outline"
                        style={{ flex: 1, borderColor: 'var(--color-text-secondary)', color: 'var(--color-text-secondary)' }}
                        onClick={() => {
                          if (window.confirm("Are you sure you want to leave this program?")) {
                            leaveProgram(studentData.id, program.id);
                          }
                        }}
                      >
                        Enrolled
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        style={{ flex: 1 }}
                        onClick={() => {
                          if (user?.role === "Student") {
                            enrollInProgram(studentData.id, program.id);
                            navigate(`/program/${program.id}`);
                          } else {
                            navigate("/signin");
                          }
                        }}
                      >
                        Join →
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem", color: "var(--color-text-secondary)" }}>
                <h3>No programs found matching your criteria.</h3>
                <button className="btn btn-ghost" onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }} style={{ marginTop: '1rem' }}>Clear Filters</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {selectedProgram && (
        <div className="modal-overlay" style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: 'blur(5px)',
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}
          onClick={() => setSelectedProgram(null)}
        >
          <div className="modal-content glass-panel" style={{ maxWidth: "600px", width: "90%", padding: "2.5rem", borderRadius: 'var(--radius-2xl)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <h2 style={{ margin: 0, fontSize: '2rem' }}>{selectedProgram.title}</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedProgram(null)} style={{ fontSize: '1.5rem' }}>✕</button>
            </div>
            <div
              className="feature-icon"
              style={{
                backgroundColor: selectedProgram.color,
                color: selectedProgram.textColor,
                fontSize: "3rem",
                width: '80px',
                height: '80px',
                borderRadius: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: "2rem"
              }}
            >
              {selectedProgram.icon}
            </div>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '2rem' }}>{selectedProgram.description}</p>
            <div style={{ padding: "1.5rem", background: "rgba(255,255,255,0.05)", borderRadius: "var(--radius-lg)", border: '1px solid rgba(255,255,255,0.1)' }}>
              <h4 style={{ marginBottom: '1rem' }}>Program Highlights</h4>
              <ul style={{ paddingLeft: "1.5rem", color: "var(--color-text-secondary)", display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li>✨ Weekly guided sessions with experts</li>
                <li>🤝 Supportive community group chat</li>
                <li>📈 Personalized progress tracking dashboard</li>
              </ul>
            </div>
            <div className="modal-actions" style={{ marginTop: "2.5rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
              <button className="btn btn-outline" onClick={() => setSelectedProgram(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => navigate(`/program/${selectedProgram.id}`)}>Go to Program Page</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WellnessPrograms;
