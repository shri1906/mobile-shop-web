import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const [services, setServices] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    axios.get('/api/services').then(res => setServices((res.data.data || []).filter(s => s.isAvailable).slice(0,3)));
    axios.get('/api/feedback').then(res => setFeedbacks(res.data.data?.slice(0,3) || []));
  }, []);

  const stats = [
    { number: '5000+', label: 'Devices Repaired' },
    { number: '4.9★', label: 'Average Rating' },
    { number: '30min', label: 'Fastest Repair' },
    { number: '6mo', label: 'Warranty' },
  ];

  const features = [
    { icon: '🔧', title: 'Certified Technicians', desc: 'Our team holds certifications from major brands with years of hands-on experience.' },
    { icon: '⚡', title: 'Fast Turnaround', desc: 'Most repairs completed within 1-3 hours. We know your phone is essential.' },
    { icon: '🛡️', title: '6-Month Warranty', desc: 'Every repair comes with a 6-month warranty on parts and labor. No surprises.' },
    { icon: '💰', title: 'Transparent Pricing', desc: 'No hidden charges. Get an upfront quote before we start any work.' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-white dark:from-navy dark:via-navy dark:to-navy-light">
        <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.07) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(245,158,11,0.05) 0%, transparent 50%)'}} />
        <div className="max-w-6xl mx-auto px-6 py-20">
          <span className="section-badge">⚡ Same Day Repairs Available</span>
          <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-tight mb-6 text-slate-900 dark:text-white">
            Your Phone Deserves<br /><span className="gradient-text">Expert Care</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mb-10 leading-relaxed">
            Professional mobile repair services for all brands. Screen, battery, water damage, software — fixed with a 6-month warranty.
          </p>
          <div className="flex flex-wrap gap-4 mb-10">
            <Link to="/appointment" className="btn-primary text-base px-8 py-4">Book a Repair →</Link>
            <Link to="/services" className="btn-outline text-base px-8 py-4">View Services</Link>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-slate-500 dark:text-slate-400 font-medium">
            {['✓ OEM Parts', '✓ 6-Month Warranty', '✓ No Fix, No Fee'].map(t => <span key={t}>{t}</span>)}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-100 dark:bg-navy-light border-y border-slate-200 dark:border-white/[0.06] py-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="font-display font-bold text-3xl text-blue-600 dark:text-blue-400 mb-1">{s.number}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-white dark:bg-navy">
        <div className="max-w-6xl mx-auto px-6">
          <span className="section-badge">What We Do</span>
          <h2 className="font-display font-bold text-4xl text-slate-900 dark:text-white mb-3">Our Repair Services</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-12">Trusted by thousands of customers across the city</p>
          {services.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <p>No services available yet.</p>
              <Link to="/login" className="text-blue-500 hover:underline text-sm mt-2 inline-block">Admin: login to seed services →</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {services.map(s => (
                <div key={s._id} className="service-card">
                  <div className="text-5xl mb-5">{s.icon}</div>
                  <h3 className="font-display font-semibold text-xl text-slate-900 dark:text-white mb-3">{s.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed flex-1 mb-5">{s.description}</p>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-display font-bold text-2xl text-blue-600 dark:text-blue-400">₹{s.price}</span>
                    <span className="text-xs text-slate-400">⏱ {s.duration}</span>
                  </div>
                  <Link to="/appointment" className="btn-outline justify-center w-full py-2.5 text-sm">Book Now</Link>
                </div>
              ))}
            </div>
          )}
          <div className="text-center"><Link to="/services" className="btn-primary">See All Services →</Link></div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-20 bg-slate-50 dark:bg-navy-light">
        <div className="max-w-6xl mx-auto px-6">
          <span className="section-badge">Why Choose Us</span>
          <h2 className="font-display font-bold text-4xl text-slate-900 dark:text-white mb-12">Repair Done Right</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="text-center p-8 rounded-2xl bg-white dark:bg-navy border border-slate-200 dark:border-white/[0.06] hover:border-blue-200 dark:hover:border-blue-500/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-3">{f.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      {feedbacks.length > 0 && (
        <section className="py-20 bg-white dark:bg-navy">
          <div className="max-w-6xl mx-auto px-6">
            <span className="section-badge">Customer Love</span>
            <h2 className="font-display font-bold text-4xl text-slate-900 dark:text-white mb-12">What People Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {feedbacks.map(fb => (
                <div key={fb._id} className="service-card">
                  <div className="text-amber-400 text-lg mb-3">{'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}</div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed flex-1 italic mb-6">"{fb.message}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-display font-bold text-white">{fb.name.charAt(0)}</div>
                    <div>
                      <div className="font-semibold text-sm text-slate-900 dark:text-white">{fb.name}</div>
                      <div className="text-xs text-slate-400">{fb.service}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center"><Link to="/feedback" className="btn-outline">Read All Reviews →</Link></div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800">
        <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(circle at 50%, rgba(255,255,255,0.06), transparent 60%)'}} />
        <div className="max-w-6xl mx-auto px-6 text-center relative">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">Ready to Get Your Phone Fixed?</h2>
          <p className="text-blue-100 text-lg mb-8">Book an appointment online and get a free diagnostic check</p>
          <Link to="/appointment" className="btn-amber text-base px-10 py-4">Book Free Diagnostic →</Link>
        </div>
      </section>
    </div>
  );
}
