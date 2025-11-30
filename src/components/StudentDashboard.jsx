import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import ActivityChart from "./charts/ActivityChart";
import MoodTrendChart from "./charts/MoodTrendChart";
import DailyTips from "./DailyTips";
import DailyQuote from "./DailyQuote";
import WaterTracker from "./WaterTracker";
import MoodTracker from "./MoodTracker";

const StudentDashboard = ({ user, studentData, enrollInProgram, leaveProgram, announcements, trackPageView, trackResourceView, savedResources = [], toggleSaveResource, resources = [], appointments = [], addAppointment }) => {
  const navigate = useNavigate();

  // Use name from logged-in user or student data, fallback to "Student"
  const studentName = user?.name || studentData?.name || "Student";

  const [progress, setProgress] = useState({
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
  const [selectedMood, setSelectedMood] = useState(null);

  // Journal State
  const [journalEntry, setJournalEntry] = useState("");
  const [journalEntries, setJournalEntries] = useState([]);

  // Booking State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingType, setBookingType] = useState("Counseling");

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

    // Track page view
    if (trackPageView) trackPageView();
  }, []);

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

  const handleBookSession = () => {
    if (!bookingDate) {
      toast.error("Please select a date and time.");
      return;
    }
    const newAppointment = {
      studentId: user.studentId,
      studentName: studentName,
      date: new Date(bookingDate).toLocaleString(),
      type: bookingType,
    };
    addAppointment(newAppointment);
    setShowBookingModal(false);
    toast.success(`Appointment request sent for ${bookingType}! 📅`);
    setBookingDate("");
  };

  const handleMoodCheckin = (mood) => {
    setSelectedMood(mood);
    toast.success(`Mood logged: ${mood}. Here's a tip for you! 🌟`);
    // In a real app, this would save to the backend
    if (mood === "Stressed" || mood === "Anxious") {
      toast("Try the 5-minute breathing exercise.", { icon: "🧘‍♀️" });
    } else if (mood === "Tired") {
      toast("Time for a power nap or some hydration!", { icon: "💧" });
    }
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

  // ✅ Update Challenge Progress
  const updateChallenge = (index) => {
    setProgress((prev) => {
      const updated = [...prev.challenges];
      if (updated[index].progress < updated[index].total) {
        updated[index].progress += 1;
        setXp((xp) => xp + 5);
      }
      return { ...prev, challenges: updated };
    });
  };

  // ✅ Join / Leave Events
  const toggleJoin = (index) => {
    setEvents((prev) => {
      const updated = [...prev];
      updated[index].joined = !updated[index].joined;
      setXp((xp) => xp + (updated[index].joined ? 20 : -10));
      return updated;
    });
  };

  // ✅ Navigate to Wellness Program Details
  const handleExplore = (programId) => {
    if (trackResourceView) trackResourceView(programId);
    navigate(`/program/${programId}`);
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

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, {studentName}! 👋</h1>
            <p className="welcome-text">
              {quote}
            </p>
            <div className="progress-badge">
              <span className="badge badge-gold">Gold</span>
              <span className="streak">🔥 7 day streak</span>
              <span className="points">{xp.toLocaleString()} / 3,000 XP</span>
            </div>
          </div>
          <button className="btn btn-outline" onClick={downloadReport} aria-label="Download Wellness Report">Download Report 📄</button>
        </div>

        {/* Stats Section */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-label">Total Students</div>
            <div className="stat-value">{progress.mood}</div>
            <div className="stat-change positive">{progress.moodGrowth}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">At-Risk Students</div>
            <div className="stat-value">23</div>
            <div className="stat-change warning">⚠ 5 critical alerts</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Engagement Score</div>
            <div className="stat-value">84%</div>
            <div className="stat-change positive">✓ Above target (80%)</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active Programs</div>
            <div className="stat-value">{studentData?.enrolledPrograms?.length || 0}</div>
            <div className="stat-change">🗓 3 starting this week</div>
          </div>
        </div>

        {/* Active Programs Section */}
        {studentData?.enrolledPrograms?.length > 0 && (
          <div className="dashboard-section" style={{ marginBottom: '2rem' }}>
            <div className="section-header">
              <h2>My Active Programs</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/wellness-programs')}>Browse All</button>
            </div>
            <div className="wellness-grid">
              {studentData.enrolledPrograms.map((programId) => {
                // Mock lookup for program details (in a real app, this would come from a data source)
                const programTitles = {
                  "yoga-meditation": "Yoga & Meditation",
                  "fitness-sessions": "Fitness Sessions",
                  "hydration-drive": "Hydration Drive",
                  "sleep-mastery": "Sleep Mastery",
                  "nutrition-basics": "Nutrition Basics",
                  "stress-management": "Stress Management"
                };
                return (
                  <div key={programId} className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ marginBottom: '0.25rem' }}>{programTitles[programId] || programId}</h4>
                      <span className="badge badge-success">Active</span>
                    </div>
                    <button className="btn btn-sm btn-outline" onClick={() => navigate(`/program/${programId}`)} aria-label={`View details for ${programTitles[programId] || programId}`}>View</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Dashboard Widgets */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <DailyQuote />
          <WaterTracker />
          <MoodTracker />
        </div>

        {/* Daily Tips Section */}
        <div style={{ marginBottom: '2rem' }}>
          <DailyTips />
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          <div className="main-content">

            {/* Announcements Section */}
            {announcements && announcements.length > 0 && (
              <section className="dashboard-section fade-in" style={{ animationDelay: "0.05s" }}>
                <div className="section-header">
                  <h2>📢 Recent Announcements</h2>
                </div>
                <div className="announcements-grid" style={{ display: "grid", gap: "1rem" }}>
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="card" style={{ borderLeft: `4px solid ${announcement.type === 'Alert' ? 'var(--color-danger)' : announcement.type === 'Success' ? 'var(--color-success)' : 'var(--color-primary)'}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                        <h4 style={{ margin: 0 }}>{announcement.title}</h4>
                        <span style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>{announcement.date}</span>
                      </div>
                      <p style={{ margin: 0 }}>{announcement.content}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Weekly Activity Chart */}
            <section className="dashboard-section fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="section-header">
                <h2>Weekly Activity</h2>
                <button className="btn btn-ghost btn-sm" aria-label="View detailed activity report">View Details</button>
              </div>
              <div className="card">
                <ActivityChart data={activityData} />
              </div>
            </section>

            {/* Mood Trend Chart */}
            <section className="dashboard-section fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="section-header">
                <h2>Mood Trend</h2>
                <p>Your emotional well-being over the last 7 days</p>
              </div>
              <div className="card">
                <MoodTrendChart data={moodData} />
              </div>
            </section>

            {/* Mood Check-in */}
            <div className="mood-section">
              <h3>How are you feeling today?</h3>
              <div className="mood-grid">
                {["Happy 😄", "Calm 😌", "Focused 🧠", "Tired 😴", "Stressed 😫", "Anxious 😰"].map((mood) => (
                  <button
                    key={mood}
                    onClick={() => handleMoodCheckin(mood.split(" ")[0])}
                    className={`btn btn-sm mood-btn ${selectedMood === mood.split(" ")[0] ? "btn-primary" : "btn-outline"}`}
                    aria-label={`Select mood: ${mood}`}
                    aria-pressed={selectedMood === mood.split(" ")[0]}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            {/* Journal Section */}
            <div className="dashboard-section" style={{ marginTop: "2rem" }}>
              <div className="section-header">
                <h2>📔 My Wellness Journal</h2>
              </div>
              <div className="card">
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Write down your thoughts, feelings, or gratitude..."
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  aria-label="Journal entry input"
                  style={{ marginBottom: "1rem" }}
                ></textarea>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button className="btn btn-primary" onClick={handleSaveJournal} aria-label="Save journal entry">
                    Save Entry
                  </button>
                </div>
                {journalEntries.length > 0 && (
                  <div className="journal-history" style={{ marginTop: "1.5rem" }}>
                    <h4>Recent Entries</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {journalEntries.slice(0, 3).map((entry) => (
                        <div key={entry.id} style={{ padding: "0.75rem", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-sm)" }}>
                          <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginBottom: "0.25rem" }}>{entry.date}</p>
                          <p style={{ margin: 0 }}>{entry.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Challenges */}
            <div className="challenge-card">
              <h3>
                Today's Challenges <span className="badge badge-sm">10 Available</span>
              </h3>
              {progress.challenges.map((challenge, index) => (
                <div key={index} className="challenge-item">
                  <div className="challenge-icon" aria-hidden="true">✓</div>
                  <div className="challenge-details">
                    <div className="challenge-name">{challenge.name}</div>
                    <div className="challenge-meta">
                      {challenge.progress}/{challenge.total} completed
                    </div>
                  </div>
                  <div className="challenge-progress" role="progressbar" aria-valuenow={challenge.progress} aria-valuemin="0" aria-valuemax={challenge.total} aria-label={`${challenge.name} progress`}>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${(challenge.progress / challenge.total) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => updateChallenge(index)}
                    aria-label={`Add progress to ${challenge.name}`}
                  >
                    + Progress
                  </button>
                </div>
              ))}
              <button
                className="btn btn-outline btn-sm"
                onClick={() => handleExplore("daily-challenges")}
                aria-label="Explore all daily challenges"
              >
                Explore →
              </button>
            </div>

            {/* Wellness Hub */}
            <div className="wellness-hub-section">
              <h3>Wellness Hub</h3>
              <div className="wellness-grid">
                <div className="wellness-card">
                  <div
                    className="wellness-icon"
                    style={{ backgroundColor: "var(--color-bg-3)", color: "#10b981" }}
                    aria-hidden="true"
                  >
                    ❤️
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4>Mental Health Support</h4>
                    <p>24/7 access to trained counselors</p>
                    <div className="wellness-sessions">
                      Sessions: <strong>3 remaining</strong>
                    </div>
                    <div className="wellness-actions">
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => handleExplore("mental-health")}
                        aria-label="Explore Mental Health Support"
                      >
                        Explore
                      </button>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => setShowBookingModal(true)}
                        aria-label="Book a counseling session"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </div>

                <div className="wellness-card">
                  <div
                    className="wellness-icon"
                    style={{ backgroundColor: "var(--color-bg-1)", color: "#3b82f6" }}
                    aria-hidden="true"
                  >
                    💪
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4>Fitness Programs</h4>
                    <p>Personalized workouts with HIIT and yoga</p>
                    <div className="wellness-sessions">
                      Next: <strong>Tomorrow</strong>
                    </div>
                    <button
                      className="btn btn-sm btn-outline btn-full-width"
                      onClick={() => handleExplore("fitness-programs")}
                      aria-label="Explore Fitness Programs"
                    >
                      Explore →
                    </button>
                  </div>
                </div>

                <div className="wellness-card">
                  <div
                    className="wellness-icon"
                    style={{ backgroundColor: "var(--color-bg-2)", color: "#f59e0b" }}
                    aria-hidden="true"
                  >
                    🥗
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4>Nutrition Guidance</h4>
                    <p>Diet planning and healthy eating habits</p>
                    <div className="wellness-sessions">
                      Time: <strong>3-5 weeks avg</strong>
                    </div>
                    <button
                      className="btn btn-sm btn-outline btn-full-width"
                      onClick={() => handleExplore("nutrition-guidance")}
                      aria-label="Explore Nutrition Guidance"
                    >
                      Explore →
                    </button>
                  </div>
                </div>

                <div className="wellness-card">
                  <div
                    className="wellness-icon"
                    style={{ backgroundColor: "var(--color-bg-5)", color: "#8b5cf6" }}
                    aria-hidden="true"
                  >
                    💬
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4>Community Support</h4>
                    <p>Connect with peers and wellness coaches</p>
                    <div className="wellness-sessions">
                      Members: <strong>137 active</strong>
                    </div>
                    <button
                      className="btn btn-sm btn-outline btn-full-width"
                      onClick={() => handleExplore("community-support")}
                      aria-label="Explore Community Support"
                    >
                      Explore →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Programs */}
          <div className="dashboard-section" style={{ marginTop: '2rem' }}>
            <div className="section-header">
              <h2>Recommended for You</h2>
            </div>
            <div className="wellness-grid">
              <div className="card" style={{ padding: '1rem' }}>
                <h4>🧘‍♀️ Morning Yoga Flow</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Start your day with energy and balance.</p>
                <button className="btn btn-sm btn-outline" style={{ marginTop: '1rem' }} onClick={() => handleExplore("yoga")} aria-label="View Morning Yoga Flow program">View Program</button>
              </div>
              <div className="card" style={{ padding: '1rem' }}>
                <h4>🥗 Healthy Eating 101</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Simple tips for a nutritious diet.</p>
                <button className="btn btn-sm btn-outline" style={{ marginTop: '1rem' }} onClick={() => handleExplore("nutrition")} aria-label="View Healthy Eating 101 program">View Program</button>
              </div>
            </div>
          </div>

          {/* Saved Resources */}
          {savedResources.length > 0 && (
            <div className="dashboard-section" style={{ marginTop: '2rem' }}>
              <div className="section-header">
                <h2>📚 My Saved Resources</h2>
              </div>
              <div className="wellness-grid">
                {resources
                  .filter((r) => savedResources.includes(r.id))
                  .map((resource) => (
                    <div key={resource.id} className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ fontSize: '2rem' }}>{resource.thumbnail}</div>
                        <div>
                          <h4 style={{ marginBottom: '0.25rem' }}>{resource.title}</h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{resource.type} • {resource.duration}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => {
                            if (trackResourceView) trackResourceView(resource.id);
                            // In a real app, we might open the modal or navigate
                            toast("Opening resource...", { icon: "📖" });
                          }}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-sm btn-ghost"
                          onClick={() => toggleSaveResource(user.studentId, resource.id)}
                          title="Remove from saved"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Recently Viewed */}
          <div className="dashboard-section" style={{ marginTop: '2rem' }}>
            <div className="section-header">
              <h2>Recently Viewed</h2>
            </div>
            <div className="card" style={{ padding: '0' }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                <a href="#" style={{ fontWeight: '500' }}>Understanding Anxiety</a>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Article • 5 min read</span>
              </div>
              <div style={{ padding: '1rem' }}>
                <a href="#" style={{ fontWeight: '500' }}>10-Minute HIIT Workout</a>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Video • Fitness</span>
              </div>
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div className="sidebar-content">
          <div className="achievement-card">
            <h3>🏆 Achievement</h3>
            <div className="achievement-list">
              {[
                { title: "Level 3", subtitle: "Keep up the great work!", xp: "1,550 XP" },
                { title: "Level 2", subtitle: "You're making progress!", xp: "950 XP" },
                { title: "Level 1", subtitle: "Just getting started!", xp: "475 XP" },
              ].map((achievement, index) => (
                <div key={index} className="achievement-item">
                  <div className="achievement-icon" aria-hidden="true">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                  </div>
                  <div>
                    <div className="achievement-title">{achievement.title}</div>
                    <div className="achievement-subtitle">{achievement.subtitle}</div>
                  </div>
                  <div className="achievement-xp">{achievement.xp}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="leaderboard-card">
            <h3>🏅 LeaderBoard</h3>
            <div className="leaderboard-list">
              {[
                { name: "Emily Chen", score: 3240, avatar: "👩" },
                { name: "Marcus Lee", score: 3180, avatar: "👨" },
                { name: "Sarah Wilson", score: 3120, avatar: "👩" },
                { name: "You", score: xp, avatar: "👤", isUser: true },
                { name: "Jake Smith", score: 2790, avatar: "👨" },
              ].map((user, index) => (
                <div
                  key={index}
                  className={`leaderboard-item ${user.isUser ? "is-user" : ""}`}
                >
                  <div className="leaderboard-rank">{index + 1}</div>
                  <div className="leaderboard-avatar" aria-hidden="true">{user.avatar}</div>
                  <div className="leaderboard-name">{user.name}</div>
                  <div className="leaderboard-score">{user.score}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Events */}
          <div className="events-card">
            <h3>📅 Upcoming Events</h3>
            <div className="event-list">
              {events.map((event, index) => (
                <div key={index} className="event-item">
                  <div className="event-type-badge">{event.type}</div>
                  <div className="event-name">{event.name}</div>
                  <div className="event-date">{event.date}</div>
                  <div className="event-registered">{event.registered}</div>
                  <div className="event-progress" role="progressbar" aria-label="Registration progress" aria-valuenow={parseInt(event.registered.split("/")[0])} aria-valuemax={parseInt(event.registered.split("/")[1])}>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${(parseInt(event.registered.split("/")[0]) /
                            parseInt(event.registered.split("/")[1])) *
                            100
                            }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <button
                    className={`btn btn-sm ${event.joined ? "btn-outline" : "btn-primary"
                      }`}
                    onClick={() => toggleJoin(index)}
                    aria-label={event.joined ? `Leave ${event.name}` : `Join ${event.name}`}
                  >
                    {event.joined ? "Leave Event" : "Join Event"}
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* Appointments Section */}
          <div className="events-card" style={{ marginTop: "2rem" }}>
            <h3>📅 My Appointments</h3>
            {appointments.length > 0 ? (
              <div className="event-list">
                {appointments.map((appt) => (
                  <div key={appt.id} className="event-item">
                    <div className={`event-type-badge ${appt.status === 'Confirmed' ? 'badge-success' : appt.status === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>
                      {appt.status}
                    </div>
                    <div className="event-name">{appt.type} Session</div>
                    <div className="event-date">{appt.date}</div>
                    {appt.notes && <div style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginTop: "0.5rem" }}>Note: {appt.notes}</div>}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--color-text-secondary)", fontStyle: "italic" }}>No appointments scheduled.</p>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="booking-modal-title">
          <div className="modal-content">
            <h3 id="booking-modal-title">Book {bookingType} Session</h3>
            <div className="form-group">
              <label htmlFor="booking-date">Select Date & Time</label>
              <input
                type="datetime-local"
                id="booking-date"
                className="form-control"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                aria-required="true"
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowBookingModal(false)} aria-label="Cancel booking">Cancel</button>
              <button className="btn btn-primary" onClick={handleBookSession} aria-label="Confirm booking">Confirm Booking</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
