import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { VoiceReaderButton } from '../components/VoiceReaderButton';
import { QRGeneratorModal } from '../components/QRGeneratorModal';
import {
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  Search,
  Download,
  Share2,
  Layers,
  Factory,
  Truck,
  User
} from 'lucide-react';

export const TraceabilityDashboardPage: React.FC = () => {
  const { t } = useLanguage();
  const { traceabilityLogs } = useApp();
  const [searchParams] = useSearchParams();

  const initialQR = searchParams.get('qr') || 'KC-QR-TRACE-BLR-00101';
  const [searchQR, setSearchQR] = useState(initialQR);
  const [activeQR, setActiveQR] = useState(initialQR);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  // Group logs by active QR
  const currentLogs = traceabilityLogs.filter(
    (l) => l.qr_code_id.toLowerCase() === activeQR.toLowerCase()
  );

  const distinctQRs = Array.from(new Set(traceabilityLogs.map((l) => l.qr_code_id)));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQR.trim()) {
      setActiveQR(searchQR.trim());
    }
  };

  const voiceSummary = `Chain of Custody Traceability for QR token ${activeQR}. Recorded across ${currentLogs.length} verified lifecycle checkpoints from citizen doorstep to certified recycler. Cryptographic integrity audited.`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-950 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2">
            <QrCode className="w-3.5 h-3.5" />
            <span>Cryptographic Circular Ledger</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100">{t('trace.title')}</h1>
          <p className="text-xs text-slate-400 mt-1">{t('trace.subtitle')}</p>
        </div>

        <div className="flex items-center gap-3">
          <VoiceReaderButton textToRead={voiceSummary} label="Listen Provenance" />
          <button
            onClick={() => setIsQRModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Display QR Code</span>
          </button>
        </div>
      </div>

      {/* QR Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQR}
            onChange={(e) => setSearchQR(e.target.value)}
            placeholder="Search QR Token (e.g. KC-QR-TRACE-BLR-00101)..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#121F1A] border border-emerald-800 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-400"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-glow-green"
        >
          Verify Token
        </button>
      </form>

      {/* Quick Select Preset Tokens */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
        <span className="text-slate-400 font-medium whitespace-nowrap">Available Tokens:</span>
        {distinctQRs.map((token) => (
          <button
            key={token}
            onClick={() => {
              setSearchQR(token);
              setActiveQR(token);
            }}
            className={`px-3 py-1.5 rounded-lg font-mono text-[11px] whitespace-nowrap transition-all ${
              activeQR === token
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                : 'bg-emerald-950/40 text-slate-400 hover:text-slate-200 border border-emerald-900'
            }`}
          >
            {token}
          </button>
        ))}
      </div>

      {/* Main Timeline Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-emerald-800/60 space-y-8">
        <div className="flex items-center justify-between border-b border-emerald-900/60 pb-4">
          <div>
            <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">
              Active Token
            </span>
            <h3 className="text-xl font-bold font-mono text-slate-100">{activeQR}</h3>
          </div>
          <span className="badge-verified">{currentLogs.length} Verified Checkpoints</span>
        </div>

        {/* 8-Stage Timeline List */}
        <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-emerald-950">
          {currentLogs.map((log, idx) => (
            <div key={log.id} className="flex items-start gap-4 relative">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center flex-shrink-0 z-10 shadow-glow-green">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1 bg-[#0D1713] p-4 rounded-xl border border-emerald-900 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-bold text-[10px] border border-emerald-500/20">
                      {log.current_stage}
                    </span>
                    <h4 className="font-bold text-slate-100 text-sm">{log.stage_title}</h4>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{log.notes}</p>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1 border-t border-emerald-950">
                  <span>Actor: <strong className="text-emerald-400">{log.actor_name}</strong> ({log.actor_type})</span>
                  <span>📍 {log.location_name}</span>
                  {log.carbon_offset_kg ? (
                    <span className="text-teal-300 font-semibold">🌿 {log.carbon_offset_kg} kg CO₂ offset</span>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QR Modal */}
      <QRGeneratorModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        qrValue={activeQR}
        title="Chain-of-Custody Traceability Token"
        subtitle="Verifiable Provenance Ledger Token"
      />
    </div>
  );
};
