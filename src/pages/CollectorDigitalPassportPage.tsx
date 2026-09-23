import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { VoiceReaderButton } from '../components/VoiceReaderButton';
import {
  IdCard,
  ShieldCheck,
  Award,
  Star,
  Download,
  Share2,
  CheckCircle2,
  TreeDeciduous,
  Leaf,
  IndianRupee,
  MapPin,
  Recycle,
  Printer
} from 'lucide-react';

export const CollectorDigitalPassportPage: React.FC = () => {
  const { t } = useLanguage();
  const { activeCollector } = useApp();

  const handlePrint = () => {
    window.print();
  };

  const passportVoiceText = `National Waste Worker Digital Passport for ${activeCollector.full_name}, Collector code ${activeCollector.collector_code}. Verified under Swachh Bharat Mission with trust score ${activeCollector.trust_score}. Total waste collected ${activeCollector.total_collected_kg} kilograms, saving ${activeCollector.trees_saved_count} trees and preventing ${activeCollector.co2_saved_kg} kilograms of carbon emissions.`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-950 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
            <IdCard className="w-3.5 h-3.5" />
            <span>Official Government Waste Worker Identity</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100">{t('passport.title')}</h1>
          <p className="text-xs text-slate-400 mt-1">{t('passport.subtitle')}</p>
        </div>

        <div className="flex items-center gap-3">
          <VoiceReaderButton textToRead={passportVoiceText} label="Listen Identity" />
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>{t('passport.print_btn')}</span>
          </button>
        </div>
      </div>

      {/* Main Government Credential Card */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500/50 bg-gradient-to-b from-[#142A22] via-[#0E1B16] to-[#0A1310] shadow-2xl p-6 sm:p-8 text-slate-100 space-y-6">
        {/* Top Government Emblem Bar */}
        <div className="flex items-center justify-between border-b border-emerald-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 p-0.5 shadow-md">
              <div className="w-full h-full bg-[#0E1B16] rounded-[10px] flex items-center justify-center">
                <Recycle className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-amber-300 font-extrabold block">
                GOVERNMENT OF INDIA • SWACHH BHARAT MISSION
              </span>
              <h2 className="text-lg font-black tracking-tight text-white">
                NATIONAL CIRCULAR WASTE PICKER PASSPORT
              </h2>
            </div>
          </div>
          <span className="badge-gov hidden sm:inline-flex">{t('passport.gov_badge')}</span>
        </div>

        {/* Collector Profile Center Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Photo & Trust Rating */}
          <div className="md:col-span-4 flex flex-col items-center text-center space-y-3">
            <img
              src={activeCollector.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'}
              alt={activeCollector.full_name}
              className="w-32 h-32 rounded-2xl object-cover border-4 border-emerald-400 shadow-glow-green"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>e-Shram Verified</span>
              </div>
              <div className="flex items-center justify-center gap-1 text-sm font-extrabold text-amber-300 mt-1">
                <Star className="w-4 h-4 fill-amber-300" />
                <span>{activeCollector.trust_score} Trust Rating</span>
              </div>
            </div>
          </div>

          {/* Details Column */}
          <div className="md:col-span-5 space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Full Name of Waste Professional
              </span>
              <span className="text-xl font-black text-white">{activeCollector.full_name}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Collector ID</span>
                <span className="font-mono font-extrabold text-emerald-400 text-sm">
                  {activeCollector.collector_code}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Linked Govt ID</span>
                <span className="font-mono text-slate-300 font-bold">Aadhaar Verified</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Assigned Ward / Rural Hub</span>
              <span className="text-slate-200 font-semibold">
                📍 {activeCollector.village}, {activeCollector.district} ({activeCollector.state})
              </span>
            </div>

            <div className="pt-2 flex items-center gap-2 text-[11px] text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{t('passport.eshram_link')}</span>
            </div>
          </div>

          {/* National QR Identity Verification Token */}
          <div className="md:col-span-3 flex flex-col items-center justify-center p-4 bg-white/95 rounded-2xl text-slate-950 shadow-inner">
            <QRCodeSVG value={`https://kabadiwalaconnect.in/passport/${activeCollector.collector_code}`} size={110} level="M" />
            <span className="font-mono text-[9px] font-bold text-slate-800 mt-2">
              {activeCollector.qr_identity}
            </span>
            <span className="text-[9px] text-emerald-700 font-bold uppercase mt-0.5">
              SCAN TO AUDIT CREDENTIALS
            </span>
          </div>
        </div>

        {/* Impact Counters Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-emerald-800/80 text-center">
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-900">
            <span className="text-[10px] text-slate-400 block">{t('passport.total_waste')}</span>
            <span className="text-lg font-black text-emerald-400">{activeCollector.total_collected_kg} kg</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-900">
            <span className="text-[10px] text-slate-400 block">{t('passport.co2_saved')}</span>
            <span className="text-lg font-black text-teal-300">{activeCollector.co2_saved_kg} kg</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-900">
            <span className="text-[10px] text-slate-400 block">{t('passport.trees_saved')}</span>
            <span className="text-lg font-black text-amber-300">{activeCollector.trees_saved_count} 🌳</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-900">
            <span className="text-[10px] text-slate-400 block">Total Formal Earnings</span>
            <span className="text-lg font-black text-emerald-400">₹{activeCollector.total_earnings.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
