import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [userType, setUserType] = useState('');
  const [userData, setUserData] = useState(null);

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const handleLogin = (email, password, type) => {
    // In a real app, you'd validate credentials here
    setUserData({ email, userType: type });
    setUserType(type);
    setCurrentPage(type === 'Student' ? 'studentDashboard' : 'adminDashboard');
  };

  const handleSignUp = (formData) => {
    // In a real app, you'd send this to a backend
    setUserData({ email: formData.email, userType: formData.accountType });
    setUserType(formData.accountType);
    setCurrentPage(formData.accountType === 'Student Account' ? 'studentDashboard' : 'adminDashboard');
  };

  const handleLogout = () => {
    setUserData(null);
    setUserType('');
    setCurrentPage('home');
  };

  return (
    <div className="App">
      <Navbar 
        onNavigate={handleNavigation} 
        isLoggedIn={!!userData}
        onLogout={handleLogout}
      />
      
      {currentPage === 'home' && <HomePage onNavigate={handleNavigation} />}
      {currentPage === 'signup' && <SignUp onSignUp={handleSignUp} onNavigate={handleNavigation} />}
      {currentPage === 'signin' && <SignIn onLogin={handleLogin} onNavigate={handleNavigation} />}
      {currentPage === 'studentDashboard' && <StudentDashboard userData={userData} />}
      {currentPage === 'adminDashboard' && <AdminDashboard userData={userData} />}
    </div>
  );
}

export default App;
