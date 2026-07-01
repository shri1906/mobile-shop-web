import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaTools, FaChargingStation } from "react-icons/fa";

import {
  MdPhoneIphone,
  MdBatteryChargingFull,
  MdWaterDrop,
  MdBuild,
  MdCloudDownload,
} from "react-icons/md";

const CATEGORIES = [
  { id: "all", label: "All Services" },
  { id: "screen-repair", label: "Screen" },
  { id: "battery", label: "Battery" },
  { id: "water-damage", label: "Water Damage" },
  { id: "software", label: "Software" },
  { id: "data-recovery", label: "Data Recovery" },
  { id: "other", label: "Other" },
];

const serviceIcons = {
  screen: <MdPhoneIphone className="text-blue-600 text-5xl" />,
  battery: <MdBatteryChargingFull className="text-green-600 text-5xl" />,
  water: <MdWaterDrop className="text-cyan-500 text-5xl" />,
  software: <MdBuild className="text-purple-600 text-5xl" />,
  recovery: <MdCloudDownload className="text-orange-500 text-5xl" />,
  charging: <FaChargingStation className="text-red-500 text-5xl" />,
  repair: <FaTools className="text-blue-600 text-5xl" />,
};

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    axios
      .get("/api/services")
      .then((res) => {
        setServices(res.data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all"
      ? services.filter((s) => s.isAvailable)
      : services.filter((s) => s.category === filter && s.isAvailable);

  return (
    <div className="bg-white dark:bg-navy min-h-screen">
      <section className="page-hero">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <span className="section-badge">Expert Repairs</span>
          <h1 className="font-display font-bold text-5xl text-slate-900 dark:text-white mb-3">
            Our Services
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Professional repairs for every smartphone issue
          </p>
        </div>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                filter === cat.id
                  ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/25"
                  : "bg-transparent border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-4 py-24 text-slate-400">
            <span className="spinner-lg" />
            <p>Loading...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-slate-400">
            <p className="text-lg">No services available in this category.</p>
            <Link
              to="/login"
              className="text-blue-500 hover:underline text-sm mt-2 inline-block"
            >
              Admin: login to add services →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((s) => (
              <div
                key={s._id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-7 rounded-2xl bg-slate-50 dark:bg-navy-light border border-slate-200 dark:border-white/[0.06] hover:border-blue-300 dark:hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
              >
                <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                  {serviceIcons[s.icon] || serviceIcons.repair}
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-xl text-slate-900 dark:text-white mb-2">
                    {s.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-3">
                    {s.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      `⏱ ${s.duration}`,
                      `🏷 ${s.category.replace("-", " ")}`,
                      "🛡 6-mo warranty",
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs bg-white dark:bg-navy border border-slate-200 dark:border-white/[0.06] text-slate-500 dark:text-slate-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 flex-shrink-0 w-full sm:w-auto">
                  <span className="font-display font-bold text-3xl text-blue-600 dark:text-blue-400">
                    ₹{s.price}
                  </span>
                  <Link
                    to={`/appointment?service=${s._id}`}
                    className="btn-primary py-2.5 px-5 text-sm"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="py-16 bg-slate-50 dark:bg-navy-light border-t border-slate-200 dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="font-display font-bold text-3xl text-slate-900 dark:text-white mb-10">
            We Repair All Brands
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Apple",
              "Samsung",
              "OnePlus",
              "Xiaomi",
              "Oppo",
              "Vivo",
              "Realme",
              "Google",
            ].map((brand) => (
              <div
                key={brand}
                className="px-6 py-3 rounded-full bg-white dark:bg-navy border border-slate-200 dark:border-white/[0.08] text-sm font-semibold text-slate-600 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-500/40 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 cursor-default"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
