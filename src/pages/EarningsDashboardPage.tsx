import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { VoiceReaderButton } from '../components/VoiceReaderButton';
import {
  IndianRupee,
  TrendingUp,
  Wallet,
  CreditCard,
  QrCode,
  Banknote,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Layers,
  Award,
  CheckCircle2,
  Receipt,
  History,
  FileSpreadsheet
} from 'lucide-react';

export const EarningsDashboardPage: React.FC = () => {
  const { t } = useLanguage();
  const { activeCollector, pickupRequests, traceabilityLogs } = useApp();
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [activeTab, setActiveTab] = useState<'earnings' | 'transactions' | 'payments' | 'traceability'>('earnings');

  const completedRequests = pickupRequests.filter(
    (r) => r.status === 'paid' || r.status === 'aggregator_received' || r.status === 'recycled'
  );

  const totalEarned = activeCollector.total_earnings;
  const weeklyEarned = Math.round(totalEarned * 0.28);
  const dailyEarned = Math.round(weeklyEarned * 0.18);

  const materialBreakdown = [
    { name: 'Metals (Copper, Brass, Steel)', percent: 54, amount: Math.round(totalEarned * 0.54), color: 'bg-emerald-500' },
    { name: 'Plastics (PET, HDPE)', percent: 22, amount: Math.round(totalEarned * 0.22), color: 'bg-teal-400' },
    { name: 'E-Waste & Batteries', percent: 16, amount: Math.round(totalEarned * 0.16), color: 'bg-amber-400' },
    { name: 'Paper & Cardboard (OCC)', percent: 8, amount: Math.round(totalEarned * 0.08), color: 'bg-slate-400' },
  ];

  const voiceSummary = `Financial, Payment and Transaction Dashboard for ${activeCollector.full_name}. Lifetime earnings total ${totalEarned} rupees. Metals represent 54% of revenue. Credit rating enables micro-loan eligibility up to 50,000 rupees under PM-SVANidhi.`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-950 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2">
            <Wallet className="w-3.5 h-3.5" />
            <span>Formal Waste Economy Financial Hub</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100">
            Collector Financials, Payments & Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Linked to Aadhaar & e-Shram Direct Benefit Transfer (DBT)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <VoiceReaderButton textToRead={voiceSummary} label="Listen Financials" />
          <div className="flex rounded-xl bg-emerald-950 p-1 border border-emerald-800 text-xs font-bold">
            <button
              onClick={() => setTimeframe('daily')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeframe === 'daily' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setTimeframe('weekly')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeframe === 'weekly' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeframe('monthly')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeframe === 'monthly' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>

      {/* Main Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-emerald-900/60">
          <span className="text-xs text-slate-400 font-semibold block">
            {timeframe === 'daily' ? 'Today’s Revenue' : timeframe === 'weekly' ? 'This Week’s Revenue' : 'This Month’s Revenue'}
          </span>
          <div className="text-3xl font-black text-emerald-400 mt-2">
            ₹{timeframe === 'daily' ? dailyEarned.toLocaleString('en-IN') : timeframe === 'weekly' ? weeklyEarned.toLocaleString('en-IN') : totalEarned.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-300 font-medium mt-1 inline-flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +14.2% vs last period
          </span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-emerald-900/60">
          <span className="text-xs text-slate-400 font-semibold block">Instant UPI Payouts</span>
          <div className="text-3xl font-black text-teal-300 mt-2">
            88.5%
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Zero delay to bank account</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-emerald-900/60">
          <span className="text-xs text-slate-400 font-semibold block">Micro-Loan Credit Score</span>
          <div className="text-3xl font-black text-amber-300 mt-2">
            785 <span className="text-xs font-normal text-slate-400">/ 900</span>
          </div>
          <span className="text-[11px] text-amber-400 mt-1 block">Eligible for ₹50,000 credit</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-emerald-900/60">
          <span className="text-xs text-slate-400 font-semibold block">Ayushman Health Cover</span>
          <div className="text-xl font-bold text-slate-100 mt-2 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>₹5,00,000</span>
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block">Active PM-JAY Policy</span>
        </div>
      </div>

      {/* Sub-Navigation Tabs: Earnings, Transactions, Payments, Traceability */}
      <div className="flex rounded-2xl bg-[#0D1713] p-1.5 border border-emerald-900">
        <button
          onClick={() => setActiveTab('earnings')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'earnings'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Earnings Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'transactions'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Transactions Ledger</span>
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
          <span>Payments Ledger</span>
        </button>

        <button
          onClick={() => setActiveTab('traceability')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'traceability'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Traceability Logs</span>
        </button>
      </div>

      {/* TAB 1: Earnings Revenue Breakdown */}
      {activeTab === 'earnings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
          <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-emerald-800/60 space-y-4">
            <h3 className="text-base font-bold text-slate-100 border-b border-emerald-900/60 pb-3">
              Material Revenue Distribution
            </h3>

            <div className="space-y-4">
              {materialBreakdown.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-300">{item.name}</span>
                    <span className="font-bold text-emerald-400">
                      ₹{item.amount.toLocaleString('en-IN')} ({item.percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-emerald-950 overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Inclusion & Schemes */}
          <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-emerald-800/60 space-y-4">
            <h3 className="text-base font-bold text-slate-100 border-b border-emerald-900/60 pb-3">
              Formal Government Schemes
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-900 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-200 block">PM SVANidhi Micro-Credit</span>
                  <span className="text-[11px] text-slate-400">Collateral-free working capital</span>
                </div>
                <span className="badge-verified">Pre-Approved</span>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-900 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-200 block">e-Shram Social Security</span>
                  <span className="text-[11px] text-slate-400">Accident Insurance ₹2 Lakh</span>
                </div>
                <span className="badge-verified">Active</span>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-900 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-200 block">DBT Direct Bank Account</span>
                  <span className="text-[11px] text-slate-400">HDFC Bank A/C ending 4012</span>
                </div>
                <span className="badge-verified">Verified</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Transactions Dashboard */}
      {activeTab === 'transactions' && (
        <div className="glass-card rounded-2xl border border-emerald-800/60 overflow-hidden p-6 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-400" />
                <span>Transactions Ledger (Material Breakdown & Weigh-in Records)</span>
              </h3>
              <p className="text-xs text-slate-400">Itemized weigh-in records saved in transactions table</p>
            </div>
            <span className="badge-verified">{completedRequests.length} Transactions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0D1713] text-emerald-400 uppercase text-[10px] font-bold border-b border-emerald-900">
                <tr>
                  <th className="py-3 px-4">Txn ID</th>
                  <th className="py-3 px-4">Pickup ID</th>
                  <th className="py-3 px-4">Material Grade</th>
                  <th className="py-3 px-4">Weight (kg)</th>
                  <th className="py-3 px-4">Applied Rate (₹/kg)</th>
                  <th className="py-3 px-4">Payment Mode</th>
                  <th className="py-3 px-4 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-950">
                {completedRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-emerald-950/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-300">
                      TXN-{req.id.replace('req-', '')}-99
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      #{req.id}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-100">
                      {req.material_category}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-200">
                      {req.actual_weight_kg || req.estimated_weight_kg} kg
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      ₹{req.rate_per_kg || 420.00}/kg
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

      {/* TAB 3: Payments Dashboard */}
      {activeTab === 'payments' && (
        <div className="glass-card rounded-2xl border border-emerald-800/60 overflow-hidden p-6 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <span>Payments Ledger (Realtime Escrow & Payout Settlements)</span>
              </h3>
              <p className="text-xs text-slate-400">Payer/Payee financial audit saved in payments table</p>
            </div>
            <span className="badge-verified">Audited Settlements</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0D1713] text-emerald-400 uppercase text-[10px] font-bold border-b border-emerald-900">
                <tr>
                  <th className="py-3 px-4">Payment ID</th>
                  <th className="py-3 px-4">Payer (Collector)</th>
                  <th className="py-3 px-4">Payee (Citizen)</th>
                  <th className="py-3 px-4">Mode</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Settled Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-950">
                {completedRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-emerald-950/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-teal-300 font-bold">
                      PAY-{req.id.replace('req-', '')}-01
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      {activeCollector.full_name} ({activeCollector.collector_code})
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {req.citizen_name || 'Ananya Sharma'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                        UPI / Bank DBT
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="badge-verified text-[10px]">
                        Completed
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-emerald-400 text-sm">
                      ₹{req.total_amount ? req.total_amount.toFixed(2) : '8,064.00'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Traceability Logs */}
      {activeTab === 'traceability' && (
        <div className="glass-card rounded-2xl border border-emerald-800/60 overflow-hidden p-6 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-emerald-400" />
                <span>Traceability Logs (Circular Provenance Records)</span>
              </h3>
              <p className="text-xs text-slate-400">Audit trail saved in traceability_logs table</p>
            </div>
            <span className="badge-verified">{traceabilityLogs.length} Log Entries</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0D1713] text-emerald-400 uppercase text-[10px] font-bold border-b border-emerald-900">
                <tr>
                  <th className="py-3 px-4">Log ID</th>
                  <th className="py-3 px-4">QR Token ID</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4 text-right">CO₂ Offset</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-950">
                {traceabilityLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-emerald-950/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {log.id}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      {log.qr_code_id}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-100">
                      {log.current_stage}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {log.actor_name} ({log.actor_type})
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {log.location_name}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-teal-300">
                      {log.carbon_offset_kg ? `${log.carbon_offset_kg} kg` : '0 kg'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
