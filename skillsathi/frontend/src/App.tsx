import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SchemesPage from "./pages/SchemesPage";
import LanguageSwitcher from "./components/LanguageSwitcher";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 bg-white shadow">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="font-bold">SkillSathi</Link>
          <nav className="space-x-4">
            <Link to="/schemes">Schemes</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/login">Login</Link>
          </nav>
          <LanguageSwitcher />
        </div>
      </header>
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/schemes" element={<SchemesPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}
