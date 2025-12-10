import React, { useState, useEffect, Suspense, lazy } from "react";
import { firebaseApi } from "./api/firebaseApi";
import toast, { Toaster } from "react-hot-toast";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ChatBot from "./components/ChatBot";
import "./App.css";

// ⚡ Code Splitting: Lazy Load Components
const HomePage = lazy(() => import("./components/HomePage"));
const SignIn = lazy(() => import("./components/SignIn"));
const SignUp = lazy(() => import("./components/SignUp"));
const AdminDashboard = lazy(() => import("./components/AdminDashboard"));
const StudentDashboard = lazy(() => import("./components/StudentDashboard"));
const WellnessPrograms = lazy(() => import("./components/WellnessPrograms"));
const HealthResources = lazy(() => import("./components/HealthResources"));
const SupportServices = lazy(() => import("./components/SupportServices"));
const About = lazy(() => import("./components/About"));
const Contact = lazy(() => import("./components/Contact"));
const ProgramDetails = lazy(() => import("./components/ProgramDetails"));
const Profile = lazy(() => import("./components/Profile"));
const SavedItems = lazy(() => import("./components/SavedItems"));
const MyPrograms = lazy(() => import("./components/MyPrograms"));
const AppointmentBooking = lazy(() => import("./components/AppointmentBooking"));
const MyAppointments = lazy(() => import("./components/MyAppointments"));

// Loading Spinner Component
const PageLoader = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);


// ✅ Layout Wrapper
const Layout = ({ user, onLogout, theme, toggleTheme, notifications, markAsRead, markAllAsRead, onSendMessage, messages, children }) => (
  <>
    <Navbar
      user={user}
      onLogout={onLogout}
      theme={theme}
      toggleTheme={toggleTheme}
      notifications={notifications}
      markAsRead={markAsRead}
      markAllAsRead={markAllAsRead}
    />
    <Toaster position="top-right" reverseOrder={false} />
    <ChatBot onSendMessage={onSendMessage} messages={messages} user={user} />
    {/* Global Broadcast Alert */}
    <div id="broadcast-root"></div>
    {children}
  </>
);


function App() {
  // ✅ Global Loading & Error State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Login State
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("loggedUser");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing stored user:", error);
      return null;
    }
  });

  // ✅ Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  // ✅ Data States (Initialized as empty, populated by API)
  const [students, setStudents] = useState([]);
  const [resources, setResources] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalLogins: 0,
    pageViews: 0,
    resourceViews: {},
  });
  // ✅ Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Welcome to the new term! 🎓", time: "2 hours ago", read: false },
    { id: 2, text: "New wellness program available: Sleep Mastery 😴", time: "1 day ago", read: false },
  ]);

  const addNotification = (text) => {
    setNotifications((prev) => [
      { id: Date.now(), text, time: "Just now", read: false },
      ...prev,
    ]);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // ✅ Polls State
  const [polls, setPolls] = useState(() => {
    const storedPolls = localStorage.getItem("pollsData");
    return storedPolls ? JSON.parse(storedPolls) : [];
  });

  // ✅ System Settings State (Maintenance, Alerts)
  const [systemSettings, setSystemSettings] = useState(() => {
    const stored = localStorage.getItem("systemSettingsData");
    return stored ? JSON.parse(stored) : {
      maintenanceMode: false,
      broadcastMessage: "",
    };
  });

  // ✅ Update Local Storage for Polls
  useEffect(() => {
    localStorage.setItem("pollsData", JSON.stringify(polls));
  }, [polls]);

  // ✅ Update Local Storage for System Settings
  useEffect(() => {
    localStorage.setItem("systemSettingsData", JSON.stringify(systemSettings));
  }, [systemSettings]);



  // ✅ Tracking Functions (Memoized)
  const trackLogin = React.useCallback(() => {
    setAnalytics((prev) => ({ ...prev, totalLogins: prev.totalLogins + 1 }));
  }, []);

  const trackPageView = React.useCallback(() => {
    setAnalytics((prev) => ({ ...prev, pageViews: prev.pageViews + 1 }));
  }, []);

  const trackResourceView = React.useCallback((resourceId) => {
    setAnalytics((prev) => ({
      ...prev,
      resourceViews: {
        ...prev.resourceViews,
        [resourceId]: (prev.resourceViews[resourceId] || 0) + 1,
      },
    }));
  }, []);


  // ✅ Initial Data Fetching (Simulating API Call)
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Check local storage first for persistence across reloads (optional optimization)
        // For this demo, we'll prefer the "API" to show the loading state on refresh
        // But we can merge with local storage if needed.

        // Safety timeout in case API hangs indefinitely
        const safetyTimeout = new Promise(resolve => setTimeout(() => resolve({
          students: [], resources: [], programs: [], announcements: [], appointments: [], messages: [], transactions: []
        }), 8000));

        const data = await Promise.race([
          firebaseApi.fetchAllData(),
          safetyTimeout
        ]);

        // Restore from local storage if available, otherwise use API defaults
        // This ensures our edits persist, but we still get the "loading" experience
        const storedStudents = localStorage.getItem("studentsData");
        let initialStudents = storedStudents ? JSON.parse(storedStudents) : data.students;

        // 🔄 Merge with Registered Users (from SignUp)
        const registeredUsers = JSON.parse(localStorage.getItem("users") || "[]");
        const newStudents = registeredUsers
          .filter(u => u.role === "Student" && !initialStudents.find(s => s.id === u.studentId))
          .map(u => ({
            id: u.studentId,
            name: u.name,
            department: u.department || "General",
            year: u.year || "1st Year",
            email: u.email,
            riskLevel: "Low", // Default
            wellnessScore: 100, // Default
            bmi: "N/A",
            activity: "Active",
            sleep: "8",
            stress: 0,
            sessions: 0,
            messages: [],
            notes: ["Newly registered student"]
          }));

        const allStudents = [...initialStudents, ...newStudents];
        setStudents(allStudents);

        const storedResources = localStorage.getItem("resourcesData");
        setResources(storedResources ? JSON.parse(storedResources) : data.resources);

        const storedPrograms = localStorage.getItem("programsData");
        setPrograms(storedPrograms ? JSON.parse(storedPrograms) : data.programs);

        const storedAnnouncements = localStorage.getItem("announcementsData");
        setTransactions(data.transactions || []);
        setAnnouncements(storedAnnouncements ? JSON.parse(storedAnnouncements) : data.announcements);

        const storedAppointments = localStorage.getItem("appointmentsData");
        setAppointments(storedAppointments ? JSON.parse(storedAppointments) : data.appointments);

        const storedMessages = localStorage.getItem("messagesData");
        setMessages(storedMessages ? JSON.parse(storedMessages) : data.messages || []);


        // Analytics & Notifications (Local only for now)
        const storedAnalytics = localStorage.getItem("analyticsData");
        if (storedAnalytics) setAnalytics(JSON.parse(storedAnalytics));

        const storedPolls = localStorage.getItem("pollsData");
        setPolls(storedPolls ? JSON.parse(storedPolls) : []);

        const storedSystemSettings = localStorage.getItem("systemSettingsData");
        if (storedSystemSettings) setSystemSettings(JSON.parse(storedSystemSettings));

      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to load application data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // ✅ Fetch Individual Student Data if missing (e.g. after fresh login)
  useEffect(() => {
    const fetchSelf = async () => {
      if (user?.role === "Student" && !students.find(s => s.id === user.uid)) {
        try {
          const myData = await firebaseApi.getStudent(user.uid);
          if (myData) {
            setStudents(prev => [...prev, myData]);
          }
        } catch (e) {
          console.error("Failed to fetch self data", e);
        }
      }
    };
    fetchSelf();
  }, [user, students]);

  // ✅ Update Local Storage & Document Attribute for Theme
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // ✅ Update Local Storage for User
  useEffect(() => {
    if (user) localStorage.setItem("loggedUser", JSON.stringify(user));
    else localStorage.removeItem("loggedUser");
  }, [user]);

  // ✅ Initialize Default Users
  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    if (!storedUsers || JSON.parse(storedUsers).length === 0) {
      const defaultUsers = [
        {
          email: "admin@example.com",
          password: "adminpassword",
          role: "Admin",
          name: "Admin User",
        },
        {
          email: "student@example.com",
          password: "password123",
          role: "Student",
          name: "Vempati Uday Kiran",
          studentId: 101,
        },
      ];
      localStorage.setItem("users", JSON.stringify(defaultUsers));
    }
  }, []);

  // ✅ Update Local Storage for Students
  useEffect(() => {
    localStorage.setItem("studentsData", JSON.stringify(students));
  }, [students]);

  // ✅ Update Local Storage for Analytics
  useEffect(() => {
    localStorage.setItem("analyticsData", JSON.stringify(analytics));
  }, [analytics]);

  // ✅ Update Local Storage for Announcements
  useEffect(() => {
    localStorage.setItem("announcementsData", JSON.stringify(announcements));
  }, [announcements]);

  // ✅ Update Local Storage for Appointments
  useEffect(() => {
    localStorage.setItem("appointmentsData", JSON.stringify(appointments));
  }, [appointments]);

  // ✅ Update Local Storage for Messages
  useEffect(() => {
    localStorage.setItem("messagesData", JSON.stringify(messages));
  }, [messages]);

  // ✅ Handle Login
  // ✅ Handle Login (Firebase)
  const handleLogin = async (emailOrId, password, role, extraData = {}) => {
    try {
      // Note: 'role' is currently passed from the UI form. 
      // ideally we fetch this from the DB after auth.
      let loggedUser = null;

      if (role === "Admin" && emailOrId === "admin@example.com" && password === "adminpassword") {
        // Keep the hardcoded admin for fallback/testing if firebase fails or for specific admin access
        loggedUser = {
          email: emailOrId,
          role,
          name: extraData.name || "Admin User",
          designation: extraData.designation || "Administrator",
          studentId: null,
        };
      } else {
        // Firebase Auth
        const fbUser = await firebaseApi.login(emailOrId, password);
        loggedUser = {
          email: fbUser.email,
          role: role, // In a real app, fetch this from DB. For now, trust the UI context.
          name: fbUser.displayName || "Student",
          uid: fbUser.uid,
          studentId: fbUser.uid // Using UID as studentID
        };
      }

      setUser(loggedUser);
      localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
      toast.success(`Welcome back, ${loggedUser.name}!`);
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Login Failed: " + error.message);
    }
  };

  // ✅ Handle Google Login
  const handleGoogleLogin = async () => {
    try {
      const fbUser = await firebaseApi.loginWithGoogle();
      // Note: We default to "Student" role for Google Sign-In for simplicity
      // In a real app, we might check if they are already an Admin in Firestore
      const loggedUser = {
        email: fbUser.email,
        role: fbUser.role || "Student", // Respect role from API
        name: fbUser.displayName || "User",
        uid: fbUser.uid,
        studentId: fbUser.uid
      };

      setUser(loggedUser);
      localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
      toast.success(`Welcome back, ${loggedUser.name}!`);
      return loggedUser; // Return user for navigation
    } catch (error) {
      console.error("Google Login Error:", error);
      toast.error("Google Login Failed: " + error.message);
      throw error; // Re-throw for caller to handle
    }
  };

  // ✅ Handle Logout
  const handleLogout = async () => {
    try {
      await firebaseApi.logout();
    } catch (err) {
      console.error("Logout Error:", err);
    }
    setUser(null);
    localStorage.removeItem("loggedUser");
    toast.success("Logged out successfully.");
  };

  // ✅ Update Password Wrapper
  const updateAppPassword = async (newPassword) => {
    try {
      await firebaseApi.updateUserPassword(newPassword);
      toast.success("Password updated successfully! for next login use this password. 🔐");
    } catch (error) {
      console.error("Password Update Error:", error);
      toast.error("Failed to update password. You may need to re-login explicitly.");
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="center-content" style={{ height: "100vh", background: "var(--color-background)", position: 'relative', overflow: 'hidden' }}>
        {/* Background blobs for visual interest */}
        <div style={{ position: 'absolute', top: '20%', left: '20%', width: '300px', height: '300px', background: 'var(--color-primary-light)', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.5 }}></div>
        <div style={{ position: 'absolute', bottom: '20%', right: '20%', width: '300px', height: '300px', background: 'var(--color-accent-light)', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.5 }}></div>

        <div className="glass-panel" style={{ padding: '3rem', borderRadius: 'var(--radius-xl)', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(20px)' }}>
          <div className="loading-spinner" style={{ width: '60px', height: '60px', border: '4px solid var(--color-primary-light)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <div>
            <h2 style={{ color: "var(--color-text-main)", marginBottom: '0.5rem', fontSize: '1.5rem' }}>WellnessHub</h2>
            <p style={{ color: "var(--color-text-secondary)", fontSize: '0.9rem' }}>Preparing your experience...</p>
          </div>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="center-content" style={{ height: "100vh", background: "var(--color-background)" }}>
        <div className="card" style={{ maxWidth: '500px', textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>⚠️</div>
          <h2 style={{ marginBottom: '1rem' }}>Connection Issue</h2>
          <p style={{ marginBottom: '2rem', color: 'var(--color-text-secondary)' }}>{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }


  // ✅ Admin Updates Student Data
  const updateStudentData = (updatedStudent) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
  };




  // ✅ Toggle Saved Resource
  const toggleSaveResource = (studentId, resourceId) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const currentSaved = s.savedResources || [];
          if (currentSaved.includes(resourceId)) {
            return { ...s, savedResources: currentSaved.filter((id) => id !== resourceId) };
          } else {
            return { ...s, savedResources: [...currentSaved, resourceId] };
          }
        }
        return s;
      })
    );
  };

  // ✅ Toggle Saved Program
  const toggleSaveProgram = (studentId, programId) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const currentSaved = s.savedPrograms || [];
          if (currentSaved.includes(programId)) {
            return { ...s, savedPrograms: currentSaved.filter((id) => id !== programId) };
          } else {
            return { ...s, savedPrograms: [...currentSaved, programId] };
          }
        }
        return s;
      })
    );
  };

  // ✅ Cancel Appointment
  const cancelAppointment = (appointmentId) => {
    setAppointments((prev) => prev.filter((apt) => apt.id !== appointmentId));
  };

  // ✅ Resource Management Functions
  const addResource = async (newResource) => {
    try {
      const saved = await firebaseApi.addResource(newResource);
      setResources((prev) => [...prev, saved]);
    } catch (e) {
      console.error("Failed to add resource", e);
      toast.error("Failed to save resource");
    }
  };

  const updateResource = async (updatedResource) => {
    try {
      await firebaseApi.updateResource(updatedResource);
      setResources((prev) => prev.map((r) => (r.id === updatedResource.id ? updatedResource : r)));
    } catch (e) {
      console.error("Failed to update resource", e);
      toast.error("Failed to update resource");
    }
  };

  const deleteResource = async (id) => {
    try {
      await firebaseApi.deleteResource(id);
      setResources((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      console.error("Failed to delete resource", e);
      toast.error("Deletion failed");
    }
  };

  /* --- Program Management --- */
  const enrollInProgram = async (studentId, programId) => {
    try {
      if (!user) return;
      await firebaseApi.enrollStudentInProgram(studentId, programId);

      // Update local state
      const updatedStudents = students.map(s => {
        if (s.id === studentId) {
          const current = s.enrolledPrograms || [];
          return { ...s, enrolledPrograms: [...current, programId] };
        }
        return s;
      });
      setStudents(updatedStudents);
      toast.success("Enrolled successfully! 🚀");
    } catch (e) {
      console.error("Enrollment error", e);
      toast.error("Failed to enroll");
    }
  };

  const leaveProgram = async (studentId, programId) => {
    try {
      if (!user) return;
      await firebaseApi.leaveProgram(studentId, programId);

      // Update local state
      const updatedStudents = students.map(s => {
        if (s.id === studentId) {
          const current = s.enrolledPrograms || [];
          return { ...s, enrolledPrograms: current.filter(id => id !== programId) };
        }
        return s;
      });
      setStudents(updatedStudents);
      toast.success("Left program successfully.");
    } catch (e) {
      console.error("Leave program error", e);
      toast.error("Failed to leave program");
    }
  };

  const addProgram = async (program) => {
    try {
      const saved = await firebaseApi.addProgram(program);
      setPrograms((prev) => [...prev, saved]);
      toast.success("Program Added 🧘‍♀️");
    } catch (e) {
      console.error("Failed to add program", e);
      toast.error("Failed to add program");
    }
  };

  const updateProgram = async (updatedProgram) => {
    try {
      await firebaseApi.updateProgram(updatedProgram);
      setPrograms((prev) => prev.map((p) => (p.id === updatedProgram.id ? updatedProgram : p)));
    } catch (e) {
      console.error("Failed to update program", e);
      toast.error("Failed to update program");
    }
  };

  const deleteProgram = async (id) => {
    try {
      await firebaseApi.deleteProgram(id);
      setPrograms((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.error("Failed to delete program", e);
      toast.error("Deletion failed");
    }
  };



  // ✅ Announcements State
  // const [announcements, setAnnouncements] = useState(() => {
  //   const storedAnnouncements = localStorage.getItem("announcementsData");
  //   return storedAnnouncements ? JSON.parse(storedAnnouncements) : [
  //     {
  //       id: 1,
  //       title: "Welcome to the New Term! 🎉",
  //       content: "We are excited to start a new journey with you. Check out the new wellness programs available.",
  //       type: "Info",
  //       date: new Date().toLocaleDateString(),
  //     },
  //     {
  //       id: 2,
  //       title: "Maintenance Alert ⚠️",
  //       content: "The system will be down for maintenance on Sunday from 2 AM to 4 AM.",
  //       type: "Alert",
  //       date: new Date().toLocaleDateString(),
  //     }
  //   ];
  // });



  // ✅ Announcement Management Functions
  const addAnnouncement = async (newAnnouncement) => {
    try {
      const saved = await firebaseApi.addAnnouncement(newAnnouncement);
      setAnnouncements((prev) => [saved, ...prev]);
      addNotification(`📢 New Announcement: ${saved.title}`);
    } catch (e) {
      console.error("Failed to add announcement", e);
      toast.error("Failed to add announcement");
    }
  };



  // ✅ Transactions
  const addTransaction = async (transaction) => {
    try {
      const saved = await firebaseApi.addTransaction(transaction);
      setTransactions(prev => [saved, ...prev]);
    } catch (e) {
      console.error("Failed to note transaction", e);
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      await firebaseApi.deleteAnnouncement(id);
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      toast.success("Announcement Deleted 🗑️");
    } catch (e) {
      console.error("Failed to delete announcement", e);
      toast.error("Failed to delete announcement");
    }
  };

  const updateAnnouncement = async (announcement) => {
    try {
      await firebaseApi.updateAnnouncement(announcement);
      setAnnouncements((prev) => prev.map((a) => (a.id === announcement.id ? announcement : a)));
      toast.success("Announcement Updated! 📢");
    } catch (e) {
      console.error("Failed to update announcement", e);
      toast.error("Failed to update announcement");
    }
  };

  // ✅ Appointments State
  // const [appointments, setAppointments] = useState(() => {
  //   try {
  //     const storedAppointments = localStorage.getItem("appointmentsData");
  //     return storedAppointments ? JSON.parse(storedAppointments) : [
  //       { id: 1, studentId: 101, studentName: "Vempati Uday Kiran", type: "Counseling", date: "2023-10-25", status: "Pending", notes: "" },
  //       { id: 2, studentId: 102, studentName: "Jane Doe", type: "Nutrition Plan", date: "2023-10-26", status: "Confirmed", notes: "Approved" },
  //     ];
  //   } catch (error) {
  //     console.error("Error parsing appointments data:", error);
  //     return [];
  //   }
  // });



  const addAppointment = async (appointment) => {
    try {
      const saved = await firebaseApi.addAppointment({ ...appointment, status: "Pending", createdAt: new Date().toISOString() });
      setAppointments((prev) => [...prev, saved]);
      addNotification(`📅 New Appointment Request: ${appointment.type}`);

      // 📧 Simulate Email Notification
      setTimeout(() => {
        toast("📧 Confirmation email sent to student!", { icon: "✉️", duration: 4000 });
        toast("📧 Notification email sent to admins.", { icon: "📨", duration: 4000 });
      }, 1500);

    } catch (e) {
      console.error("Failed to add appointment", e);
      toast.error("Failed to book appointment");
    }
  };

  const handleSendMessage = async (text, sender = "user") => {
    try {
      if (!user) return;
      const newMessage = {
        userId: user.uid,
        userName: user.name,
        text,
        sender,
        createdAt: new Date().toISOString(),
        read: false,
        reply: null
      };
      const saved = await firebaseApi.sendSupportMessage(newMessage);
      setMessages((prev) => [...prev, saved]);
    } catch (e) {
      console.error("Failed to send message", e);
      toast.error("Failed to send message");
    }
  };

  const replyToMessage = async (messageId, replyText) => {
    try {
      const updated = { reply: replyText, read: true, repliedAt: new Date().toISOString() };
      await firebaseApi.updateMessage(messageId, updated);
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, ...updated } : m));
      toast.success("Reply sent! 📨");
    } catch (e) {
      console.error("Failed to reply", e);
      toast.error("Failed to reply");
    }
  };





  // ... (Initial Data Fetching inside useEffect needs update to load these) ...
  // Updating the loadData function inside useEffect:

  // ✅ Student Data Update
  const updateOwnData = async (updatedData) => {
    if (!user || user.role !== "Student") return;
    try {
      await firebaseApi.updateStudent(user.uid, updatedData);

      // Update local state
      setStudents(prev => prev.map(s => s.id === user.uid ? { ...s, ...updatedData } : s));

      toast.success("Profile Updated! ✅");
    } catch (error) {
      console.error("Failed to update profile", error);
      toast.error("Failed to save changes.");
    }
  };

  const updateAppointmentStatus = (id, status, note, assignedTo = null, newDate = null) => {
    setAppointments(prev => prev.map(appt => appt.id === id ? { ...appt, status, notes: note, assignedTo, date: newDate || appt.date } : appt));

    // 🔔 Trigger Notification
    const appt = appointments.find(a => a.id === id);
    if (appt) {
      let message = "";
      if (status === "Confirmed") {
        message = `Your appointment for ${appt.type} has been approved! ✅`;
      } else if (status === "Rescheduled") {
        message = `Your appointment has been rescheduled to ${newDate}. 🗓️`;
      } else {
        message = `Your appointment request was updated: ${status}`;
      }

      // Persist to Firebase
      firebaseApi.updateAppointment(id, { status, notes: note, assignedTo, date: newDate || appt.date })
        .catch(err => console.error("Failed to update appointment", err));

      addNotification(message);
    }
  };

  const addPoll = (newPoll) => {
    setPolls(prev => [...prev, { ...newPoll, id: Date.now(), votes: {} }]); // votes: { optionIndex: count }
    addNotification(`📊 New Poll: ${newPoll.question}`);
  };

  const votePoll = (pollId, optionIndex) => {
    setPolls(prev => prev.map(p => {
      if (p.id === pollId) {
        const currentVotes = p.votes[optionIndex] || 0;
        return { ...p, votes: { ...p.votes, [optionIndex]: currentVotes + 1 } };
      }
      return p;
    }));
    toast.success("Vote recorded! 🗳️");
  };

  const deletePoll = (pollId) => {
    setPolls(prev => prev.filter(p => p.id !== pollId));
  };

  // ✅ System Actions
  const toggleMaintenanceMode = () => {
    setSystemSettings(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }));
    toast.success(`Maintenance Mode ${!systemSettings.maintenanceMode ? 'Enabled 🔒' : 'Disabled 🔓'}`);
  };

  const sendBroadcastAlert = (message) => {
    setSystemSettings(prev => ({ ...prev, broadcastMessage: message }));
    if (message) toast.error(`🚨 ALERT SENT: ${message}`, { duration: 5000 });
  };









  // ✅ Router Setup
  return (
    <div className={`app-container ${theme}`} data-theme={theme}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <Layout
                  user={user}
                  onLogout={handleLogout}
                  theme={theme}
                  toggleTheme={toggleTheme}
                  notifications={notifications}
                  markAsRead={markAsRead}
                  markAllAsRead={markAllAsRead}
                  onSendMessage={handleSendMessage}
                  messages={messages}
                >
                  <HomePage user={user} />
                </Layout>
              }
            />

            {/* Auth */}
            <Route
              path="/signin"
              element={
                <Layout
                  user={user}
                  onLogout={handleLogout}
                  theme={theme}
                  toggleTheme={toggleTheme}
                  notifications={notifications}
                  markAsRead={markAsRead}
                  markAllAsRead={markAllAsRead}
                  onSendMessage={handleSendMessage}
                  messages={messages}
                >
                  <SignIn onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} trackLogin={trackLogin} />
                </Layout>
              }
            />
            <Route
              path="/signup"
              element={
                <Layout
                  user={user}
                  onLogout={handleLogout}
                  theme={theme}
                  toggleTheme={toggleTheme}
                  notifications={notifications}
                  markAsRead={markAsRead}
                  markAllAsRead={markAllAsRead}
                  onSendMessage={handleSendMessage}
                  messages={messages}
                >
                  <SignUp onGoogleLogin={handleGoogleLogin} />
                </Layout>
              }
            />

            {/* Student Dashboard */}
            <Route
              path="/student-dashboard"
              element={
                user?.role === "Student" ? (
                  <Layout
                    user={user}
                    onLogout={handleLogout}
                    theme={theme}
                    toggleTheme={toggleTheme}
                    notifications={notifications}
                    markAsRead={markAsRead}
                    markAllAsRead={markAllAsRead}
                    onSendMessage={handleSendMessage}
                    messages={messages}
                  >
                    <StudentDashboard
                      user={user}
                      studentData={students.find((s) => s.id === user.studentId)}
                      updateOwnData={updateOwnData}
                      updatePassword={updateAppPassword}
                      enrollInProgram={enrollInProgram}
                      leaveProgram={leaveProgram}
                      announcements={announcements}
                      trackPageView={trackPageView}
                      trackResourceView={trackResourceView}
                      savedResources={students.find((s) => s.id === user.studentId)?.savedResources || []}
                      toggleSaveResource={toggleSaveResource}
                      resources={resources}
                      programs={programs}
                      appointments={appointments.filter((a) => a.studentId === user.studentId)}
                      addAppointment={addAppointment}
                      polls={polls}
                      votePoll={votePoll}
                      systemSettings={systemSettings}
                    />
                  </Layout>
                ) : (
                  <Navigate to="/signin" />
                )
              }
            />

            {/* Admin Dashboard */}
            <Route
              path="/admin-dashboard"
              element={
                user?.role === "Admin" ? (
                  <Layout
                    user={user}
                    onLogout={handleLogout}
                    theme={theme}
                    toggleTheme={toggleTheme}
                    notifications={notifications}
                    markAsRead={markAsRead}
                    markAllAsRead={markAllAsRead}
                  >
                    <AdminDashboard
                      students={students}
                      updateStudentData={updateStudentData}
                      resources={resources}
                      addResource={addResource}
                      updateResource={updateResource}
                      deleteResource={deleteResource}
                      programs={programs}
                      addProgram={addProgram}
                      updateProgram={updateProgram}
                      deleteProgram={deleteProgram}
                      announcements={announcements}
                      addAnnouncement={addAnnouncement}
                      deleteAnnouncement={deleteAnnouncement}
                      updateAnnouncement={updateAnnouncement}
                      appointments={appointments}
                      updateAppointmentStatus={updateAppointmentStatus}
                      user={user}
                      polls={polls}
                      addPoll={addPoll}
                      deletePoll={deletePoll}
                      systemSettings={systemSettings}
                      toggleMaintenanceMode={toggleMaintenanceMode}
                      sendBroadcastAlert={sendBroadcastAlert}
                      messages={messages}
                      replyToMessage={replyToMessage}
                      transactions={transactions}
                    />
                  </Layout>
                ) : (
                  <Navigate to="/signin" />
                )
              }
            />

            {/* Public Pages */}
            <Route
              path="/wellness-programs"
              element={
                <Layout
                  user={user}
                  onLogout={handleLogout}
                  theme={theme}
                  toggleTheme={toggleTheme}
                  notifications={notifications}
                  markAsRead={markAsRead}
                  markAllAsRead={markAllAsRead}
                  onSendMessage={handleSendMessage}
                  messages={messages}
                >
                  <WellnessPrograms
                    user={user}
                    studentData={students.find((s) => s.id === user?.studentId)}
                    enrollInProgram={enrollInProgram}
                    leaveProgram={leaveProgram}
                    programs={programs}
                  />
                </Layout>
              }
            />
            <Route
              path="/health-resources"
              element={
                <Layout
                  user={user}
                  onLogout={handleLogout}
                  theme={theme}
                  toggleTheme={toggleTheme}
                  notifications={notifications}
                  markAsRead={markAsRead}
                  markAllAsRead={markAllAsRead}
                  onSendMessage={handleSendMessage}
                  messages={messages}
                >
                  <HealthResources
                    resources={resources}
                    trackResourceView={trackResourceView}
                    savedResources={students.find((s) => s.id === user?.studentId)?.savedResources || []}
                    toggleSaveResource={toggleSaveResource}
                    user={user}
                    studentData={students.find((s) => s.id === user?.uid)}
                    programs={programs}
                    enrollInProgram={enrollInProgram}
                    leaveProgram={leaveProgram}
                  />
                </Layout>
              }
            />
            <Route
              path="/support-services"
              element={
                <Layout
                  user={user}
                  onLogout={handleLogout}
                  theme={theme}
                  toggleTheme={toggleTheme}
                  notifications={notifications}
                  markAsRead={markAsRead}
                  markAllAsRead={markAllAsRead}
                  onSendMessage={handleSendMessage}
                  messages={messages}
                >
                  <SupportServices />
                </Layout>
              }
            />
            <Route
              path="/about"
              element={
                <Layout user={user} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme}>
                  <About />
                </Layout>
              }
            />
            <Route
              path="/contact"
              element={
                <Layout user={user} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme}>
                  <Contact />
                </Layout>
              }
            />

            {/* Program Details */}
            <Route
              path="/program/:programId"
              element={
                <Layout user={user} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme}>
                  <ProgramDetails
                    user={user}
                    studentData={students.find((s) => s.id === user?.studentId)}
                    enrollInProgram={enrollInProgram}
                    leaveProgram={leaveProgram}
                  />
                </Layout>
              }
            />

            {/* Profile */}
            <Route
              path="/profile"
              element={
                user ? (
                  <Layout user={user} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} notifications={notifications} markAsRead={markAsRead} markAllAsRead={markAllAsRead}>
                    <Profile
                      user={user}
                      setUser={setUser}
                      studentData={students.find((s) => s.id === user.studentId)}
                      updateOwnData={updateOwnData}
                    />
                  </Layout>
                ) : (
                  <Navigate to="/signin" />
                )
              }
            />

            {/* Saved Items */}
            <Route
              path="/saved-items"
              element={
                user ? (
                  <Layout user={user} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} notifications={notifications} markAsRead={markAsRead} markAllAsRead={markAllAsRead}>
                    <SavedItems
                      savedResources={students.find((s) => s.id === user?.studentId)?.savedResources || []}
                      resources={resources}
                      savedPrograms={students.find((s) => s.id === user?.studentId)?.savedPrograms || []}
                      programs={programs}
                      toggleSaveResource={toggleSaveResource}
                      toggleSaveProgram={toggleSaveProgram}
                      userId={user.studentId}
                    />
                  </Layout>
                ) : (
                  <Navigate to="/signin" />
                )
              }
            />

            {/* My Programs */}
            <Route
              path="/my-programs"
              element={
                user ? (
                  <Layout user={user} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} notifications={notifications} markAsRead={markAsRead} markAllAsRead={markAllAsRead}>
                    <MyPrograms
                      enrolledPrograms={students.find((s) => s.id === user?.studentId)?.enrolledPrograms || []}
                      programs={programs}
                      leaveProgram={leaveProgram}
                      userId={user.studentId}
                    />
                  </Layout>
                ) : (
                  <Navigate to="/signin" />
                )
              }
            />

            {/* Book Appointment */}
            <Route
              path="/book-appointment"
              element={
                user ? (
                  <Layout user={user} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} notifications={notifications} markAsRead={markAsRead} markAllAsRead={markAllAsRead}>
                    <AppointmentBooking
                      user={user}
                      addAppointment={addAppointment}
                    />
                  </Layout>
                ) : (
                  <Navigate to="/signin" />
                )
              }
            />

            {/* My Appointments */}
            <Route
              path="/my-appointments"
              element={
                user ? (
                  <Layout user={user} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} notifications={notifications} markAsRead={markAsRead} markAllAsRead={markAllAsRead}>
                    <MyAppointments
                      appointments={appointments}
                      user={user}
                      cancelAppointment={cancelAppointment}
                    />
                  </Layout>
                ) : (
                  <Navigate to="/signin" />
                )
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div >
  );
}

export default App;
