import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Role } from '../types';
import {
  Recycle,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Building,
  Truck,
  Layers,
  Factory,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

const ROLE_OPTIONS: {
  value: 'Citizen' | 'Collector' | 'Aggregator' | 'Recycler';
  roleKey: Role;
  label: string;
  sub: string;
  icon: any;
  badge: string;
}[] = [
  {
    value: 'Citizen',
    roleKey: 'citizen',
    label: 'Citizen / Household',
    sub: 'Request doorstep scrap pickups, check live MSP rates, earn Green Credits',
    icon: User,
    badge: 'Household & Green Citizen'
  },
  {
    value: 'Collector',
    roleKey: 'collector',
    label: 'Certified Collector (Kabadiwala)',
    sub: 'Accept GPS pickups, calibrated digital scale weighing, instant UPI payout',
    icon: Truck,
    badge: 'Formal Sector Worker (e-Shram)'
  },
  {
    value: 'Aggregator',
    roleKey: 'aggregator',
    label: 'District Aggregator Hub',
    sub: 'Rural/Urban consolidation node, baling, threshold bulk dispatching',
    icon: Layers,
    badge: 'Hub Consolidation Unit'
  },
  {
    value: 'Recycler',
    roleKey: 'recycler',
    label: 'Authorized Recycler / Smelter',
    sub: 'Industrial smelting, secondary raw materials & CPCB EPR certification',
    icon: Factory,
    badge: 'CPCB Authorized Facility'
  }
];

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, getDashboardPathForRole } = useAuth();
  const { setNotification, setRole } = useApp();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'Citizen' as 'Citizen' | 'Collector' | 'Aggregator' | 'Recycler',
    village: '',
    district: 'Bangalore Urban'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleRoleSelect = (roleValue: 'Citizen' | 'Collector' | 'Aggregator' | 'Recycler') => {
    setFormData(prev => ({ ...prev, role: roleValue }));
    if (errorMessage) setErrorMessage(null);
  };

  const validateForm = (): string | null => {
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      return 'Please enter your full legal name.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      return 'Please enter a valid email address.';
    }

    // Phone validation: allow 10 digits or with +91 prefix
    const cleanedPhone = formData.phone.replace(/[\s\-()]/g, '');
    if (!cleanedPhone || cleanedPhone.length < 10) {
      return 'Please enter a valid 10-digit mobile phone number.';
    }

    if (!formData.password || formData.password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }

    if (formData.password !== formData.confirmPassword) {
      return 'Password and Confirm Password do not match.';
    }

    if (!formData.village.trim()) {
      return 'Please enter your Village, Ward, or Locality.';
    }

    if (!formData.district.trim()) {
      return 'Please enter your District.';
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
      // Ensure phone has clean formatting
      let formattedPhone = formData.phone.trim();
      if (!formattedPhone.startsWith('+')) {
        const cleaned = formattedPhone.replace(/\D/g, '');
        if (cleaned.length === 10) {
          formattedPhone = `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
        }
      }

      const result = await signUp({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formattedPhone,
        password: formData.password,
        role: formData.role,
        village: formData.village.trim(),
        district: formData.district.trim()
      });

      if (!result.success) {
        setErrorMessage(result.error || 'Failed to create account. Please try again.');
        setLoading(false);
        return;
      }

      // Success
      const targetRole = (result.role || formData.role.toLowerCase()) as Role;
      setRole(targetRole);

      setSuccessMessage(`Account created successfully as ${formData.role}! Redirecting to your dashboard...`);
      setNotification(`🎉 Welcome to Kabadiwala Connect, ${formData.fullName}!`);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      const targetPath = result.redirectPath || getDashboardPathForRole(targetRole);

      setTimeout(() => {
        navigate(targetPath, { replace: true });
      }, 1500);

    } catch (err: any) {
      console.error('Signup error:', err);
      setErrorMessage(err?.message || 'Network error connecting to Supabase. Please check your connection.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full relative z-10 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-glow-green">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Supabase Verified Registration</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">
            Create Your <span className="text-gradient">Kabadiwala Connect</span> Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Join India's national circular recycling network. Connect directly to fair MSP pricing, digital weighing, and EPR traceability.
          </p>
        </div>

        {/* Card Container */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-800/60 shadow-2xl space-y-6">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">Registration Failed</p>
                <p className="mt-0.5 text-rose-200">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">Registration Successful</p>
                <p className="mt-0.5 text-emerald-200">{successMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 1. Role Selection Grid */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Select Your Role <span className="text-emerald-400">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ROLE_OPTIONS.map((item) => {
                  const Icon = item.icon;
                  const isSelected = formData.role === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => handleRoleSelect(item.value)}
                      className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                        isSelected
                          ? 'bg-emerald-500/20 border-emerald-400 shadow-glow-green text-slate-100 ring-1 ring-emerald-400'
                          : 'bg-emerald-950/40 border-emerald-900/60 text-slate-400 hover:border-emerald-800 hover:text-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className={`p-2 rounded-xl ${isSelected ? 'bg-emerald-500/30 text-emerald-300' : 'bg-emerald-900/40 text-slate-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSelected && (
                          <span className="badge-verified text-[10px] py-0.5 px-2">
                            <CheckCircle2 className="w-3 h-3" /> Selected
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-xs text-slate-100 block">{item.label}</span>
                        <span className="text-[10px] text-slate-400 leading-snug mt-1 block">{item.sub}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Native Dropdown for Mobile / Accessibility */}
              <div className="mt-2 block sm:hidden">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1713] border border-emerald-800 text-xs font-medium text-slate-100 focus:outline-none focus:border-emerald-400"
                >
                  <option value="Citizen">Citizen (Household Recycler)</option>
                  <option value="Collector">Collector (Kabadiwala / Informal Worker)</option>
                  <option value="Aggregator">Aggregator (District Hub)</option>
                  <option value="Recycler">Recycler (Smelter / Formal Processor)</option>
                </select>
              </div>
            </div>

            {/* 2. Personal Information (Full Name & Email) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Full Legal Name <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Kumar Nayak"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0D1713] border border-emerald-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
                  />
                </div>
              </div>

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
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@domain.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0D1713] border border-emerald-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* 3. Phone Number */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Mobile Phone Number <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 9845012345 or +91 98450 12345"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0D1713] border border-emerald-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Required for SMS OTP verification and UPI instant settlement.
              </span>
            </div>

            {/* 4. Location Details (Village & District) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Village / Ward / Locality <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="village"
                    required
                    value={formData.village}
                    onChange={handleChange}
                    placeholder="e.g. Indiranagar Ward 82 / Sindhanur Hub"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0D1713] border border-emerald-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  District <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Building className="w-4 h-4" />
                  </div>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0D1713] border border-emerald-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
                  >
                    <option value="Bangalore Urban">Bangalore Urban (Karnataka)</option>
                    <option value="Bangalore Rural">Bangalore Rural (Karnataka)</option>
                    <option value="Raichur">Raichur District (Karnataka)</option>
                    <option value="Mysore">Mysore (Karnataka)</option>
                    <option value="Belgaum">Belgaum (Karnataka)</option>
                    <option value="Gulbarga">Kalaburagi / Gulbarga (Karnataka)</option>
                    <option value="Mumbai">Mumbai (Maharashtra)</option>
                    <option value="Pune">Pune (Maharashtra)</option>
                    <option value="Hyderabad">Hyderabad (Telangana)</option>
                    <option value="Other">Other District</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 5. Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Password <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
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

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Confirm Password <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-type your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0D1713] border border-emerald-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-emerald-400"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms and Privacy Info */}
            <div className="text-[11px] text-slate-400 bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-900/50 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                By creating an account, you agree to the National Swachh Bharat Recycling Standards and allow Kabadiwala Connect to securely link your profile to Supabase.
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-glow-green disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Creating Account & Linking Supabase Profile...</span>
                </>
              ) : (
                <>
                  <span>Create {formData.role} Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link to Login */}
          <div className="pt-4 border-t border-emerald-900/60 text-center">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-400 hover:underline font-bold">
                Log In here →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
