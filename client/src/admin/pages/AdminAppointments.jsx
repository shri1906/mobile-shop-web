import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const STATUSES = [
  "all",
  "pending",
  "confirmed",
  "in-progress",
  "completed",
  "cancelled",
];

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { status: filter, search };
      const r = await axios.get("/api/appointments", { params });
      setAppointments(r.data.data || []);
      setTotal(r.data.total || 0);
    } catch (e) {
      toast.error("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => {
    const t = setTimeout(load, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [load]);

  const handleStatusChange = async (id, status) => {
    const toastId = toast.loading("Updating appointment...");

    try {
      await axios.put(`/api/appointments/${id}`, { status });

      toast.success("Appointment updated successfully.", {
        id: toastId,
      });

      load();

      if (selected?._id === id) {
        setSelected((prev) => ({ ...prev, status }));
      }
    } catch (e) {
      toast.error("Failed to update appointment.", {
        id: toastId,
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Appointment?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    const toastId = toast.loading("Deleting appointment...");

    try {
      await axios.delete(`/api/appointments/${id}`);

      toast.success("Appointment deleted successfully.", {
        id: toastId,
      });

      setSelected(null);
      load();
    } catch (e) {
      toast.error("Failed to delete appointment.", {
        id: toastId,
      });
    }
  };

  const statusColors = {
    pending: "amber",
    confirmed: "blue",
    "in-progress": "purple",
    completed: "green",
    cancelled: "red",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            Appointments
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {total} total appointments
          </p>
        </div>
      </div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, device..."
          className="admin-input max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${filter === s ? "bg-blue-600 text-white" : "bg-white dark:bg-navy-light border border-slate-200 dark:border-white/[0.06] text-slate-600 dark:text-slate-400 hover:border-blue-400"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6 items-start">
        {/* Table */}
        <div className="flex-1 admin-card overflow-hidden p-0 min-w-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-navy border-b border-slate-200 dark:border-white/[0.06]">
                <tr>
                  {[
                    "Customer",
                    "Service",
                    "Device",
                    "Date & Time",
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
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16">
                      <span className="spinner-lg" />
                    </td>
                  </tr>
                ) : appointments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-16 text-slate-400"
                    >
                      No appointments found.
                    </td>
                  </tr>
                ) : (
                  appointments.map((a) => (
                    <tr
                      key={a._id}
                      className={`table-row cursor-pointer ${selected?._id === a._id ? "bg-blue-50 dark:bg-blue-500/10" : ""}`}
                      onClick={() => setSelected(a)}
                    >
                      <td className="table-td">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {a.name}
                        </p>
                        <p className="text-xs text-slate-400">{a.email}</p>
                        <p className="text-xs text-slate-400">{a.phone}</p>
                      </td>
                      <td className="table-td">
                        {a.service?.icon} {a.service?.title}
                      </td>
                      <td className="table-td">{a.deviceModel}</td>
                      <td className="table-td">
                        <p>
                          {new Date(a.appointmentDate).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </p>
                        <p className="text-xs text-slate-400">
                          {a.appointmentTime}
                        </p>
                      </td>
                      <td className="table-td">
                        <select
                          value={a.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            handleStatusChange(a._id, e.target.value)
                          }
                          className={`text-xs font-bold rounded-full px-2.5 py-1 border-0 cursor-pointer uppercase tracking-wide focus:outline-none
                          ${
                            a.status === "pending"
                              ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300"
                              : a.status === "confirmed"
                                ? "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300"
                                : a.status === "in-progress"
                                  ? "bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300"
                                  : a.status === "completed"
                                    ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300"
                                    : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300"
                          }`}
                        >
                          {[
                            "pending",
                            "confirmed",
                            "in-progress",
                            "completed",
                            "cancelled",
                          ].map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td
                        className="table-td"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => handleDelete(a._id)}
                          className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 transition-all"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="w-80 flex-shrink-0 admin-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-slate-900 dark:text-white">
                Detail
              </h3>
              <button
                onClick={() => setSelected(null)}
                className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/[0.06] flex items-center justify-center text-slate-500 text-xs hover:bg-slate-200 transition-all"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-sm">
              {[
                ["Customer", selected.name],
                ["Email", selected.email],
                ["Phone", selected.phone],
                [
                  "Service",
                  `${selected.service?.icon || ""} ${selected.service?.title || "—"}`,
                ],
                ["Price", `₹${selected.service?.price || "—"}`],
                ["Device", selected.deviceModel],
                [
                  "Date",
                  new Date(selected.appointmentDate).toLocaleDateString(
                    "en-IN",
                    { weekday: "long", day: "numeric", month: "long" },
                  ),
                ],
                ["Time", selected.appointmentTime],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-2">
                  <span className="text-slate-500 dark:text-slate-400 flex-shrink-0">
                    {k}
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white text-right">
                    {v}
                  </span>
                </div>
              ))}
              <div>
                <p className="text-slate-500 dark:text-slate-400 mb-1">
                  Issue Description
                </p>
                <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-navy rounded-lg p-3 text-xs leading-relaxed">
                  {selected.issueDescription}
                </p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 mb-2">
                  Update Status
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "pending",
                    "confirmed",
                    "in-progress",
                    "completed",
                    "cancelled",
                  ].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(selected._id, s)}
                      className={`px-2 py-1.5 rounded-lg text-xs font-bold uppercase transition-all border ${selected.status === s ? "border-blue-500 bg-blue-600 text-white" : "border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-400 hover:border-blue-400"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleDelete(selected._id)}
                className="btn-danger w-full justify-center py-2.5 text-sm mt-2"
              >
                🗑 Delete Appointment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
