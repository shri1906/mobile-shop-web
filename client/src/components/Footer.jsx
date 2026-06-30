import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaMobileAlt,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const socials = [
  {
    icon: <FaFacebookF />,
    href: "https://facebook.com",
  },
  {
    icon: <FaInstagram />,
    href: "https://instagram.com",
  },
  {
    icon: <FaXTwitter />,
    href: "https://x.com",
  },
  {
    icon: <FaYoutube />,
    href: "https://youtube.com",
  },
];

function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-[#080E1A] border-t border-white/[0.06] pt-16 pb-0">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="font-display font-bold text-2xl text-white mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                  <FaMobileAlt className="text-white text-xl" />
                </div>

                <div className="font-display font-bold text-2xl text-white">
                  TechFix<span className="text-blue-500">Pro</span>
                </div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Your trusted mobile repair experts. Fast, reliable, and affordable
              repairs for all smartphone brands.
            </p>
            <div className="flex gap-3">
              {socials.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-blue-600 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">
              Services
            </h4>
            <ul className="space-y-2.5">
              {[
                "Screen Repair",
                "Battery Replacement",
                "Water Damage",
                "Data Recovery",
                "Software Fix",
              ].map((s) => (
                <li key={s}>
                  <Link
                    to="/services"
                    className="text-slate-400 hover:text-blue-400 text-sm transition-colors"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                ["/", "Home"],
                ["/services", "All Services"],
                ["/appointment", "Book Appointment"],
                ["/feedback", "Customer Reviews"],
              ].map(([path, label]) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="text-slate-400 hover:text-blue-400 text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">
              Contact Us
            </h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-blue-500" />
                123 Tech Street, Dehradun
              </li>

              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-green-500" />
                +91 98765 43210
              </li>

              <li className="flex items-center gap-3">
                <FaEnvelope className="text-red-500" />
                hello@techfixpro.in
              </li>

              <li className="flex items-center gap-3">
                <FaClock className="text-yellow-500" />
                Mon – Sat : 9:00 AM – 8:00 PM
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.06] py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TechFix Pro. All rights reserved.</p>
          <p>Built with MERN Stack ❤️</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
