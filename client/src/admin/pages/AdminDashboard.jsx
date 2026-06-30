import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaCalendarAlt,
  FaHourglassHalf,
  FaCheckCircle,
  FaTools,
  FaCheckDouble,
  FaTimesCircle,
  FaStar,
} from "react-icons/fa";

import { MdDashboard, MdReviews } from "react-icons/md";

function StatCard({ label, value, icon, color, sub }) {
  return (
    <div className="admin-card">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${color}`}
        >
          {icon}
        </div>
      </div>
      <p className="text-3xl font-display font-bold text-slate-900 dark:text-white">
        {value}
      </p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [services, setServices] = useState([]);
  const [feedbackStats, setFeedbackStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [apptRes, svcRes, fbRes] = await Promise.all([
        axios.get("/api/appointments/stats"),
        axios.get("/api/services"),
        axios.get("/api/feedback/admin/all"),
      ]);
      setStats(apptRes.data.data);
      setServices(svcRes.data.data || []);
      const fbs = fbRes.data.data || [];
      const avg = fbs.length
        ? (fbs.reduce((s, f) => s + f.rating, 0) / fbs.length).toFixed(1)
        : 0;
      setFeedbackStats({
        total: fbs.length,
        avg,
        pending: fbs.filter((f) => !f.isApproved).length,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedAll = async () => {
    setSeeding(true);
    setSeedMsg("");
    try {
      await axios.post("/api/services/seed");
      await axios.post("/api/feedback/seed");
      setSeedMsg("✅ Services & feedback seeded!");
      loadAll();
    } catch (e) {
      setSeedMsg("❌ Seed failed: " + (e.response?.data?.message || e.message));
    } finally {
      setSeeding(false);
    }
  };

  const handleSeedAdmin = async () => {
    try {
      const res = await axios.post("/api/auth/seed-admin");
      setSeedMsg("✅ " + res.data.message + " | email: " + res.data.email);
    } catch (e) {
      setSeedMsg("❌ " + (e.response?.data?.message || e.message));
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <span className="spinner-lg" />
      </div>
    );

  const statusCards = [
    {
      label: "Total Appointments",
      value: stats?.total ?? 0,
      icon: <FaCalendarAlt className="text-blue-600 text-2xl" />,
      color: "bg-blue-100 dark:bg-blue-500/20",
    },
    {
      label: "Pending",
      value: stats?.pending ?? 0,
      icon: <FaHourglassHalf className="text-amber-500 text-2xl" />,
      color: "bg-amber-100 dark:bg-amber-500/20",
      sub: "Awaiting confirmation",
    },
    {
      label: "Confirmed",
      value: stats?.confirmed ?? 0,
      icon: <FaCheckCircle className="text-blue-600 text-2xl" />,
      color: "bg-blue-100 dark:bg-blue-500/20",
      sub: "Ready to service",
    },
    {
      label: "In Progress",
      value: stats?.inProgress ?? 0,
      icon: <FaTools className="text-purple-600 text-2xl" />,
      color: "bg-purple-100 dark:bg-purple-500/20",
      sub: "Currently repairing",
    },
    {
      label: "Completed",
      value: stats?.completed ?? 0,
      icon: <FaCheckDouble className="text-green-600 text-2xl" />,
      color: "bg-green-100 dark:bg-green-500/20",
      sub: "Successfully repaired",
    },
    {
      label: "Cancelled",
      value: stats?.cancelled ?? 0,
      icon: <FaTimesCircle className="text-red-600 text-2xl" />,
      color: "bg-red-100 dark:bg-red-500/20",
    },
    {
      label: "Active Services",
      value: services.length,
      icon: <FaTools className="text-indigo-600 text-2xl" />,
      color: "bg-indigo-100 dark:bg-indigo-500/20",
    },
    {
      label: "Average Rating",
      value: feedbackStats?.avg ?? 0,
      icon: <FaStar className="text-yellow-500 text-2xl" />,
      color: "bg-yellow-100 dark:bg-yellow-500/20",
      sub: `${feedbackStats?.total ?? 0} Reviews`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <MdDashboard className="text-3xl text-blue-600" />
            <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
              Dashboard
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Welcome back! Here's what's happening.
          </p>
        </div>
        {/* <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSeedAdmin}
            className="btn-outline text-sm py-2 px-4"
          >
            🔑 Seed Admin
          </button>
          <button
            onClick={handleSeedAll}
            disabled={seeding}
            className="btn-primary text-sm py-2 px-4"
          >
            {seeding ? (
              <>
                <span className="spinner" /> Seeding...
              </>
            ) : (
              "🌱 Seed Demo Data"
            )}
          </button>
        </div> */}
      </div>

      {seedMsg && (
        <div
          className={`p-4 rounded-xl text-sm border ${seedMsg.startsWith("✅") ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-300" : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300"}`}
        >
          {seedMsg}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statusCards.map((c, i) => (
          <StatCard key={i} {...c} />
        ))}
      </div>

      {/* Recent Appointments */}
      {stats?.recentAppointments?.length > 0 && (
        <div className="admin-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-slate-900 dark:text-white">
              Recent Appointments
            </h2>
            <Link
              to="/admin/appointments"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/[0.06]">
                  {["Customer", "Service", "Date", "Status"].map((h) => (
                    <th key={h} className="table-th">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentAppointments.map((a) => (
                  <tr key={a._id} className="table-row">
                    <td className="table-td font-medium text-slate-900 dark:text-white">
                      {a.name}
                      <div className="text-xs text-slate-400">{a.email}</div>
                    </td>
                    <td className="table-td">{a.service?.title || "—"}</td>
                    <td className="table-td">
                      {new Date(a.appointmentDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td className="table-td">
                      <span className={`status-${a.status}`}>{a.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            to: "/admin/services",
            icon: <FaTools className="text-4xl text-blue-600" />,
            label: "Manage Services",
            desc: `${services.length} services active`,
          },
          {
            to: "/admin/appointments",
            icon: <FaCalendarAlt className="text-4xl text-green-600" />,
            label: "Manage Appointments",
            desc: `${stats?.pending ?? 0} pending`,
          },
          {
            to: "/admin/feedback",
            icon: <FaStar className="text-4xl text-yellow-500" />,
            label: "Manage Reviews",
            desc: `${feedbackStats?.total ?? 0} total reviews`,
          },
        ].map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="admin-card hover:border-blue-300 dark:hover:border-blue-500/40 hover:-translate-y-0.5 transition-all block"
          >
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-navy flex items-center justify-center">
                {l.icon}
              </div>
            </div>
            <p className="font-display font-semibold text-slate-900 dark:text-white">
              {l.label}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {l.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
