import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SERVICE_OPTIONS = ['Screen Repair','Battery Replacement','Water Damage Repair','Software Fix','Data Recovery','Charging Port Repair','Other'];

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [form, setForm] = useState({ name:'', email:'', service:'', rating:0, message:'' });
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const load = () => { axios.get('/api/feedback').then(r => { setFeedbacks(r.data.data || []); setAvgRating(r.data.avgRating || 0); }); };
  useEffect(() => { load(); }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.rating) { setError('Please select a rating'); return; }
    setLoading(true); setError(null);
    try {
      const r = await axios.post('/api/feedback', form);
      setSuccess(r.data.message);
      setForm({ name:'', email:'', service:'', rating:0, message:'' });
      load();
    } catch (err) { setError(err.response?.data?.message || 'Submission failed'); }
    finally { setLoading(false); }
  };

  const dist = [5,4,3,2,1].map(r => ({
    r, count: feedbacks.filter(f => f.rating === r).length,
    pct: feedbacks.length ? Math.round((feedbacks.filter(f => f.rating === r).length / feedbacks.length) * 100) : 0
  }));

  return (
    <div className="bg-white dark:bg-navy min-h-screen">
      <section className="page-hero">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <span className="section-badge">Customer Reviews</span>
          <h1 className="font-display font-bold text-5xl text-slate-900 dark:text-white mb-6">What Our Customers Say</h1>
          <div className="flex items-center justify-center gap-5">
            <span className="font-display font-bold text-6xl text-amber-500">{avgRating || '—'}</span>
            <div>
              <div className="text-amber-400 text-2xl">{avgRating > 0 ? '★'.repeat(Math.round(avgRating)) + '☆'.repeat(5 - Math.round(avgRating)) : '☆☆☆☆☆'}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">Based on {feedbacks.length} reviews</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2 space-y-4">
            {feedbacks.length > 0 && (
              <div className="bg-slate-50 dark:bg-navy-light border border-slate-200 dark:border-white/[0.06] rounded-2xl p-6 mb-2">
                <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-4">Rating Breakdown</h3>
                {dist.map(d => (
                  <div key={d.r} className="flex items-center gap-3 mb-2.5">
                    <span className="text-sm text-slate-500 w-5 text-right">{d.r}★</span>
                    <div className="flex-1 h-2 bg-slate-200 dark:bg-navy rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-700" style={{width:`${d.pct}%`}} />
                    </div>
                    <span className="text-xs text-slate-400 w-4">{d.count}</span>
                  </div>
                ))}
              </div>
            )}

            {feedbacks.length === 0 ? (
              <div className="text-center py-20 text-slate-400"><p className="text-lg">Be the first to leave a review! 🌟</p></div>
            ) : feedbacks.map(fb => (
              <div key={fb._id} className="p-6 rounded-2xl bg-slate-50 dark:bg-navy-light border border-slate-200 dark:border-white/[0.06] hover:border-blue-200 dark:hover:border-blue-500/30 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-display font-bold text-white">{fb.name.charAt(0).toUpperCase()}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{fb.name}</p>
                    <p className="text-xs text-slate-400">{fb.service}</p>
                  </div>
                  <div className="text-amber-400">{'★'.repeat(fb.rating)}<span className="text-slate-300 dark:text-slate-600">{'★'.repeat(5-fb.rating)}</span></div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-3">{fb.message}</p>
                <p className="text-xs text-slate-400">{new Date(fb.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</p>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="sticky top-24 bg-slate-50 dark:bg-navy-light border border-slate-200 dark:border-white/[0.06] rounded-2xl p-7">
            <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-1">Share Your Experience</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Your feedback helps us improve</p>

            {success && <div className="mb-4 p-4 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-300 text-sm">✅ {success}</div>}
            {error && <div className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 text-sm">❌ {error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Your Rating *</label>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(n => (
                    <button type="button" key={n} onClick={() => setForm({...form,rating:n})} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
                      className={`text-3xl transition-all duration-150 hover:scale-110 ${n <= (hover || form.rating) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}>★</button>
                  ))}
                  {form.rating > 0 && <span className="ml-2 text-xs text-slate-500 font-medium">{['','Poor','Fair','Good','Great','Excellent'][form.rating]}</span>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Name *</label><input value={form.name} onChange={e => setForm({...form,name:e.target.value})} placeholder="Priya Patel" required className="input-field" /></div>
                <div><label className="label">Email *</label><input type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} placeholder="priya@example.com" required className="input-field" /></div>
              </div>
              <div>
                <label className="label">Service Used *</label>
                <select value={form.service} onChange={e => setForm({...form,service:e.target.value})} required className="input-field">
                  <option value="">-- Select Service --</option>
                  {SERVICE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Your Review *</label>
                <textarea value={form.message} onChange={e => setForm({...form,message:e.target.value})} placeholder="Tell us about your experience..." rows={5} required maxLength={1000} className="input-field resize-none" />
                <div className="text-right text-xs text-slate-400 mt-1">{form.message.length}/1000</div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 text-sm">
                {loading ? <><span className="spinner" /> Submitting...</> : 'Submit Review →'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
