import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

// User pages
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Appointment from "./pages/Appointment";
import Feedback from "./pages/Feedback";
import Login from "./pages/Login";
import Contact from "./pages/Contact";

// Admin
import AdminLayout from "./admin/components/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminServices from "./admin/pages/AdminServices";
import AdminAppointments from "./admin/pages/AdminAppointments";
import AdminFeedback from "./admin/pages/AdminFeedback";

import "./App.css";

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy">
        <span className="spinner-lg" />
      </div>
    );
  if (!user || user.role !== "admin") return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes({ dark, setDark }) {
  return (
    <Routes>
      {/* Public user routes */}
      <Route
        path="/"
        element={
          <>
            <Navbar dark={dark} setDark={setDark} />
            <Home />
            <Footer />
          </>
        }
      />
      <Route
        path="/services"
        element={
          <>
            <Navbar dark={dark} setDark={setDark} />
            <Services />
            <Footer />
          </>
        }
      />
      <Route
        path="/appointment"
        element={
          <>
            <Navbar dark={dark} setDark={setDark} />
            <Appointment />
            <Footer />
          </>
        }
      />
      <Route
        path="/feedback"
        element={
          <>
            <Navbar dark={dark} setDark={setDark} />
            <Feedback />
            <Footer />
          </>
        }
      />
      <Route
        path="/contact"
        element={
          <>
            <Navbar dark={dark} setDark={setDark} />
            <Contact />
            <Footer />
          </>
        }
      />
      <Route path="/login" element={<Login />} />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="appointments" element={<AdminAppointments />} />
        <Route path="feedback" element={<AdminFeedback />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-center"
          gutter={10}
          toastOptions={{
            duration: 3000,

            style: {
              background: dark ? "#0f172a" : "#ffffff",
              color: dark ? "#f8fafc" : "#0f172a",
              border: dark
                ? "1px solid rgba(255,255,255,.08)"
                : "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "14px 16px",
              boxShadow: dark
                ? "0 10px 30px rgba(0,0,0,.45)"
                : "0 10px 25px rgba(0,0,0,.08)",
            },

            success: {
              iconTheme: {
                primary: "#22c55e",
                secondary: "#ffffff",
              },
            },

            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#ffffff",
              },
            },

            loading: {
              iconTheme: {
                primary: "#3b82f6",
                secondary: "#ffffff",
              },
            },
          }}
        />
        <div className="min-h-screen flex flex-col">
          <AppRoutes dark={dark} setDark={setDark} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
