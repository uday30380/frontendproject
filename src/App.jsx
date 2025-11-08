import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
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
import HealthAdvice from "./components/HealthAdvice";
import SupportServices from "./components/SupportServices";
import About from "./components/About";
import Contact from "./components/Contact";
import ProgramDetails from "./components/ProgramDetails";

import "./App.css";

// ✅ Layout Wrapper
const Layout = ({ user, onLogout, children }) => (
  <>
    <Navbar user={user} onLogout={onLogout} />
    <Toaster position="top-right" reverseOrder={false} />
    {children}
  </>
);

function App() {
  // ✅ Login State
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("loggedUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // ✅ Shared Students Dataset
  const [students, setStudents] = useState([
    {
      id: 101,
      name: "Vempati Uday Kiran",
      department: "CSE",
      wellnessScore: 72,
      stress: 8,
      activity: "Moderate",
      sleep: 5.5,
      challenges: [
        { name: "15-Minute Meditation", progress: 75, total: 100 },
        { name: "Drink 8 Glasses of Water", progress: 5, total: 8 },
      ],
      events: [
        { name: "Stress Management Workshop", joined: true },
        { name: "Yoga & Mindfulness", joined: false },
      ],
      messages: [
        {
          from: "Admin",
          text: "Let's schedule a counseling session next Monday.",
          time: "2 days ago",
        },
        { from: "Student", text: "Sure, that works for me!", time: "1 day ago" },
      ],
      notes: ["Monitor sleep; recommend breathing exercises."],
    },
  ]);

  // ✅ Update Local Storage
  useEffect(() => {
    if (user) localStorage.setItem("loggedUser", JSON.stringify(user));
    else localStorage.removeItem("loggedUser");
  }, [user]);

  // ✅ Handle Login
  const handleLogin = (emailOrId, password, role) => {
    const loggedUser = {
      emailOrId,
      role,
      studentId: role === "Student" ? 101 : null,
    };
    setUser(loggedUser);
  };

  // ✅ Handle Logout
  const handleLogout = () => {
    setUser(null);
  };

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

  // ✅ Router Setup
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Home */}
        <Route
          path="/"
          element={
            <Layout user={user} onLogout={handleLogout}>
              <HomePage />
            </Layout>
          }
        />

        {/* Auth */}
        <Route
          path="/signin"
          element={
            <Layout user={user} onLogout={handleLogout}>
              <SignIn onLogin={handleLogin} />
            </Layout>
          }
        />
        <Route
          path="/signup"
          element={
            <Layout user={user} onLogout={handleLogout}>
              <SignUp />
            </Layout>
          }
        />

        {/* Student Dashboard */}
        <Route
          path="/student-dashboard"
          element={
            user?.role === "Student" ? (
              <Layout user={user} onLogout={handleLogout}>
                <StudentDashboard
                  studentData={students.find((s) => s.id === user.studentId)}
                  updateOwnData={updateOwnData}
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
              <Layout user={user} onLogout={handleLogout}>
                <AdminDashboard
                  students={students}
                  updateStudentData={updateStudentData}
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
            <Layout user={user} onLogout={handleLogout}>
              <WellnessPrograms />
            </Layout>
          }
        />
        <Route
          path="/health-advice"
          element={
            <Layout user={user} onLogout={handleLogout}>
              <HealthAdvice />
            </Layout>
          }
        />
        <Route
          path="/support-services"
          element={
            <Layout user={user} onLogout={handleLogout}>
              <SupportServices />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout user={user} onLogout={handleLogout}>
              <About />
            </Layout>
          }
        />
        <Route
          path="/contact"
          element={
            <Layout user={user} onLogout={handleLogout}>
              <Contact />
            </Layout>
          }
        />

        {/* Program Details */}
        <Route
          path="/program/:programId"
          element={
            <Layout user={user} onLogout={handleLogout}>
              <ProgramDetails />
            </Layout>
          }
        />
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
