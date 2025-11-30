import React, { useState, useEffect } from "react";
import { mockApi } from "./api/mockApi";
import { Toaster } from "react-hot-toast";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import AdminDashboard from "./components/AdminDashboard";
import StudentDashboard from "./components/StudentDashboard";
import WellnessPrograms from "./components/WellnessPrograms";
import HealthResources from "./components/HealthResources";
import SupportServices from "./components/SupportServices";
import About from "./components/About";
import Contact from "./components/Contact";
import ProgramDetails from "./components/ProgramDetails";
import Profile from "./components/Profile";
import ChatBot from "./components/ChatBot";

import "./App.css";

// ✅ Layout Wrapper
const Layout = ({ user, onLogout, theme, toggleTheme, notifications, markAsRead, markAllAsRead, children }) => (
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
    <ChatBot />
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



  // ✅ Initial Data Fetching (Simulating API Call)
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Check local storage first for persistence across reloads (optional optimization)
        // For this demo, we'll prefer the "API" to show the loading state on refresh
        // But we can merge with local storage if needed.

        const data = await mockApi.fetchAllData();

        // Restore from local storage if available, otherwise use API defaults
        // This ensures our edits persist, but we still get the "loading" experience
        const storedStudents = localStorage.getItem("studentsData");
        setStudents(storedStudents ? JSON.parse(storedStudents) : data.students);

        const storedResources = localStorage.getItem("resourcesData");
        setResources(storedResources ? JSON.parse(storedResources) : data.resources);

        const storedPrograms = localStorage.getItem("programsData");
        setPrograms(storedPrograms ? JSON.parse(storedPrograms) : data.programs);

        const storedAnnouncements = localStorage.getItem("announcementsData");
        setAnnouncements(storedAnnouncements ? JSON.parse(storedAnnouncements) : data.announcements);

        const storedAppointments = localStorage.getItem("appointmentsData");
        setAppointments(storedAppointments ? JSON.parse(storedAppointments) : data.appointments);

        // Analytics & Notifications (Local only for now)
        const storedAnalytics = localStorage.getItem("analyticsData");
        if (storedAnalytics) setAnalytics(JSON.parse(storedAnalytics));

      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to load application data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

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

  // ✅ Handle Login
  const handleLogin = (emailOrId, password, role, extraData = {}) => {
    if (role === "Admin") {
      // Admin Login
      const adminUser = {
        emailOrId,
        role,
        name: extraData.name || "Admin User",
        designation: extraData.designation || "Administrator",
        studentId: null,
      };
      setUser(adminUser);
      localStorage.setItem("loggedUser", JSON.stringify(adminUser));
    } else {
      // Student Login (Existing Logic)
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const foundUser = existingUsers.find(
        (u) =>
          (u.email === emailOrId || u.studentId == emailOrId) &&
          u.password === password &&
          u.role === role
      );

      const loggedUser = foundUser || {
        emailOrId,
        role,
        name: "Student", // Fallback
        studentId: 101, // Fallback ID
      };
      setUser(loggedUser);
      localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
    }
  };

  // ✅ Handle Logout
  const handleLogout = () => {
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="center-content" style={{ height: "100vh", background: "var(--color-background)" }}>
        <div className="loading-spinner"></div>
        <h2 style={{ color: "var(--color-primary)" }}>Loading WellnessHub...</h2>
        <p>Preparing your personalized experience</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="center-content" style={{ height: "100vh", background: "var(--color-background)" }}>
        <div style={{ color: "var(--color-danger)", fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }


  // ✅ Admin Updates Student Data
  const updateStudentData = (updatedStudent) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
  };

  // ✅ Student Updates Their Own Data
  const updateOwnData = (studentId, updatedFields) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, ...updatedFields } : s
      )
    );
  };

  // ✅ Enroll in Program
  const enrollInProgram = (studentId, programId) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const currentEnrolled = s.enrolledPrograms || [];
          if (!currentEnrolled.includes(programId)) {
            return { ...s, enrolledPrograms: [...currentEnrolled, programId] };
          }
        }
        return s;
      })
    );
  };

  // ✅ Leave Program
  const leaveProgram = (studentId, programId) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            enrolledPrograms: (s.enrolledPrograms || []).filter((id) => id !== programId),
          };
        }
        return s;
      })
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

  // ✅ Resource Management Functions
  const addResource = (newResource) => {
    setResources((prev) => [...prev, { ...newResource, id: Date.now() }]);
  };

  const updateResource = (updatedResource) => {
    setResources((prev) => prev.map((r) => (r.id === updatedResource.id ? updatedResource : r)));
  };

  const deleteResource = (id) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
  };

  // ✅ Program Management Functions
  const addProgram = (newProgram) => {
    setPrograms((prev) => [...prev, { ...newProgram, id: newProgram.id || Date.now().toString() }]);
  };

  const updateProgram = (updatedProgram) => {
    setPrograms((prev) => prev.map((p) => (p.id === updatedProgram.id ? updatedProgram : p)));
  };

  const deleteProgram = (id) => {
    setPrograms((prev) => prev.filter((p) => p.id !== id));
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

  // ✅ Update Local Storage for Announcements
  // useEffect(() => {
  //   localStorage.setItem("announcementsData", JSON.stringify(announcements));
  // }, [announcements]);

  // ✅ Announcement Management Functions
  const addAnnouncement = (newAnnouncement) => {
    setAnnouncements((prev) => [{ ...newAnnouncement, id: Date.now(), date: new Date().toLocaleDateString() }, ...prev]);
  };

  const deleteAnnouncement = (id) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
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

  // useEffect(() => {
  //   localStorage.setItem("appointmentsData", JSON.stringify(appointments));
  // }, [appointments]);

  const addAppointment = (appointment) => {
    setAppointments((prev) => [...prev, { ...appointment, id: Date.now(), status: "Pending" }]);
  };

  const updateAppointmentStatus = (id, status, note) => {
    setAppointments(prev => prev.map(appt => appt.id === id ? { ...appt, status, notes: note } : appt));
  };

  // ✅ Analytics State
  // const [analytics, setAnalytics] = useState(() => {
  //   const storedAnalytics = localStorage.getItem("analyticsData");
  //   return storedAnalytics ? JSON.parse(storedAnalytics) : {
  //     totalLogins: 0,
  //     pageViews: 0,
  //     resourceViews: {}, // { resourceId: count }
  //   };
  // });



  // ✅ Tracking Functions
  const trackLogin = () => {
    setAnalytics((prev) => ({ ...prev, totalLogins: prev.totalLogins + 1 }));
  };

  const trackPageView = () => {
    setAnalytics((prev) => ({ ...prev, pageViews: prev.pageViews + 1 }));
  };

  const trackResourceView = (resourceId) => {
    setAnalytics((prev) => ({
      ...prev,
      resourceViews: {
        ...prev.resourceViews,
        [resourceId]: (prev.resourceViews[resourceId] || 0) + 1,
      },
    }));
  };





  // ✅ Router Setup
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
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
            >
              <HomePage />
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
            >
              <SignIn onLogin={handleLogin} trackLogin={trackLogin} />
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
            >
              <SignUp />
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
              >
                <StudentDashboard
                  user={user}
                  studentData={students.find((s) => s.id === user.studentId)}
                  updateOwnData={updateOwnData}
                  enrollInProgram={enrollInProgram}
                  leaveProgram={leaveProgram}
                  announcements={announcements}
                  trackPageView={trackPageView}
                  trackResourceView={trackResourceView}
                  savedResources={students.find((s) => s.id === user.studentId)?.savedResources || []}
                  toggleSaveResource={toggleSaveResource}
                  resources={resources}
                  appointments={appointments.filter((a) => a.studentId === user.studentId)}
                  addAppointment={addAppointment}
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
                  analytics={analytics}
                  appointments={appointments}
                  updateAppointmentStatus={updateAppointmentStatus}
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
            >
              <HealthResources
                resources={resources}
                trackResourceView={trackResourceView}
                savedResources={students.find((s) => s.id === user?.studentId)?.savedResources || []}
                toggleSaveResource={toggleSaveResource}
                user={user}
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
              <Layout user={user} onLogout={handleLogout}>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
