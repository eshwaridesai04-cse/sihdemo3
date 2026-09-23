import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { VoiceReaderButton } from '../components/VoiceReaderButton';
import {
  Factory,
  ShieldCheck,
  QrCode,
  CheckCircle2,
  Upload,
  Camera,
  Scale,
  Award,
  Sparkles,
  FileCheck,
  ArrowRight,
  ExternalLink,
  LogOut
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RecyclerDashboardPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { activeRecycler, traceabilityLogs, recyclerConfirmBatch, setNotification } = useApp();
  const { userProfile, signOut } = useAuth();

  const facilityName = userProfile?.full_name ? `${userProfile.full_name} Facility` : activeRecycler.facility_name;
  const contactPerson = userProfile?.full_name || activeRecycler.contact_person;

  const [qrInput, setQrInput] = useState('KC-QR-TRACE-BLR-00101');
  const [proofImage, setProofImage] = useState<string | null>(
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&auto=format&fit=crop&q=80'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [successCert, setSuccessCert] = useState<{ id: string; timestamp: string } | null>(null);

  const matchedLogs = traceabilityLogs.filter((l) => l.qr_code_id === qrInput);

  const handleVerifyAndRecycle = async () => {
    setIsProcessing(true);
    await recyclerConfirmBatch(qrInput, proofImage || undefined);
    setIsProcessing(false);
    setSuccessCert({
      id: `EPR-CERT-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleString()
    });
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProofImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setNotification('✅ You have been logged out successfully.');
    navigate('/login', { replace: true });
  };

  const voiceSummary = `Authorized Recycler ERP Portal for ${facilityName}. Registration number ${activeRecycler.registration_no}. Authorized for smelting and secondary refining of Copper, Aluminium, PET Plastic, and E-Waste under CPCB Extended Producer Responsibility guidelines.`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-800/60 bg-gradient-to-r from-[#121F1A] via-[#10231C] to-[#121F1A]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="badge-gov">CPCB / KSPCB EPR Certified Facility</span>
              <span className="badge-verified">Formal Smelter</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              {facilityName}
            </h1>
            <p className="text-xs text-slate-300 font-mono">
              Reg No: <strong>{activeRecycler.registration_no}</strong> • Contact: <strong>{contactPerson}</strong> • Facility: <strong>{activeRecycler.address}</strong>
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {activeRecycler.authorized_materials.map((mat, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-[10px] text-emerald-300 font-semibold">
                  {mat}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-900 text-center">
              <span className="text-[10px] text-slate-400 block font-semibold">EPR Credit Balance</span>
              <span className="text-xl font-extrabold text-emerald-400">
                {activeRecycler.epr_credit_balance.toLocaleString('en-IN')} MT
              </span>
            </div>
            <VoiceReaderButton textToRead={voiceSummary} label="Listen Facility Profile" />
            <button
              onClick={handleLogout}
              className="px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center gap-2 transition-colors"
              title="Sign out of your recycler account"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>


      {/* Main Recycler QR Scanner & Ingestion Verification Station */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: QR Verification & Processing Proof */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-emerald-800/60 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>QR Provenance Verification & Inward Gate</span>
              </h3>
              <span className="text-[10px] text-emerald-400 font-bold">Zero Contamination Check</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Scan or Enter QR Traceability Token *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  placeholder="e.g. KC-QR-TRACE-BLR-00101"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0D1713] border border-emerald-800 font-mono text-xs text-slate-100 focus:outline-none focus:border-emerald-400"
                />
                <button
                  type="button"
                  onClick={() => setQrInput('KC-QR-TRACE-BLR-00101')}
                  className="px-3 py-2 rounded-xl bg-emerald-950 border border-emerald-800 text-xs font-semibold text-emerald-300"
                >
                  Load Token
                </button>
              </div>
            </div>

            {/* Proof of Processing Image Upload */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Upload Smelting / Pelletizing Proof Image
              </label>
              <label className="border border-dashed border-emerald-800/60 hover:border-emerald-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-[#0D1713] transition-all text-center">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="sr-only" />
                {proofImage ? (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden">
                    <img src={proofImage} alt="Smelting Proof" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="text-xs bg-emerald-500 text-slate-950 font-bold px-2 py-1 rounded">
                        Change Proof Image
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <Camera className="w-5 h-5 text-emerald-400 mb-1" />
                    <span className="text-[11px] text-slate-400">Click to attach furnace/pelletizer photo</span>
                  </>
                )}
              </label>
            </div>

            {/* Mark Recycled Trigger */}
            <button
              onClick={handleVerifyAndRecycle}
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-glow-green transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isProcessing ? 'Issuing EPR Hash...' : 'Mark Formally Recycled & Issue EPR Certificate'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Issued Certificate & Traceability Timeline */}
        <div className="lg:col-span-6 space-y-6">
          {successCert ? (
            <div className="glass-card rounded-2xl p-6 border-2 border-emerald-400/80 bg-[#0D1713] space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-emerald-900 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-extrabold text-sm text-slate-100">
                    Official EPR Recycling Certificate
                  </h4>
                </div>
                <span className="badge-verified text-[10px]">Issued</span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-emerald-900/40">
                  <span className="text-slate-400">Certificate ID:</span>
                  <span className="font-mono font-bold text-emerald-300">{successCert.id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-emerald-900/40">
                  <span className="text-slate-400">Authorized Facility:</span>
                  <span className="font-semibold text-slate-100">{activeRecycler.facility_name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-emerald-900/40">
                  <span className="text-slate-400">CPCB Registration:</span>
                  <span className="font-mono text-slate-300">{activeRecycler.registration_no}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-emerald-900/40">
                  <span className="text-slate-400">Traceability Token:</span>
                  <span className="font-mono text-emerald-400">{qrInput}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Timestamp:</span>
                  <span className="text-slate-400">{successCert.timestamp}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => alert(`Official EPR Certificate #${successCert.id} downloaded.`)}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Download Signed EPR Certificate PDF</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-6 border border-emerald-800/60 space-y-4">
              <h3 className="text-sm font-bold text-slate-100 border-b border-emerald-900/60 pb-3">
                Traceability Audit History for #{qrInput}
              </h3>
              {matchedLogs.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">
                  Enter a valid QR token on the left to review doorstep-to-factory journey.
                </p>
              ) : (
                <div className="space-y-3">
                  {matchedLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-900 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-400">{log.current_stage}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-slate-200 font-medium">{log.stage_title}</p>
                      <p className="text-[11px] text-slate-400">
                        Actor: {log.actor_name} ({log.location_name})
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
