import React, { useState, useEffect } from "react";
import axios from "axios";

const EMPTY = {
  title: "",
  description: "",
  price: "",
  duration: "1-2 hours",
  category: "screen-repair",
  icon: "🔧",
  isAvailable: true,
};
const CATEGORIES = [
  "screen-repair",
  "battery",
  "water-damage",
  "software",
  "data-recovery",
  "other",
];
const ICONS = ["📱", "🔋", "💧", "⚙️", "💾", "🔌", "🖥️", "🔇", "📷", "🔊"];

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const r = await axios.get("/api/services");
      setServices(r.data.data || []);
    } catch (e) {
      showMsg("error", e.response?.data?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4000);
  };

  const openAdd = () => {
    setForm(EMPTY);
    setEditId(null);
    setShowForm(true);
  };
  const openEdit = (s) => {
    setForm({ ...s, price: s.price.toString() });
    setEditId(s._id);
    setShowForm(true);
  };
  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm(EMPTY);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await axios.put(`/api/services/${editId}`, {
          ...form,
          price: Number(form.price),
        });
        showMsg("success", "Service updated!");
      } else {
        await axios.post("/api/services", {
          ...form,
          price: Number(form.price),
        });
        showMsg("success", "Service created!");
      }
      closeForm();
      load();
    } catch (e) {
      showMsg("error", e.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await axios.delete(`/api/services/${id}`);
      showMsg("success", "Deleted!");
      load();
    } catch (e) {
      showMsg("error", "Delete failed");
    }
  };

  const handleToggle = async (s) => {
    try {
      await axios.put(`/api/services/${s._id}`, {
        isAvailable: !s.isAvailable,
      });
      load();
    } catch (e) {
      showMsg("error", "Toggle failed");
    }
  };

  const handleSeed = async () => {
    if (
      !window.confirm("This will replace all services with defaults. Continue?")
    )
      return;
    setSeeding(true);
    try {
      await axios.post("/api/services/seed");
      showMsg("success", "Services seeded!");
      load();
    } catch (e) {
      showMsg("error", "Seed failed");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            Services
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {services.length} services total
          </p>
        </div>
        <div className="flex gap-3">
          {/* <button
            onClick={handleSeed}
            disabled={seeding}
            className="btn-outline text-sm py-2 px-4"
          >
            {seeding ? (
              <>
                <span className="spinner-dark" /> Seeding...
              </>
            ) : (
              "🌱 Seed Defaults"
            )}
          </button> */}
          <button onClick={openAdd} className="btn-primary text-sm py-2 px-4">
            + Add Service
          </button>
        </div>
      </div>

      {msg && (
        <div
          className={`p-4 rounded-xl text-sm border ${msg.type === "success" ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-300" : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300"}`}
        >
          {msg.type === "success" ? "✅" : "❌"} {msg.text}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-navy-light rounded-2xl w-full max-w-lg border border-slate-200 dark:border-white/[0.06] shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/[0.06]">
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                {editId ? "Edit Service" : "Add Service"}
              </h2>
              <button
                onClick={closeForm}
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/[0.06] flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={handleSave}
              className="p-6 space-y-4 max-h-[70vh] overflow-y-auto"
            >
              <div>
                <label className="label">Icon</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {ICONS.map((ic) => (
                    <button
                      type="button"
                      key={ic}
                      onClick={() => setForm({ ...form, icon: ic })}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${form.icon === ic ? "bg-blue-600 shadow-lg" : "bg-slate-100 dark:bg-navy hover:bg-slate-200 dark:hover:bg-white/10"}`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
                <input
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  className="admin-input"
                  placeholder="Or type emoji"
                />
              </div>
              <div>
                <label className="label">Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="admin-input"
                  placeholder="Screen Repair"
                />
              </div>
              <div>
                <label className="label">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                  rows={3}
                  className="admin-input resize-none"
                  placeholder="Describe the service..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Price (₹) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    required
                    min="0"
                    className="admin-input"
                    placeholder="1499"
                  />
                </div>
                <div>
                  <label className="label">Duration *</label>
                  <input
                    value={form.duration}
                    onChange={(e) =>
                      setForm({ ...form, duration: e.target.value })
                    }
                    required
                    className="admin-input"
                    placeholder="1-2 hours"
                  />
                </div>
              </div>
              <div>
                <label className="label">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="admin-input"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c.replace("-", " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="avail"
                  checked={form.isAvailable}
                  onChange={(e) =>
                    setForm({ ...form, isAvailable: e.target.checked })
                  }
                  className="w-4 h-4 accent-blue-600"
                />
                <label
                  htmlFor="avail"
                  className="text-sm text-slate-700 dark:text-slate-300"
                >
                  Available for booking
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="btn-outline flex-1 justify-center py-2.5 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex-1 justify-center py-2.5 text-sm"
                >
                  {saving ? (
                    <>
                      <span className="spinner" /> Saving...
                    </>
                  ) : editId ? (
                    "Update Service"
                  ) : (
                    "Create Service"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <span className="spinner-lg" />
        </div>
      ) : (
        <div className="admin-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-navy border-b border-slate-200 dark:border-white/[0.06]">
                <tr>
                  {[
                    "Service",
                    "Category",
                    "Price",
                    "Duration",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th key={h} className="table-th">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {services.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-16 text-slate-400"
                    >
                      No services yet. Add one or seed defaults.
                    </td>
                  </tr>
                ) : (
                  services.map((s) => (
                    <tr key={s._id} className="table-row">
                      <td className="table-td">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{s.icon}</span>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {s.title}
                            </p>
                            <p className="text-xs text-slate-400 max-w-xs truncate">
                              {s.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="table-td">
                        <span className="px-2.5 py-1 rounded-full text-xs bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300">
                          {s.category}
                        </span>
                      </td>
                      <td className="table-td font-display font-bold text-blue-600 dark:text-blue-400">
                        ₹{s.price}
                      </td>
                      <td className="table-td">{s.duration}</td>
                      <td className="table-td">
                        <button
                          onClick={() => handleToggle(s)}
                          className={`px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${s.isAvailable ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300" : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300"}`}
                        >
                          {s.isAvailable ? "● Active" : "○ Hidden"}
                        </button>
                      </td>
                      <td className="table-td">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEdit(s)}
                            className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(s._id, s.title)}
                            className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-500/20 transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
