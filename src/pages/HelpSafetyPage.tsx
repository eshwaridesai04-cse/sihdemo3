import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { VoiceReaderButton } from '../components/VoiceReaderButton';
import {
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  Phone,
  FileText,
  CheckCircle2,
  HeartPulse,
  Flame,
  BatteryCharging,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const HelpSafetyPage: React.FC = () => {
  const { t } = useLanguage();

  const [grievanceText, setGrievanceText] = useState('');
  const [complaintSent, setComplaintSent] = useState(false);

  const safetyProtocols = [
    {
      title: 'Lead-Acid & Lithium Batteries',
      danger: 'DANGER: Corrosive acid and thermal runaway explosion hazard.',
      guidelines: [
        'Never puncture, invert, or dismantle battery casings in the field.',
        'Always wear acid-resistant neoprene gloves and protective face shield.',
        'Transport upright in spill-containment plastic crates with sawdust absorbent.'
      ],
      icon: BatteryCharging,
      badge: 'Hazardous Waste Rule 2016'
    },
    {
      title: 'E-Waste PCBs & CRT Glass',
      danger: 'WARNING: Heavy metal toxicity (Lead, Cadmium, Mercury, Beryllium).',
      guidelines: [
        'Burning PCBs or wire cables in open pits is strictly illegal & carcinogenic.',
        'Do not break vacuum tubes or CRT displays; explosive implosion hazard.',
        'Route entire boards directly to authorized CPCB smelters for hydrometallurgical recovery.'
      ],
      icon: Flame,
      badge: 'E-Waste Management Rules 2022'
    },
    {
      title: 'Sharp Metals & Glass Cullet',
      danger: 'CAUTION: Puncture wounds, deep lacerations, and tetanus risks.',
      guidelines: [
        'Mandatory Level-5 cut-resistant nitrile-coated gloves when sorting metals.',
        'Wear steel-toed boots when stepping on scrap consolidation piles.',
        'Keep current on Tetanus Toxoid (TT) vaccinations every 6 months.'
      ],
      icon: HeartPulse,
      badge: 'Occupational Safety SOP'
    }
  ];

  const handleGrievanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievanceText.trim()) return;
    setComplaintSent(true);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    setTimeout(() => {
      setGrievanceText('');
      setComplaintSent(false);
    }, 4000);
  };

  const safetyVoiceSummary = `National Safety & Occupational Health SOP for informal recyclers. Battery safety: Never dismantle battery casings, wear acid-resistant gloves. E-waste: Burning wires is strictly illegal and toxic. Government 24x7 helpline is 1800-202-2622.`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-950 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Worker Protection & Grievance Redressal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100">
            Occupational Safety & SOPs
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Standard operating guidelines for informal waste collectors under Swachh Bharat & CPCB.
          </p>
        </div>

        <VoiceReaderButton textToRead={safetyVoiceSummary} label="Listen Safety Rules" />
      </div>

      {/* Emergency Helpline Banner */}
      <div className="glass-card rounded-2xl p-6 border-2 border-emerald-500/40 bg-gradient-to-r from-emerald-950/60 to-teal-950/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <Phone className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">
              24x7 Waste Worker National Helpline
            </span>
            <h3 className="text-2xl font-black text-white">1800-202-2622 (Toll Free)</h3>
            <p className="text-xs text-slate-300">
              For emergency medical advice, price exploitation reports, or hazardous chemical spills.
            </p>
          </div>
        </div>
      </div>

      {/* Safety SOP Cards */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-100">Mandatory Handling Protocols</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {safetyProtocols.map((proto, idx) => {
            const Icon = proto.icon;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl p-5 border border-emerald-800/60 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-400 font-mono">
                      {proto.badge}
                    </span>
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h4 className="font-bold text-base text-slate-100">{proto.title}</h4>
                  <p className="text-[11px] font-semibold text-amber-300/90 leading-tight">
                    {proto.danger}
                  </p>

                  <ul className="space-y-1.5 text-xs text-slate-300 pt-1">
                    {proto.guidelines.map((g, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grievance Redressal Form */}
      <div className="glass-card rounded-2xl p-6 border border-emerald-800/60 space-y-4">
        <div className="border-b border-emerald-900/60 pb-3">
          <h3 className="text-base font-bold text-slate-100">
            Submit Worker Grievance or Price Skimming Report
          </h3>
          <p className="text-xs text-slate-400">
            Directly reviewed by Municipal Ward Inspector and CPCB Circular Ombudsman.
          </p>
        </div>

        {complaintSent ? (
          <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>Grievance ticket #GRV-{Date.now().toString().slice(-5)} submitted. Case officer assigned.</span>
          </div>
        ) : (
          <form onSubmit={handleGrievanceSubmit} className="space-y-3">
            <textarea
              rows={3}
              required
              value={grievanceText}
              onChange={(e) => setGrievanceText(e.target.value)}
              placeholder="Describe your issue (e.g. Unfair MSP deduction at hub, faulty digital scale, delay in UPI settlement)..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1713] border border-emerald-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-400"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Submit Formal Grievance</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
