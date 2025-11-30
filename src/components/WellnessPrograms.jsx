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
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section" style={{ padding: "4rem 2rem", textAlign: "center", flexDirection: "column", gap: "1.5rem" }}>
        <div className="hero-content" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1 className="hero-title" style={{ fontSize: "3rem" }}>Wellness Programs</h1>
          <p className="hero-description" style={{ margin: "0 auto" }}>
            Discover a variety of programs designed to promote your physical health,
            mental well-being, and overall balance. Join a community of students
            striving for a healthier lifestyle.
          </p>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="container" style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "center" }}>
          <input
            type="text"
            placeholder="🔍 Search programs..."
            className="form-control"
            style={{ maxWidth: "500px" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`btn btn-sm ${selectedCategory === cat ? "btn-primary" : "btn-outline"}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="features-section" style={{ paddingTop: "2rem" }}>
        <div className="container">
          <div className="features-grid">
            {filteredPrograms.length > 0 ? (
              filteredPrograms.map((program) => (
                <div key={program.id} className="feature-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div
                    className="feature-icon"
                    style={{
                      backgroundColor: program.color,
                      color: program.textColor,
                      fontSize: "2rem",
                    }}
                  >
                    {program.icon}
                  </div>
                  <h3>{program.title}</h3>
                  <div className="badge badge-info" style={{ alignSelf: "flex-start", marginBottom: "1rem" }}>{program.category}</div>
                  <p style={{ flex: 1 }}>{program.description}</p>
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem" }}>
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
                        Enrolled (Leave)
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
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem", color: "var(--color-text-secondary)" }}>
                <h3>No programs found matching your criteria.</h3>
                <button className="btn btn-ghost" onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}>Clear Filters</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {selectedProgram && (
        <div className="modal-overlay" style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}
          onClick={() => setSelectedProgram(null)}
        >
          <div className="modal-content card" style={{ maxWidth: "500px", width: "90%", padding: "2rem" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ margin: 0 }}>{selectedProgram.title}</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedProgram(null)}>✕</button>
            </div>
            <div
              className="feature-icon"
              style={{
                backgroundColor: selectedProgram.color,
                color: selectedProgram.textColor,
                fontSize: "2rem",
                marginBottom: "1.5rem"
              }}
            >
              {selectedProgram.icon}
            </div>
            <p>{selectedProgram.description}</p>
            <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "var(--color-background)", borderRadius: "var(--radius-md)" }}>
              <h4>Program Highlights</h4>
              <ul style={{ paddingLeft: "1.5rem", color: "var(--color-text-secondary)" }}>
                <li>Weekly guided sessions</li>
                <li>Community support group</li>
                <li>Progress tracking</li>
              </ul>
            </div>
            <div className="modal-actions" style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
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
