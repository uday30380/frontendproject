import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import ActivityChart from "./charts/ActivityChart";
import MoodTrendChart from "./charts/MoodTrendChart";

const AdminDashboard = ({ students, setStudents, updateStudentData, resources, addResource, updateResource, deleteResource, programs, addProgram, updateProgram, deleteProgram, announcements, addAnnouncement, deleteAnnouncement, analytics, appointments = [], updateAppointmentStatus, user }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("Dashboard Overview");
  const [newNote, setNewNote] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [activityData, setActivityData] = useState([]);
  const [moodData, setMoodData] = useState([]);
  const [loginData, setLoginData] = useState([]);

  // DEBUG: Log props to check for missing data
  console.log("AdminDashboard Props:", { students, resources, programs, analytics });

  // Safety Check: If students data is missing, show loading or empty state
  if (!students) {
    return (
      <div className="dashboard admin-dashboard center-content">
        <div className="loading-spinner">Loading Dashboard Data...</div>
      </div>
    );
  }





  // Appointment Management State
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentAction, setAppointmentAction] = useState(""); // "Approve", "Reject", "Reschedule"
  const [appointmentNote, setAppointmentNote] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState("");

  // Resource Management State
  const [isEditingResource, setIsEditingResource] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editResourceForm, setEditResourceForm] = useState({
    title: "", category: "Mental Health", type: "Article", description: "", thumbnail: "📝", duration: "", author: ""
  });

  // Program Management State
  const [isEditingProgram, setIsEditingProgram] = useState(false);
  const [editProgramForm, setEditProgramForm] = useState({
    id: "", title: "", category: "Physical", icon: "🏃‍♂️", color: "#4CAF50", textColor: "#FFFFFF", description: "", detailedDescription: "", img: "", duration: "", level: "All Levels"
  });

  // Announcement State
  const [isAddingAnnouncement, setIsAddingAnnouncement] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", content: "", type: "Info" });

  useEffect(() => {
    // Simulate aggregated data generation based on students
    const generateAggregatedData = () => {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

      // Mocking aggregated activity (e.g., avg steps of all students)
      const newActivityData = days.map(day => ({
        name: day,
        steps: Math.floor(Math.random() * 3000) + 3000, // Higher avg for group
        meditation: Math.floor(Math.random() * 20) + 15,
      }));

      // Mocking aggregated mood trend
      const newMoodData = days.map(day => ({
        name: day,
        mood: Math.floor(Math.random() * 3) + 6, // Avg mood 6-9
      }));

      setActivityData(newActivityData);
      setMoodData(newMoodData);
      setLoginData(days.map(day => ({ name: day, mood: Math.floor(Math.random() * 50) + 10 }))); // Reusing 'mood' key for LineChart compatibility
    };

    generateAggregatedData();
  }, [students]);

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedStudent = filteredStudents[selectedIndex] || filteredStudents[0];

  // 🔄 Navigation
  const nextStudent = () => setSelectedIndex((i) => (i + 1) % filteredStudents.length);
  const prevStudent = () => setSelectedIndex((i) => (i - 1 + filteredStudents.length) % filteredStudents.length);

  // 🗒️ Add Note
  // 🗒️ Add Note
  const addNote = () => {
    if (!newNote.trim() || !selectedStudent) return;
    const updated = { ...selectedStudent, notes: [...(selectedStudent.notes || []), newNote] };
    updateStudentData(updated);
    setNewNote("");
    toast("Note added 📝", { icon: "🗒️" });
  };

  // ✏️ Edit Student (Placeholder)
  const handleEditStudent = () => {
    toast("Edit Student feature coming soon! 🚧", { icon: "👨‍🎓" });
  };

  // 📤 Export Report (was sendMessage)
  const exportReport = () => {
    if (!selectedStudent) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Admin Wellness Summary", 10, 20);
    doc.setFontSize(12);
    doc.text(`Student: ${selectedStudent.name}`, 10, 35);
    doc.text(`XP: ${selectedStudent.wellnessScore}`, 10, 45);
    doc.text("Admin Notes:", 10, 60);
    (selectedStudent.notes || []).forEach((n, i) => {
      doc.text(`• ${n}`, 15, 70 + i * 10);
    });
    doc.save(`${selectedStudent.name}_AdminReport.pdf`);
    toast.success("Report exported as PDF 📊");
  };

  // Alias for backward compatibility if needed, or just use exportReport
  const sendMessage = exportReport;

  return (
    <div className="dashboard admin-dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>🧭 Admin Dashboard</h1>
            <p>Student Health and Wellness System</p>
          </div>
        </div>

        {/* Analytics Overview */}
        <section className="dashboard-section fade-in" style={{ marginBottom: "3rem" }}>
          <div className="section-header">
            <h2>Analytics Overview</h2>
          </div>

          {/* 🔔 Pending Appointments Widget */}
          {appointments.some(a => a.status === 'Pending') && (
            <div className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--color-warning)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  📅 Pending Appointment Requests
                  <span className="badge badge-warning">{appointments.filter(a => a.status === 'Pending').length}</span>
                </h3>
                <button className="btn btn-sm btn-outline" onClick={() => setActiveTab("Appointments")}>View All</button>
              </div>
              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                {appointments.filter(a => a.status === 'Pending').slice(0, 3).map(appt => (
                  <div key={appt.id} style={{ background: 'var(--color-surface-alt)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: '600' }}>{appt.studentName}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{appt.date}</span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                      {appt.type} • {appt.reason}
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button
                        className="btn btn-sm btn-success"
                        style={{ flex: 1 }}
                        onClick={() => updateAppointmentStatus(appt.id, "Confirmed", "Approved from Dashboard", user?.name || "Admin")}
                      >
                        Approve ✅
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        style={{ flex: 1 }}
                        onClick={() => {
                          setSelectedAppointment(appt);
                          setAppointmentAction("Reject");
                          setAppointmentNote("");
                          setActiveTab("Appointments");
                        }}
                      >
                        Reject ❌
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2rem" }}>
            {/* 📢 Quick Announcement Widget */}
            <div className="card">
              <h3 style={{ marginBottom: "1rem" }}>📢 Post Announcement</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                  type="text"
                  placeholder="Title"
                  style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-background)' }}
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                />
                <textarea
                  placeholder="Message..."
                  rows="3"
                  style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-background)', resize: 'none' }}
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                ></textarea>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (!newAnnouncement.title || !newAnnouncement.content) return toast.error("Please fill in all fields");
                    addAnnouncement({ ...newAnnouncement, id: Date.now(), date: new Date().toLocaleDateString() });
                    setNewAnnouncement({ title: "", content: "", type: "Info" });
                    toast.success("Announcement Posted! 📢");
                  }}
                >
                  Post Now 🚀
                </button>
              </div>
            </div>

            {/* ⚡ Recent Activity Feed */}
            <div className="card">
              <h3 style={{ marginBottom: "1rem" }}>⚡ Recent Activity</h3>
              <div className="activity-feed" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {students.slice(0, 5).map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'start', fontSize: '0.9rem', paddingBottom: '0.75rem', borderBottom: i < 4 ? '1px solid var(--color-border)' : 'none' }}>
                    <div style={{ marginTop: '0.25rem', width: '8px', height: '8px', borderRadius: '50%', background: i % 2 === 0 ? 'var(--color-success)' : 'var(--color-primary)' }}></div>
                    <div>
                      <div>
                        <span style={{ fontWeight: '600' }}>{s.name}</span>
                        <span style={{ color: 'var(--color-text-secondary)' }}> {i % 2 === 0 ? 'completed a session' : 'joined a program'}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>{Math.floor(Math.random() * 24) + 1}h ago</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <h3 style={{ marginBottom: "1rem" }}>Student Engagement</h3>
              <ActivityChart data={activityData} />
            </div>
            <div className="card">
              <h3 style={{ marginBottom: "1rem" }}>Average Mood Trend</h3>
              <MoodTrendChart data={moodData} />
            </div>
            <div className="card">
              <h3 style={{ marginBottom: "1rem" }}>Program Popularity</h3>
              {/* Simple Bar Chart for Program Popularity using Recharts or mock UI if Recharts not imported for this specific chart type yet. Reusing ActivityChart for simplicity or creating a new one if needed. Using ActivityChart structure for now as it is a BarChart. */}
              <ActivityChart data={programs?.map(p => ({ name: p.title.substring(0, 10) + '...', steps: Math.floor(Math.random() * 50) + 10 })) || []} />
            </div>
            {/* New Analytics Cards */}
            <div className="card">
              <h3 style={{ marginBottom: "1rem" }}>System Usage</h3>
              <div className="stats-grid" style={{ marginBottom: "1rem" }}>
                <div className="stat-card stat-card-blue">
                  <h4>Total Logins</h4>
                  <p className="stat-value">{analytics?.totalLogins || 0}</p>
                </div>
                <div className="stat-card stat-card-green">
                  <h4>Page Views</h4>
                  <p className="stat-value">{analytics?.pageViews || 0}</p>
                </div>
              </div>
              <h4 style={{ marginBottom: "0.5rem" }}>Daily Login Trend</h4>
              <div style={{ height: "200px" }}>
                <MoodTrendChart data={loginData} />
              </div>
            </div>
            <div className="card">
              <h3 style={{ marginBottom: "1rem" }}>Top Resources</h3>
              <ul className="leaderboard-list">
                {Object.entries(analytics?.resourceViews || {})
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([id, count], index) => {
                    const resource = resources?.find(r => r.id.toString() === id.toString());
                    return (
                      <li key={id} className="leaderboard-item">
                        <span className="leaderboard-rank">{index + 1}</span>
                        <span className="leaderboard-name">{resource?.title || `Resource ID: ${id}`}</span>
                        <span className="leaderboard-score">{count} views</span>
                      </li>
                    );
                  })}
                {Object.keys(analytics?.resourceViews || {}).length === 0 && <p>No resource views yet.</p>}
              </ul>
            </div>
          </div>
        </section>

        <div className="dashboard-content master-detail">
          {/* 🧍 Left Panel – Student List */}
          <div className="student-list-panel">
            <h3>Registered Students</h3>
            <input
              type="text"
              placeholder="🔍 Search student..."
              className="search-box search-container"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search students by name or department"
            />
            <div className="student-list" role="listbox" aria-label="Student list">
              {filteredStudents.map((student, i) => (
                <div
                  key={student.id}
                  className={`student-item ${selectedStudent.id === student.id ? "active" : ""}`}
                  onClick={() => setSelectedIndex(i)}
                  role="option"
                  aria-selected={selectedStudent.id === student.id}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedIndex(i);
                    }
                  }}
                >
                  <div className="student-avatar" aria-hidden="true">
                    {student.name.charAt(0)}
                  </div>
                  <div className="student-info">
                    <div className="student-name">{student.name}</div>
                    <div className="student-meta">
                      {student.department} • {student.wellnessScore}%
                    </div>
                  </div>
                  <div
                    className={`status-dot ${student.riskLevel === "High" || student.riskLevel === "Critical"
                      ? "red"
                      : student.riskLevel === "Moderate"
                        ? "yellow"
                        : "green"
                      }`}
                    aria-label={`Risk Level: ${student.riskLevel}`}
                  ></div>
                </div>
              ))}
            </div>

            <div className="nav-controls">
              <button className="btn btn-sm btn-outline" onClick={prevStudent} aria-label="Previous student">
                ⬅ Previous
              </button>
              <button className="btn btn-sm btn-outline" onClick={nextStudent} aria-label="Next student">
                Next ➡
              </button>
            </div>
          </div>

          {/* 📊 Right Panel – Student Details */}
          <div className="student-detail-panel">
            {!selectedStudent ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-secondary)" }}>
                <h3>Select a student to view details</h3>
              </div>
            ) : (
              <>
                <div className="detail-header">
                  <div>
                    <h2>{selectedStudent.name}</h2>
                    <p>
                      {selectedStudent.department} | Score: {selectedStudent.wellnessScore}%
                    </p>
                  </div>
                  <div className="action-buttons">
                    <button className="btn btn-outline" onClick={handleEditStudent} aria-label={`Edit details for ${selectedStudent.name}`}>
                      ✏️ Edit
                    </button>
                    <button className="btn btn-primary" onClick={exportReport} aria-label={`Export report for ${selectedStudent.name}`}>
                      📤 Export
                    </button>
                  </div>
                </div>

                <div className="tabs" role="tablist">
                  {[
                    "Dashboard Overview",
                    "Overview",
                    "Physical Health",
                    "Mental Wellness",
                    "Lifestyle & Habits",
                    "Counseling & Messages",
                    "Admin Notes",
                    "Resource Management",
                    "Program Management",
                    "Announcements",
                    "Appointments"
                  ].map(tab => (
                    <button
                      key={tab}
                      className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                      onClick={() => setActiveTab(tab)}
                      role="tab"
                      aria-selected={activeTab === tab}
                      aria-controls={`panel-${tab.replace(/\s+/g, '-')}`}
                      id={`tab-${tab.replace(/\s+/g, '-')}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="tab-content" role="tabpanel" id={`panel-${activeTab.replace(/\s+/g, '-')}`} aria-labelledby={`tab-${activeTab.replace(/\s+/g, '-')}`}>
                  {activeTab === "Dashboard Overview" && (
                    <div>
                      <h3>📊 System Overview</h3>
                      <div className="stats-grid">
                        <div className="stat-card stat-card-blue">
                          <h4>Total Students</h4>
                          <p className="stat-value">{students.length}</p>
                        </div>
                        <div className="stat-card stat-card-red">
                          <h4>High Risk</h4>
                          <p className="stat-value">
                            {students.filter(s => s.riskLevel === "High" || s.riskLevel === "Critical").length}
                          </p>
                        </div>
                        <div className="stat-card stat-card-green">
                          <h4>Avg Wellness</h4>
                          <p className="stat-value">
                            {Math.round(students.reduce((acc, s) => acc + s.wellnessScore, 0) / students.length)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "Overview" && (
                    <div>
                      <h3>📋 Student Overview</h3>
                      <div className="overview-grid">
                        <div className="card">
                          <h4>Academic</h4>
                          <p><b>ID:</b> {selectedStudent.id}</p>
                          <p><b>Department:</b> {selectedStudent.department}</p>
                        </div>
                        <div className="card">
                          <h4>Wellness Status</h4>
                          <p><b>Risk Level:</b> <span className={`badge ${selectedStudent.riskLevel === 'High' ? 'badge-danger' : 'badge-success'}`}>{selectedStudent.riskLevel}</span></p>
                          <p><b>Score:</b> {selectedStudent.wellnessScore}%</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "Physical Health" && (
                    <div>
                      <h3>💪 Physical Health Metrics</h3>
                      <div className="card" style={{ marginTop: "1rem" }}>
                        <p><b>BMI:</b> {selectedStudent.bmi}</p>
                        <p><b>Activity Level:</b> {selectedStudent.activity}</p>
                        <p><b>Average Sleep:</b> {selectedStudent.sleep} hrs/day</p>
                      </div>
                    </div>
                  )}

                  {activeTab === "Mental Wellness" && (
                    <div>
                      <h3>🧠 Mental Wellness</h3>
                      <div className="card" style={{ marginTop: "1rem" }}>
                        <p><b>Stress Level:</b> {selectedStudent.stress}/10</p>
                        <p><b>Counseling Sessions:</b> {selectedStudent.sessions}</p>
                        <p><b>Mood Summary:</b> {selectedStudent.stress > 7 ? "High Stress" : "Stable"}</p>
                      </div>
                    </div>
                  )}

                  {activeTab === "Lifestyle & Habits" && (
                    <div>
                      <h3>🌿 Lifestyle & Habits</h3>
                      <div className="card" style={{ marginTop: "1rem" }}>
                        <p><b>Physical Activity:</b> {selectedStudent.activity}</p>
                        <p><b>Sleep Hours:</b> {selectedStudent.sleep}</p>
                        <p><b>Participation:</b> Regular yoga and fitness challenges</p>
                      </div>
                    </div>
                  )}

                  {activeTab === "Counseling & Messages" && (
                    <div>
                      <h3>💬 Counseling & Communication</h3>
                      <div className="messages" role="log" aria-label="Message history">
                        {selectedStudent.messages.map((m, i) => (
                          <div key={i} className={`message ${m.from === "Admin" ? "admin" : "student"}`}>
                            <strong>{m.from}:</strong> {m.text}
                            <span className="message-time">{m.time}</span>
                          </div>
                        ))}
                      </div>
                      <div className="chat-input">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Type message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          aria-label="Type a message"
                        />
                        <button className="btn btn-primary" onClick={sendMessage} aria-label="Send message">
                          Send
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === "Admin Notes" && (
                    <div>
                      <h3>🗒️ Admin Notes</h3>
                      <ul className="notes-list">
                        {selectedStudent.notes.map((n, i) => (
                          <li key={i} className="note-item">🟢 {n}</li>
                        ))}
                      </ul>
                      <div className="note-input-area">
                        <textarea
                          className="form-control"
                          placeholder="Add a note..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          aria-label="Add a new note"
                        ></textarea>
                        <button className="btn btn-primary" onClick={addNote} aria-label="Save note">
                          Add
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === "Resource Management" && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <h3>📚 Resource Management</h3>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setEditResourceForm({ title: "", category: "Mental Health", type: "Article", description: "", thumbnail: "📝", duration: "", author: "" });
                            setIsEditingResource(true);
                          }}
                          aria-label="Add new resource"
                        >
                          + Add Resource
                        </button>
                      </div>

                      <div className="resources-list" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {resources?.map((resource) => (
                          <div key={resource.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem" }}>
                            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                              <div style={{ fontSize: "2rem" }}>{resource.thumbnail}</div>
                              <div>
                                <h4 style={{ margin: 0 }}>{resource.title}</h4>
                                <span className="badge badge-outline" style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>{resource.category} • {resource.type}</span>
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              <button
                                className="btn btn-sm btn-outline"
                                onClick={() => {
                                  setEditResourceForm(resource);
                                  setIsEditingResource(true);
                                }}
                                aria-label={`Edit resource ${resource.title}`}
                              >
                                ✏️
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => {
                                  if (window.confirm("Are you sure you want to delete this resource?")) {
                                    deleteResource(resource.id);
                                    toast.success("Resource deleted");
                                  }
                                }}
                                aria-label={`Delete resource ${resource.title}`}
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "Program Management" && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <h3>🧘‍♀️ Program Management</h3>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setEditProgramForm({
                              id: "",
                              title: "",
                              category: "Physical",
                              icon: "🏃‍♂️",
                              color: "#4CAF50",
                              textColor: "#FFFFFF",
                              description: "",
                              detailedDescription: "",
                              img: "",
                              duration: "",
                              level: "All Levels"
                            });
                            setIsEditingProgram(true);
                          }}
                          aria-label="Add new program"
                        >
                          + Add Program
                        </button>
                      </div>

                      <div className="resources-list" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {programs?.map((program) => (
                          <div key={program.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem" }}>
                            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                              <div style={{ fontSize: "2rem" }}>{program.icon}</div>
                              <div>
                                <h4 style={{ margin: 0 }}>{program.title}</h4>
                                <span className="badge badge-outline" style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>{program.category} • {program.duration}</span>
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              <button
                                className="btn btn-sm btn-outline"
                                onClick={() => {
                                  setEditProgramForm(program);
                                  setIsEditingProgram(true);
                                }}
                                aria-label={`Edit program ${program.title}`}
                              >
                                ✏️
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => {
                                  if (window.confirm("Are you sure you want to delete this program?")) {
                                    deleteProgram(program.id);
                                    toast.success("Program deleted");
                                  }
                                }}
                                aria-label={`Delete program ${program.title}`}
                              >
                                🗑️
                              </button>
                            </div>
                          </div>

                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "Announcements" && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <h3>📢 Announcements</h3>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => setIsAddingAnnouncement(true)}
                          aria-label="Post new announcement"
                        >
                          + Post Announcement
                        </button>
                      </div>

                      <div className="announcements-list" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {announcements?.map((announcement) => (
                          <div key={announcement.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", borderLeft: `4px solid ${announcement.type === 'Alert' ? 'var(--color-danger)' : announcement.type === 'Success' ? 'var(--color-success)' : 'var(--color-primary)'}` }}>
                            <div>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <h4 style={{ margin: 0 }}>{announcement.title}</h4>
                                <span className="badge badge-sm">{announcement.type}</span>
                              </div>
                              <p style={{ margin: "0.25rem 0 0", fontSize: "0.9rem" }}>{announcement.content}</p>
                              <span style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>{announcement.date}</span>
                            </div>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => {
                                if (window.confirm("Delete this announcement?")) {
                                  deleteAnnouncement(announcement.id);
                                  toast.success("Announcement deleted");
                                }
                              }}
                              aria-label={`Delete announcement ${announcement.title}`}
                            >
                              🗑️
                            </button>
                          </div>
                        ))}
                        {(!announcements || announcements.length === 0) && <p>No announcements posted.</p>}
                      </div>
                    </div>
                  )}

                  {/* Add Announcement Modal */}
                  {isAddingAnnouncement && (
                    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="add-announcement-title">
                      <div className="modal-content">
                        <h3 id="add-announcement-title">Post Announcement</h3>
                        <div className="form-group">
                          <label>Title</label>
                          <input
                            className="form-control"
                            value={newAnnouncement.title}
                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Type</label>
                          <select
                            className="form-control"
                            value={newAnnouncement.type}
                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}
                          >
                            <option value="Info">Info</option>
                            <option value="Alert">Alert</option>
                            <option value="Success">Success</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Content</label>
                          <textarea
                            className="form-control"
                            value={newAnnouncement.content}
                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                          />
                        </div>
                        <div className="modal-actions">
                          <button className="btn btn-outline" onClick={() => setIsAddingAnnouncement(false)}>Cancel</button>
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              if (!newAnnouncement.title || !newAnnouncement.content) {
                                toast.error("Please fill in all fields");
                                return;
                              }
                              addAnnouncement(newAnnouncement);
                              setNewAnnouncement({ title: "", content: "", type: "Info" });
                              setIsAddingAnnouncement(false);
                              toast.success("Announcement posted");
                            }}
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Edit Resource Modal */}
                  {
                    isEditingResource && (
                      <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="edit-resource-title">
                        <div className="modal-content" style={{ maxWidth: showPreview ? "700px" : "500px" }}>
                          {showPreview ? (
                            // 👁️ Preview Mode (Mock Student View)
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                  <div style={{ fontSize: '3rem' }}>{editResourceForm.thumbnail}</div>
                                  <div>
                                    <h2 style={{ marginBottom: '0.25rem' }}>{editResourceForm.title || "Untitled Resource"}</h2>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                      <span className="badge badge-primary">{editResourceForm.category}</span>
                                      <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>• {editResourceForm.type}</span>
                                    </div>
                                  </div>
                                </div>
                                <button className="btn btn-ghost" onClick={() => setShowPreview(false)}>✕</button>
                              </div>

                              <div style={{ background: 'var(--color-surface-alt)', padding: '2rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', textAlign: 'center' }}>
                                <p style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                                  [Content Placeholder: In a real app, the full article text or video player would appear here.]
                                </p>
                              </div>

                              <div style={{ marginBottom: '1.5rem' }}>
                                <h3>Description</h3>
                                <p>{editResourceForm.description || "No description provided."}</p>
                              </div>

                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                                <div>
                                  <strong>Author:</strong> {editResourceForm.author || "Unknown"}<br />
                                  <strong>Duration:</strong> {editResourceForm.duration || "N/A"}
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                  <button className="btn btn-outline">Save for Later</button>
                                  <button className="btn btn-primary">Start Now</button>
                                </div>
                              </div>

                              <div className="modal-actions" style={{ marginTop: "2rem", borderTop: "1px solid var(--color-border)", paddingTop: "1rem" }}>
                                <button className="btn btn-outline" onClick={() => setShowPreview(false)}>⬅ Back to Edit</button>
                                <button
                                  className="btn btn-primary"
                                  onClick={() => {
                                    if (editResourceForm.id) {
                                      updateResource(editResourceForm);
                                      toast.success("Resource updated");
                                    } else {
                                      addResource(editResourceForm);
                                      toast.success("Resource added");
                                    }
                                    setIsEditingResource(false);
                                    setShowPreview(false);
                                  }}
                                >
                                  Save & Publish
                                </button>
                              </div>
                            </div>
                          ) : (
                            // ✏️ Edit Mode
                            <div>
                              <h3 id="edit-resource-title">{editResourceForm.id ? "Edit Resource" : "Add Resource"}</h3>
                              <div className="form-group">
                                <label>Title</label>
                                <input
                                  className="form-control"
                                  value={editResourceForm.title}
                                  onChange={(e) => setEditResourceForm({ ...editResourceForm, title: e.target.value })}
                                />
                              </div>
                              <div className="form-group">
                                <label>Category</label>
                                <select
                                  className="form-control"
                                  value={editResourceForm.category}
                                  onChange={(e) => setEditResourceForm({ ...editResourceForm, category: e.target.value })}
                                >
                                  <option value="Mental Health">Mental Health</option>
                                  <option value="Fitness">Fitness</option>
                                  <option value="Nutrition">Nutrition</option>
                                  <option value="Sleep">Sleep</option>
                                </select>
                              </div>
                              <div className="form-group">
                                <label>Type</label>
                                <select
                                  className="form-control"
                                  value={editResourceForm.type}
                                  onChange={(e) => setEditResourceForm({ ...editResourceForm, type: e.target.value })}
                                >
                                  <option value="Article">Article</option>
                                  <option value="Video">Video</option>
                                  <option value="Audio">Audio</option>
                                  <option value="Challenge">Challenge</option>
                                </select>
                              </div>
                              <div className="form-group">
                                <label>Description</label>
                                <textarea
                                  className="form-control"
                                  value={editResourceForm.description}
                                  onChange={(e) => setEditResourceForm({ ...editResourceForm, description: e.target.value })}
                                />
                              </div>
                              <div className="modal-actions">
                                <button className="btn btn-outline" onClick={() => setIsEditingResource(false)}>Cancel</button>
                                <button className="btn btn-ghost" onClick={() => setShowPreview(true)}>👁️ Preview</button>
                                <button
                                  className="btn btn-primary"
                                  onClick={() => {
                                    if (editResourceForm.id) {
                                      updateResource(editResourceForm);
                                      toast.success("Resource updated");
                                    } else {
                                      addResource(editResourceForm);
                                      toast.success("Resource added");
                                    }
                                    setIsEditingResource(false);
                                  }}
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  }

                  {/* Edit Program Modal */}
                  {isEditingProgram && (
                    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="edit-program-title">
                      <div className="modal-content" style={{ maxWidth: "600px" }}>
                        <h3 id="edit-program-title">{editProgramForm.id ? "Edit Program" : "Add Program"}</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                          <div className="form-group">
                            <label>Title</label>
                            <input
                              className="form-control"
                              value={editProgramForm.title}
                              onChange={(e) => setEditProgramForm({ ...editProgramForm, title: e.target.value })}
                            />
                          </div>
                          <div className="form-group">
                            <label>Category</label>
                            <select
                              className="form-control"
                              value={editProgramForm.category}
                              onChange={(e) => setEditProgramForm({ ...editProgramForm, category: e.target.value })}
                            >
                              <option value="Physical">Physical</option>
                              <option value="Mental">Mental</option>
                              <option value="Lifestyle">Lifestyle</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Icon (Emoji)</label>
                            <input
                              className="form-control"
                              value={editProgramForm.icon}
                              onChange={(e) => setEditProgramForm({ ...editProgramForm, icon: e.target.value })}
                            />
                          </div>
                          <div className="form-group">
                            <label>Duration</label>
                            <input
                              className="form-control"
                              value={editProgramForm.duration}
                              onChange={(e) => setEditProgramForm({ ...editProgramForm, duration: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Short Description</label>
                          <input
                            className="form-control"
                            value={editProgramForm.description}
                            onChange={(e) => setEditProgramForm({ ...editProgramForm, description: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Detailed Description</label>
                          <textarea
                            className="form-control"
                            value={editProgramForm.detailedDescription}
                            onChange={(e) => setEditProgramForm({ ...editProgramForm, detailedDescription: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Image URL</label>
                          <input
                            className="form-control"
                            value={editProgramForm.img}
                            onChange={(e) => setEditProgramForm({ ...editProgramForm, img: e.target.value })}
                          />
                        </div>
                        <div className="modal-actions">
                          <button className="btn btn-outline" onClick={() => setIsEditingProgram(false)}>Cancel</button>
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              if (editProgramForm.id) {
                                updateProgram(editProgramForm);
                                toast.success("Program updated");
                              } else {
                                addProgram(editProgramForm);
                                toast.success("Program added");
                              }
                              setIsEditingProgram(false);
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "Appointments" && (
                    <div>
                      <h3>📅 Appointment Requests</h3>
                      <div className="card">
                        <table className="table" style={{ width: "100%", borderCollapse: "collapse" }}>
                          <thead>
                            <tr style={{ borderBottom: "1px solid var(--color-border)", textAlign: "left" }}>
                              <th style={{ padding: "1rem" }}>Student</th>
                              <th style={{ padding: "1rem" }}>Type</th>
                              <th style={{ padding: "1rem" }}>Date</th>
                              <th style={{ padding: "1rem" }}>Status</th>
                              <th style={{ padding: "1rem" }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {appointments.length > 0 ? (
                              appointments.map((appt) => (
                                <tr key={appt.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                                  <td style={{ padding: "1rem" }}>{appt.studentName} (ID: {appt.studentId})</td>
                                  <td style={{ padding: "1rem" }}>{appt.type}</td>
                                  <td style={{ padding: "1rem" }}>{appt.date}</td>
                                  <td style={{ padding: "1rem" }}>
                                    <span className={`badge ${appt.status === 'Confirmed' ? 'badge-success' : appt.status === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>
                                      {appt.status}
                                    </span>
                                  </td>
                                  <td style={{ padding: "1rem" }}>
                                    {appt.status === "Pending" && (
                                      <div style={{ display: "flex", gap: "0.5rem" }}>
                                        <button
                                          className="btn btn-sm btn-success"
                                          onClick={() => updateAppointmentStatus(appt.id, "Confirmed", "Approved by Admin", user?.name || "Admin")}
                                        >
                                          ✅
                                        </button>
                                        <button
                                          className="btn btn-sm btn-danger"
                                          onClick={() => {
                                            setSelectedAppointment(appt);
                                            setAppointmentAction("Reject");
                                            setAppointmentNote("");
                                          }}
                                        >
                                          ❌
                                        </button>
                                        <button
                                          className="btn btn-sm btn-outline"
                                          onClick={() => {
                                            setSelectedAppointment(appt);
                                            setAppointmentAction("Reschedule");
                                            setAppointmentNote("");
                                            setRescheduleDate("");
                                          }}
                                        >
                                          🗓️
                                        </button>
                                      </div>
                                    )}
                                    {appt.status !== "Pending" && (
                                      <div style={{ fontSize: "0.85rem" }}>
                                        <div style={{ color: "var(--color-text-secondary)" }}>{appt.notes}</div>
                                        {appt.assignedTo && (
                                          <div style={{ color: "var(--color-primary)", fontWeight: "500", marginTop: "0.25rem" }}>
                                            👤 Assigned to: {appt.assignedTo}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="5" style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-secondary)" }}>
                                  No appointment requests found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Action Modal (Reject/Reschedule) */}
                      {selectedAppointment && (
                        <div className="modal-overlay">
                          <div className="modal-content">
                            <h3>{appointmentAction} Appointment</h3>
                            <p>For: {selectedAppointment.studentName} - {selectedAppointment.type}</p>

                            {appointmentAction === "Reschedule" && (
                              <div className="form-group">
                                <label>New Date & Time</label>
                                <input
                                  type="datetime-local"
                                  className="form-control"
                                  value={rescheduleDate}
                                  onChange={(e) => setRescheduleDate(e.target.value)}
                                />
                              </div>
                            )}

                            <div className="form-group">
                              <label>Reason / Note</label>
                              <textarea
                                className="form-control"
                                value={appointmentNote}
                                onChange={(e) => setAppointmentNote(e.target.value)}
                                placeholder={appointmentAction === "Reschedule" ? "Reason for rescheduling..." : "Enter reason for rejection..."}
                              />
                            </div>
                            <div className="modal-actions">
                              <button className="btn btn-outline" onClick={() => setSelectedAppointment(null)}>Cancel</button>
                              <button
                                className="btn btn-primary"
                                onClick={() => {
                                  if (appointmentAction === "Reschedule" && !rescheduleDate) {
                                    toast.error("Please select a new date");
                                    return;
                                  }
                                  updateAppointmentStatus(
                                    selectedAppointment.id,
                                    appointmentAction === "Reject" ? "Rejected" : "Rescheduled",
                                    appointmentNote,
                                    null,
                                    appointmentAction === "Reschedule" ? rescheduleDate : null
                                  );
                                  setSelectedAppointment(null);
                                  toast.success(`Appointment ${appointmentAction}d`);
                                }}
                              >
                                Confirm {appointmentAction}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div >
    </div >
  );
};

export default AdminDashboard;
