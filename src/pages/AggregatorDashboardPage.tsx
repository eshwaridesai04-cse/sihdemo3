import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { VoiceReaderButton } from '../components/VoiceReaderButton';
import {
  Layers,
  MapPin,
  Truck,
  Scale,
  Factory,
  Bell,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Package,
  Calendar,
  Send,
  Sparkles,
  LogOut
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AggregatorDashboardPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const {
    activeAggregator,
    aggregatorInventory,
    pickupRequests,
    aggregatorReceiveBatch,
    setNotification
  } = useApp();
  const { userProfile, signOut } = useAuth();

  const hubName = userProfile?.full_name ? `${userProfile.full_name} Hub` : activeAggregator.hub_name;
  const operatorName = userProfile?.full_name || activeAggregator.operator_name;
  const hubDistrict = userProfile?.district || activeAggregator.district;

  const [selectedHub, setSelectedHub] = useState(activeAggregator.id);
  const [isDispatching, setIsDispatching] = useState(false);

  // Incoming pickups ready for hub drop-off (paid by collectors)
  const incomingPickups = pickupRequests.filter((r) => r.status === 'paid');

  // Hub total weight
  const totalStockKg = aggregatorInventory.reduce((sum, item) => sum + item.weight_kg, 0);
  const thresholdKg = activeAggregator.dispatch_threshold_kg || 2000;
  const progressPercent = Math.min(100, Math.round((totalStockKg / thresholdKg) * 100));

  const handleReceiveDropoff = async (pickupId: string) => {
    await aggregatorReceiveBatch(pickupId, activeAggregator.id);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  const handleTriggerBulkDispatch = () => {
    setIsDispatching(true);
    setTimeout(() => {
      setIsDispatching(false);
      setNotification(`🚛 Bulk Lot (${totalStockKg} kg) dispatched to EcoMetals & GreenPolymer Smelters!`);
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    }, 1200);
  };

  const handleLogout = async () => {
    await signOut();
    setNotification('✅ You have been logged out successfully.');
    navigate('/login', { replace: true });
  };

  const voiceSummary = `Aggregator Hub ${hubName} at ${hubDistrict}. Current accumulated stock is ${totalStockKg} kg, which is ${progressPercent} percent of the bulk dispatch threshold. Rural consolidation active for tier-3 collectors.`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-950 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>District Aggregation & Baling Node</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100">
            {hubName}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            📍 {activeAggregator.address}, {hubDistrict} • Operator: <strong>{operatorName}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <VoiceReaderButton textToRead={voiceSummary} label="Listen Hub Status" />
          <button
            onClick={handleLogout}
            className="px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center gap-2 transition-colors"
            title="Sign out of your aggregator account"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Logout</span>
          </button>
        </div>
      </div>


      {/* Rural Supply Chain Logic Banner (Raichur Model) */}
      <div className="glass-card rounded-2xl p-6 border border-emerald-800/60 bg-gradient-to-r from-emerald-950/60 via-[#10231C] to-emerald-950/60">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="badge-gov">Rural & Tier-3 District Logic (SIH Problem Statement Focus)</span>
            <h3 className="text-lg font-bold text-slate-100">
              Bulk Baling & Industrial Recycler Threshold System
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              In districts without proximate industrial smelters (such as Raichur), waste pickers cannot transport small lots to industrial centers. This hub accumulates lots, balances purity, and triggers automated bulk logistics when the <strong>{thresholdKg} kg threshold</strong> is reached.
            </p>
          </div>

          {/* Threshold Progress Bar Widget */}
          <div className="w-full lg:w-80 bg-[#0D1713] p-4 rounded-xl border border-emerald-900/80 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-semibold">Consolidated Volume</span>
              <span className="text-emerald-400 font-bold">{totalStockKg} / {thresholdKg} kg</span>
            </div>
            <div className="w-full h-3.5 rounded-full bg-emerald-950 overflow-hidden p-0.5 border border-emerald-900">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">{progressPercent}% Capacity</span>
              {progressPercent >= 90 ? (
                <span className="text-amber-400 font-bold animate-pulse">⚡ Threshold Ready</span>
              ) : (
                <span className="text-slate-500">{thresholdKg - totalStockKg} kg to trigger</span>
              )}
            </div>
          </div>
        </div>

        {progressPercent >= 90 && (
          <div className="mt-5 pt-4 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Threshold reached! Industrial recyclers (Peenya / Doddaballapur) alerted for bulk collection.</span>
            </div>
            <button
              onClick={handleTriggerBulkDispatch}
              disabled={isDispatching}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{isDispatching ? 'Dispatching...' : 'Dispatch Bulk Lot to Smelter'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Two Column Layout: Drop-off Ingestion & Inventory Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Collector Drop-off Inward Gate */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card rounded-2xl p-6 border border-emerald-800/60 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-100">Collector Drop-off Intake</h3>
                <p className="text-[11px] text-slate-400">Batches collected in field ready for hub ingestion</p>
              </div>
              <span className="badge-verified">{incomingPickups.length} Incoming</span>
            </div>

            {incomingPickups.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                All collected batches ingested into hub inventory.
              </div>
            ) : (
              <div className="space-y-3">
                {incomingPickups.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-900 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] text-emerald-400 font-mono font-bold">
                          ORDER #{p.id}
                        </span>
                        <h4 className="font-bold text-slate-200 text-xs">{p.material_category}</h4>
                        <p className="text-[11px] text-slate-400">Collector: {p.collector_name}</p>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-400">
                        {p.actual_weight_kg || p.estimated_weight_kg} kg
                      </span>
                    </div>

                    <button
                      onClick={() => handleReceiveDropoff(p.id)}
                      className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ingest into Hub Inventory</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Aggregator Inventory Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-card rounded-2xl border border-emerald-800/60 overflow-hidden">
            <div className="p-5 border-b border-emerald-900/60 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100">Hub Consolidated Inventory</h3>
                <p className="text-xs text-slate-400">Active consolidated batches tagged with traceability tokens</p>
              </div>
              <span className="badge-verified">{aggregatorInventory.length} Active Lots</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#0D1713] text-emerald-400 uppercase text-[10px] font-bold border-b border-emerald-900">
                  <tr>
                    <th className="py-3 px-5">Batch ID</th>
                    <th className="py-3 px-4">Material Grade</th>
                    <th className="py-3 px-4">Net Weight</th>
                    <th className="py-3 px-4">Collector Source</th>
                    <th className="py-3 px-4">Hub Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-950">
                  {aggregatorInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-emerald-950/40 transition-colors">
                      <td className="py-3.5 px-5 font-mono font-bold text-slate-200">
                        {item.batch_id}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-100">
                        {item.material_name}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-emerald-400">
                        {item.weight_kg} kg
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {item.collector_name || 'Ramesh Nayak'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.status === 'threshold_reached'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
