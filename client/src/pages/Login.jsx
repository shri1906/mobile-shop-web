import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-navy dark:to-navy-light px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-display font-bold text-slate-900 dark:text-white">
            <span>📱</span>TechFix<span className="text-blue-500">Pro</span>
          </Link>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Sign in to your account</p>
        </div>

        <div className="bg-white dark:bg-navy-light border border-slate-200 dark:border-white/[0.06] rounded-2xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-black/30">
          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 text-sm">
              ❌ {error}
            </div>
          )}

          <div className="mb-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-sm">
            <p className="font-semibold text-blue-700 dark:text-blue-300 mb-1">🔑 Admin credentials</p>
            <p className="text-blue-600 dark:text-blue-400">Email: <code>admin@techfixpro.in</code></p>
            <p className="text-blue-600 dark:text-blue-400">Password: <code>admin123</code></p>
            <p className="text-xs text-blue-500 dark:text-blue-500 mt-1">Hit <code>/api/auth/seed-admin</code> once to create admin</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@techfixpro.in" required className="input-field" />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required className="input-field" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4">
              {loading ? <><span className="spinner" /> Signing in...</> : 'Sign In →'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline">← Back to website</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
