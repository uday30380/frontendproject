import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
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

// ✅ Layout component with Navbar
const Layout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/signin" element={<Layout><SignIn /></Layout>} />
        <Route path="/signup" element={<Layout><SignUp /></Layout>} />
        <Route path="/admin-dashboard" element={<Layout><AdminDashboard /></Layout>} />
        <Route path="/student-dashboard" element={<Layout><StudentDashboard /></Layout>} />
        <Route path="/wellness-programs" element={<Layout><WellnessPrograms /></Layout>} />
        <Route path="/health-advice" element={<Layout><HealthAdvice /></Layout>} />
        <Route path="/support-services" element={<Layout><SupportServices /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
