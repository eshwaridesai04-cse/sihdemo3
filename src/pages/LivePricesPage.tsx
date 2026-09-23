import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { VoiceReaderButton } from '../components/VoiceReaderButton';
import {
  TrendingUp,
  Filter,
  MapPin,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw,
  Search,
  IndianRupee
} from 'lucide-react';

export const LivePricesPage: React.FC = () => {
  const { t } = useLanguage();
  const { materialPrices } = useApp();

  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Distinct cities and categories
  const cities = useMemo(() => {
    const set = new Set(materialPrices.map((p) => p.city));
    return ['All', ...Array.from(set)];
  }, [materialPrices]);

  const categories = useMemo(() => {
    const set = new Set(materialPrices.map((p) => p.category));
    return ['All', ...Array.from(set)];
  }, [materialPrices]);

  // Filtered prices
  const filteredPrices = useMemo(() => {
    return materialPrices.filter((item) => {
      const matchCity = selectedCity === 'All' || item.city === selectedCity;
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchSearch = item.material_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCity && matchCat && matchSearch;
    });
  }, [materialPrices, selectedCity, selectedCategory, searchQuery]);

  // Voice speech summary of today's prices
  const voiceText = useMemo(() => {
    const topItems = filteredPrices.slice(0, 5);
    const summaryList = topItems
      .map((item) => `${item.material_name} is ${item.price_per_kg} rupees per ${item.unit}`)
      .join('. ');
    return `Today's live recyclable scrap prices: ${summaryList}. Government minimum support price benchmark applies.`;
  }, [filteredPrices]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-emerald-950 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{t('prices.last_sync')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
            {t('prices.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            {t('prices.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <VoiceReaderButton textToRead={voiceText} label={t('prices.speak_btn')} />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#121F1A]/90 p-4 rounded-2xl border border-emerald-900/60">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search material (e.g. Copper, PET, PCB)..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400"
          />
        </div>

        {/* City Filter */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full py-2 px-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-xs text-slate-100 focus:outline-none focus:border-emerald-400"
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'All Districts / Hubs' : `${c} Hub`}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-2 px-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-xs text-slate-100 focus:outline-none focus:border-emerald-400"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Reset */}
        <button
          onClick={() => {
            setSelectedCity('All');
            setSelectedCategory('All');
            setSearchQuery('');
          }}
          className="py-2 px-3 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-xs text-slate-300 flex items-center justify-center gap-2 font-medium"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Main Prices Table */}
      <div className="glass-card rounded-2xl border border-emerald-800/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0D1713] text-emerald-400 uppercase text-[10px] font-extrabold border-b border-emerald-900">
              <tr>
                <th className="py-4 px-6">{t('prices.material_col')}</th>
                <th className="py-4 px-4">{t('prices.cat_col')}</th>
                <th className="py-4 px-4">{t('prices.price_col')}</th>
                <th className="py-4 px-4">{t('prices.msp_col')}</th>
                <th className="py-4 px-4">{t('prices.trend_col')}</th>
                <th className="py-4 px-4">Location</th>
                <th className="py-4 px-6 text-right">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950">
              {filteredPrices.map((item) => (
                <tr key={item.id} className="hover:bg-emerald-950/40 transition-colors group">
                  <td className="py-4 px-6 font-bold text-slate-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{item.material_name}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-900 text-emerald-300 font-medium">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-base font-extrabold text-emerald-300">
                      ₹{item.price_per_kg.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal"> /{item.unit}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-amber-300">
                      ₹{item.msp_price_per_kg.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Govt Floor</span>
                  </td>
                  <td className="py-4 px-4">
                    {item.price_trend === 'up' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>+{item.change_percentage}%</span>
                      </span>
                    ) : item.price_trend === 'down' ? (
                      <span className="inline-flex items-center gap-1 text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded">
                        <ArrowDownRight className="w-3.5 h-3.5" />
                        <span>{item.change_percentage}%</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-400 font-medium bg-slate-800/60 px-2 py-0.5 rounded">
                        <Minus className="w-3.5 h-3.5" />
                        <span>0.0%</span>
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-slate-300 font-medium">
                    {item.city} ({item.district})
                  </td>
                  <td className="py-4 px-6 text-right text-slate-500 font-mono text-[11px]">
                    {item.last_updated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPrices.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs">
            No scrap prices matching your filter criteria.
          </div>
        )}
      </div>

      {/* Fair Minimum Support Price (MSP) Explainer Banner */}
      <div className="glass-card rounded-2xl p-6 border border-emerald-900/80 bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-emerald-950/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>Anti-Exploitation Price Floor (MSP) Enforced</span>
          </div>
          <p className="text-xs text-slate-300 max-w-3xl">
            Under MoHUA guidelines for SIH 2026, certified informal collectors cannot be paid below the declared Fair MSP. Digital weight readings automatically prevent middleman price skimming.
          </p>
        </div>
        <div className="text-right whitespace-nowrap">
          <span className="badge-gov">CPCB Audited Daily</span>
        </div>
      </div>
    </div>
  );
};
