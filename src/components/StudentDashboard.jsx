
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import ActivityChart from "./charts/ActivityChart";
import MoodTrendChart from "./charts/MoodTrendChart";
import FocusTimer from "./FocusTimer";

const StudentDashboard = ({
  user,
  studentData,
  announcements,
  trackPageView,
  polls,
  votePoll,
  systemSettings,
  updateOwnData, // NEW PROP needed
  updatePassword // NEW PROP
}) => {
  const navigate = useNavigate();
  // Ensure we have fallbacks
  const studentName = user?.name || studentData?.name || "Student";
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: studentName,
    department: studentData?.department || "General",
    year: studentData?.year || "1st Year",
    newPassword: "",
    confirmPassword: ""
  });

  // Effect to sync form with data when it loads
  useEffect(() => {
    if (studentData) {
      setEditForm({
        name: studentData.name || user?.name || "Student",
        department: studentData.department || "General",
        year: studentData.year || "1st Year",
      });
    }
  }, [studentData, user]);

  const handleUpdateProfile = async () => {
    try {
      if (updateOwnData) {
        await updateOwnData({
          name: editForm.name,
          department: editForm.department,
          year: editForm.year
        });
      }

      if (editForm.newPassword) {
        if (editForm.newPassword.length < 6) {
          toast.error("Password must be at least 6 characters");
          return;
        }
        if (editForm.newPassword !== editForm.confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }
        if (updatePassword) {
          await updatePassword(editForm.newPassword);
        }
      }

      setShowProfileModal(false);
      // Reset password fields
      setEditForm(prev => ({ ...prev, newPassword: "", confirmPassword: "" }));
      // Success toast is handled by called functions, but we can add comprehensive one
      toast.success("Profile updated successfully! ✅");
    } catch (error) {
      console.error("Profile Update Error", error);
    }
  };



  // Handle Broadcast Alert
  useEffect(() => {
    if (systemSettings?.broadcastMessage) {
      toast.custom((t) => (
        <div className="glass-panel" style={{ border: '2px solid var(--color-danger)', padding: '1.5rem', background: '#fff' }}>
          <h3 style={{ color: 'var(--color-danger)', marginTop: 0 }}>🚨 URGENT ALERT</h3>
          <p style={{ fontSize: '1.1rem' }}>{systemSettings.broadcastMessage}</p>
          <button className="btn btn-sm btn-primary" onClick={() => toast.dismiss(t.id)}>Dismiss</button>
        </div>
      ), { duration: Infinity, position: 'top-center' });
    }
  }, [systemSettings?.broadcastMessage]);

  const [progress] = useState({
    mood: 2847,
    moodGrowth: "+12% from last month",
    challenges: [
      { name: "15-Minute Morning Meditation", progress: 75, total: 100 },
      { name: "Drink 8 Glasses of Water", progress: 5, total: 8 },
      { name: "Take 6,000 steps", progress: 4250, total: 6000 },
    ],
  });

  const [events, setEvents] = useState([
    {
      name: "Stress Management Workshop",
      date: "Today, 2:00 PM",
      registered: "28/30 registered",
      type: "Workshop",
      joined: false,
    },
    {
      name: "Group Counseling Session",
      date: "Tomorrow, 10:00 AM",
      registered: "12/15 registered",
      type: "Counseling",
      joined: false,
    },
    {
      name: "Yoga & Mindfulness",
      date: "Friday, 5:00 PM",
      registered: "18/25 registered",
      type: "Fitness",
      joined: false,
    },
  ]);

  const [xp, setXp] = useState(2114);
  const [quote, setQuote] = useState("");

  // Journal State
  const [journalEntry, setJournalEntry] = useState("");
  const [journalEntries, setJournalEntries] = useState([]);

  // Chart Data State
  const [activityData, setActivityData] = useState([]);
  const [moodData, setMoodData] = useState([]);

  useEffect(() => {
    // Simulate fetching data
    const generateData = () => {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const newActivityData = days.map(day => ({
        name: day,
        steps: Math.floor(Math.random() * 5000) + 2000,
        meditation: Math.floor(Math.random() * 30) + 10,
      }));
      const newMoodData = days.map(day => ({
        name: day,
        mood: Math.floor(Math.random() * 5) + 5, // Mood 5-10
      }));
      setActivityData(newActivityData);
      setMoodData(newMoodData);
    };

    generateData();
    if (trackPageView) trackPageView();
  }, [trackPageView]);

  const handleSaveJournal = () => {
    if (!journalEntry.trim()) return;
    const newEntry = {
      id: Date.now(),
      text: journalEntry,
      date: new Date().toLocaleString(),
    };
    setJournalEntries([newEntry, ...journalEntries]);
    setJournalEntry("");
    toast.success("Journal entry saved! 📔");
  };

  // 💡 Motivational Quotes
  useEffect(() => {
    const quotes = [
      "Your mind is your strongest muscle — train it daily. 💪",
      "Hydrate, rest, and rise stronger every day. 🌞",
      "Progress, not perfection — one step at a time. 🧘‍♀️",
      "Small wins make big differences. Keep going! 🌱",
      "Your wellness journey starts with self-care. ❤️",
    ];
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  // ✅ Join / Leave Events
  const toggleJoin = (index) => {
    setEvents((prev) => {
      const updated = [...prev];
      updated[index].joined = !updated[index].joined;
      setXp((xp) => xp + (updated[index].joined ? 20 : -10));
      return updated;
    });
  };

  const downloadReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Student Wellness Report", 10, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${studentName}`, 10, 35);
    doc.text(`XP: ${xp}`, 10, 45);
    doc.text("Completed Challenges:", 10, 60);
    progress.challenges.forEach((ch, i) => {
      doc.text(`• ${ch.name} — ${ch.progress}/${ch.total}`, 15, 70 + i * 10);
    });
    doc.save(`Student_WellnessReport.pdf`);
    toast.success("PDF Report Downloaded 📄");
  };

  // Maintenance Mode Lock
  if (systemSettings?.maintenanceMode) {
    return (
      <div className="dashboard fade-in">
        <div className="center-content" style={{ height: '80vh', textAlign: 'center' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🔒</div>
          <h1>Under Maintenance</h1>
          <p>The student dashboard is currently locked for upgrades.</p>
          <p>Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard fade-in">
      <div className="dashboard-container">

        {/* Premium Header */}
        <div className="dashboard-header-premium glass-panel" style={{ marginBottom: '2rem', padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Hello, {studentName}! 👋</h1>
            <p className="welcome-text" style={{ fontSize: '1.2rem', opacity: 0.9 }}>{quote}</p>
            <div className="progress-badge" style={{ marginTop: '1rem' }}>
              <span className="badge badge-gold">🏆 Gold Level</span>
              <span className="streak">🔥 7 Day Streak</span>
              <span className="points">{xp.toLocaleString()} / 3,000 XP</span>
            </div>
          </div>
          <button className="btn btn-outline btn-text-light" onClick={downloadReport}>
            Download Report 📄
          </button>
          {/* Edit Profile Button */}
          <button className="btn btn-outline btn-text-light ml-2" onClick={() => setShowProfileModal(true)}>
            Edit Profile ✏️
          </button>
        </div>

        {/* Edit Profile Modal */}
        {showProfileModal && (
          <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowProfileModal(false)}>
            <div className="glass-panel" style={{ width: '90%', maxWidth: '500px', padding: '2rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)' }} onClick={e => e.stopPropagation()}>
              <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>✏️ Edit Profile</h3>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Name (Display)</label>
                <input
                  className="form-control"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Department</label>
                <select
                  className="form-control"
                  value={editForm.department}
                  onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                >
                  <option value="General">General</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Year</label>
                <select
                  className="form-control"
                  value={editForm.year}
                  onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border)', margin: '1.5rem 0', paddingTop: '1.5rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>🔐 Change Password</h4>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Leave blank to keep current"
                    value={editForm.newPassword}
                    onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Retype password"
                    value={editForm.confirmPassword}
                    onChange={(e) => setEditForm({ ...editForm, confirmPassword: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button className="btn btn-outline" onClick={() => setShowProfileModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleUpdateProfile}>Save Changes</button>
              </div>
            </div>
          </div>
        )}

        {/* 🗓️ Habit Heatmap & Wellness Tools */}
        {/* 🗓️ Habit Heatmap & Wellness Tools */}
        <section className="dashboard-section grid-2-col">
          {/* Habit Heatmap */}
          <div className="card glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>🔥 Habit Streak Heatmap</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(14, 1fr)', gap: '4px' }}>
              {[...Array(56)].map((_, i) => {
                const intensity = Math.random() > 0.3 ? Math.floor(Math.random() * 4) : 0; // 0-3
                const color = intensity === 0 ? 'rgba(255,255,255,0.1)' :
                  intensity === 1 ? 'var(--color-primary-light)' :
                    intensity === 2 ? 'var(--color-primary)' : 'var(--color-accent)';
                return (
                  <div key={i} title={`Day ${i + 1}: ${intensity === 0 ? 'No activity' : 'Active'}`} style={{
                    aspectRatio: '1', borderRadius: '4px', background: color, cursor: 'pointer', transition: 'transform 0.1s'
                  }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  ></div>
                )
              })}
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              <span>Less</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <div style={{ width: '12px', height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}></div>
                <div style={{ width: '12px', height: '12px', background: 'var(--color-primary-light)', borderRadius: '2px' }}></div>
                <div style={{ width: '12px', height: '12px', background: 'var(--color-primary)', borderRadius: '2px' }}></div>
                <div style={{ width: '12px', height: '12px', background: 'var(--color-accent)', borderRadius: '2px' }}></div>
              </div>
              <span>More</span>
            </div>
          </div>

          {/* Wellness Tools */}
          <div className="card glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>🧘 Wellness Tools</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* Breathing Tool */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ fontSize: '2rem' }}>🌬️</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600' }}>4-7-8 Breathing</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>Calm your mind in 2 minutes</div>
                </div>
                <button className="btn btn-sm btn-outline" onClick={() => toast("Starting Breathing Exercise... (Visualizer coming soon!)", { icon: '🧘' })}>Start</button>
              </div>

              {/* Focus Sound */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ fontSize: '2rem' }}>🎵</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600' }}>Focus Sounds</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>Rain, Forest, or White Noise</div>
                </div>
                <button className="btn btn-sm btn-outline" onClick={() => toast("Playing: Rain Sounds 🌧️", { icon: '🎵' })}>Play</button>
              </div>

              {/* Journal Prompt */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ fontSize: '2rem' }}>✍️</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600' }}>Daily Prompt</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>"What made you smile today?"</div>
                </div>
                <button className="btn btn-sm btn-primary" onClick={() => {
                  setJournalEntry("What made me smile today: ");
                  toast.success("Prompt added to journal!");
                  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }}>Write</button>
              </div>

            </div>
          </div>
        </section>

        {/* Daily Wellness Trackers */}
        <section className="dashboard-section" style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>✨ Daily Check-in</h2>
          <div className="trackers-grid">

            {/* Hydration Tracker */}
            <div className="card glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Hydration</h3>
                <span className="badge badge-info">{studentData?.hydration || 0}/8 Cups</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '1rem' }}>
                {[...Array(8)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      // Toggle water intake logic (mock)
                      const current = studentData?.hydration || 0;
                      const newCount = i < current ? i : i + 1;
                      // In a real app, this would update via API
                      toast.success(`Hydration updated: ${newCount} cups 💧`);
                    }}
                    style={{
                      fontSize: '1.5rem',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      opacity: i < (studentData?.hydration || 3) ? 1 : 0.3,
                      transition: 'transform 0.2s',
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    💧
                  </button>
                ))}
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Stay hydrated for better focus!</p>
            </div>

            {/* Sleep Logger */}
            <div className="card glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Sleep Quality</h3>
                <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Last night</span>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>Hours Slept: <span style={{ fontWeight: 'bold' }}>7.5 hrs</span></label>
                <input type="range" min="0" max="12" step="0.5" defaultValue="7.5" style={{ width: '100%', accentColor: 'var(--color-primary)' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                {['😫', '😐', '🙂', '😴'].map((emoji, i) => (
                  <button key={i} className="btn btn-ghost" style={{ fontSize: '1.5rem', padding: '0.5rem', borderRadius: '50%' }}>{emoji}</button>
                ))}
              </div>
            </div>

            {/* Mood Selector */}
            <div className="card glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>How are you feeling?</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                {[
                  { emoji: '🤩', label: 'Great' },
                  { emoji: '🙂', label: 'Good' },
                  { emoji: '😐', label: 'Okay' },
                  { emoji: '😔', label: 'Low' },
                  { emoji: '😤', label: 'Stressed' }
                ].map((m, i) => (
                  <button key={i} className="btn-icon" style={{ flexDirection: 'column', gap: '0.25rem', height: 'auto', padding: '0.5rem' }} onClick={() => toast.success(`Mood logged: ${m.label}`)}>
                    <span style={{ fontSize: '1.8rem' }}>{m.emoji}</span>
                    <span style={{ fontSize: '0.7rem' }}>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* Stats Row */}
        <div className="dashboard-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="stat-card glass-panel" style={{ padding: '1.5rem' }}>
            <div className="stat-label">Engagement</div>
            <div className="stat-value">84%</div>
            <div className="stat-change positive">✓ Above Target</div>
          </div>
          <div className="stat-card glass-panel" style={{ padding: '1.5rem' }}>
            <div className="stat-label">Active Programs</div>
            <div className="stat-value">{studentData?.enrolledPrograms?.length || 0}</div>
            <div className="stat-change">🗓 Keep it up!</div>
          </div>
          <div className="stat-card glass-panel" style={{ padding: '1.5rem' }}>
            <div className="stat-label">Upcoming Events</div>
            <div className="stat-value">{events.filter(e => e.joined).length}</div>
            <div className="stat-change">Check schedule</div>
          </div>
          <div className="stat-card glass-panel" style={{ padding: '1.5rem' }}>
            <div className="stat-label">Wellness Score</div>
            <div className="stat-value">{studentData?.wellnessScore || 100}</div>
            <div className="stat-change positive">+5 this week</div>
          </div>
        </div>

        {/* Quick Actions */}
        <section className="dashboard-section" style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>🚀 Quick Actions</h2>
          <div className="wellness-grid-dynamic">
            <button className="card action-card glass-panel" onClick={() => navigate('/my-programs')}>
              <div className="action-icon" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>🎯</div>
              <h3>My Programs</h3>
            </button>
            <button className="card action-card glass-panel" onClick={() => navigate('/saved-items')}>
              <div className="action-icon" style={{ background: 'var(--color-warning-bg)', color: 'var(--color-warning)' }}>📚</div>
              <h3>Saved Items</h3>
            </button>
            <button className="card action-card glass-panel" onClick={() => navigate('/book-appointment')}>
              <div className="action-icon" style={{ background: 'var(--color-info-bg)', color: 'var(--color-info)' }}>📅</div>
              <h3>Book Session</h3>
            </button>
            <button className="card action-card glass-panel" onClick={() => navigate('/my-appointments')}>
              <div className="action-icon" style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)' }}>📋</div>
              <h3>Appointments</h3>
            </button>
          </div>
        </section>

        <div className="dashboard-grid-layout">
          {/* Main Content */}
          <div className="main-content">

            {/* Announcements */}
            {announcements && announcements.length > 0 && (
              <section className="dashboard-section fade-in">
                <h2 style={{ marginBottom: '1rem' }}>📢 Recent Updates</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="card glass-panel" style={{ borderLeft: `4px solid var(--color-primary)`, padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <h4 style={{ margin: 0 }}>{announcement.title}</h4>
                        <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>{announcement.date}</span>
                      </div>
                      <p>{announcement.content}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 📊 Active Polls Widget */}
            {polls && polls.length > 0 && (
              <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>🗳️ Voice Your Opinion</h3>
                {polls.map(poll => (
                  <div key={poll.id} style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{poll.question}</div>
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                      {poll.options.map((opt, idx) => (
                        <button
                          key={idx}
                          className="btn btn-sm btn-outline"
                          style={{ justifyContent: 'space-between' }}
                          onClick={() => votePoll(poll.id, idx)}
                        >
                          {opt}
                          <span className="badge badge-primary">{poll.votes[idx] || 0}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 🎯 Personal Goals Widget (Local State) */}
            <div className="card glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>🎯 My Goals</h3>
                <button className="btn btn-sm btn-ghost" onClick={() => {
                  const goal = prompt("Enter a new goal:");
                  if (goal) document.getElementById('add-goal-btn')?.click(); // Trigger mock add
                  if (goal) toast.success("Goal added! 🎯");
                  // In a real app we'd update state here directly, but we'll use a visual-only list for now 
                  // or better yet, let's use a small self-contained state in Phase 3 or just mock it now:
                }} id="add-goal-btn">+ Add</button>
              </div>
              <div className="goals-list">
                {['Drink 2L Water', 'Meditate 10 mins', 'Walk 5000 steps'].map((g, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem', padding: '0.5rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
                    <input type="checkbox" onChange={(e) => e.target.checked ? toast.success("Goal Completed! 🎉") : null} />
                    <span style={{ flex: 1 }}>{g}</span>
                  </div>
                ))}
              </div>
            </div>





            {/* 🏆 Community Challenges */}
            <div className="card glass-panel" style={{ padding: '1.5rem', gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>🏆 Community Challenges</h3>
                <button className="btn btn-sm btn-ghost">View All</button>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                {[
                  { title: "Walking Warrior", participants: 124, goal: "10k Steps/Day", reward: "🥇 Badge" },
                  { title: "Zen Master", participants: 85, goal: "7 Days Meditation", reward: "🧘 Badge" },
                  { title: "Hydration Hero", participants: 210, goal: "8 Cups/Day", reward: "💧 Badge" }
                ].map((c, i) => (
                  <div key={i} style={{ minWidth: '250px', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{c.title}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>{c.participants} joined • {c.goal}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}>Win: {c.reward}</span>
                      <button className="btn btn-sm btn-primary" onClick={() => toast.success(`Joined ${c.title}!`)}>Join</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ❤️ Recommended For You */}
            <div className="card glass-panel" style={{ padding: '1.5rem', gridColumn: 'span 2', marginTop: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>💡 Recommended for You</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {[
                  { title: "Understanding Stress", type: "Article", duration: "5 min read" },
                  { title: "Beginner Yoga Flow", type: "Video", duration: "15 min" }
                ].map((r, i) => (
                  <div key={i} className="feature-card-animated" style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', cursor: 'pointer' }}>
                    <div style={{ fontSize: '1.5rem' }}>{r.type === 'Video' ? '▶️' : '📄'}</div>
                    <div>
                      <div style={{ fontWeight: '600' }}>{r.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{r.type} • {r.duration}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts Row */}
            <div className="charts-row">
              <div className="card glass-panel p-3">
                <h3 className="mb-2">Weekly Activity</h3>
                <ActivityChart data={activityData} />
              </div>
              <div className="card glass-panel p-3">
                <h3 className="mb-2">Mood Trend</h3>
                <MoodTrendChart data={moodData} />
              </div>
            </div>

            {/* Journal */}
            <section className="dashboard-section">
              <h2 style={{ marginBottom: '1rem' }}>📔 Wellness Journal</h2>
              <div className="card glass-panel" style={{ padding: '2rem' }}>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="How are you feeling today? Write it down..."
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  style={{ marginBottom: '1rem', background: 'rgba(255,255,255,0.5)' }}
                ></textarea>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button className="btn btn-primary" onClick={handleSaveJournal}>Save Entry</button>
                </div>
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <div className="sidebar-content">
            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem' }}>
              <FocusTimer />
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>🏆 Achievements</h3>
              {(studentData?.achievements || [
                { title: "Level 3", subtitle: "Keep it up!", xp: "1,550 XP" },
                { title: "Level 2", subtitle: "Great progress!", xp: "950 XP" },
                { title: "Level 1", subtitle: "Started journey", xp: "475 XP" },
              ]).map((achievement, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '1.5rem' }}>{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</div>
                  <div>
                    <div style={{ fontWeight: '600' }}>{achievement.title}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{achievement.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ marginBottom: '1rem' }}>📅 Events</h3>
              {events.map((event, i) => (
                <div key={i} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ fontWeight: '600' }}>{event.name}</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.5rem' }}>{event.date}</div>
                  <button
                    className={`btn btn-sm ${event.joined ? 'btn-outline' : 'btn-primary'} btn-full-width`}
                    onClick={() => toggleJoin(i)}
                  >
                    {event.joined ? "Leave" : "Join"}
                  </button>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
      {/* 🚨 Emergency Contact Card */}
      <div className="card glass-panel" style={{ padding: '1.5rem', marginTop: '2rem', border: '1px solid var(--color-danger)', background: 'rgba(255, 0, 0, 0.05)' }}>
        <h3 style={{ color: 'var(--color-danger)', marginBottom: '0.5rem' }}>🆘 Emergency Contact</h3>
        <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>In case of crisis, reach out immediately.</p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-danger" onClick={() => window.location.href = "tel:911"}>📞 Call 911</button>
          <button className="btn btn-outline" style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }} onClick={() => toast.success("Location shared with campus security")}>📍 Share Location</button>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <small>My Contact:</small>
            <input className="form-control" defaultValue="+1 (555) 000-0000" style={{ width: '150px', padding: '0.25rem' }} />
            <button className="btn btn-sm btn-ghost" onClick={() => toast.success("Contact Saved")}>💾</button>
          </div>
        </div>
      </div>



      <button
        className="btn btn-danger"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          fontSize: '1.5rem',
          boxShadow: 'var(--shadow-xl)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={() => toast((t) => (
          <div>
            <h3>🚨 Crisis Handling</h3>
            <p>Connecting to counselor...</p>
            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-sm btn-primary" onClick={() => toast.dismiss(t.id)}>Call Now</button>
              <button className="btn btn-sm btn-outline" onClick={() => toast.dismiss(t.id)}>Cancel</button>
            </div>
          </div>
        ), { duration: 5000, icon: '🆘' })}
        title="SOS / Get Help"
      >
        🆘
      </button>
    </div>
  );
};

export default StudentDashboard;
