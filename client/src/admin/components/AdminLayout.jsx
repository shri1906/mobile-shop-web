import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaTools,
  FaCalendarAlt,
  FaStar,
  FaGlobe,
  FaSignOutAlt,
  FaMobileAlt,
} from "react-icons/fa";

import { MdDashboard, MdMenuOpen, MdMenu } from "react-icons/md";

const navItems = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: <MdDashboard className="text-lg" />,
    end: true,
  },
  {
    to: "/admin/services",
    label: "Services",
    icon: <FaTools className="text-lg" />,
    end: false,
  },
  {
    to: "/admin/appointments",
    label: "Appointments",
    icon: <FaCalendarAlt className="text-lg" />,
    end: false,
  },
  {
    to: "/admin/feedback",
    label: "Reviews",
    icon: <FaStar className="text-lg text-yellow-500" />,
    end: false,
  },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-navy">
      <aside
        className={`${sidebarOpen ? "w-60" : "w-16"} flex-shrink-0 bg-white dark:bg-navy-light border-r border-slate-200 dark:border-white/[0.06] flex flex-col transition-all duration-300 overflow-hidden`}
      >
        <div className="h-16 flex items-center px-4 border-b border-slate-200 dark:border-white/[0.06] gap-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center flex-shrink-0">
            <FaMobileAlt className="text-white text-lg" />
          </div>
          {sidebarOpen && (
            <span className="font-display font-bold text-lg text-slate-900 dark:text-white whitespace-nowrap">
              TechFix<span className="text-blue-500">Pro</span>
            </span>
          )}
        </div>
        {sidebarOpen && (
          <div className="mx-3 mt-4 mb-2 px-3 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Admin Panel
            </p>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-0.5 truncate">
              {user?.name}
            </p>
          </div>
        )}
        <nav className="flex-1 px-2 py-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:text-slate-900 dark:hover:text-white"
                }`
              }
            >
              <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                {item.icon}
              </span>
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="p-2 border-t border-slate-200 dark:border-white/[0.06] space-y-1">
          <NavLink
            to="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"
          >
            <span className="w-5 flex justify-center">
              <FaGlobe />
            </span>
            {sidebarOpen && <span>View Website</span>}
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
          >
            <span className="w-5 flex justify-center">
              <FaSignOutAlt />
            </span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-navy-light border-b border-slate-200 dark:border-white/[0.06] flex items-center justify-between px-6 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-white/[0.06] flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-all text-sm"
          >
            {sidebarOpen ? (
              <MdMenuOpen className="text-xl" />
            ) : (
              <MdMenu className="text-xl" />
            )}
          </button>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {user?.name}
              </p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
