import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { getGoogleMapsDirectionsUrl } from '../lib/maps';
import { PaymentModal } from '../components/PaymentModal';
import { QRGeneratorModal } from '../components/QRGeneratorModal';
import { VoiceReaderButton } from '../components/VoiceReaderButton';
import { PaymentMode, PickupRequest } from '../types';
import {
  Truck,
  MapPin,
  CheckCircle2,
  XCircle,
  Navigation,
  Scale,
  CreditCard,
  QrCode,
  Star,
  Award,
  IndianRupee,
  Calendar,
  Clock,
  IdCard,
  Layers,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  LogOut
} from 'lucide-react';

export const CollectorDashboardPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const {
    activeCollector,
    pickupRequests,
    acceptPickupRequest,
    rejectPickupRequest,
    completeWeighInAndPayment,
    materialPrices,
    setNotification
  } = useApp();
  const { userProfile, signOut } = useAuth();

  const collectorName = userProfile?.full_name || activeCollector.full_name;
  const collectorVillage = userProfile?.village || activeCollector.village;
  const collectorDistrict = userProfile?.district || activeCollector.district;

  // Active Job Workflow Modal & State
  const [selectedJob, setSelectedJob] = useState<PickupRequest | null>(null);
  const [weighedWeight, setWeighedWeight] = useState<number>(15);
  const [appliedRate, setAppliedRate] = useState<number>(420);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [generatedQRId, setGeneratedQRId] = useState<string>('');

  // Available new requests (requested status)
  const availableRequests = pickupRequests.filter((r) => r.status === 'requested');
  // In-progress or accepted by collector
  const activeJobs = pickupRequests.filter(
    (r) => (r.status === 'accepted' || r.status === 'in_progress') && (r.collector_id === activeCollector.id || !r.collector_id)
  );
  // Completed jobs
  const completedJobs = pickupRequests.filter(
    (r) => (r.status === 'paid' || r.status === 'aggregator_received' || r.status === 'recycled') && r.collector_id === activeCollector.id
  );

  const handleOpenWeighIn = (job: PickupRequest) => {
    setSelectedJob(job);
    setWeighedWeight(job.estimated_weight_kg || 15);
    // Find matching rate from live prices or default
    const matched = materialPrices.find((p) => p.category === job.material_category || p.material_name.includes(job.material_category));
    setAppliedRate(matched ? matched.price_per_kg : 380);
  };

  const handleTriggerPayment = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = async (mode: PaymentMode, txnId: string) => {
    if (!selectedJob) return;
    setIsPaymentModalOpen(false);

    const result = await completeWeighInAndPayment(
      selectedJob.id,
      Number(weighedWeight),
      Number(appliedRate),
      mode
    );

    setGeneratedQRId(result.qrCodeId);
    setIsQRModalOpen(true);
  };

  const handleLogout = async () => {
    await signOut();
    setNotification('✅ You have been logged out successfully.');
    navigate('/login', { replace: true });
  };

  const collectorVoiceText = `Collector ${collectorName}, ID ${activeCollector.collector_code}. You have ${availableRequests.length} new pickup requests available. Trust score is ${activeCollector.trust_score} out of 5. Lifetime earnings are ${activeCollector.total_earnings} rupees.`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Collector Profile Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-800/60 bg-gradient-to-r from-[#121F1A] via-[#10231C] to-[#121F1A]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <img
              src={activeCollector.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'}
              alt="Collector"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-400 shadow-glow-green"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
                  {collectorName}
                </h1>
                <span className="badge-verified">Verified Kabadiwala</span>
                <span className="badge-gov text-[10px]">e-Shram Linked</span>
              </div>
              <p className="text-xs text-slate-300 font-mono">
                Code: <strong>{activeCollector.collector_code}</strong> • QR Identity: <strong>{activeCollector.qr_identity}</strong>
              </p>
              <p className="text-xs text-slate-400">
                📍 {collectorVillage}, {collectorDistrict} ({activeCollector.state})
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-900 text-center">
              <span className="text-[10px] text-slate-400 block font-semibold">Trust Rating</span>
              <div className="flex items-center justify-center gap-1 text-base font-extrabold text-amber-300">
                <Star className="w-4 h-4 fill-amber-300" />
                <span>{activeCollector.trust_score} / 5.0</span>
              </div>
            </div>

            <VoiceReaderButton textToRead={collectorVoiceText} label="Listen Brief" />

            <Link
              to="/passport"
              className="px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-2 transition-all"
            >
              <IdCard className="w-4 h-4" />
              <span>Digital Passport</span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center gap-2 transition-colors"
              title="Sign out of your collector account"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Logout</span>
            </button>
          </div>
        </div>


        {/* 4 Financial & Impact Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-emerald-900/60">
          <div>
            <span className="text-[11px] text-slate-400 block">Total Waste Collected</span>
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-300">
              {activeCollector.total_collected_kg.toLocaleString('en-IN')} kg
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Lifetime Earnings</span>
            <span className="text-xl sm:text-2xl font-extrabold text-teal-300">
              ₹{activeCollector.total_earnings.toLocaleString('en-IN')}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">CO₂ Abated</span>
            <span className="text-xl sm:text-2xl font-extrabold text-slate-100">
              {activeCollector.co2_saved_kg} kg
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Trees Saved Equivalent</span>
            <span className="text-xl sm:text-2xl font-extrabold text-amber-300">
              {activeCollector.trees_saved_count} 🌳
            </span>
          </div>
        </div>
      </div>

      {/* Main Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Realtime Pickup Request Feed */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Assigned Jobs */}
          {activeJobs.length > 0 && (
            <div className="glass-card rounded-2xl p-6 border-2 border-emerald-500/40 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Active Doorstep Jobs in Progress ({activeJobs.length})</span>
                </div>
              </div>

              <div className="space-y-4">
                {activeJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 rounded-xl bg-[#0D1713] border border-emerald-800/80 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] text-emerald-400 font-bold font-mono">
                          ORDER #{job.id}
                        </span>
                        <h4 className="font-bold text-slate-100 text-sm">{job.citizen_name}</h4>
                        <p className="text-xs text-slate-300 mt-0.5">
                          📍 {job.address}, {job.village}
                        </p>
                      </div>
                      <span className="badge-verified uppercase text-[10px]">
                        {job.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-900">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Material:</span>
                        <span className="font-bold text-emerald-300">{job.material_category}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Est Weight:</span>
                        <span className="font-bold text-slate-200">{job.estimated_weight_kg} kg</span>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <a
                        href={getGoogleMapsDirectionsUrl(job.latitude || 12.9260, job.longitude || 77.6762)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Navigation className="w-4 h-4 text-emerald-400" />
                        <span>Google Navigation</span>
                      </a>

                      <button
                        onClick={() => handleOpenWeighIn(job)}
                        className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                      >
                        <Scale className="w-4 h-4" />
                        <span>Digital Weigh-in & Pay</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Realtime Queue */}
          <div className="glass-card rounded-2xl p-6 border border-emerald-800/60 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-100">Live Available Pickup Queue</h3>
                <p className="text-xs text-slate-400">Incoming requests broadcasted in your ward & district</p>
              </div>
              <span className="badge-verified">{availableRequests.length} Available</span>
            </div>

            {availableRequests.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No pending requests right now. New requests will appear here in Realtime.
              </div>
            ) : (
              <div className="space-y-4">
                {availableRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-900 hover:border-emerald-700/60 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] text-emerald-400 font-bold font-mono">
                          REQUEST #{req.id}
                        </span>
                        <h4 className="font-bold text-slate-100 text-sm">{req.citizen_name}</h4>
                        <p className="text-xs text-slate-300 mt-0.5">
                          📍 {req.address}, {req.village}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-300 font-bold text-xs">
                        ~{req.estimated_weight_kg} kg
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 bg-[#0D1713] p-2.5 rounded-lg border border-emerald-900">
                      <strong>Category:</strong> {req.material_category} {req.material_details && `• ${req.material_details}`}
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => acceptPickupRequest(req.id, activeCollector.id)}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{t('collector.accept_job')}</span>
                      </button>
                      <button
                        onClick={() => rejectPickupRequest(req.id)}
                        className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 font-semibold text-xs flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Decline</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Weigh-in & Payout Execution Panel */}
        <div className="lg:col-span-5 space-y-6">
          {selectedJob ? (
            <div className="glass-card rounded-2xl p-6 border-2 border-emerald-500/50 space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Scale className="w-5 h-5" />
                  <span>Doorstep Weigh-in Station</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">#{selectedJob.id}</span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 block font-semibold mb-1">
                    {t('collector.weigh_input')} *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0.5"
                      value={weighedWeight}
                      onChange={(e) => setWeighedWeight(Number(e.target.value))}
                      className="w-full px-3.5 py-3 rounded-xl bg-[#0D1713] border-2 border-emerald-500/50 text-base font-extrabold text-emerald-300 focus:outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                      kg
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 block font-semibold mb-1">
                    {t('collector.rate_input')} *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="1"
                      value={appliedRate}
                      onChange={(e) => setAppliedRate(Number(e.target.value))}
                      className="w-full px-3.5 py-3 rounded-xl bg-[#0D1713] border border-emerald-800 text-base font-extrabold text-slate-100 focus:outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                      ₹/kg
                    </span>
                  </div>
                </div>

                {/* Total Calculated Payout Box */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/80 to-teal-950/80 border border-emerald-700/60 text-center">
                  <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider block">
                    {t('collector.calc_total')}
                  </span>
                  <span className="text-3xl font-black text-emerald-300">
                    ₹{(weighedWeight * appliedRate).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <button
                  onClick={handleTriggerPayment}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-glow-green transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{t('collector.pay_citizen')}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-8 border border-emerald-900/60 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <Scale className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-200 text-sm">Precision Weighing Terminal</h4>
              <p className="text-xs text-slate-400">
                Select an active job from the left to calibrate scale weight, apply market MSP, and settle instant payouts.
              </p>
            </div>
          )}

          {/* Rural Hub Deposit Prompt (Raichur Logic) */}
          <div className="glass-card rounded-2xl p-5 border border-emerald-900/60 bg-gradient-to-br from-amber-950/20 to-emerald-950/30 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Layers className="w-4 h-4" />
              <span>District Aggregator Hub Drop-off</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Drop off your collected batches at the nearest District Aggregation Center (e.g., Raichur Hub) for bulk lot consolidation and direct bonus incentives.
            </p>
            <Link
              to="/dashboard/aggregator"
              className="inline-flex items-center gap-1 text-emerald-400 font-bold hover:underline"
            >
              <span>View Hub Drop-off Schedule</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Payment Settlement Modal */}
      {selectedJob && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
          amount={weighedWeight * appliedRate}
          citizenName={selectedJob.citizen_name || 'Citizen'}
          collectorName={activeCollector.full_name}
          weightKg={weighedWeight}
          materialName={selectedJob.material_category}
        />
      )}

      {/* Post-Payment QR Modal */}
      <QRGeneratorModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        qrValue={generatedQRId}
        title="Tamper-Proof Traceability Token"
        subtitle="Issued to Citizen & Tagged for Aggregator Hub"
        details={[
          { label: 'Collector Code', value: activeCollector.collector_code },
          { label: 'Weighed Weight', value: `${weighedWeight} kg` },
          { label: 'Total Payout', value: `₹${(weighedWeight * appliedRate).toFixed(2)}` },
          { label: 'Next Destination', value: `${activeCollector.district} Aggregator Hub` }
        ]}
      />
    </div>
  );
};
