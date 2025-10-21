import React, { useState, useEffect } from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import TreeLayoutFamilyTree from "./components/TreeLayoutFamilyTree";
import MemberList from "./components/MemberList";
import Profile from "./components/Profile";
import VIPPackages from "./components/VIPPackages";
import Navigation from "./components/Navigation";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load user data from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem("currentUser", JSON.stringify(userData));
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("currentUser");
    setCurrentPage("home");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home onNavigate={setCurrentPage} />;
      case "login":
        return <Login onLogin={handleLogin} onNavigate={setCurrentPage} />;
      case "register":
        return <Register onNavigate={setCurrentPage} />;
      case "dashboard":
        return <Dashboard user={user} onNavigate={setCurrentPage} />;
      case "family-tree":
        return <TreeLayoutFamilyTree user={user} onNavigate={setCurrentPage} />;
      case "member-list":
        return <MemberList user={user} onNavigate={setCurrentPage} />;
      case "profile":
        return <Profile user={user} onUpdateUser={setUser} onNavigate={setCurrentPage} />;
      case "vip":
        return <VIPPackages user={user} onNavigate={setCurrentPage} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="App">
      <Navigation 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={handleLogout}
      />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
