import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Role } from '../types';
import {
  Recycle,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff,
  User,
  Truck,
  Layers,
  Factory,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, getDashboardPathForRole } = useAuth();
  const { setNotification, setRole } = useApp();
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Quick Demo Logins for Instant Evaluation
  const demoAccounts = [
    { role: 'citizen' as Role, email: 'ananya.sharma@example.com', name: 'Citizen Demo', icon: User },
    { role: 'collector' as Role, email: 'ramesh.collector@example.com', name: 'Collector Demo', icon: Truck },
    { role: 'aggregator' as Role, email: 'raichur.hub@kabadiwalaconnect.in', name: 'Aggregator Demo', icon: Layers },
    { role: 'recycler' as Role, email: 'contact@ecometals.in', name: 'Recycler Demo', icon: Factory },
  ];

  const handleFillDemo = (demoEmail: string, demoRole: Role) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setErrorMessage(null);
  };

  const validateForm = (): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      return 'Please enter a valid email address.';
    }
    if (!password) {
      return 'Please enter your password.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setLoading(true);

    try {
      const result = await signIn(email.trim(), password);

      if (!result.success) {
        setErrorMessage(result.error || 'Invalid email or password. Please try again.');
        setLoading(false);
        return;
      }

      const roleFound = result.role || 'citizen';
      setRole(roleFound);

      setSuccessMessage(`Welcome back! Authenticated as ${roleFound.toUpperCase()}. Redirecting to your dashboard...`);
      setNotification(`👋 Welcome back to Kabadiwala Connect!`);

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });

      // Target path: from navigation state or role's dashboard
      const fromPath = (location.state as any)?.from?.pathname;
      const targetPath = fromPath && !fromPath.includes('/login')
        ? fromPath
        : (result.redirectPath || getDashboardPathForRole(roleFound));

      setTimeout(() => {
        navigate(targetPath, { replace: true });
      }, 1200);

    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMessage(err?.message || 'Network error connecting to Supabase. Please check your connection.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 relative">
      {/* Ambient Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-glow-green">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure Supabase Authentication</span>
          </div>

          <h1 className="text-3xl font-black text-slate-100 tracking-tight">
            Log In to <span className="text-gradient">Kabadiwala Connect</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Access your real-time recycling dashboard, traceability ledger, and instant payout records.
          </p>
        </div>

        {/* Card Container */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-800/60 shadow-2xl space-y-6">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">Authentication Failed</p>
                <p className="mt-0.5 text-rose-200">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">Access Granted</p>
                <p className="mt-0.5 text-emerald-200">{successMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Email Address <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="name@domain.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0D1713] border border-emerald-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Password <span className="text-emerald-400">*</span>
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0D1713] border border-emerald-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-emerald-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-glow-green disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Verifying Credentials with Supabase...</span>
                </>
              ) : (
                <>
                  <span>Sign In & Open Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Accounts Selection */}
          <div className="pt-4 border-t border-emerald-900/60 space-y-2">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center">
              Quick Pre-configured Demo Accounts
            </p>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((demo) => {
                const Icon = demo.icon;
                return (
                  <button
                    key={demo.role}
                    type="button"
                    onClick={() => handleFillDemo(demo.email, demo.role)}
                    className="p-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-900/60 text-slate-300 text-[11px] font-medium flex items-center gap-1.5 transition-colors text-left"
                  >
                    <Icon className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span className="truncate">{demo.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Link to Signup */}
          <div className="pt-2 text-center">
            <p className="text-xs text-slate-400">
              Don't have an account yet?{' '}
              <Link to="/signup" className="text-emerald-400 hover:underline font-bold">
                Sign Up here →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
