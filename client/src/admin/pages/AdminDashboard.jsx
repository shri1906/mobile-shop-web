import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function StatCard({ label, value, icon, color, sub }) {
  return (
    <div className="admin-card">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}
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
      icon: "📅",
      color: "bg-blue-100 dark:bg-blue-500/20",
    },
    {
      label: "Pending",
      value: stats?.pending ?? 0,
      icon: "⏳",
      color: "bg-amber-100 dark:bg-amber-500/20",
      sub: "Awaiting confirmation",
    },
    {
      label: "Confirmed",
      value: stats?.confirmed ?? 0,
      icon: "✅",
      color: "bg-blue-100 dark:bg-blue-500/20",
      sub: "Ready to service",
    },
    {
      label: "In Progress",
      value: stats?.inProgress ?? 0,
      icon: "🔧",
      color: "bg-purple-100 dark:bg-purple-500/20",
      sub: "Currently being repaired",
    },
    {
      label: "Completed",
      value: stats?.completed ?? 0,
      icon: "🎉",
      color: "bg-green-100 dark:bg-green-500/20",
      sub: "Successfully repaired",
    },
    {
      label: "Cancelled",
      value: stats?.cancelled ?? 0,
      icon: "❌",
      color: "bg-red-100 dark:bg-red-500/20",
    },
    {
      label: "Active Services",
      value: services.length,
      icon: "🛠️",
      color: "bg-indigo-100 dark:bg-indigo-500/20",
    },
    {
      label: "Avg Rating",
      value: feedbackStats?.avg ?? 0,
      icon: "⭐",
      color: "bg-amber-100 dark:bg-amber-500/20",
      sub: `${feedbackStats?.total ?? 0} total reviews`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            Dashboard
          </h1>
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
            icon: "🔧",
            label: "Manage Services",
            desc: `${services.length} services active`,
          },
          {
            to: "/admin/appointments",
            icon: "📅",
            label: "Manage Appointments",
            desc: `${stats?.pending ?? 0} pending`,
          },
          {
            to: "/admin/feedback",
            icon: "⭐",
            label: "Manage Reviews",
            desc: `${feedbackStats?.total ?? 0} total reviews`,
          },
        ].map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="admin-card hover:border-blue-300 dark:hover:border-blue-500/40 hover:-translate-y-0.5 transition-all block"
          >
            <div className="text-3xl mb-3">{l.icon}</div>
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
