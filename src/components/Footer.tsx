import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Recycle, ShieldCheck, Heart, Award, FileText, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();

  return (
    <footer className="bg-[#070D0B] border-t border-emerald-950/80 text-slate-400 text-xs mt-20">
      {/* Top Banner */}
      <div className="bg-emerald-950/40 border-b border-emerald-900/30 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-200">SIH 2026 Winner Ready</p>
              <p className="text-[11px] text-slate-400">Problem Statement SIH26229</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-200">100% EPR Compliant</p>
              <p className="text-[11px] text-slate-400">MoHUA & CPCB Guidelines</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-200">Rural Hub Integration</p>
              <p className="text-[11px] text-slate-400">Raichur & Urban Node Live</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-200">National Helpline</p>
              <p className="text-[11px] text-emerald-400 font-semibold">1800-202-2622 (24x7)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Recycle className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base text-slate-100">{t('app.title')}</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
            {t('app.description')}
          </p>
          <div className="flex items-center gap-2 pt-2">
            <span className="badge-gov">Swachh Bharat Mission 2026</span>
            <span className="badge-verified">CPCB Registered</span>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-3">Core Modules</h4>
          <ul className="space-y-2">
            <li><Link to="/scanner" className="hover:text-emerald-400 transition-colors">AI Material Scanner</Link></li>
            <li><Link to="/prices" className="hover:text-emerald-400 transition-colors">Live MSP Scrap Prices</Link></li>
            <li><Link to="/request-pickup" className="hover:text-emerald-400 transition-colors">Doorstep Waste Pickup</Link></li>
            <li><Link to="/track-pickup" className="hover:text-emerald-400 transition-colors">Realtime GPS Tracking</Link></li>
            <li><Link to="/traceability" className="hover:text-emerald-400 transition-colors">QR Chain of Custody</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-3">Stakeholder Portals</h4>
          <ul className="space-y-2">
            <li><Link to="/dashboard/citizen" className="hover:text-emerald-400 transition-colors">Citizen Rewards</Link></li>
            <li><Link to="/dashboard/collector" className="hover:text-emerald-400 transition-colors">Collector Terminal</Link></li>
            <li><Link to="/dashboard/aggregator" className="hover:text-emerald-400 transition-colors">Aggregator Hub (Raichur)</Link></li>
            <li><Link to="/dashboard/recycler" className="hover:text-emerald-400 transition-colors">Recycler ERP Portal</Link></li>
            <li><Link to="/passport" className="hover:text-emerald-400 transition-colors">Collector Digital ID</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-3">Languages (ಭಾಷೆಗಳು)</h4>
          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded text-[11px] ${language === 'en' ? 'bg-emerald-500 text-white font-bold' : 'bg-emerald-950/60 text-slate-300'}`}>English</button>
            <button onClick={() => setLanguage('kn')} className={`px-2 py-1 rounded text-[11px] ${language === 'kn' ? 'bg-emerald-500 text-white font-bold' : 'bg-emerald-950/60 text-slate-300'}`}>ಕನ್ನಡ</button>
            <button onClick={() => setLanguage('hi')} className={`px-2 py-1 rounded text-[11px] ${language === 'hi' ? 'bg-emerald-500 text-white font-bold' : 'bg-emerald-950/60 text-slate-300'}`}>हिन्दी</button>
            <button onClick={() => setLanguage('te')} className={`px-2 py-1 rounded text-[11px] ${language === 'te' ? 'bg-emerald-500 text-white font-bold' : 'bg-emerald-950/60 text-slate-300'}`}>తెలుగు</button>
            <button onClick={() => setLanguage('mr')} className={`px-2 py-1 rounded text-[11px] ${language === 'mr' ? 'bg-emerald-500 text-white font-bold' : 'bg-emerald-950/60 text-slate-300'}`}>मराठी</button>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-950/80">
            <Link to="/help" className="text-emerald-400 hover:underline flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              <span>Safety SOPs & Grievances</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-emerald-950/80 py-4 text-center text-[11px] text-slate-500 bg-[#050A08]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>{t('footer.copyright')}</p>
          <p className="flex items-center gap-1 text-slate-400">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Informal Waste Workers Across India
          </p>
        </div>
      </div>
    </footer>
  );
};
