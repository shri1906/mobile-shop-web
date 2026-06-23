import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-[#080E1A] border-t border-white/[0.06] pt-16 pb-0">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="font-display font-bold text-2xl text-white mb-4">
              📱 TechFix<span className="text-blue-500">Pro</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Your trusted mobile repair experts. Fast, reliable, and affordable repairs for all smartphone brands.
            </p>
            <div className="flex gap-2">
              {['FB', 'IG', 'TW', 'YT'].map(s => (
                <a key={s} href="#!"
                  className="w-9 h-9 bg-white/[0.06] hover:bg-blue-600 rounded-lg flex items-center justify-center text-slate-400 hover:text-white text-xs font-bold transition-all duration-200">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2.5">
              {['Screen Repair', 'Battery Replacement', 'Water Damage', 'Data Recovery', 'Software Fix'].map(s => (
                <li key={s}>
                  <Link to="/services" className="text-slate-400 hover:text-blue-400 text-sm transition-colors">{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[['/', 'Home'], ['/services', 'All Services'], ['/appointment', 'Book Appointment'], ['/feedback', 'Customer Reviews']].map(([path, label]) => (
                <li key={path}>
                  <Link to={path} className="text-slate-400 hover:text-blue-400 text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>📍 123 Tech Street, Dehradun</li>
              <li>📞 +91 98765 43210</li>
              <li>✉️ hello@techfixpro.in</li>
              <li>🕐 Mon-Sat: 9AM – 8PM</li>
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
