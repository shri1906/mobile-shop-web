import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const categories = [
  { id: "all", label: "All Services" },
  { id: "screen-repair", label: "Screen" },
  { id: "battery", label: "Battery" },
  { id: "water-damage", label: "Water Damage" },
  { id: "software", label: "Software" },
  { id: "data-recovery", label: "Data Recovery" },
  { id: "other", label: "Other" },
];

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    axios
      .get("/api/services/seed")
      .then(() =>
        axios.get("/api/services").then((res) => {
          setServices(res.data.data || []);
          setLoading(false);
        }),
      )
      .catch(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all" ? services : services.filter((s) => s.category === filter);

  return (
    <div className="bg-white dark:bg-navy min-h-screen">
      {/* Hero */}
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

      {/* Filter + List */}
      <section className="py-16 max-w-6xl mx-auto px-6">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-200
                ${
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
            <span
              className="spinner border-blue-500 border-t-transparent"
              style={{ borderTopColor: "transparent" }}
            />
            <p>Loading services...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((service) => (
              <div
                key={service._id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-7 rounded-2xl
                           bg-slate-50 dark:bg-navy-light border border-slate-200 dark:border-white/[0.06]
                           hover:border-blue-300 dark:hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/5
                           transition-all duration-300"
              >
                <div className="text-5xl w-16 text-center flex-shrink-0">
                  {service.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-xl text-slate-900 dark:text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-3">
                    {service.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      `⏱ ${service.duration}`,
                      `🏷 ${service.category.replace("-", " ")}`,
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
                    ₹{service.price}
                  </span>
                  <Link
                    to={`/appointment?service=${service._id}`}
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

      {/* Brands */}
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
                className="px-6 py-3 rounded-full bg-white dark:bg-navy border border-slate-200 dark:border-white/[0.08]
                           text-sm font-semibold text-slate-600 dark:text-slate-300
                           hover:border-blue-300 dark:hover:border-blue-500/40 hover:text-blue-600 dark:hover:text-blue-400
                           transition-all duration-200 cursor-default"
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

export default Services;
