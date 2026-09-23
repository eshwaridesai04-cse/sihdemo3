import React, { useState } from 'react';
import { useLanguage, AVAILABLE_LANGUAGES } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { Role, Language } from '../types';
import {
  Settings,
  User,
  Database,
  Key,
  Globe,
  Sun,
  Moon,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Save
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { role, setRole, theme, toggleTheme, setNotification } = useApp();

  // Settings State
  const [supabaseUrl, setSupabaseUrl] = useState(
    localStorage.getItem('kc_supabase_url') || import.meta.env.VITE_SUPABASE_URL || 'https://mock-sih-project.supabase.co'
  );
  const [supabaseKey, setSupabaseKey] = useState(
    localStorage.getItem('kc_supabase_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-key'
  );
  const [geminiApiKey, setGeminiApiKey] = useState(
    localStorage.getItem('kc_gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || ''
  );
  const [razorpayKey, setRazorpayKey] = useState(
    localStorage.getItem('kc_razorpay_key') || import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_mock12345'
  );
  const [googleMapsKey, setGoogleMapsKey] = useState(
    localStorage.getItem('kc_maps_key') || import.meta.env.VITE_GOOGLE_MAPS_KEY || ''
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('kc_supabase_url', supabaseUrl);
    localStorage.setItem('kc_supabase_key', supabaseKey);
    localStorage.setItem('kc_gemini_api_key', geminiApiKey);
    localStorage.setItem('kc_razorpay_key', razorpayKey);
    localStorage.setItem('kc_maps_key', googleMapsKey);

    setSavedSuccess(true);
    setNotification('✅ Platform configuration and API keys saved successfully!');
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDemoData = () => {
    if (confirm('Reset all demo requests and return to default baseline state?')) {
      localStorage.removeItem('kc_pickup_requests');
      localStorage.removeItem('kc_traceability_logs');
      localStorage.removeItem('kc_agg_inventory');
      localStorage.removeItem('kc_ai_scans');
      window.location.reload();
    }
  };

  const roles: { value: Role; label: string; desc: string }[] = [
    { value: 'citizen', label: 'Citizen / Household', desc: 'Schedule pickups, check live prices, earn green credits' },
    { value: 'collector', label: 'Certified Kabadiwala', desc: 'Accept GPS pickups, digital weigh-in, instant UPI settlement' },
    { value: 'aggregator', label: 'District Hub (Raichur)', desc: 'Rural consolidation, baling, threshold notifications' },
    { value: 'recycler', label: 'Authorized Recycler', desc: 'QR code verification, proof upload, EPR certification' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-emerald-950 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>System & Credentials Configuration</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100">{t('nav.settings')}</h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure Supabase Database, Gemini Vision API, Google Maps, Razorpay, Persona & Languages.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Active Persona Switcher */}
        <div className="glass-card rounded-2xl p-6 border border-emerald-800/60 space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-emerald-900/60 pb-3">
            <User className="w-4 h-4 text-emerald-400" />
            <span>Active Presentation Persona</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {roles.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  role === r.value
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-glow-green'
                    : 'bg-emerald-950/40 border-emerald-900/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-slate-100">{r.label}</span>
                  {role === r.value && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{r.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Language Selection (5 Languages) */}
        <div className="glass-card rounded-2xl p-6 border border-emerald-800/60 space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-emerald-900/60 pb-3">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Platform Language (ಸಂಪೂರ್ಣ ವೆಬ್‌ಸೈಟ್ ಭಾಷೆ)</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {AVAILABLE_LANGUAGES.map((langItem) => (
              <button
                key={langItem.code}
                type="button"
                onClick={() => setLanguage(langItem.code)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  language === langItem.code
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-glow-green font-bold'
                    : 'bg-emerald-950/40 border-emerald-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-xl block mb-1">{langItem.flag}</span>
                <span className="text-xs font-semibold block">{langItem.name}</span>
                <span className="text-[11px] text-emerald-400/80">{langItem.nativeName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Supabase Connection Details */}
        <div className="glass-card rounded-2xl p-6 border border-emerald-800/60 space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-emerald-900/60 pb-3">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Supabase Database & Realtime API</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-300 block font-semibold mb-1">
                Supabase URL (VITE_SUPABASE_URL)
              </label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://your-project.supabase.co"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1713] border border-emerald-800 font-mono text-slate-100 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-slate-300 block font-semibold mb-1">
                Supabase Anon Key (VITE_SUPABASE_ANON_KEY)
              </label>
              <input
                type="password"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1713] border border-emerald-800 font-mono text-slate-100 focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>
        </div>

        {/* AI Vision & Payment API Keys */}
        <div className="glass-card rounded-2xl p-6 border border-emerald-800/60 space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-emerald-900/60 pb-3">
            <Key className="w-4 h-4 text-emerald-400" />
            <span>Gemini Vision AI & Payment Credentials</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-300 block font-semibold mb-1">
                Gemini Vision API Key
              </label>
              <input
                type="password"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1713] border border-emerald-800 font-mono text-slate-100 focus:outline-none focus:border-emerald-400"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Leave blank to use preloaded neural heuristic vision fallback.
              </span>
            </div>

            <div>
              <label className="text-slate-300 block font-semibold mb-1">
                Razorpay Key ID
              </label>
              <input
                type="text"
                value={razorpayKey}
                onChange={(e) => setRazorpayKey(e.target.value)}
                placeholder="rzp_test_..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1713] border border-emerald-800 font-mono text-slate-100 focus:outline-none focus:border-emerald-400"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Enables live Razorpay checkout dialog.
              </span>
            </div>
          </div>
        </div>

        {/* Save & Reset Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-glow-green transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{savedSuccess ? 'Settings Saved!' : 'Save & Apply Configuration'}</span>
          </button>

          <button
            type="button"
            onClick={handleResetDemoData}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Baseline State</span>
          </button>
        </div>
      </form>
    </div>
  );
};
