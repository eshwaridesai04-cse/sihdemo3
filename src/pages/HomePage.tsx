import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { VoiceReaderButton } from '../components/VoiceReaderButton';
import {
  Recycle,
  Camera,
  TrendingUp,
  Truck,
  ShieldCheck,
  QrCode,
  IdCard,
  Award,
  Layers,
  Factory,
  ArrowRight,
  CheckCircle2,
  Leaf,
  Users,
  IndianRupee,
  MapPin,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

export const HomePage: React.FC = () => {
  const { t, language } = useLanguage();
  const { materialPrices, pickupRequests } = useApp();

  const heroVoiceText = `${t('app.title')}. ${t('app.subtitle')}. ${t('hero.description')}`;

  const stats = [
    { label: t('hero.stat_diverted'), value: '48,250 kg', sub: '+18% this week', icon: Recycle, color: 'text-emerald-400' },
    { label: t('hero.stat_co2'), value: '112.4 T', sub: 'Carbon prevented', icon: Leaf, color: 'text-teal-400' },
    { label: t('hero.stat_collectors'), value: '3,480+', sub: 'e-Shram certified', icon: Users, color: 'text-emerald-300' },
    { label: t('hero.stat_payouts'), value: '₹1.84 Cr', sub: 'Direct to workers', icon: IndianRupee, color: 'text-yellow-400' },
  ];

  const quickActions = [
    {
      title: t('quick.ai_scan_title'),
      desc: t('quick.ai_scan_desc'),
      link: '/scanner',
      icon: Camera,
      gradient: 'from-emerald-500/20 to-teal-500/10',
      border: 'border-emerald-500/30',
      cta: 'Open AI Vision'
    },
    {
      title: t('quick.request_title'),
      desc: t('quick.request_desc'),
      link: '/request-pickup',
      icon: Truck,
      gradient: 'from-teal-500/20 to-cyan-500/10',
      border: 'border-teal-500/30',
      cta: 'Schedule Pickup'
    },
    {
      title: t('quick.prices_title'),
      desc: t('quick.prices_desc'),
      link: '/prices',
      icon: TrendingUp,
      gradient: 'from-emerald-500/20 to-green-500/10',
      border: 'border-emerald-500/30',
      cta: 'View Live Rates'
    },
    {
      title: t('quick.trace_title'),
      desc: t('quick.trace_desc'),
      link: '/traceability',
      icon: QrCode,
      gradient: 'from-amber-500/20 to-yellow-500/10',
      border: 'border-amber-500/30',
      cta: 'Verify Provenance'
    },
    {
      title: t('quick.passport_title'),
      desc: t('quick.passport_desc'),
      link: '/passport',
      icon: IdCard,
      gradient: 'from-emerald-600/20 to-emerald-900/20',
      border: 'border-emerald-600/30',
      cta: 'View Digital Passport'
    }
  ];

  const circularSteps = [
    { step: '01', title: 'Doorstep Precision', role: 'Citizen & AI', desc: 'Scan items with Gemini AI and request GPS pickup with transparent rates.', icon: Camera },
    { step: '02', title: 'Verified Weigh-in', role: 'Kabadiwala Collector', desc: 'Calibrated digital scale weighing, instant UPI payout, and QR token generation.', icon: Truck },
    { step: '03', title: 'Hub Consolidation', role: 'District Aggregator', desc: 'Rural nodes (like Raichur) accumulate lots until threshold is reached.', icon: Layers },
    { step: '04', title: 'Circular Transformation', role: 'Authorized Recycler', desc: 'Industrial smelting into secondary raw materials with EPR certificates.', icon: Factory },
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-inner"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('hero.badge')}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-100 leading-[1.15]"
            >
              {t('hero.title_p1')}{' '}
              <span className="text-gradient block sm:inline">{t('hero.title_p2')}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal"
            >
              {t('hero.description')}
            </motion.p>

            {/* Hero CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-3 pt-2"
            >
              <Link
                to="/request-pickup"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-glow-green hover:scale-[1.02] transition-all"
              >
                <Truck className="w-4 h-4" />
                <span>{t('hero.cta_pickup')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/scanner"
                className="px-6 py-3.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/60 border border-emerald-700/60 text-emerald-300 font-semibold text-sm flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>{t('hero.cta_scan')}</span>
              </Link>

              <Link
                to="/prices"
                className="px-5 py-3.5 rounded-xl bg-[#121F1A]/80 hover:bg-emerald-950/80 border border-emerald-800/40 text-slate-300 font-medium text-sm flex items-center gap-2 transition-all"
              >
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>{t('hero.cta_prices')}</span>
              </Link>
            </motion.div>

            <div className="pt-2 flex justify-center">
              <VoiceReaderButton textToRead={heroVoiceText} label="Listen to Platform Overview" />
            </div>
          </div>

          {/* Key Stats Counter Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16"
          >
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="glass-card p-5 rounded-2xl border border-emerald-900/50 hover:border-emerald-600/50 transition-all hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-400">{stat.label}</span>
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <Icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                    {stat.value}
                  </div>
                  <p className="text-[11px] text-emerald-400/80 mt-1 font-medium">{stat.sub}</p>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Live Scrap Price Ticker Strip */}
      <section className="bg-emerald-950/40 border-y border-emerald-900/40 py-3 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 whitespace-nowrap bg-emerald-950/80 px-3 py-1 rounded-lg border border-emerald-800/60">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>LIVE MSP RATES</span>
          </div>
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar text-xs text-slate-300 py-1">
            {materialPrices.slice(0, 7).map((item) => (
              <div key={item.id} className="flex items-center gap-2 whitespace-nowrap">
                <span className="font-semibold text-slate-200">{item.material_name}:</span>
                <span className="text-emerald-400 font-bold">₹{item.price_per_kg}/{item.unit}</span>
                <span className={`text-[10px] px-1 rounded ${item.price_trend === 'up' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                  {item.price_trend === 'up' ? `▲ +${item.change_percentage}%` : '— Stable'}
                </span>
                <span className="text-slate-500 text-[10px]">({item.city})</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Action Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="badge-verified mb-2">Instant Self-Service Hub</span>
          <h2 className="text-3xl font-extrabold text-slate-100">Empowering Every Stakeholder</h2>
          <p className="text-sm text-slate-400 mt-2">
            Integrated tools for citizens, waste pickers, district aggregators, and industrial recyclers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.link}
                className={`glass-card p-6 rounded-2xl border ${action.border} bg-gradient-to-br ${action.gradient} glass-card-hover group flex flex-col justify-between`}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {action.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-emerald-900/40 flex items-center justify-between text-xs font-bold text-emerald-400">
                  <span>{action.cta}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Circular Economy Visual Journey (SIH Problem Statement Focus) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-emerald-800/60 relative overflow-hidden bg-gradient-to-b from-[#121F1A] to-[#0D1713]">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="badge-gov mb-2">Zero-Leakage Circular Lifecycle</span>
            <h2 className="text-3xl font-extrabold text-slate-100">
              From Informal Doorstep to Industrial Ingot
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              How Kabadiwala Connect bridges rural collection nodes (like Raichur) and urban wards into verifiable Extended Producer Responsibility (EPR) chains.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {circularSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="relative bg-emerald-950/40 rounded-2xl p-6 border border-emerald-900/60 hover:border-emerald-500/50 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-emerald-500/40 font-mono">{step.step}</span>
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                    {step.role}
                  </span>
                  <h4 className="text-base font-bold text-slate-100 mb-2">{step.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Bottom Trust Highlight */}
          <div className="mt-10 pt-8 border-t border-emerald-900/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Tamper-Proof QR Hash Logging</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Zero-Contamination Purity Audits</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Instant Direct Bank Transfer & UPI</span>
            </div>
          </div>
        </div>
      </section>

      {/* Rural Node Spotlight: Raichur District Hub Logic */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center glass-card rounded-3xl p-8 border border-emerald-800/50">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Specialized Tier-3 & Rural Supply Chain</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              Solving the Rural Smelter Void (e.g. Raichur)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              In districts without immediate industrial smelters, small collectors struggle with transport costs. Kabadiwala Connect directs waste to the nearest <strong>District Aggregator Hub</strong>.
            </p>
            <ul className="space-y-2 text-xs text-slate-200">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <span>Collectors deposit small quantities (5kg to 50kg) at localized hub.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <span>Hub baler compacts material until 2,000 kg threshold is reached.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <span>Automated dispatch notification sent to regional authorized smelters.</span>
              </li>
            </ul>
            <div className="pt-2">
              <Link
                to="/dashboard/aggregator"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold hover:bg-emerald-500/30 transition-all"
              >
                <span>Inspect Aggregator Hub Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="bg-[#0D1713] rounded-2xl p-6 border border-emerald-900/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-900/60">
              <span className="text-xs font-bold text-slate-200">Raichur Central Aggregation Hub</span>
              <span className="badge-verified">Operational</span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Current Hub Stock: 1,850 kg</span>
                  <span className="text-emerald-400 font-bold">92.5% of Threshold</span>
                </div>
                <div className="w-full h-3 rounded-full bg-emerald-950 overflow-hidden p-0.5 border border-emerald-900">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: '92.5%' }} />
                </div>
                <p className="text-[10px] text-amber-300/90 mt-1.5">
                  ⚠️ 150 kg remaining to trigger automatic industrial recycler dispatch.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-900/40">
                  <span className="text-slate-400 block text-[10px]">Active Local Collectors</span>
                  <span className="text-lg font-bold text-slate-100">42 Registered</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-900/40">
                  <span className="text-slate-400 block text-[10px]">Average Payout</span>
                  <span className="text-lg font-bold text-emerald-400">₹42.50 / kg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
