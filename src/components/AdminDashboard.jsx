import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import ActivityChart from "./charts/ActivityChart";
import MoodTrendChart from "./charts/MoodTrendChart";
import { firebaseApi } from "../api/firebaseApi"; // Import API

const AdminDashboard = ({ students, updateStudentData, resources, addResource, deleteResource, updateResource, programs, addProgram, deleteProgram, updateProgram, announcements, addAnnouncement, deleteAnnouncement, updateAnnouncement, analytics, appointments = [], updateAppointmentStatus, user, polls, addPoll, deletePoll, systemSettings, toggleMaintenanceMode, sendBroadcastAlert, messages = [], replyToMessage, transactions = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("Dashboard Overview");
  const [newNote, setNewNote] = useState("");
  const [showPollModal, setShowPollModal] = useState(false);

  const [activityData, setActivityData] = useState([]);
  const [moodData, setMoodData] = useState([]);
  const [loginData, setLoginData] = useState([]);

  // Announcement State
  const [isAddingAnnouncement, setIsAddingAnnouncement] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", content: "", type: "Info" });
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  // Resource State
  const [isAddingResource, setIsAddingResource] = useState(false);
  const [newResource, setNewResource] = useState({ title: "", category: "General", thumbnail: "📚", isFeatured: false, link: "#" });

  // Program State
  const [isAddingProgram, setIsAddingProgram] = useState(false);
  const [newProgram, setNewProgram] = useState({ title: "", category: "Wellness", icon: "🧘‍♀️", duration: "4 Weeks", level: "Beginner" });

  // Edit States
  const [editingResource, setEditingResource] = useState(null);
  const [editingProgram, setEditingProgram] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await firebaseApi.fetchAllData();
        // Assuming parent passes updateStudentData or we set it locally. 
        // In this specific structure, students are passed as props. 
        // Ideally, the Parent (App.jsx) fetches data and passes it down.
        // BUT, if we want the dashboard to self-refresh or if props are null initially:
        if (!students || students.length === 0) {
          // For now, let's just log. Since data flow seems to be from App.jsx,
          // we might need to modify App.jsx to fetch real data initially.
          console.log("AdminDashboard mounted. Real data should be passed from App.jsx");
        }
      } catch (e) {
        console.error("Dashboard fetch error", e);
      }
    };
    fetchData();

    const generateAggregatedData = () => {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const newActivityData = days.map(day => ({
        name: day,
        steps: Math.floor(Math.random() * 3000) + 3000,
        meditation: Math.floor(Math.random() * 20) + 15,
      }));
      const newMoodData = days.map(day => ({
        name: day,
        mood: Math.floor(Math.random() * 3) + 6,
      }));
      setActivityData(newActivityData);
      setMoodData(newMoodData);
      setLoginData(days.map(day => ({ name: day, mood: Math.floor(Math.random() * 50) + 10 })));
    };
    if (students) {
      generateAggregatedData();
    }
  }, [students]);

  // Safety Check
  if (!students) {
    return (
      <div className="center-content" style={{ height: '50vh' }}>
        <div className="loading-spinner"></div>
        <p>Loading Dashboard Data...</p>
      </div>
    );
  }

  const filteredStudents = students.filter(s =>
    (s.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (s.department?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const selectedStudent = filteredStudents[selectedIndex] || filteredStudents[0];

  const addNote = () => {
    if (!newNote.trim() || !selectedStudent) return;
    const updated = { ...selectedStudent, notes: [...(selectedStudent.notes || []), newNote] };
    updateStudentData(updated);
    setNewNote("");
    toast.success("Note added 📝");
  };

  // Use real user name if available, otherwise fallback
  const adminName = user?.displayName || user?.name || "Admin";

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

  const renderTabContent = () => {
    switch (activeTab) {
      case "Dashboard Overview":
        return (
          <div>
            <h3 style={{ marginBottom: '1rem' }}>📊 System Overview</h3>
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
              <div className="stat-card" style={{ padding: '1.5rem', background: 'var(--color-info-bg)', borderRadius: 'var(--radius-lg)' }}>
                <h4>Total Students</h4>
                <p className="stat-value" style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-info)' }}>{students.length}</p>
              </div>
              <div className="stat-card" style={{ padding: '1.5rem', background: 'var(--color-danger-bg)', borderRadius: 'var(--radius-lg)' }}>
                <h4>High Risk</h4>
                <p className="stat-value" style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-danger)' }}>
                  {students.filter(s => s.riskLevel === "High" || s.riskLevel === "Critical").length}
                </p>
              </div>
              <div className="stat-card" style={{ padding: '1.5rem', background: 'var(--color-success-bg)', borderRadius: 'var(--radius-lg)' }}>
                <h4>Avg Wellness</h4>
                <p className="stat-value" style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-success)' }}>
                  {Math.round(students.reduce((acc, s) => acc + s.wellnessScore, 0) / students.length)}%
                </p>
              </div>
              <div className="stat-card" style={{ padding: '1.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                <h4>System Status</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <div style={{ width: '12px', height: '12px', background: 'var(--color-success)', borderRadius: '50%', boxShadow: '0 0 8px var(--color-success)' }}></div>
                  <span style={{ fontWeight: '600' }}>Operational</span>
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.25rem' }}>Latency: 24ms</div>
              </div>
            </div>
          </div>
        );
      case "Audit Logs":
        return (
          <div className="card glass-panel" style={{ padding: '1.5rem' }}>
            <h3>🛡️ System Audit Logs</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem' }}>Time</th>
                  <th style={{ padding: '0.5rem' }}>Action</th>
                  <th style={{ padding: '0.5rem' }}>Admin</th>
                  <th style={{ padding: '0.5rem' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { time: "10:42 AM", action: "DELETE_RESOURCE", admin: "Admin", details: "Removed 'Outdated Guide'" },
                  { time: "09:15 AM", action: "USER_LOGIN", admin: "System", details: "User 'John Doe' logged in" },
                  { time: "Yesterday", action: "UPDATE_POLICY", admin: "SuperAdmin", details: "Updated privacy terms" },
                ].map((log, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.75rem', fontSize: '0.9rem', opacity: 0.8 }}>{log.time}</td>
                    <td style={{ padding: '0.75rem' }}><span className="badge badge-outline">{log.action}</span></td>
                    <td style={{ padding: '0.75rem' }}>{log.admin}</td>
                    <td style={{ padding: '0.75rem', opacity: 0.8 }}>{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "Overview":
        return (
          <div className="overview-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="card glass-panel" style={{ padding: '1.5rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>Academic Info</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p style={{ margin: 0 }}><b>ID:</b> {selectedStudent.id}</p>
                <p style={{ margin: 0 }}><b>Email:</b> {selectedStudent.email}</p>
                <p style={{ margin: 0 }}><b>Year:</b> {selectedStudent.year}</p>
              </div>
            </div>
            <div className="card glass-panel" style={{ padding: '1.5rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>Wellness Status</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p style={{ margin: 0 }}><b>Risk Level:</b> {selectedStudent.riskLevel}</p>
                <p style={{ margin: 0 }}><b>Wellness Score:</b> {selectedStudent.wellnessScore}%</p>
              </div>
            </div>

            <div className="card glass-panel" style={{ padding: '1.5rem', gridColumn: '1 / -1' }}>
              <h4 style={{ marginBottom: '1rem' }}>📚 Enrolled Programs</h4>
              {selectedStudent.enrolledPrograms?.length > 0 ? (
                <div className="flex gap-2 flex-wrap">
                  {selectedStudent.enrolledPrograms.map(progId => {
                    const prog = programs?.find(p => p.id === progId);
                    return (
                      <span key={progId} className="badge badge-primary">
                        {prog ? prog.title : `Program ID: ${progId}`}
                      </span>
                    );
                  })}
                </div>
              ) : <p className="text-secondary text-sm">Not enrolled in any programs.</p>}
            </div>
          </div>
        );
      case "Physical Health":
        return (
          <div className="card glass-panel" style={{ padding: '1.5rem' }}>
            <h3>💪 Physical Metrics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div><b>BMI:</b> {selectedStudent.bmi}</div>
              <div><b>Activity:</b> {selectedStudent.activity}</div>
              <div><b>Sleep:</b> {selectedStudent.sleep} hrs/day</div>
            </div>
          </div>
        );
      case "Mental Wellness":
        return (
          <div className="card glass-panel" style={{ padding: '1.5rem' }}>
            <h3>🧠 Mental Wellness</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div><b>Stress Level:</b> {selectedStudent.stress}/10</div>
              <div><b>Sessions:</b> {selectedStudent.sessions}</div>
              <div><b>Mood:</b> {selectedStudent.stress > 7 ? "High Stress" : "Stable"}</div>
            </div>
          </div>
        );
      case "Admin Notes":
        return (
          <div>
            <h3>🗒️ Admin Notes</h3>
            <ul className="notes-list" style={{ marginBottom: '1.5rem', listStyle: 'none' }}>
              {selectedStudent.notes?.map((n, i) => (
                <li key={i} className="note-item" style={{ background: 'var(--color-surface)', padding: '0.75rem', marginBottom: '0.5rem', borderRadius: 'var(--radius-sm)' }}>🟢 {n}</li>
              ))}
            </ul>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <textarea
                className="form-control"
                placeholder="Add a note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows="2"
              ></textarea>
              <button className="btn btn-primary" onClick={addNote}>Add</button>
            </div>
          </div>
        );
      case "Resource Management":
        return (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3>📚 Resources</h3>
              <button className="btn btn-primary btn-sm" onClick={() => setIsAddingResource(true)}>+ Add Resource</button>
            </div>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {resources?.map(r => (
                <div key={r.id} className="card glass-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ fontSize: '1.5rem' }}>{r.thumbnail}</div>
                    <div>
                      <div style={{ fontWeight: '600' }}>{r.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{r.category}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className={`btn btn-sm ${r.isFeatured ? 'btn-gold' : 'btn-outline'}`}
                      onClick={() => {
                        const updated = { ...r, isFeatured: !r.isFeatured };
                        if (typeof updateResource === 'function') updateResource(updated);
                        toast.success(updated.isFeatured ? "Marked as Featured! 🌟" : "Removed from Featured");
                      }}
                      title="Toggle Featured"
                    >
                      {r.isFeatured ? '★' : '☆'}
                    </button>
                    <button className="btn btn-sm btn-outline" onClick={() => setEditingResource(r)}>✏️</button>
                    <button className="btn btn-sm btn-danger" onClick={() => { if (window.confirm('Delete?')) deleteResource(r.id); }}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "Program Management":
        return (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3>🧘‍♀️ Programs</h3>
              <button className="btn btn-primary btn-sm" onClick={() => setIsAddingProgram(true)}>+ Add Program</button>
            </div>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {programs?.map(p => (
                <div key={p.id} className="card glass-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ fontSize: '1.5rem' }}>{p.icon}</div>
                    <div>
                      <div style={{ fontWeight: '600' }}>{p.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{p.category}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-sm btn-outline" onClick={() => setEditingProgram(p)}>✏️</button>
                    <button className="btn btn-sm btn-danger" onClick={() => { if (window.confirm('Delete?')) deleteProgram(p.id); }}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "Appointments":
        return (
          <div>
            <h3>📅 Appointments</h3>
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
              {appointments.map(appt => (
                <div key={appt.id} className="card glass-panel" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{appt.studentName}</span>
                    <span className={`badge ${appt.status === 'Confirmed' ? 'badge-success' : appt.status === 'Pending' ? 'badge-warning' : 'badge-danger'}`}>{appt.status}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>{appt.type} Session • {appt.date}</p>

                  {appt.status === 'Pending' && (
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                      <button className="btn btn-success" onClick={() => updateAppointmentStatus(appt.id, "Confirmed", "Approved", user?.name)}>✓ Approve</button>
                      <button className="btn btn-danger" onClick={() => updateAppointmentStatus(appt.id, "Rejected", "Rejected", user?.name)}>✕ Reject</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case "System Controls":
        return (
          <div className="card glass-panel" style={{ padding: '1.5rem' }}>
            <h3>⚙️ System Controls</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
              <div style={{ padding: '1rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                <h4>🔒 Maintenance Mode</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>Lock student access for updates.</p>
                <button className={`btn ${systemSettings?.maintenanceMode ? 'btn-danger' : 'btn-outline'}`} onClick={toggleMaintenanceMode}>
                  {systemSettings?.maintenanceMode ? 'Disable Maintenance' : 'Enable Maintenance'}
                </button>
              </div>
              <div style={{ padding: '1rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                <h4>📢 Broadcast Alert</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>Send urgent modal to all users.</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input className="form-control" placeholder="Alert Message..." id="broadcastInput" />
                  <button className="btn btn-primary" onClick={() => sendBroadcastAlert(document.getElementById('broadcastInput').value)}>Send</button>
                </div>
              </div>
            </div>

            <h3 style={{ marginTop: '2rem' }}>📊 Active Polls</h3>
            <button className="btn btn-sm btn-primary" onClick={() => setShowPollModal(true)} style={{ marginTop: '0.5rem' }}>+ Create New Poll</button>
            <ul style={{ marginTop: '1rem', listStyle: 'none' }}>
              {polls?.map(p => (
                <li key={p.id} style={{ padding: '0.75rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{p.question}</span>
                  <button className="btn btn-xs btn-danger" onClick={() => deletePoll(p.id)}>End</button>
                </li>
              ))}
            </ul>
          </div>
        );
      case "Messages": {
        const unreadMessages = messages?.filter(m => !m.read || !m.reply).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const repliedMessages = messages?.filter(m => m.reply).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return (
          <div className="card glass-panel p-6">
            <h3 className="mb-4 text-xl font-bold">💬 Student Messages</h3>

            <div className="mb-6">
              <h4 className="border-b border-gray-200 pb-2 mb-4 text-primary">Pending Inquiries ({unreadMessages?.length || 0})</h4>
              {unreadMessages?.length > 0 ? (
                <div className="space-y-4">
                  {unreadMessages.map(msg => (
                    <div key={msg.id} className="p-4 bg-white/50 rounded-lg border border-gray-100 hover:shadow-sm transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-800">{msg.userName || "Student"}</span>
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                            {new Date(msg.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3 bg-gray-50 p-2 rounded">{msg.text}</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Type a reply..."
                          className="flex-1 p-2 text-sm border border-gray-300 rounded focus:border-primary focus:outline-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              replyToMessage(msg.id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                        />
                        <button className="btn btn-sm btn-primary" onClick={(e) => {
                          const input = e.target.previousSibling;
                          if (input.value.trim()) {
                            replyToMessage(msg.id, input.value);
                            input.value = '';
                          }
                        }}>Reply</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">No new messages.</p>
              )}
            </div>

            <div className="opacity-70 mt-8">
              <h4 className="border-b border-gray-200 pb-2 mb-4">Replied History</h4>
              {repliedMessages?.length > 0 ? (
                <div className="space-y-3">
                  {repliedMessages.slice(0, 5).map(msg => (
                    <div key={msg.id} className="text-sm p-3 bg-gray-50 rounded">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{msg.userName}</span>
                        <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="mb-1 text-gray-600">Q: {msg.text}</div>
                      <div className="text-green-700 pl-2 border-l-2 border-green-500">A: {msg.reply}</div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-gray-400">No history yet.</p>}
            </div>
          </div>
        );
      }
      case "Announcements":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">📢 Manage Announcements</h3>
              <button className="btn btn-primary" onClick={() => setIsAddingAnnouncement(true)}>+ New Announcement</button>
            </div>

            <div className="grid gap-4">
              {announcements?.length > 0 ? (
                announcements.map(ann => (
                  <div key={ann.id} className="card glass-panel p-4 flex justify-between items-start group hover:shadow-md transition-all">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`badge ${ann.type === 'Alert' ? 'badge-danger' : 'badge-primary'}`}>{ann.type}</span>
                        <h4 className="font-bold text-lg text-gray-800">{ann.title}</h4>
                      </div>
                      <p className="text-gray-600 mb-2">{ann.content}</p>
                      <span className="text-xs text-gray-400">ID: {ann.id} • Date: {ann.date}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn btn-sm btn-outline" onClick={() => {
                        // Pre-fill and open modal (re-using add modal logic or separate edit state)
                        // For simplicity, let's use a new editing state
                        setEditingAnnouncement(ann);
                      }}>✏️ Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => {
                        if (window.confirm("Are you sure you want to delete this announcement?")) {
                          deleteAnnouncement(ann.id);
                        }
                      }}>🗑️</button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic text-center py-8">No active announcements.</p>
              )}
            </div>
          </div>
        );
      case "Financials": {
        const totalRevenue = transactions?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0;
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card glass-panel p-6">
                <h3 className="text-gray-500 mb-2">Total Revenue</h3>
                <h2 className="text-4xl font-bold text-success">${totalRevenue.toFixed(2)}</h2>
              </div>
              <div className="card glass-panel p-6">
                <h3 className="text-gray-500 mb-2">Total Transactions</h3>
                <h2 className="text-4xl font-bold">{transactions?.length || 0}</h2>
              </div>
            </div>

            <div className="card glass-panel p-6">
              <h3 className="text-xl font-bold mb-4">Transaction History</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10 text-left">
                      <th className="p-3">Date</th>
                      <th className="p-3">User</th>
                      <th className="p-3">Item</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions?.length > 0 ? transactions.map(t => (
                      <tr key={t.id} className="border-b border-white/5">
                        <td className="p-3 text-sm">{new Date(t.createdAt).toLocaleDateString()}</td>
                        <td className="p-3 font-bold">{t.userName}</td>
                        <td className="p-3">{t.programTitle}</td>
                        <td className="p-3 text-success font-mono font-bold">${t.amount}</td>
                        <td className="p-3"><span className="badge badge-info">{t.type}</span></td>
                      </tr>
                    )) : (
                      <tr><td colSpan="5" className="p-8 text-center text-gray-400">No transactions yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="dashboard admin-dashboard fade-in">
      <div className="dashboard-container">

        {/* Premium Header */}
        <div className="dashboard-header-premium glass-panel" style={{ marginBottom: '2rem', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ marginBottom: '0.5rem', fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(135deg, #fff 0%, #e0e0e0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Hello, {adminName}! 👋</h1>
            <p className="welcome-text" style={{ fontSize: '1.2rem', opacity: 0.9 }}>Here's what's happening today.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={() => setIsAddingAnnouncement(true)}>📢 Post Announcement</button>
          </div>
        </div>

        {/* Analytics Overview Section */}
        <section className="dashboard-section" style={{ marginBottom: "2.5rem" }}>

          {/* Pending Appointments Alert */}
          {appointments.some(a => a.status === 'Pending') && (
            <div className="glass-panel" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--color-warning)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'var(--color-warning-bg)' }}>
              <div>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-warning-dark)' }}>
                  📅 {appointments.filter(a => a.status === 'Pending').length} Pending Appointments
                </h3>
                <p style={{ margin: '0.25rem 0 0', color: 'var(--color-text-secondary)' }}>Review requests from students.</p>
              </div>
              <button className="btn btn-outline" style={{ borderColor: 'var(--color-warning)', color: 'var(--color-warning-dark)' }} onClick={() => setActiveTab("Appointments")}>Review Now</button>
            </div>
          )}

          <div className="dashboard-grid-layout" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {/* Stats Cards */}
            <div className="card glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: "1rem" }}>System Usage</h3>
              <div className="stats-grid" style={{ marginBottom: "1.5rem" }}>
                <div className="stat-card" style={{ background: 'var(--color-info-bg)', color: 'var(--color-info-dark)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <h4 style={{ fontSize: '0.9rem' }}>Total Logins</h4>
                  <p className="stat-value" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{analytics?.totalLogins || 0}</p>
                </div>
                <div className="stat-card" style={{ background: 'var(--color-success-bg)', color: 'var(--color-success-dark)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <h4 style={{ fontSize: '0.9rem' }}>Page Views</h4>
                  <p className="stat-value" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{analytics?.pageViews || 0}</p>
                </div>
              </div>
              <div style={{ height: "150px" }}>
                <MoodTrendChart data={loginData} />
              </div>
            </div>

            <div className="card glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: "1rem" }}>Student Engagement</h3>
              <ActivityChart data={activityData} />
            </div>

            <div className="card glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: "1rem" }}>Avg Mood Trend</h3>
              <MoodTrendChart data={moodData} />
            </div>

            <div className="card glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: "1rem" }}>Top Resources</h3>
              <ul className="leaderboard-list">
                {Object.entries(analytics?.resourceViews || {})
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 3)
                  .map(([id, count], index) => {
                    const resource = resources?.find(r => r.id.toString() === id.toString());
                    return (
                      <li key={id} className="leaderboard-item" style={{ padding: '0.75rem', borderBottom: '1px solid var(--color-border)' }}>
                        <span className="leaderboard-rank" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '0.8rem' }}>{index + 1}</span>
                        <span className="leaderboard-name" style={{ flex: 1, marginLeft: '0.75rem', fontWeight: '500' }}>{resource?.title || `ID: ${id}`}</span>
                        <span className="leaderboard-score">{count} views</span>
                      </li>
                    );
                  })}
                {Object.keys(analytics?.resourceViews || {}).length === 0 && <p className="text-muted">No data yet.</p>}
              </ul>
            </div>
          </div>
        </section>

        {/* Master-Detail View */}
        <div className="admin-master-detail" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem', height: 'calc(100vh - 200px)' }}>

          {/* Left Panel: Student List */}
          <div className="student-list-panel glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            <div className="student-list-header" style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
              <h3 style={{ margin: 0 }}>Students ({students.length})</h3>
              <input
                type="text"
                placeholder="🔍 Search..."
                className="form-control"
                style={{ marginTop: '1rem' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="student-list-scroll" style={{ flex: 1, overflowY: 'auto' }}>
              {filteredStudents.map((student, i) => (
                <div
                  key={student.id}
                  className={`student-list-item ${selectedStudent?.id === student.id ? "active" : ""}`}
                  onClick={() => setSelectedIndex(i)}
                  style={{
                    padding: '1rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    cursor: 'pointer',
                    borderLeft: selectedStudent?.id === student.id ? '4px solid var(--color-primary)' : '4px solid transparent',
                    background: selectedStudent?.id === student.id ? 'var(--color-primary-light)' : 'transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  <div className="student-avatar-small" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>
                    {student.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{student.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{student.department}</div>
                  </div>
                  {student.riskLevel === 'High' && <span style={{ fontSize: '0.8rem', color: 'var(--color-danger)' }}>⚠</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Details */}
          <div className="student-detail-panel glass-panel" style={{ height: '100%', overflowY: 'auto', padding: '2rem' }}>
            {!selectedStudent ? (
              <div className="center-content" style={{ height: '100%' }}>
                <p>Select a student to view details</p>
              </div>
            ) : (
              <div>
                <div className="detail-header-premium" style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: '700', boxShadow: 'var(--shadow-lg)' }}>
                      {selectedStudent.name.charAt(0)}
                    </div>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '2rem' }}>{selectedStudent.name}</h2>
                      <p style={{ color: 'var(--color-text-secondary)', margin: '0.25rem 0' }}>
                        {selectedStudent.department} • {selectedStudent.year}
                      </p>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                        <span className="badge badge-primary">Score: {selectedStudent.wellnessScore}%</span>
                        <span className={`badge ${selectedStudent.riskLevel === 'High' ? 'badge-danger' : 'badge-success'}`}>
                          Risk: {selectedStudent.riskLevel}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="action-buttons" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-outline" onClick={exportReport}>📤 Export Report</button>
                    <button className="btn btn-danger btn-outline" onClick={() => toast.error(`User ${selectedStudent.name} suspended 🛑`)}>⛔ Suspend User</button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="admin-tabs no-scrollbar" style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                  {[
                    "Dashboard Overview", "Overview", "Physical Health", "Mental Wellness",
                    "Admin Notes", "Messages", "Announcements", "Financials", "System Controls", "Audit Logs", "Resource Management", "Program Management"
                  ].map(tab => (
                    <button
                      key={tab}
                      className={`btn btn-sm ${activeTab === tab ? "btn-primary" : "btn-ghost"}`}
                      onClick={() => setActiveTab(tab)}
                      style={{ borderRadius: 'var(--radius-full)' }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="fade-in">
                  {renderTabContent()}
                </div>
              </div>
            )}
          </div>
        </div>


      </div>
      {/* Add Announcement Modal */}
      {
        isAddingAnnouncement && (
          <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setIsAddingAnnouncement(false)}>
            <div className="glass-panel" style={{ width: '90%', maxWidth: '500px', padding: '2rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)' }} onClick={e => e.stopPropagation()}>
              <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.5rem' }}>📢 Post Announcement</h3>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Title</label>
                <input className="form-control" value={newAnnouncement.title} onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })} autoFocus />
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Content</label>
                <textarea className="form-control" value={newAnnouncement.content} onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })} rows="4" />
              </div>
              <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button className="btn btn-outline" onClick={() => setIsAddingAnnouncement(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={() => {
                  if (!newAnnouncement.title || !newAnnouncement.content) return toast.error("Please fill all fields");
                  addAnnouncement({ ...newAnnouncement, id: Date.now(), date: new Date().toLocaleDateString() });
                  setIsAddingAnnouncement(false);
                  setNewAnnouncement({ title: "", content: "", type: "Info" });
                  toast.success("Announcement Posted! 📢");
                }}>Post</button>
              </div>
            </div>
          </div>
        )
      }

      {/* Add Resource Modal */}
      {
        isAddingResource && (
          <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setIsAddingResource(false)}>
            <div className="glass-panel" style={{ width: '90%', maxWidth: '500px', padding: '2rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)' }} onClick={e => e.stopPropagation()}>
              <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.5rem' }}>📚 Add Resource</h3>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Title</label>
                <input className="form-control" value={newResource.title} onChange={(e) => setNewResource({ ...newResource, title: e.target.value })} autoFocus />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Category</label>
                <select className="form-control" value={newResource.category} onChange={(e) => setNewResource({ ...newResource, category: e.target.value })}>
                  <option value="General">General</option>
                  <option value="Mental Health">Mental Health</option>
                  <option value="Physical Health">Physical Health</option>
                  <option value="Academic">Academic</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Link (URL)</label>
                <input className="form-control" value={newResource.link} onChange={(e) => setNewResource({ ...newResource, link: e.target.value })} placeholder="https://..." />
              </div>
              <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button className="btn btn-outline" onClick={() => setIsAddingResource(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={() => {
                  if (!newResource.title) return toast.error("Please enter a title");
                  addResource({ ...newResource, id: Date.now() });
                  setIsAddingResource(false);
                  setNewResource({ title: "", category: "General", thumbnail: "📚", isFeatured: false, link: "#" });
                  toast.success("Resource Added! 📚");
                }}>Add Resource</button>
              </div>
            </div>
          </div>
        )
      }

      {/* Add Program Modal */}
      {
        isAddingProgram && (
          <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setIsAddingProgram(false)}>
            <div className="glass-panel" style={{ width: '90%', maxWidth: '500px', padding: '2rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)' }} onClick={e => e.stopPropagation()}>
              <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.5rem' }}>🧘‍♀️ Add Wellness Program</h3>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Title</label>
                <input className="form-control" value={newProgram.title} onChange={(e) => setNewProgram({ ...newProgram, title: e.target.value })} autoFocus />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Category</label>
                <select className="form-control" value={newProgram.category} onChange={(e) => setNewProgram({ ...newProgram, category: e.target.value })}>
                  <option value="Wellness">Wellness</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Meditation">Meditation</option>
                  <option value="Nutrition">Nutrition</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Duration</label>
                <input className="form-control" value={newProgram.duration} onChange={(e) => setNewProgram({ ...newProgram, duration: e.target.value })} placeholder="e.g. 4 Weeks" />
              </div>
              <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button className="btn btn-outline" onClick={() => setIsAddingProgram(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={() => {
                  if (!newProgram.title) return toast.error("Please enter a title");
                  addProgram({ ...newProgram, id: Date.now().toString() });
                  setIsAddingProgram(false);
                  setNewProgram({ title: "", category: "Wellness", icon: "🧘‍♀️", duration: "4 Weeks", level: "Beginner" });
                  toast.success("Program Created! 🧘‍♀️");
                }}>Create Program</button>
              </div>
            </div>
          </div>
        )
      }

      {/* Poll Creator Modal */}
      {
        showPollModal && (
          <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowPollModal(false)}>
            <div className="glass-panel" style={{ width: '90%', maxWidth: '500px', padding: '2rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)' }} onClick={e => e.stopPropagation()}>
              <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>📊 Create New Poll</h3>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Question</label>
                <input className="form-control" placeholder="e.g. What stress relief workshop do you want?" id="pollQuestion" />
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Options (comma separated)</label>
                <input className="form-control" placeholder="Yoga, Meditation, Painting" id="pollOptions" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button className="btn btn-outline" onClick={() => setShowPollModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={() => {
                  const question = document.getElementById('pollQuestion').value;
                  const options = document.getElementById('pollOptions').value.split(',').map(o => o.trim()).filter(o => o);
                  if (question && options.length > 1) {
                    addPoll({ question, options });
                    setShowPollModal(false);
                    toast.success("Poll Launched! 🚀");
                  } else {
                    toast.error("Invalid Poll Data");
                  }
                }}>Launch Poll</button>
              </div>
            </div>
          </div>
        )
      }

      {/* Edit Announcement Modal */}
      {
        editingAnnouncement && (
          <div className="modal-overlay" onClick={() => setEditingAnnouncement(null)}>
            <div className="glass-panel modal-content" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-bold mb-4">✏️ Edit Announcement</h3>
              <div className="form-group mb-4">
                <label className="form-label">Title</label>
                <input
                  className="form-control"
                  value={editingAnnouncement.title}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
                  autoFocus
                />
              </div>
              <div className="form-group mb-4">
                <label className="form-label">Type</label>
                <select
                  className="form-control"
                  value={editingAnnouncement.type}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, type: e.target.value })}
                >
                  <option value="Info">Info ℹ️</option>
                  <option value="Alert">Alert 🚨</option>
                  <option value="Event">Event 📅</option>
                </select>
              </div>
              <div className="form-group mb-6">
                <label className="form-label">Content</label>
                <textarea
                  className="form-control"
                  value={editingAnnouncement.content}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, content: e.target.value })}
                  rows="4"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button className="btn btn-outline" onClick={() => setEditingAnnouncement(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={() => {
                  if (!editingAnnouncement.title || !editingAnnouncement.content) return toast.error("Please fill all fields");
                  updateAnnouncement(editingAnnouncement);
                  setEditingAnnouncement(null);
                }}>Save Changes</button>
              </div>
            </div>
          </div>
        )
      }

      {/* Edit Resource Modal */}
      {
        editingResource && (
          <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setEditingResource(null)}>
            <div className="glass-panel" style={{ width: '90%', maxWidth: '500px', padding: '2rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)' }} onClick={e => e.stopPropagation()}>
              <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.5rem' }}>✏️ Edit Resource</h3>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Title</label>
                <input className="form-control" value={editingResource.title} onChange={(e) => setEditingResource({ ...editingResource, title: e.target.value })} autoFocus />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Category</label>
                <select className="form-control" value={editingResource.category} onChange={(e) => setEditingResource({ ...editingResource, category: e.target.value })}>
                  <option value="General">General</option>
                  <option value="Mental Health">Mental Health</option>
                  <option value="Physical Health">Physical Health</option>
                  <option value="Academic">Academic</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Link (URL)</label>
                <input className="form-control" value={editingResource.link} onChange={(e) => setEditingResource({ ...editingResource, link: e.target.value })} />
              </div>
              <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button className="btn btn-outline" onClick={() => setEditingResource(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={() => {
                  if (!editingResource.title) return toast.error("Please enter a title");
                  updateResource(editingResource);
                  setEditingResource(null);
                  toast.success("Resource Updated! ✅");
                }}>Save Changes</button>
              </div>
            </div>
          </div>
        )
      }

      {/* Edit Program Modal */}
      {
        editingProgram && (
          <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setEditingProgram(null)}>
            <div className="glass-panel" style={{ width: '90%', maxWidth: '500px', padding: '2rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)' }} onClick={e => e.stopPropagation()}>
              <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.5rem' }}>✏️ Edit Program</h3>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Title</label>
                <input className="form-control" value={editingProgram.title} onChange={(e) => setEditingProgram({ ...editingProgram, title: e.target.value })} autoFocus />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Category</label>
                <select className="form-control" value={editingProgram.category} onChange={(e) => setEditingProgram({ ...editingProgram, category: e.target.value })}>
                  <option value="Wellness">Wellness</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Meditation">Meditation</option>
                  <option value="Nutrition">Nutrition</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Duration</label>
                <input className="form-control" value={editingProgram.duration} onChange={(e) => setEditingProgram({ ...editingProgram, duration: e.target.value })} />
              </div>
              <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button className="btn btn-outline" onClick={() => setEditingProgram(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={() => {
                  if (!editingProgram.title) return toast.error("Please enter a title");
                  updateProgram(editingProgram);
                  setEditingProgram(null);
                  toast.success("Program Updated! ✅");
                }}>Save Changes</button>
              </div>
            </div>
          </div>
        )
      }

    </div >
  );
};

export default AdminDashboard;
