import React, { useState, useEffect } from "react";
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
import "./App.css";

// ✅ Layout component (Navbar always visible)
const Layout = ({ user, onLogout, children }) => (
  <>
    <Navbar user={user} onLogout={onLogout} />
    {children}
  </>
);

function App() {
  // ✅ Manage user login state
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("loggedUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // ✅ Save login data to localStorage (for persistence)
  useEffect(() => {
    if (user) {
      localStorage.setItem("loggedUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("loggedUser");
    }
  }, [user]);

  // ✅ Handle login
  const handleLogin = (emailOrId, password, role) => {
    const loggedUser = { emailOrId, role };
    setUser(loggedUser);
  };

  // ✅ Handle logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("loggedUser");
  };

  // ✅ Router setup
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path="/"
          element={
            <Layout user={user} onLogout={handleLogout}>
              <HomePage />
            </Layout>
          }
        />
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

        {/* Protected Routes */}
        <Route
          path="/student-dashboard"
          element={
            user?.role === "Student" ? (
              <Layout user={user} onLogout={handleLogout}>
                <StudentDashboard />
              </Layout>
            ) : (
              <Navigate to="/signin" />
            )
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            user?.role === "Admin" ? (
              <Layout user={user} onLogout={handleLogout}>
                <AdminDashboard />
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
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
