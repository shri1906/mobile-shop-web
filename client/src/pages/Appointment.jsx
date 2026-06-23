import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
];

const inputCls = "input-field";
const labelCls = "label";

function Appointment() {
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    serviceId: searchParams.get("service") || "",
    deviceModel: "",
    issueDescription: "",
    appointmentDate: "",
    appointmentTime: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [trackEmail, setTrackEmail] = useState("");
  const [myAppointments, setMyAppointments] = useState([]);
  const [tracking, setTracking] = useState(false);

  useEffect(() => {
    axios.get("/api/services").then((res) => setServices(res.data.data || []));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.post("/api/appointments", form);
      setSuccess(res.data.message);
      setForm({
        name: "",
        email: "",
        phone: "",
        serviceId: "",
        deviceModel: "",
        issueDescription: "",
        appointmentDate: "",
        appointmentTime: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  const trackAppointments = async (e) => {
    e.preventDefault();
    setTracking(true);
    try {
      const res = await axios.get(`/api/appointments/my/${trackEmail}`);
      setMyAppointments(res.data.data || []);
    } catch {
      setMyAppointments([]);
    } finally {
      setTracking(false);
    }
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  const statusCls = (s) => `status-${s}`;

  return (
    <div className="bg-white dark:bg-navy min-h-screen">
      {/* Hero */}
      <section className="page-hero">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <span className="section-badge">Schedule Repair</span>
          <h1 className="font-display font-bold text-5xl text-slate-900 dark:text-white mb-3">
            Book an Appointment
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Fill out the form below and we'll confirm within 2 hours
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Form */}
          <div className="lg:col-span-2 bg-slate-50 dark:bg-navy-light border border-slate-200 dark:border-white/[0.06] rounded-2xl p-8">
            <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-6">
              Repair Request
            </h2>

            {success && (
              <div className="mb-5 p-4 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-300 text-sm">
                ✅ {success}
              </div>
            )}
            {error && (
              <div className="mb-5 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 text-sm">
                ❌ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>Your Name *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Rahul Sharma"
                    required
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Phone Number *</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    required
                    className={inputCls}
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>Email Address *</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="rahul@example.com"
                  required
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Select Service *</label>
                <select
                  name="serviceId"
                  value={form.serviceId}
                  onChange={handleChange}
                  required
                  className={inputCls}
                >
                  <option value="">-- Choose a Service --</option>
                  {services.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.icon} {s.title} — ₹{s.price}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Device Model *</label>
                <input
                  name="deviceModel"
                  value={form.deviceModel}
                  onChange={handleChange}
                  placeholder="e.g. iPhone 14, Samsung S23"
                  required
                  className={inputCls}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>Preferred Date *</label>
                  <input
                    name="appointmentDate"
                    type="date"
                    value={form.appointmentDate}
                    onChange={handleChange}
                    min={minDateStr}
                    required
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Preferred Time *</label>
                  <select
                    name="appointmentTime"
                    value={form.appointmentTime}
                    onChange={handleChange}
                    required
                    className={inputCls}
                  >
                    <option value="">-- Select Time --</option>
                    {timeSlots.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>Describe the Issue *</label>
                <textarea
                  name="issueDescription"
                  value={form.issueDescription}
                  onChange={handleChange}
                  placeholder="Tell us what's wrong with your device..."
                  rows={4}
                  required
                  className={inputCls}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-4 text-base disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="spinner" /> Booking...
                  </>
                ) : (
                  "Confirm Appointment →"
                )}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-5">
            {/* Steps */}
            <div className="bg-slate-50 dark:bg-navy-light border border-slate-200 dark:border-white/[0.06] rounded-2xl p-6">
              <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-4">
                📋 What to Expect
              </h3>
              <ol className="space-y-3">
                {[
                  ["Book Online", "Fill the form"],
                  ["Get Confirmed", "We'll call you within 2hrs"],
                  ["Drop Your Device", "Or we can pick up"],
                  ["Get It Fixed", "Same day for most repairs"],
                  ["Pick Up", "Or we deliver it back"],
                ].map(([title, desc], i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      <strong className="text-slate-900 dark:text-white">
                        {title}
                      </strong>{" "}
                      — {desc}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Tracker */}
            <div className="bg-slate-50 dark:bg-navy-light border border-slate-200 dark:border-white/[0.06] rounded-2xl p-6">
              <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-4">
                🔍 Track Appointment
              </h3>
              <form onSubmit={trackAppointments} className="space-y-3">
                <div>
                  <label className={labelCls}>Your Email</label>
                  <input
                    type="email"
                    value={trackEmail}
                    onChange={(e) => setTrackEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className={inputCls}
                  />
                </div>
                <button
                  type="submit"
                  disabled={tracking}
                  className="btn-outline w-full justify-center py-2.5 text-sm"
                >
                  {tracking ? (
                    <>
                      <span
                        className="spinner border-blue-500"
                        style={{ borderTopColor: "transparent" }}
                      />{" "}
                      Searching...
                    </>
                  ) : (
                    "Find Appointments"
                  )}
                </button>
              </form>
              {myAppointments.length > 0 && (
                <div className="mt-4 space-y-3">
                  {myAppointments.map((a) => (
                    <div
                      key={a._id}
                      className="p-3 rounded-xl bg-white dark:bg-navy border border-slate-200 dark:border-white/[0.06]"
                    >
                      <div className="font-semibold text-sm text-slate-900 dark:text-white">
                        {a.service?.title}
                      </div>
                      <div className="text-xs text-slate-400 mt-1 mb-2">
                        {new Date(a.appointmentDate).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short", year: "numeric" },
                        )}{" "}
                        at {a.appointmentTime}
                      </div>
                      <span className={statusCls(a.status)}>{a.status}</span>
                    </div>
                  ))}
                </div>
              )}
              {myAppointments.length === 0 && trackEmail && !tracking && (
                <p className="text-xs text-slate-400 mt-3">
                  No appointments found for this email.
                </p>
              )}
            </div>

            {/* Call CTA */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-blue-600/20 to-blue-900/20 border border-blue-500/20">
              <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-2">
                📞 Quick Contact
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Prefer to call? We're available Mon-Sat, 9AM - 8PM
              </p>
              <a
                href="tel:+919876543210"
                className="btn-primary w-full justify-center py-3 text-sm"
              >
                Call: +91 98765 43210
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Appointment;
