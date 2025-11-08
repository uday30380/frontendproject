import React, { useState } from "react";
import toast from "react-hot-toast";
import jsPDF from "jspdf";



const sendMessage = () => {
  const msg = {
    from: "Admin",
    text: "Good job joining the wellness program!",
    time: new Date().toLocaleTimeString(),
  };
  const newMsgs = [...selected.messages, msg];
  const updated = { ...selected, messages: newMsgs };
  updateStudentData(updated);
  setSelected(updated);
  toast.success("Message sent to student ✅");
};

const addNote = () => {
  const note = `Checked on ${new Date().toLocaleString()} - Monitor stress level.`;
  const updated = { ...selected, notes: [...(selected.notes || []), note] };
  updateStudentData(updated);
  setSelected(updated);
  toast("Note added 📝", { icon: "🗒️" });
};

const downloadReport = () => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Admin Wellness Summary", 10, 20);
  doc.setFontSize(12);
  doc.text(`Student: ${selected.name}`, 10, 35);
  doc.text(`XP: ${selected.wellnessScore}`, 10, 45);
  doc.text("Admin Notes:", 10, 60);
  (selected.notes || []).forEach((n, i) => {
    doc.text(`• ${n}`, 15, 70 + i * 10);
  });
  doc.save(`${selected.name}_AdminReport.pdf`);
  toast.success("Report exported as PDF 📊");
};


<button onClick={downloadReport}>Download Student Report (PDF)</button>

const AdminDashboard = ({ userData }) => {
  // 🧍 All Students (Master View)
  const [students, setStudents] = useState([
    {
      id: 101,
      name: "Vempati Uday Kiran",
      department: "CSE",
      wellnessScore: 72,
      riskLevel: "High",
      bmi: 23.5,
      activity: "Moderate",
      stress: 8,
      sleep: 5.5,
      sessions: 3,
      notes: ["Monitor sleep and recommend breathing exercises."],
      messages: [
        { from: "Admin", text: "Let's schedule a follow-up next Monday.", time: "2 days ago" },
        { from: "Student", text: "Sure, that works for me.", time: "1 day ago" },
      ],
    },
    {
      id: 102,
      name: "Emily Chen",
      department: "ECE",
      wellnessScore: 88,
      riskLevel: "Moderate",
      bmi: 21.4,
      activity: "High",
      stress: 4,
      sleep: 7.2,
      sessions: 2,
      notes: ["Excellent participation in yoga sessions."],
      messages: [
        { from: "Admin", text: "Keep up your mindfulness routine!", time: "3 days ago" },
      ],
    },
    {
      id: 103,
      name: "Marcus Lee",
      department: "IT",
      wellnessScore: 64,
      riskLevel: "Critical",
      bmi: 27.9,
      activity: "Low",
      stress: 9,
      sleep: 4.3,
      sessions: 1,
      notes: ["Needs counseling support. Track stress closely."],
      messages: [
        { from: "Admin", text: "Let's connect for a quick session tomorrow.", time: "Today" },
      ],
    },
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("Overview");
  const [newMessage, setNewMessage] = useState("");
  const [newNote, setNewNote] = useState("");

  const selectedStudent = students[selectedIndex];

  // 🔄 Navigation
  const nextStudent = () => setSelectedIndex((i) => (i + 1) % students.length);
  const prevStudent = () => setSelectedIndex((i) => (i - 1 + students.length) % students.length);

  // 🗒️ Add Note
  const addNote = () => {
    if (!newNote.trim()) return;
    const updated = [...students];
    updated[selectedIndex].notes.push(newNote);
    setStudents(updated);
    setNewNote("");
  };

  // 💬 Add Message
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const updated = [...students];
    updated[selectedIndex].messages.push({ from: "Admin", text: newMessage, time: "Just now" });
    setStudents(updated);
    setNewMessage("");
  };

  // 📥 Export Report (Simulated PDF)
  const exportReport = () => {
    const s = selectedStudent;
    const report = `
    🧭 STUDENT WELLNESS REPORT
    -----------------------------
    Name: ${s.name}
    ID: ${s.id}
    Department: ${s.department}
    Wellness Score: ${s.wellnessScore}%
    Risk Level: ${s.riskLevel}
    BMI: ${s.bmi}
    Stress Level: ${s.stress}/10
    Average Sleep: ${s.sleep} hrs
    Counseling Sessions: ${s.sessions}
    Notes:
    ${s.notes.map((n) => "- " + n).join("\n")}
    Last Updated: ${new Date().toLocaleString()}
    `;
    const blob = new Blob([report], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${s.name.replace(" ", "_")}_Wellness_Report.txt`;
    link.click();
  };

  return (
    <div className="dashboard admin-dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>🧭 Admin Dashboard – Student Health and Wellness System</h1>
            <p>
              Manage, track, and support student well-being through detailed
              analytics, communication, and health insights.
            </p>
          </div>
        </div>

        <div className="dashboard-content master-detail">
          {/* 🧍 Left Panel – Student List */}
          <div className="student-list-panel">
            <h3>👩‍🎓 Registered Students</h3>
            <input
              type="text"
              placeholder="🔍 Search student..."
              className="search-box"
            />
            <div className="student-list">
              {students.map((student, i) => (
                <div
                  key={student.id}
                  className={`student-item ${
                    selectedIndex === i ? "active" : ""
                  }`}
                  onClick={() => setSelectedIndex(i)}
                >
                  <div className="student-name">{student.name}</div>
                  <div className="student-meta">
                    Dept: {student.department} | Score: {student.wellnessScore}%
                  </div>
                  <div
                    className={`status-dot ${
                      student.riskLevel === "High"
                        ? "red"
                        : student.riskLevel === "Moderate"
                        ? "yellow"
                        : "green"
                    }`}
                  ></div>
                </div>
              ))}
            </div>

            <div className="nav-controls">
              <button className="btn btn-sm" onClick={prevStudent}>
                ⬅ Previous
              </button>
              <button className="btn btn-sm" onClick={nextStudent}>
                Next ➡
              </button>
            </div>
          </div>

          {/* 📊 Right Panel – Student Details */}
          <div className="student-detail-panel">
            <div className="detail-header">
              <h2>{selectedStudent.name}</h2>
              <p>
                Dept: {selectedStudent.department} | Wellness Score:{" "}
                {selectedStudent.wellnessScore}%
              </p>
              <button className="btn btn-outline" onClick={exportReport}>
                📤 Export Report
              </button>
            </div>

            {/* Tabs */}
            <div className="tabs">
              {[
                "Overview",
                "Physical Health",
                "Mental Wellness",
                "Lifestyle & Habits",
                "Counseling & Messages",
                "Admin Notes",
              ].map((tab) => (
                <button
                  key={tab}
                  className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === "Overview" && (
                <div>
                  <h3>📋 Student Overview</h3>
                  <p><b>ID:</b> {selectedStudent.id}</p>
                  <p><b>Department:</b> {selectedStudent.department}</p>
                  <p><b>Risk Level:</b> {selectedStudent.riskLevel}</p>
                  <p><b>Overall Wellness Score:</b> {selectedStudent.wellnessScore}%</p>
                </div>
              )}

              {activeTab === "Physical Health" && (
                <div>
                  <h3>💪 Physical Health Metrics</h3>
                  <p>BMI: {selectedStudent.bmi}</p>
                  <p>Activity Level: {selectedStudent.activity}</p>
                  <p>Average Sleep: {selectedStudent.sleep} hrs/day</p>
                </div>
              )}

              {activeTab === "Mental Wellness" && (
                <div>
                  <h3>🧠 Mental Wellness</h3>
                  <p>Stress Level: {selectedStudent.stress}/10</p>
                  <p>Counseling Sessions Attended: {selectedStudent.sessions}</p>
                  <p>Mood Summary: {selectedStudent.stress > 7 ? "High Stress" : "Stable"}</p>
                </div>
              )}

              {activeTab === "Lifestyle & Habits" && (
                <div>
                  <h3>🌿 Lifestyle & Habits</h3>
                  <p>Physical Activity: {selectedStudent.activity}</p>
                  <p>Sleep Hours: {selectedStudent.sleep}</p>
                  <p>Participation: Regular yoga and fitness challenges</p>
                </div>
              )}

              {activeTab === "Counseling & Messages" && (
                <div>
                  <h3>💬 Counseling & Communication</h3>
                  <div className="messages">
                    {selectedStudent.messages.map((m, i) => (
                      <div key={i} className={`message ${m.from === "Admin" ? "admin" : "student"}`}>
                        <strong>{m.from}:</strong> {m.text}
                        <span className="time">{m.time}</span>
                      </div>
                    ))}
                  </div>
                  <div className="chat-input">
                    <input
                      type="text"
                      placeholder="Type message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button className="btn btn-sm" onClick={sendMessage}>
                      Send
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "Admin Notes" && (
                <div>
                  <h3>🗒️ Admin Notes</h3>
                  <ul>
                    {selectedStudent.notes.map((n, i) => (
                      <li key={i}>🟢 {n}</li>
                    ))}
                  </ul>
                  <textarea
                    placeholder="Add a note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  ></textarea>
                  <button className="btn btn-sm" onClick={addNote}>
                    Add Note
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
