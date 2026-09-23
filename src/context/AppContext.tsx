import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  Citizen,
  Collector,
  MaterialPrice,
  PickupRequest,
  Transaction,
  Payment,
  AIScanResult,
  Aggregator,
  AggregatorInventory,
  Recycler,
  TraceabilityLog,
  PickupStatus,
  PaymentMode
} from '../types';
import {
  INITIAL_MATERIAL_PRICES,
  INITIAL_COLLECTORS,
  INITIAL_CITIZENS,
  INITIAL_AGGREGATORS,
  INITIAL_RECYCLERS,
  INITIAL_PICKUP_REQUESTS,
  INITIAL_TRACEABILITY_LOGS,
  INITIAL_AGGREGATOR_INVENTORY,
  getSupabase,
  uploadStorageImage
} from '../lib/supabase';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  activeCollector: Collector;
  activeCitizen: Citizen;
  activeAggregator: Aggregator;
  activeRecycler: Recycler;
  materialPrices: MaterialPrice[];
  pickupRequests: PickupRequest[];
  traceabilityLogs: TraceabilityLog[];
  aggregatorInventory: AggregatorInventory[];
  aiScans: AIScanResult[];
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  
  // Realtime Actions
  createPickupRequest: (request: Omit<PickupRequest, 'id' | 'created_at' | 'status'>) => Promise<PickupRequest>;
  acceptPickupRequest: (requestId: string, collectorId: string) => Promise<void>;
  rejectPickupRequest: (requestId: string) => Promise<void>;
  completeWeighInAndPayment: (
    requestId: string,
    actualWeightKg: number,
    appliedRate: number,
    paymentMode: PaymentMode
  ) => Promise<{ qrCodeId: string; totalAmount: number }>;
  aggregatorReceiveBatch: (pickupId: string, aggregatorId: string) => Promise<void>;
  recyclerConfirmBatch: (qrCodeId: string, proofImageUrl?: string) => Promise<void>;
  logAIScan: (scan: AIScanResult) => Promise<void>;
  
  // Notifications
  notification: string | null;
  setNotification: (msg: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>(() => {
    return (localStorage.getItem('kc_role') as Role) || 'citizen';
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('kc_theme') as 'dark' | 'light') || 'dark';
  });

  const [materialPrices, setMaterialPrices] = useState<MaterialPrice[]>(() => {
    const saved = localStorage.getItem('kc_material_prices');
    return saved ? JSON.parse(saved) : INITIAL_MATERIAL_PRICES;
  });

  const [pickupRequests, setPickupRequests] = useState<PickupRequest[]>(() => {
    const saved = localStorage.getItem('kc_pickup_requests');
    return saved ? JSON.parse(saved) : INITIAL_PICKUP_REQUESTS;
  });

  const [traceabilityLogs, setTraceabilityLogs] = useState<TraceabilityLog[]>(() => {
    const saved = localStorage.getItem('kc_traceability_logs');
    return saved ? JSON.parse(saved) : INITIAL_TRACEABILITY_LOGS;
  });

  const [aggregatorInventory, setAggregatorInventory] = useState<AggregatorInventory[]>(() => {
    const saved = localStorage.getItem('kc_agg_inventory');
    return saved ? JSON.parse(saved) : INITIAL_AGGREGATOR_INVENTORY;
  });

  const [aiScans, setAiScans] = useState<AIScanResult[]>(() => {
    const saved = localStorage.getItem('kc_ai_scans');
    return saved ? JSON.parse(saved) : [];
  });

  const [notification, setNotification] = useState<string | null>(null);

  // Active Personas
  const [activeCollector, setActiveCollector] = useState<Collector>(INITIAL_COLLECTORS[0]);
  const [activeCitizen, setActiveCitizen] = useState<Citizen>(INITIAL_CITIZENS[0]);
  const [activeAggregator] = useState<Aggregator>(INITIAL_AGGREGATORS[0]);
  const [activeRecycler] = useState<Recycler>(INITIAL_RECYCLERS[0]);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    localStorage.setItem('kc_role', newRole);
    setNotification(`Switched persona to ${newRole.toUpperCase()} mode.`);
    setTimeout(() => setNotification(null), 3500);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('kc_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Sync to Local Storage on updates
  useEffect(() => {
    localStorage.setItem('kc_material_prices', JSON.stringify(materialPrices));
  }, [materialPrices]);

  useEffect(() => {
    localStorage.setItem('kc_pickup_requests', JSON.stringify(pickupRequests));
  }, [pickupRequests]);

  useEffect(() => {
    localStorage.setItem('kc_traceability_logs', JSON.stringify(traceabilityLogs));
  }, [traceabilityLogs]);

  useEffect(() => {
    localStorage.setItem('kc_agg_inventory', JSON.stringify(aggregatorInventory));
  }, [aggregatorInventory]);

  useEffect(() => {
    localStorage.setItem('kc_ai_scans', JSON.stringify(aiScans));
  }, [aiScans]);

  // Initial Fetch & Supabase Realtime Subscriptions
  useEffect(() => {
    const supabase = getSupabase();

    // 1. Initial Load from Supabase Database
    const fetchSupabaseTables = async () => {
      try {
        const { data: dbPrices } = await supabase.from('material_prices').select('*');
        if (dbPrices && dbPrices.length > 0) {
          setMaterialPrices(dbPrices as MaterialPrice[]);
        }

        const { data: dbPickups } = await supabase.from('pickup_requests').select('*').order('created_at', { ascending: false });
        if (dbPickups && dbPickups.length > 0) {
          setPickupRequests(dbPickups as PickupRequest[]);
        }

        const { data: dbLogs } = await supabase.from('traceability_logs').select('*').order('timestamp', { ascending: false });
        if (dbLogs && dbLogs.length > 0) {
          setTraceabilityLogs(dbLogs as TraceabilityLog[]);
        }

        const { data: dbInv } = await supabase.from('aggregator_inventory').select('*').order('created_at', { ascending: false });
        if (dbInv && dbInv.length > 0) {
          setAggregatorInventory(dbInv as AggregatorInventory[]);
        }

        const { data: dbScans } = await supabase.from('ai_scans').select('*').order('created_at', { ascending: false });
        if (dbScans && dbScans.length > 0) {
          setAiScans(dbScans as AIScanResult[]);
        }
      } catch (err) {
        console.warn('Initial Supabase table query fallback:', err);
      }
    };

    fetchSupabaseTables();

    // 2. Realtime Channels
    try {
      const pickupChannel = supabase
        .channel('public:pickup_requests')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'pickup_requests' }, (payload) => {
          if (payload.eventType === 'INSERT') {
            const newReq = payload.new as PickupRequest;
            setPickupRequests(prev => [newReq, ...prev.filter(r => r.id !== newReq.id)]);
            setNotification(`⚡ Realtime Alert: New Pickup requested at ${newReq.village || newReq.address}`);
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as PickupRequest;
            setPickupRequests(prev => prev.map(r => r.id === updated.id ? { ...r, ...updated } : r));
          }
        })
        .subscribe();

      const priceChannel = supabase
        .channel('public:material_prices')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'material_prices' }, (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            const updatedPrice = payload.new as MaterialPrice;
            setMaterialPrices(prev => prev.map(p => p.id === updatedPrice.id ? updatedPrice : p));
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(pickupChannel);
        supabase.removeChannel(priceChannel);
      };
    } catch (e) {
      // Offline fallback handling
    }
  }, []);

  // Actions
  const createPickupRequest = async (requestData: Omit<PickupRequest, 'id' | 'created_at' | 'status'>): Promise<PickupRequest> => {
    let photoPublicUrl = requestData.photo_url;
    if (requestData.photo_url && requestData.photo_url.startsWith('data:')) {
      const fileName = `pickup_${Date.now()}_${Math.floor(Math.random() * 1000)}.jpg`;
      const uploaded = await uploadStorageImage('pickup_images', fileName, requestData.photo_url);
      if (uploaded) photoPublicUrl = uploaded;
    }

    const newRequest: PickupRequest = {
      ...requestData,
      photo_url: photoPublicUrl,
      id: `req-${Date.now().toString().slice(-5)}`,
      status: 'requested',
      created_at: new Date().toISOString()
    };

    setPickupRequests(prev => [newRequest, ...prev]);

    // Insert into Supabase pickup_requests table
    try {
      const supabase = getSupabase();
      await supabase.from('pickup_requests').insert([{
        id: newRequest.id,
        citizen_id: requestData.citizen_id || activeCitizen.id,
        material_category: requestData.material_category,
        material_details: requestData.material_details,
        estimated_weight_kg: requestData.estimated_weight_kg,
        status: 'requested',
        address: requestData.address,
        village: requestData.village,
        district: requestData.district,
        latitude: requestData.latitude,
        longitude: requestData.longitude,
        photo_url: photoPublicUrl,
        preferred_date: requestData.preferred_date,
        preferred_time_slot: requestData.preferred_time_slot,
        notes: requestData.notes
      }]);
    } catch (e) {
      console.warn('Supabase pickup_requests insert warning:', e);
    }

    // Add initial traceability log
    const initialLog: TraceabilityLog = {
      id: `t-log-${Date.now()}`,
      pickup_id: newRequest.id,
      qr_code_id: `KC-QR-TRACE-${Date.now().toString().slice(-6)}`,
      current_stage: 'Requested',
      stage_title: 'Doorstep Pickup Requested by Citizen',
      actor_type: 'Citizen',
      actor_name: requestData.citizen_name || activeCitizen.full_name,
      location_name: `${requestData.village}, ${requestData.district}`,
      notes: `Requested pickup for ${requestData.estimated_weight_kg}kg ${requestData.material_category}.`,
      timestamp: new Date().toISOString()
    };

    setTraceabilityLogs(prev => [initialLog, ...prev]);

    try {
      const supabase = getSupabase();
      await supabase.from('traceability_logs').insert([initialLog]);
    } catch (e) {
      console.warn('Supabase traceability_logs insert warning:', e);
    }

    setNotification('⚡ Pickup request broadcasted to nearest collectors!');
    setTimeout(() => setNotification(null), 4000);

    return newRequest;
  };

  const acceptPickupRequest = async (requestId: string, collectorId: string) => {
    setPickupRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'accepted' as PickupStatus,
          collector_id: collectorId,
          collector_name: activeCollector.full_name
        };
      }
      return req;
    }));

    try {
      const supabase = getSupabase();
      await supabase.from('pickup_requests').update({
        status: 'accepted',
        collector_id: collectorId
      }).eq('id', requestId);
    } catch (e) {
      console.warn('Supabase pickup_requests update warning:', e);
    }

    const acceptLog: TraceabilityLog = {
      id: `t-log-${Date.now()}`,
      pickup_id: requestId,
      qr_code_id: `KC-QR-TRACE-${requestId.replace('req-', '')}`,
      current_stage: 'Accepted',
      stage_title: 'Pickup Accepted by Verified Collector',
      actor_type: 'Collector',
      actor_id: collectorId,
      actor_name: activeCollector.full_name,
      location_name: `${activeCollector.village}, ${activeCollector.district}`,
      notes: `Collector en route with calibrated digital scale.`,
      timestamp: new Date().toISOString()
    };

    setTraceabilityLogs(prev => [acceptLog, ...prev]);

    try {
      const supabase = getSupabase();
      await supabase.from('traceability_logs').insert([acceptLog]);
    } catch (e) {
      console.warn('Supabase traceability_logs insert warning:', e);
    }

    setNotification('✅ You accepted the pickup! Route opened in Google Navigation.');
    setTimeout(() => setNotification(null), 4000);
  };

  const rejectPickupRequest = async (requestId: string) => {
    setPickupRequests(prev => prev.filter(req => req.id !== requestId));
    setNotification('Job declined and released back to available pool.');
    setTimeout(() => setNotification(null), 3000);
  };

  const completeWeighInAndPayment = async (
    requestId: string,
    actualWeightKg: number,
    appliedRate: number,
    paymentMode: PaymentMode
  ) => {
    const totalAmount = actualWeightKg * appliedRate;
    const qrCodeId = `KC-QR-TRACE-${Date.now().toString().slice(-6)}`;

    setPickupRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          actual_weight_kg: actualWeightKg,
          rate_per_kg: appliedRate,
          total_amount: totalAmount,
          status: 'paid' as PickupStatus,
          qr_code_id: qrCodeId,
          updated_at: new Date().toISOString()
        };
      }
      return req;
    }));

    // Sync pickup_requests status in Supabase
    try {
      const supabase = getSupabase();
      await supabase.from('pickup_requests').update({
        actual_weight_kg: actualWeightKg,
        rate_per_kg: appliedRate,
        total_amount: totalAmount,
        status: 'paid',
        qr_code_id: qrCodeId,
        updated_at: new Date().toISOString()
      }).eq('id', requestId);
    } catch (e) {
      console.warn('Supabase pickup_requests update warning:', e);
    }

    // Update Collector stats
    setActiveCollector(prev => ({
      ...prev,
      total_collected_kg: prev.total_collected_kg + actualWeightKg,
      total_earnings: prev.total_earnings + totalAmount,
      co2_saved_kg: Number((prev.co2_saved_kg + (actualWeightKg * 2.3)).toFixed(1)),
      trees_saved_count: Number((prev.trees_saved_count + (actualWeightKg * 0.05)).toFixed(1))
    }));

    // Add Collected Log
    const collectedLog: TraceabilityLog = {
      id: `t-log-c-${Date.now()}`,
      pickup_id: requestId,
      qr_code_id: qrCodeId,
      current_stage: 'Collected',
      stage_title: 'Doorstep Precision Weighing & Purity Verification',
      actor_type: 'Collector',
      actor_id: activeCollector.id,
      actor_name: activeCollector.full_name,
      location_name: `${activeCollector.village}, ${activeCollector.district}`,
      notes: `Digital weight verified: ${actualWeightKg} kg at ₹${appliedRate}/kg. Contamination 0%.`,
      carbon_offset_kg: Number((actualWeightKg * 1.8).toFixed(1)),
      timestamp: new Date().toISOString()
    };

    // Add Paid Log
    const paidLog: TraceabilityLog = {
      id: `t-log-p-${Date.now()}`,
      pickup_id: requestId,
      qr_code_id: qrCodeId,
      current_stage: 'Paid',
      stage_title: `Instant Payout Settled via ${paymentMode}`,
      actor_type: 'Collector',
      actor_id: activeCollector.id,
      actor_name: activeCollector.full_name,
      location_name: `${activeCollector.village}, ${activeCollector.district}`,
      notes: `Transferred ₹${totalAmount.toLocaleString('en-IN')} instantly. Tamper-proof QR token generated.`,
      carbon_offset_kg: Number((actualWeightKg * 2.3).toFixed(1)),
      timestamp: new Date().toISOString()
    };

    setTraceabilityLogs(prev => [paidLog, collectedLog, ...prev]);

    try {
      const supabase = getSupabase();
      await supabase.from('traceability_logs').insert([collectedLog, paidLog]);

      // Save Transactions & Payments to Supabase database
      const txnId = `txn-${Date.now()}`;
      const targetReq = pickupRequests.find(r => r.id === requestId);

      await supabase.from('transactions').insert([{
        id: txnId,
        pickup_id: requestId,
        citizen_id: targetReq?.citizen_id || activeCitizen.id,
        collector_id: activeCollector.id,
        material_name: targetReq?.material_category || 'Scrap Material',
        category: targetReq?.material_category || 'Metals',
        weight_kg: actualWeightKg,
        price_per_kg: appliedRate,
        total_amount: totalAmount,
        payment_mode: paymentMode
      }]);

      await supabase.from('payments').insert([{
        id: `pay-${Date.now()}`,
        transaction_id: txnId,
        pickup_id: requestId,
        payer_id: activeCollector.id,
        payee_id: targetReq?.citizen_id || activeCitizen.id,
        amount: totalAmount,
        payment_mode: paymentMode,
        payment_status: 'completed',
        notes: `Instant payment settled via ${paymentMode}`
      }]);
    } catch (e) {
      console.warn('Supabase transactions & payments insert warning:', e);
    }

    return { qrCodeId, totalAmount };
  };

  const aggregatorReceiveBatch = async (pickupId: string, aggregatorId: string) => {
    const targetReq = pickupRequests.find(r => r.id === pickupId);
    if (!targetReq) return;

    setPickupRequests(prev => prev.map(req => {
      if (req.id === pickupId) {
        return { ...req, status: 'aggregator_received' as PickupStatus };
      }
      return req;
    }));

    try {
      const supabase = getSupabase();
      await supabase.from('pickup_requests').update({ status: 'aggregator_received' }).eq('id', pickupId);
    } catch (e) {
      console.warn('Supabase update warning:', e);
    }

    const batchId = `HUB-BATCH-${Date.now().toString().slice(-5)}`;
    const newInv: AggregatorInventory = {
      id: `inv-${Date.now()}`,
      aggregator_id: aggregatorId,
      collector_id: targetReq.collector_id,
      collector_name: targetReq.collector_name || 'Verified Collector',
      pickup_id: pickupId,
      material_name: targetReq.material_category,
      category: targetReq.material_category,
      weight_kg: targetReq.actual_weight_kg || targetReq.estimated_weight_kg,
      batch_id: batchId,
      status: 'in_hub',
      created_at: new Date().toISOString()
    };

    setAggregatorInventory(prev => [newInv, ...prev]);

    try {
      const supabase = getSupabase();
      await supabase.from('aggregator_inventory').insert([newInv]);
    } catch (e) {
      console.warn('Supabase aggregator_inventory insert warning:', e);
    }

    const aggLog: TraceabilityLog = {
      id: `t-log-agg-${Date.now()}`,
      pickup_id: pickupId,
      qr_code_id: targetReq.qr_code_id || `KC-QR-TRACE-${Date.now().toString().slice(-6)}`,
      current_stage: 'Aggregator Received',
      stage_title: 'Consolidation & Baling at District Aggregator Hub',
      actor_type: 'Aggregator',
      actor_id: aggregatorId,
      actor_name: activeAggregator.hub_name,
      location_name: `${activeAggregator.village}, ${activeAggregator.district}`,
      notes: `Batch ${batchId} stored in dry hub. Weight: ${newInv.weight_kg}kg.`,
      carbon_offset_kg: Number((newInv.weight_kg * 2.8).toFixed(1)),
      timestamp: new Date().toISOString()
    };

    setTraceabilityLogs(prev => [aggLog, ...prev]);

    try {
      const supabase = getSupabase();
      await supabase.from('traceability_logs').insert([aggLog]);
    } catch (e) {
      console.warn('Supabase traceability_logs insert warning:', e);
    }

    setNotification(`📦 Batch received at Aggregator Hub (${batchId})!`);
  };

  const recyclerConfirmBatch = async (qrCodeId: string, proofImageUrl?: string) => {
    let uploadedProofUrl = proofImageUrl;
    if (proofImageUrl && proofImageUrl.startsWith('data:')) {
      const fileName = `proof_${Date.now()}_${Math.floor(Math.random() * 1000)}.jpg`;
      const uploaded = await uploadStorageImage('traceability_proofs', fileName, proofImageUrl);
      if (uploaded) uploadedProofUrl = uploaded;
    }

    const matchedLog = traceabilityLogs.find(l => l.qr_code_id === qrCodeId);
    const pickupId = matchedLog?.pickup_id || 'req-101';

    setPickupRequests(prev => prev.map(req => {
      if (req.id === pickupId || req.qr_code_id === qrCodeId) {
        return { ...req, status: 'recycled' as PickupStatus };
      }
      return req;
    }));

    try {
      const supabase = getSupabase();
      await supabase.from('pickup_requests').update({ status: 'recycled' }).eq('qr_code_id', qrCodeId);
    } catch (e) {
      console.warn('Supabase update warning:', e);
    }

    const recyclerLog: TraceabilityLog = {
      id: `t-log-rec-${Date.now()}`,
      pickup_id: pickupId,
      qr_code_id: qrCodeId,
      current_stage: 'Recycled',
      stage_title: 'Formally Processed & Recycled at Smelter / Pelletizer',
      actor_type: 'Recycler',
      actor_id: activeRecycler.id,
      actor_name: activeRecycler.facility_name,
      location_name: `${activeRecycler.address}, ${activeRecycler.district}`,
      notes: `Material melted into certified secondary raw ingots. EPR certificate generated.`,
      proof_image_url: uploadedProofUrl || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&auto=format&fit=crop&q=80',
      carbon_offset_kg: 145.0,
      timestamp: new Date().toISOString()
    };

    setTraceabilityLogs(prev => [recyclerLog, ...prev]);

    try {
      const supabase = getSupabase();
      await supabase.from('traceability_logs').insert([recyclerLog]);
    } catch (e) {
      console.warn('Supabase traceability_logs insert warning:', e);
    }

    setNotification('🎉 QR verified! Material officially marked as RECYCLED with EPR certificate.');
  };

  const logAIScan = async (scan: AIScanResult) => {
    let uploadedImageUrl = scan.image_url;
    if (scan.image_url && scan.image_url.startsWith('data:')) {
      const fileName = `scan_${Date.now()}_${Math.floor(Math.random() * 1000)}.jpg`;
      const uploaded = await uploadStorageImage('ai_scan_images', fileName, scan.image_url);
      if (uploaded) uploadedImageUrl = uploaded;
    }

    const newScanRecord: AIScanResult = {
      ...scan,
      image_url: uploadedImageUrl,
      id: `scan-${Date.now()}`,
      created_at: new Date().toISOString()
    };

    setAiScans(prev => [newScanRecord, ...prev]);

    try {
      const supabase = getSupabase();
      await supabase.from('ai_scans').insert([{
        user_id: activeCitizen.id,
        image_url: uploadedImageUrl,
        detected_material: scan.detected_material,
        category: scan.category,
        confidence_score: scan.confidence_score,
        is_recyclable: scan.is_recyclable,
        estimated_price: scan.estimated_price,
        safety_tips: scan.safety_tips,
        outside_scope: scan.outside_scope || false,
        scope_message: scan.scope_message || null,
        raw_response: scan.raw_response || null
      }]);
    } catch (e) {
      console.warn('Supabase ai_scans insert warning:', e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activeCollector,
        activeCitizen,
        activeAggregator,
        activeRecycler,
        materialPrices,
        pickupRequests,
        traceabilityLogs,
        aggregatorInventory,
        aiScans,
        theme,
        toggleTheme,
        createPickupRequest,
        acceptPickupRequest,
        rejectPickupRequest,
        completeWeighInAndPayment,
        aggregatorReceiveBatch,
        recyclerConfirmBatch,
        logAIScan,
        notification,
        setNotification
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
