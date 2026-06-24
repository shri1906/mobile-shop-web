import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState(null);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    load();
  }, [filter, search]);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter === "approved") params.approved = true;
      if (filter === "pending") params.approved = false;
      if (search) params.search = search;
      const r = await axios.get("/api/feedback/admin/all", { params });
      setFeedbacks(r.data.data || []);
    } catch (e) {
      showMsg("error", "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4000);
  };

  const handleToggleApproval = async (fb) => {
    try {
      await axios.put(`/api/feedback/${fb._id}`, {
        isApproved: !fb.isApproved,
      });
      showMsg(
        "success",
        fb.isApproved ? "Review hidden" : "Review approved & published",
      );
      load();
    } catch (e) {
      showMsg("error", "Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await axios.delete(`/api/feedback/${id}`);
      showMsg("success", "Deleted!");
      load();
    } catch (e) {
      showMsg("error", "Delete failed");
    }
  };

  const handleSeed = async () => {
    if (
      !window.confirm(
        "Seed sample reviews? This replaces all existing reviews.",
      )
    )
      return;
    setSeeding(true);
    try {
      await axios.post("/api/feedback/seed");
      showMsg("success", "Sample reviews seeded!");
      load();
    } catch (e) {
      showMsg("error", "Seed failed");
    } finally {
      setSeeding(false);
    }
  };

  const avgRating = feedbacks.length
    ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(
        1,
      )
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            Reviews & Feedback
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {feedbacks.length} reviews · Avg rating:{" "}
            <span className="text-amber-500 font-semibold">★ {avgRating}</span>
          </p>
        </div>
        <button
          onClick={handleSeed}
          disabled={seeding}
          className="btn-outline text-sm py-2 px-4"
        >
          {seeding ? (
            <>
              <span className="spinner-dark" /> Seeding...
            </>
          ) : (
            "🌱 Seed Samples"
          )}
        </button>
      </div>

      {msg && (
        <div
          className={`p-4 rounded-xl text-sm border ${msg.type === "success" ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-300" : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300"}`}
        >
          {msg.type === "success" ? "✅" : "❌"} {msg.text}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search reviews..."
          className="admin-input max-w-xs"
        />
        <div className="flex gap-2">
          {["all", "approved", "pending"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${filter === f ? "bg-blue-600 text-white" : "bg-white dark:bg-navy-light border border-slate-200 dark:border-white/[0.06] text-slate-600 dark:text-slate-400 hover:border-blue-400"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Reviews",
            value: feedbacks.length,
            color: "text-blue-600 dark:text-blue-400",
          },
          {
            label: "Published",
            value: feedbacks.filter((f) => f.isApproved).length,
            color: "text-green-600 dark:text-green-400",
          },
          {
            label: "Hidden",
            value: feedbacks.filter((f) => !f.isApproved).length,
            color: "text-red-600 dark:text-red-400",
          },
        ].map((s, i) => (
          <div key={i} className="admin-card text-center">
            <p className={`text-3xl font-display font-bold ${s.color}`}>
              {s.value}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Reviews Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <span className="spinner-lg" />
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="admin-card text-center py-16 text-slate-400">
          No reviews found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {feedbacks.map((fb) => (
            <div
              key={fb._id}
              className={`admin-card relative transition-all ${!fb.isApproved ? "opacity-60 border-dashed" : ""}`}
            >
              {/* Status badge */}
              <div className="absolute top-4 right-4">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold ${fb.isApproved ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300" : "bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-slate-400"}`}
                >
                  {fb.isApproved ? "● Published" : "○ Hidden"}
                </span>
              </div>

              {/* Stars */}
              <div className="text-amber-400 mb-2">
                {"★".repeat(fb.rating)}
                <span className="text-slate-300 dark:text-slate-600">
                  {"★".repeat(5 - fb.rating)}
                </span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold font-display text-sm flex-shrink-0">
                  {fb.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">
                    {fb.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {fb.email} · {fb.service}
                  </p>
                </div>
              </div>

              {/* Message */}
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                {fb.message}
              </p>

              {/* Date */}
              <p className="text-xs text-slate-400 mb-4">
                {new Date(fb.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleApproval(fb)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${fb.isApproved ? "bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300 hover:bg-slate-200" : "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-300 hover:bg-green-100"}`}
                >
                  {fb.isApproved ? "👁 Hide Review" : "✅ Approve & Publish"}
                </button>
                <button
                  onClick={() => handleDelete(fb._id)}
                  className="px-4 py-2 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
