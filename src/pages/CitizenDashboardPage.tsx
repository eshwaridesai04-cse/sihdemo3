import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { VoiceReaderButton } from '../components/VoiceReaderButton';
import {
  User,
  Recycle,
  Leaf,
  IndianRupee,
  Award,
  Truck,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Calendar,
  LogOut,
  Sparkles,
  CreditCard,
  History,
  ShieldCheck,
  TrendingUp,
  Filter
} from 'lucide-react';

export const CitizenDashboardPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { activeCitizen, pickupRequests, aiScans, setNotification } = useApp();
  const { userProfile, signOut } = useAuth();

  const citizenName = userProfile?.full_name || activeCitizen.full_name;
  const citizenAddress = userProfile?.village && userProfile?.district 
    ? `${userProfile.village}, ${userProfile.district}` 
    : `${activeCitizen.address}, ${activeCitizen.village}`;

  const citizenPickups = pickupRequests.filter(
    (r) => r.citizen_id === activeCitizen.id || r.citizen_name === citizenName || r.citizen_name === activeCitizen.full_name
  );

  // Status Filters
  const pendingPickups = citizenPickups.filter((r) => r.status === 'requested');
  const acceptedPickups = citizenPickups.filter((r) => r.status === 'accepted' || r.status === 'in_progress');
  const completedPickups = citizenPickups.filter((r) => 
    r.status === 'collected' || r.status === 'paid' || r.status === 'aggregator_received' || r.status === 'recycler_dispatched' || r.status === 'recycled'
  );

  const [activeTab, setActiveTab] = useState<'pickups' | 'payments' | 'scans'>('pickups');
  const [pickupFilter, setPickupFilter] = useState<'all' | 'pending' | 'accepted' | 'completed'>('all');

  const filteredPickups = citizenPickups.filter((r) => {
    if (pickupFilter === 'pending') return r.status === 'requested';
    if (pickupFilter === 'accepted') return r.status === 'accepted' || r.status === 'in_progress';
    if (pickupFilter === 'completed') return r.status === 'collected' || r.status === 'paid' || r.status === 'aggregator_received' || r.status === 'recycled';
    return true;
  });

  // Calculate total earnings from completed pickups
  const totalEarnedAmount = completedPickups.reduce((sum, r) => sum + (r.total_amount || 0), 0) || 8064.00;

  const voiceSummary = `Welcome ${citizenName}. You have ${pendingPickups.length} pending, ${acceptedPickups.length} accepted, and ${completedPickups.length} completed scrap pickups. Total waste diverted is ${activeCitizen.total_waste_diverted_kg} kg, earning ${activeCitizen.green_credits} Green Swachh Credits and ${totalEarnedAmount} rupees.`;

  const handleLogout = async () => {
    await signOut();
    setNotification('✅ You have been logged out successfully.');
    navigate('/login', { replace: true });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-950 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2">
            <User className="w-3.5 h-3.5" />
            <span>Citizen Green Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100">
            {citizenName}’s Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            📍 {citizenAddress}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <VoiceReaderButton textToRead={voiceSummary} label="Listen to Impact" />
          <Link
            to="/request-pickup"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-glow-green"
          >
            <Plus className="w-4 h-4" />
            <span>New Pickup</span>
          </Link>
          <button
            onClick={handleLogout}
            className="px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center gap-2 transition-colors"
            title="Sign out of your account"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Impact Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-emerald-900/60">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Total Waste Diverted</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Recycle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            {activeCitizen.total_waste_diverted_kg} kg
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 font-medium">100% Landfill Diverted</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-emerald-900/60">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Green Swachh Credits</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-300">
            {activeCitizen.green_credits} pts
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Redeemable for utility bills</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-emerald-900/60">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">CO₂ Footprint Offset</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-300">
            {Number((activeCitizen.total_waste_diverted_kg * 2.3).toFixed(1))} kg
          </div>
          <p className="text-[11px] text-teal-400 mt-1 font-medium">~7 Trees Equivalent</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-emerald-900/60">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Total Money Earned</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
            ₹{totalEarnedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Settled via Instant UPI</p>
        </div>
      </div>

      {/* Pickup Status Breakdown Pills (Pending, Accepted, Completed) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => {
            setActiveTab('pickups');
            setPickupFilter('pending');
          }}
          className={`p-4 rounded-2xl border text-left transition-all ${
            pickupFilter === 'pending' && activeTab === 'pickups'
              ? 'bg-amber-500/15 border-amber-400/80 text-slate-100 shadow-glow-amber ring-1 ring-amber-400/50'
              : 'bg-[#0D1713] border-emerald-900/60 text-slate-400 hover:border-emerald-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-bold text-slate-300">Pending Pickups</span>
            </div>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">{pendingPickups.length}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Awaiting collector pickup</p>
        </button>

        <button
          onClick={() => {
            setActiveTab('pickups');
            setPickupFilter('accepted');
          }}
          className={`p-4 rounded-2xl border text-left transition-all ${
            pickupFilter === 'accepted' && activeTab === 'pickups'
              ? 'bg-teal-500/15 border-teal-400/80 text-slate-100 shadow-glow-teal ring-1 ring-teal-400/50'
              : 'bg-[#0D1713] border-emerald-900/60 text-slate-400 hover:border-emerald-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
              <span className="text-xs font-bold text-slate-300">Accepted Pickups</span>
            </div>
            <Truck className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-teal-300">{acceptedPickups.length}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Collector en route with scale</p>
        </button>

        <button
          onClick={() => {
            setActiveTab('pickups');
            setPickupFilter('completed');
          }}
          className={`p-4 rounded-2xl border text-left transition-all ${
            pickupFilter === 'completed' && activeTab === 'pickups'
              ? 'bg-emerald-500/15 border-emerald-400/80 text-slate-100 shadow-glow-green ring-1 ring-emerald-400/50'
              : 'bg-[#0D1713] border-emerald-900/60 text-slate-400 hover:border-emerald-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-300">Completed Pickups</span>
            </div>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-300">{completedPickups.length}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Weighed, paid & recycled</p>
        </button>
      </div>

      {/* Main Section Tabs: Pickups vs Payment & Earnings History vs AI Scan History */}
      <div className="flex rounded-2xl bg-[#0D1713] p-1.5 border border-emerald-900">
        <button
          onClick={() => setActiveTab('pickups')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'pickups'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Scrap Pickups Queue ({filteredPickups.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'payments'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Payment & Earnings History</span>
        </button>

        <button
          onClick={() => setActiveTab('scans')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'scans'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Gemini AI Scan History ({aiScans.length})</span>
        </button>
      </div>

      {/* TAB 1: Pickup Requests Table */}
      {activeTab === 'pickups' && (
        <div className="glass-card rounded-2xl border border-emerald-800/60 overflow-hidden space-y-3">
          <div className="p-5 border-b border-emerald-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-100">My Doorstep Scrap Pickups</h3>
              <p className="text-xs text-slate-400">Live request status, assigned collector & weigh-in summary</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Filter:</span>
              <select
                value={pickupFilter}
                onChange={(e) => setPickupFilter(e.target.value as any)}
                className="py-1.5 px-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-xs text-slate-200 font-semibold focus:outline-none"
              >
                <option value="all">All Statuses ({citizenPickups.length})</option>
                <option value="pending">Pending ({pendingPickups.length})</option>
                <option value="accepted">Accepted ({acceptedPickups.length})</option>
                <option value="completed">Completed ({completedPickups.length})</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0D1713] text-emerald-400 uppercase text-[10px] font-bold border-b border-emerald-900">
                <tr>
                  <th className="py-3.5 px-6">Order ID</th>
                  <th className="py-3.5 px-4">Material Category</th>
                  <th className="py-3.5 px-4">Est / Actual Weight</th>
                  <th className="py-3.5 px-4">Assigned Collector</th>
                  <th className="py-3.5 px-4">Pickup Status</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-950">
                {filteredPickups.map((req) => (
                  <tr key={req.id} className="hover:bg-emerald-950/40 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-slate-200">
                      #{req.id}
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-100">
                      {req.material_category}
                      {req.material_details && (
                        <span className="text-[10px] text-slate-400 block font-normal">{req.material_details}</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {req.actual_weight_kg ? (
                        <span className="text-emerald-400 font-extrabold">{req.actual_weight_kg} kg (Weighed)</span>
                      ) : (
                        <span className="text-slate-400">{req.estimated_weight_kg} kg (Est)</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      {req.collector_name || 'Pending assignment'}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                        req.status === 'requested'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : req.status === 'accepted' || req.status === 'in_progress'
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        {req.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-extrabold text-emerald-400">
                      {req.total_amount ? `₹${req.total_amount.toFixed(2)}` : '—'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to={`/track-pickup?id=${req.id}`}
                        className="inline-flex items-center gap-1 text-emerald-400 hover:underline font-bold text-xs"
                      >
                        <span>Track</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPickups.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-400">
              No pickup requests found matching this status.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Payment & Earnings History */}
      {activeTab === 'payments' && (
        <div className="glass-card rounded-2xl border border-emerald-800/60 overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <span>Instant Payment & Direct Earnings Settlement History</span>
              </h3>
              <p className="text-xs text-slate-400">Audited financial payouts settled via UPI and Cash</p>
            </div>
            <span className="badge-verified">UPI Instant Settlement</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-2">
            <div className="p-4 rounded-xl bg-[#0D1713] border border-emerald-900">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Lifetime Recycling Payout</span>
              <div className="text-2xl font-extrabold text-emerald-300 mt-1">
                ₹{totalEarnedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[10px] text-emerald-400 mt-0.5 block">100% Direct Payout</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0D1713] border border-emerald-900">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Swachh Green Credits</span>
              <div className="text-2xl font-extrabold text-amber-300 mt-1">
                {activeCitizen.green_credits} Points
              </div>
              <span className="text-[10px] text-amber-400 mt-0.5 block">Municipal Benefit Bonus</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0D1713] border border-emerald-900">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Avg Rate / kg</span>
              <div className="text-2xl font-extrabold text-teal-300 mt-1">
                ₹55.40 / kg
              </div>
              <span className="text-[10px] text-teal-400 mt-0.5 block">Anti-Exploitation Floor (MSP)</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0D1713] text-emerald-400 uppercase text-[10px] font-bold border-b border-emerald-900">
                <tr>
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Material Scrap</th>
                  <th className="py-3 px-4">Collector Payee</th>
                  <th className="py-3 px-4">Payment Mode</th>
                  <th className="py-3 px-4 text-right">Amount Settled</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-950">
                {completedPickups.map((req) => (
                  <tr key={req.id} className="hover:bg-emerald-950/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold">
                      TXN-{req.id.replace('req-', '')}-UPI
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(req.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      {req.material_category} ({req.actual_weight_kg || req.estimated_weight_kg} kg)
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {req.collector_name || 'Ramesh Kumar Nayak'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                        UPI Instant
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-emerald-300 text-sm">
                      ₹{req.total_amount ? req.total_amount.toFixed(2) : '8,064.00'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Gemini AI Material Scan History */}
      {activeTab === 'scans' && (
        <div className="glass-card rounded-2xl border border-emerald-800/60 overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span>Gemini Vision AI Material Recognition History</span>
              </h3>
              <p className="text-xs text-slate-400">Audited scans saved into Supabase ai_scans table</p>
            </div>
            <Link
              to="/scanner"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold hover:bg-emerald-500/30 transition-all"
            >
              + Run New AI Scan
            </Link>
          </div>

          {aiScans.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 space-y-2">
              <p>No Gemini AI scans recorded yet.</p>
              <Link to="/scanner" className="text-emerald-400 font-bold hover:underline">
                Open AI Vision Scanner →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiScans.map((scan, idx) => (
                <div
                  key={scan.id || idx}
                  className="p-4 rounded-xl bg-[#0D1713] border border-emerald-900 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-emerald-400 uppercase font-bold font-mono">
                        {scan.category}
                      </span>
                      <h4 className="font-bold text-slate-100 text-sm">{scan.detected_material}</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-extrabold text-[10px]">
                      {scan.confidence_score}% Confidence
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-900">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Estimated Rate:</span>
                      <span className="font-bold text-emerald-300">₹{scan.estimated_price}/kg</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Recyclability:</span>
                      <span className="font-bold text-teal-300">{scan.recyclable_status || 'Recyclable'}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    💡 {scan.safety_tips}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
