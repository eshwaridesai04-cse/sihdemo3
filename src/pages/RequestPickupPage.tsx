import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { getCurrentGPSLocation, getStaticMapUrl } from '../lib/maps';
import {
  Truck,
  MapPin,
  Calendar,
  Clock,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Phone,
  Layers,
  ArrowRight,
  Sparkles,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RequestPickupPage: React.FC = () => {
  const { t } = useLanguage();
  const { createPickupRequest, activeCitizen } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const stateData = location.state as { prefillCategory?: string; prefillDetails?: string } | null;

  // Form State
  const [fullName, setFullName] = useState(activeCitizen.full_name || 'Ananya Sharma');
  const [phone, setPhone] = useState(activeCitizen.phone || '+91 98800 11223');
  const [address, setAddress] = useState(activeCitizen.address || 'Flat 402, Green Glen Heights, Bellandur');
  const [village, setVillage] = useState(activeCitizen.village || 'Bellandur Ward 150');
  const [district, setDistrict] = useState(activeCitizen.district || 'Bangalore Urban');
  const [materialCategory, setMaterialCategory] = useState(stateData?.prefillCategory || 'Metals');
  const [materialDetails, setMaterialDetails] = useState(stateData?.prefillDetails || '');
  const [estimatedWeight, setEstimatedWeight] = useState<number>(15);
  const [preferredDate, setPreferredDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [notes, setNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // GPS Coordinates
  const [latitude, setLatitude] = useState<number>(12.9260);
  const [longitude, setLongitude] = useState<number>(77.6762);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsSuccess, setGpsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['Metals', 'Plastics', 'Paper & Cardboard', 'E-Waste', 'Glass', 'Batteries'];
  const timeSlots = [
    '08:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '12:00 PM - 02:00 PM',
    '02:00 PM - 04:00 PM',
    '04:00 PM - 06:00 PM'
  ];

  const handleAutoDetectGPS = async () => {
    setGpsLoading(true);
    try {
      const coords = await getCurrentGPSLocation();
      setLatitude(coords.latitude);
      setLongitude(coords.longitude);
      setAddress(coords.address);
      setVillage(coords.village);
      setDistrict(coords.district);
      setGpsSuccess(true);
    } catch (e) {
      console.warn(e);
    } finally {
      setGpsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhotoUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newReq = await createPickupRequest({
      citizen_id: activeCitizen.id,
      citizen_name: fullName,
      citizen_phone: phone,
      material_category: materialCategory,
      material_details: materialDetails,
      estimated_weight_kg: Number(estimatedWeight),
      address,
      village,
      district,
      latitude,
      longitude,
      preferred_date: preferredDate,
      preferred_time_slot: preferredTimeSlot,
      notes,
      photo_url: photoUrl || undefined
    });

    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });

    setTimeout(() => {
      setIsSubmitting(false);
      navigate(`/track-pickup?id=${newReq.id}`);
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          <Truck className="w-3.5 h-3.5" />
          <span>Doorstep Digital Dispatch</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
          {t('request.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          {t('request.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Citizen Details & GPS Location */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-emerald-800/60 space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-emerald-900/60 pb-3">
              <User className="w-4 h-4 text-emerald-400" />
              <span>Contact & Doorstep Location</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {t('request.name_lbl')} *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-xs text-slate-100 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {t('request.phone_lbl')} *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-xs text-slate-100 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* GPS Auto Detect Button */}
            <div className="p-3.5 rounded-xl bg-[#0D1713] border border-emerald-900 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300">
                  {gpsSuccess ? t('request.gps_detected') : 'Pinpoint doorstep for collector navigation'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleAutoDetectGPS}
                disabled={gpsLoading}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                {gpsLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
                <span>{t('request.gps_btn')}</span>
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {t('request.address_lbl')} *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House / Apartment / Street Name"
                className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-xs text-slate-100 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {t('request.village_lbl')} *
                </label>
                <input
                  type="text"
                  required
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="e.g. Indiranagar or Sindhanur"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-xs text-slate-100 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {t('request.district_lbl')} *
                </label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Bangalore Urban or Raichur"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-xs text-slate-100 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* Schedule Time & Instructions */}
          <div className="glass-card rounded-2xl p-6 border border-emerald-800/60 space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-emerald-900/60 pb-3">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Preferred Date & Slot</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {t('request.date_lbl')} *
                </label>
                <input
                  type="date"
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-xs text-slate-100 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {t('request.slot_lbl')} *
                </label>
                <select
                  value={preferredTimeSlot}
                  onChange={(e) => setPreferredTimeSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-xs text-slate-100 focus:outline-none focus:border-emerald-400"
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {t('request.notes_lbl')}
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Ring bell, heavy scrap stored on balcony, call before arriving..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Material Category & Photo Upload */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-emerald-800/60 space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-emerald-900/60 pb-3">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Material & Quantity</span>
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {t('request.cat_lbl')} *
              </label>
              <select
                value={materialCategory}
                onChange={(e) => setMaterialCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-xs text-slate-100 focus:outline-none focus:border-emerald-400"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Material Description / Specific Items
              </label>
              <input
                type="text"
                value={materialDetails}
                onChange={(e) => setMaterialDetails(e.target.value)}
                placeholder="e.g. Copper pipes, plastic bottles, e-waste monitors..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-xs text-slate-100 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  {t('request.weight_lbl')} *
                </label>
                <span className="text-emerald-400 font-bold text-xs">{estimatedWeight} kg</span>
              </div>
              <input
                type="range"
                min="1"
                max="200"
                value={estimatedWeight}
                onChange={(e) => setEstimatedWeight(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>1 kg (Small bag)</span>
                <span>50 kg</span>
                <span>200+ kg (Bulk)</span>
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Attach Waste Scrap Photo (Optional)
              </label>
              <label className="border border-dashed border-emerald-800/60 hover:border-emerald-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-[#0D1713] transition-all text-center">
                <input type="file" accept="image/*" onChange={handleFileUpload} className="sr-only" />
                {photoUrl ? (
                  <div className="relative w-full h-24 rounded-lg overflow-hidden">
                    <img src={photoUrl} alt="Upload" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <>
                    <Camera className="w-5 h-5 text-emerald-400 mb-1" />
                    <span className="text-[11px] text-slate-400">Click to attach photo for collector</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-glow-green transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Broadcasting to Verified Collectors...</span>
              </>
            ) : (
              <>
                <Truck className="w-4 h-4" />
                <span>{t('request.submit_btn')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
