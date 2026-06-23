import React from "react";
import { Link } from "react-router-dom";

function ServiceCard({ service }) {
  return (
    <div className="service-card">
      <div className="text-5xl mb-5">{service.icon}</div>
      <h3 className="font-display font-semibold text-xl text-slate-900 dark:text-white mb-3">
        {service.title}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed flex-1 mb-5">
        {service.description}
      </p>
      <div className="flex items-center justify-between mb-5">
        <span className="font-display font-bold text-2xl text-blue-600 dark:text-blue-400">
          ₹{service.price}
        </span>
        <span className="text-xs text-slate-400">⏱ {service.duration}</span>
      </div>
      <Link
        to={`/appointment?service=${service._id}`}
        className="btn-outline justify-center w-full py-2.5 text-sm"
      >
        Book Now
      </Link>
    </div>
  );
}

export default ServiceCard;
