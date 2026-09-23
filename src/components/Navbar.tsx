import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage, AVAILABLE_LANGUAGES } from '../context/LanguageContext';
import { useVoice } from '../context/VoiceContext';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import {
  Recycle,
  Camera,
  TrendingUp,
  Truck,
  User,
  Shield,
  Layers,
  Factory,
  IdCard,
  Settings,
  HelpCircle,
  VolumeX,
  Menu,
  X,
  Globe,
  LogIn,
  UserPlus,
  LogOut,
  QrCode
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { t, language, setLanguage, currentLangInfo } = useLanguage();
  const { isSpeaking, stopSpeaking } = useVoice();
  const { role, setRole, theme, toggleTheme, setNotification } = useApp();
  const { user, userRole, userProfile, signOut, getDashboardPathForRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
    setNotification('✅ You have been logged out.');
    navigate('/login');
  };

  const navLinks = [
    { path: '/', label: t('nav.home'), icon: Recycle },
    { path: '/scanner', label: t('nav.scanner'), icon: Camera },
    { path: '/prices', label: t('nav.prices'), icon: TrendingUp },
    { path: '/request-pickup', label: t('nav.request'), icon: Truck },
    { path: '/track-pickup', label: t('nav.track'), icon: Shield },
    { path: '/traceability', label: t('nav.traceability'), icon: QrCode },
    { path: '/passport', label: t('nav.passport'), icon: IdCard },
  ];

  const rolePortals: { role: Role; path: string; label: string; icon: any }[] = [
    { role: 'citizen', path: '/citizen-dashboard', label: t('nav.citizen_dashboard'), icon: User },
    { role: 'collector', path: '/collector-dashboard', label: t('nav.collector_dashboard'), icon: Truck },
    { role: 'aggregator', path: '/aggregator-dashboard', label: t('nav.aggregator_dashboard'), icon: Layers },
    { role: 'recycler', path: '/recycler-dashboard', label: t('nav.recycler_dashboard'), icon: Factory },
  ];

  return (
    <header className="sticky top-0 z-50 glass-nav backdrop-blur-xl bg-[#0B1310]/90 border-b border-emerald-950/60 transition-all">
      {/* Top Govt & SIH Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-emerald-900/50 to-teal-950/80 px-4 py-1 text-xs border-b border-emerald-900/40 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-emerald-300">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-semibold border border-emerald-500/30">
              SIH 2026 • SIH26229
            </span>
            <span>Swachh Bharat Mission (Urban & Rural) • MoHUA National Recycling Grid</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-emerald-400">
            <span>📞 Govt Toll-Free Helpline: <strong>1800-202-2622</strong></span>
            <span>🟢 Raichur & Urban Aggregation Online</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-glow-green group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0B1310] rounded-[10px] flex items-center justify-center">
                <Recycle className="w-5 h-5 text-emerald-400 group-hover:rotate-180 transition-transform duration-700" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-100 group-hover:text-emerald-400 transition-colors">
                  {t('app.title')}
                </span>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  PROD
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block truncate max-w-[240px]">
                {t('app.subtitle')}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold shadow-sm'
                      : 'text-slate-300 hover:text-emerald-300 hover:bg-emerald-950/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Center (Auth Status, Persona Switcher, Language, Settings) */}
          <div className="flex items-center gap-2">
            {/* Supabase User Authentication Status / Actions */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to={getDashboardPathForRole(userRole || role)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-xs font-bold text-emerald-300 flex items-center gap-2 hover:bg-emerald-500/25 transition-all shadow-sm"
                  title="Open Your Role Dashboard"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/30 text-emerald-300 flex items-center justify-center text-[10px] font-extrabold uppercase">
                    {(userProfile?.full_name || user.email || 'U').charAt(0)}
                  </div>
                  <span className="hidden md:inline truncate max-w-[110px]">
                    {userProfile?.full_name || 'Dashboard'}
                  </span>
                  <span className="bg-emerald-400/20 text-emerald-300 text-[10px] uppercase font-mono px-1.5 py-0.5 rounded">
                    {userRole || role}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
                  title="Logout from Supabase"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-xs font-bold text-slate-200 hover:text-emerald-300 hover:bg-emerald-900/40 transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Log In</span>
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-extrabold shadow-glow-green transition-all flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Up</span>
                </Link>
              </div>
            )}

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-xs font-medium text-emerald-300 flex items-center gap-1.5 hover:bg-emerald-900/50 transition-colors"
                title="Switch User Persona"
              >
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span className="capitalize font-semibold">{role}</span>
                <span className="text-[10px] text-emerald-500">▼</span>
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#121F1A] border border-emerald-800/80 shadow-2xl py-2 z-50">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 border-b border-emerald-950 uppercase tracking-wider">
                    {t('nav.switch_role')}
                  </div>
                  {rolePortals.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.role}
                        onClick={() => {
                          setRole(item.role);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2.5 transition-colors ${
                          role === item.role
                            ? 'bg-emerald-500/20 text-emerald-300 font-semibold border-l-2 border-emerald-400'
                            : 'text-slate-300 hover:bg-emerald-950/60 hover:text-emerald-300'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-emerald-400" />
                        <span className="capitalize">{item.label}</span>
                      </button>
                    );
                  })}
                  <div className="border-t border-emerald-950 mt-1 pt-1">
                    <Link
                      to={getDashboardPathForRole(role)}
                      onClick={() => setRoleDropdownOpen(false)}
                      className="block px-3 py-1.5 text-xs text-emerald-400 hover:underline font-medium"
                    >
                      → Go to Active Portal
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Language Selector Dropdown (5 Languages) */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-xs font-medium text-slate-200 flex items-center gap-1.5 hover:bg-emerald-900/50 transition-colors"
                title="Change Website Language"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold">{currentLangInfo.nativeName}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#121F1A] border border-emerald-800/80 shadow-2xl py-2 z-50">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 border-b border-emerald-950 uppercase tracking-wider">
                    Select Language (ಭಾಷೆ / भाषा)
                  </div>
                  {AVAILABLE_LANGUAGES.map((langItem) => (
                    <button
                      key={langItem.code}
                      onClick={() => {
                        setLanguage(langItem.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                        language === langItem.code
                          ? 'bg-emerald-500/20 text-emerald-300 font-semibold border-l-2 border-emerald-400'
                          : 'text-slate-300 hover:bg-emerald-950/60 hover:text-emerald-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{langItem.flag}</span>
                        <span>{langItem.name}</span>
                      </span>
                      <span className="text-[11px] text-emerald-400/80 font-medium">
                        {langItem.nativeName}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Voice Assistant Toggle */}
            {isSpeaking ? (
              <button
                onClick={stopSpeaking}
                className="p-2 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30 transition-colors animate-pulse"
                title="Voice Assistant Speaking - Click to Stop"
              >
                <VolumeX className="w-4 h-4" />
              </button>
            ) : null}

            {/* Help Link */}
            <Link
              to="/help"
              className="p-2 rounded-lg text-slate-400 hover:text-emerald-300 hover:bg-emerald-950/40 transition-colors"
              title={t('nav.help')}
            >
              <HelpCircle className="w-4 h-4" />
            </Link>

            {/* Settings Link */}
            <Link
              to="/settings"
              className="p-2 rounded-lg text-slate-400 hover:text-emerald-300 hover:bg-emerald-950/40 transition-colors"
              title={t('nav.settings')}
            >
              <Settings className="w-4 h-4" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-400 hover:text-emerald-300 hover:bg-emerald-950/40 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0e1a15] border-b border-emerald-950 px-4 pt-2 pb-6 space-y-3">
          {/* Auth state banner in Mobile Menu */}
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-900/80 flex items-center justify-between">
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/30 text-emerald-300 flex items-center justify-center text-xs font-bold uppercase">
                    {(userProfile?.full_name || user.email || 'U').charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-100">{userProfile?.full_name || user.email}</p>
                    <p className="text-[10px] text-emerald-400 font-mono capitalize">{userRole || role} Portal</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 w-full">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center rounded-lg bg-emerald-950 border border-emerald-800 text-xs font-bold text-slate-200"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-extrabold"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-emerald-950/80">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs font-medium text-slate-200 bg-emerald-950/40 hover:bg-emerald-900/40 flex items-center gap-2"
                >
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Select User Portal
            </p>
            <div className="grid grid-cols-2 gap-2">
              {rolePortals.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.role}
                    to={item.path}
                    onClick={() => {
                      setRole(item.role);
                      setMobileMenuOpen(false);
                    }}
                    className="px-3 py-2 rounded-lg text-xs font-medium text-slate-200 bg-emerald-950/30 hover:bg-emerald-900/40 flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4 text-emerald-400" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
