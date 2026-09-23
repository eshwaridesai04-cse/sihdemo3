import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { getStaticMapUrl, getGoogleMapsDirectionsUrl } from '../lib/maps';
import { VoiceReaderButton } from '../components/VoiceReaderButton';
import { QRGeneratorModal } from '../components/QRGeneratorModal';
import {
  Truck,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  QrCode,
  ArrowRight,
  User,
  Star
} from 'lucide-react';

export const TrackPickupPage: React.FC = () => {
  const { t } = useLanguage();
  const { pickupRequests, activeCollector } = useApp();
  const [searchParams] = useSearchParams();

  const selectedId = searchParams.get('id') || (pickupRequests[0]?.id ?? 'req-101');
  const [activeReqId, setActiveReqId] = useState(selectedId);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const currentRequest = pickupRequests.find((r) => r.id === activeReqId) || pickupRequests[0];

  const stages = [
    { key: 'requested', label: t('track.status_requested'), desc: 'Request broadcasted to local collectors' },
    { key: 'accepted', label: t('track.status_accepted'), desc: 'Collector accepted and assigned' },
    { key: 'in_progress', label: t('track.status_in_progress'), desc: 'Collector en route with digital scale' },
    { key: 'collected', label: t('track.status_collected'), desc: 'Doorstep weighing & inspection complete' },
    { key: 'paid', label: t('track.status_paid'), desc: 'Instant UPI/Cash settlement confirmed' },
    { key: 'recycled', label: t('track.status_recycled'), desc: 'Transformed into secondary raw material' },
  ];

  const getStageIndex = (status: string) => {
    switch (status) {
      case 'requested': return 0;
      case 'accepted': return 1;
      case 'in_progress': return 2;
      case 'collected': return 3;
      case 'paid':
      case 'aggregator_received':
      case 'recycler_dispatched': return 4;
      case 'recycled': return 5;
      default: return 0;
    }
  };

  const currentStageIdx = getStageIndex(currentRequest?.status || 'requested');

  const voiceStatusText = currentRequest
    ? `Pickup order status for ${currentRequest.material_category} at ${currentRequest.village} is ${currentRequest.status}. Assigned collector is ${currentRequest.collector_name || 'Ramesh Kumar Nayak'}, trust rating 4.9 out of 5.`
    : 'No active pickup found.';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-950 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2">
            <Truck className="w-3.5 h-3.5" />
            <span>Realtime GPS Dispatch Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100">{t('track.title')}</h1>
          <p className="text-xs text-slate-400 mt-1">{t('track.subtitle')}</p>
        </div>

        <div className="flex items-center gap-3">
          <VoiceReaderButton textToRead={voiceStatusText} label="Listen to Status" />
          {/* Pickup Switcher Pill */}
          <select
            value={activeReqId}
            onChange={(e) => setActiveReqId(e.target.value)}
            className="py-2 px-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-xs text-slate-200 font-semibold focus:outline-none"
          >
            {pickupRequests.map((req) => (
              <option key={req.id} value={req.id}>
                Order #{req.id} ({req.material_category} - {req.village})
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentRequest ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Stage Progress & Assigned Collector */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step Timeline */}
            <div className="glass-card rounded-2xl p-6 border border-emerald-800/60 space-y-6">
              <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
                <span className="text-xs font-bold text-slate-300">Order #{currentRequest.id}</span>
                <span className="badge-verified uppercase font-bold text-[10px]">
                  {currentRequest.status.replace('_', ' ')}
                </span>
              </div>

              <div className="space-y-6">
                {stages.map((st, idx) => {
                  const isDone = idx <= currentStageIdx;
                  const isCurrent = idx === currentStageIdx;
                  return (
                    <div key={st.key} className="flex items-start gap-4 relative">
                      {idx !== stages.length - 1 && (
                        <div
                          className={`absolute left-4 top-8 w-0.5 h-12 -ml-[1px] ${
                            idx < currentStageIdx ? 'bg-emerald-500' : 'bg-emerald-950'
                          }`}
                        />
                      )}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all ${
                          isDone
                            ? 'bg-emerald-500 text-slate-950 font-bold shadow-glow-green'
                            : 'bg-emerald-950 text-slate-500 border border-emerald-900'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs">{idx + 1}</span>}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-bold ${isCurrent ? 'text-emerald-400' : isDone ? 'text-slate-200' : 'text-slate-500'}`}>
                            {st.label}
                          </h4>
                          {isCurrent && (
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{st.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Assigned Collector Profile Card */}
            <div className="glass-card rounded-2xl p-6 border border-emerald-800/60">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block mb-3">
                {t('track.assigned_collector')}
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={activeCollector.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'}
                    alt="Collector"
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-glow-green"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-slate-100">
                        {currentRequest.collector_name || activeCollector.full_name}
                      </h4>
                      <span className="badge-verified text-[10px]">Verified</span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">
                      ID: {activeCollector.collector_code} • {activeCollector.village}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-amber-300 font-bold mt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-300" />
                      <span>{activeCollector.trust_score} Trust Score</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${activeCollector.phone}`}
                    className="py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{t('track.call_collector')}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live GPS Route Map & Pickup Breakdown */}
          <div className="lg:col-span-5 space-y-6">
            {/* Map Frame */}
            <div className="glass-card rounded-2xl p-4 border border-emerald-800/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>GPS Destination Pin</span>
                </span>
                <a
                  href={getGoogleMapsDirectionsUrl(currentRequest.latitude || 12.9260, currentRequest.longitude || 77.6762)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline text-xs flex items-center gap-1 font-semibold"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="relative rounded-xl overflow-hidden aspect-video border border-emerald-900">
                <iframe
                  title="Doorstep GPS Map"
                  src={getStaticMapUrl(currentRequest.latitude || 12.9260, currentRequest.longitude || 77.6762)}
                  className="w-full h-full border-0 grayscale-[40%] contrast-125"
                />
              </div>

              <p className="text-xs text-slate-300 font-medium truncate">
                📍 {currentRequest.address}, {currentRequest.village}
              </p>
            </div>

            {/* Scrap Order Breakdown */}
            <div className="glass-card rounded-2xl p-6 border border-emerald-800/60 space-y-4">
              <h3 className="text-sm font-bold text-slate-100 border-b border-emerald-900/60 pb-3">
                Scrap Batch Details
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-emerald-900/30">
                  <span className="text-slate-400">Material Category:</span>
                  <span className="font-bold text-emerald-400">{currentRequest.material_category}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-emerald-900/30">
                  <span className="text-slate-400">Estimated Weight:</span>
                  <span className="font-semibold text-slate-200">{currentRequest.estimated_weight_kg} kg</span>
                </div>
                {currentRequest.actual_weight_kg && (
                  <div className="flex justify-between py-1 border-b border-emerald-900/30">
                    <span className="text-slate-400">Actual Weighed:</span>
                    <span className="font-extrabold text-teal-300">{currentRequest.actual_weight_kg} kg</span>
                  </div>
                )}
                {currentRequest.total_amount && (
                  <div className="flex justify-between py-1 border-b border-emerald-900/30">
                    <span className="text-slate-400">Total Settled:</span>
                    <span className="font-extrabold text-emerald-400 text-sm">₹{currentRequest.total_amount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Scheduled Time:</span>
                  <span className="text-slate-300">{currentRequest.preferred_date} ({currentRequest.preferred_time_slot})</span>
                </div>
              </div>

              {currentRequest.qr_code_id && (
                <button
                  onClick={() => setIsQRModalOpen(true)}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all mt-2"
                >
                  <QrCode className="w-4 h-4" />
                  <span>View Traceability QR Code</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-16 text-center text-slate-400">No active pickup requests found.</div>
      )}

      {/* QR Traceability Modal */}
      {currentRequest?.qr_code_id && (
        <QRGeneratorModal
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
          qrValue={currentRequest.qr_code_id}
          title="Chain-of-Custody Traceability Token"
          subtitle={`Verified Pickup Order #${currentRequest.id}`}
          details={[
            { label: 'Citizen', value: currentRequest.citizen_name || 'Ananya Sharma' },
            { label: 'Collector', value: currentRequest.collector_name || 'Ramesh Kumar Nayak' },
            { label: 'Material', value: currentRequest.material_category },
            { label: 'Weight', value: `${currentRequest.actual_weight_kg || currentRequest.estimated_weight_kg} kg` },
            { label: 'Settlement', value: currentRequest.total_amount ? `₹${currentRequest.total_amount}` : 'Pending' }
          ]}
        />
      )}
    </div>
  );
};
