import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Citizen,
  Collector,
  MaterialPrice,
  PickupRequest,
  Transaction,
  Payment,
  Earning,
  AIScanResult,
  Aggregator,
  AggregatorInventory,
  Recycler,
  TraceabilityLog
} from '../types';

// Default Supabase Configuration
const rawUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xwgsokydrvuvwwgejdoc.supabase.co';
export const DEFAULT_SUPABASE_URL = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
export const DEFAULT_SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_dt5K4rzQ7rIWTnQC0f69IA_IcWJa77V';

export const cleanSupabaseUrl = (url: string): string => {
  if (!url) return DEFAULT_SUPABASE_URL;
  return url.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
};

let supabaseClient: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
  const customUrl = cleanSupabaseUrl(localStorage.getItem('kc_supabase_url') || DEFAULT_SUPABASE_URL);
  const customKey = (localStorage.getItem('kc_supabase_key') || DEFAULT_SUPABASE_KEY).trim();

  if (!supabaseClient) {
    try {
      supabaseClient = createClient(customUrl, customKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storage: window.localStorage
        },
        realtime: { params: { eventsPerSecond: 10 } }
      });
    } catch (e) {
      console.warn('Failed to initialize live Supabase client, using fallback engine.', e);
      supabaseClient = createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_KEY);
    }
  }
  return supabaseClient;
};

export const supabase = getSupabase();

export const uploadStorageImage = async (
  bucketName: 'ai_scan_images' | 'pickup_images' | string,
  filePath: string,
  imageData: Blob | File | string
): Promise<string | null> => {
  try {
    const client = getSupabase();
    let bodyToUpload: Blob | File;

    if (typeof imageData === 'string') {
      if (imageData.startsWith('http://') || imageData.startsWith('https://')) {
        return imageData;
      }
      const res = await fetch(imageData);
      bodyToUpload = await res.blob();
    } else {
      bodyToUpload = imageData;
    }

    const { data, error } = await client.storage
      .from(bucketName)
      .upload(filePath, bodyToUpload, {
        contentType: bodyToUpload.type || 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.warn(`Supabase storage upload warning (${bucketName}):`, error.message);
      return typeof imageData === 'string' ? imageData : null;
    }

    const { data: publicUrlData } = client.storage.from(bucketName).getPublicUrl(data.path);
    return publicUrlData.publicUrl || (typeof imageData === 'string' ? imageData : null);
  } catch (err) {
    console.warn(`Storage upload exception (${bucketName}):`, err);
    return typeof imageData === 'string' ? imageData : null;
  }
};


// =====================================================================
// INITIAL PRODUCTION SEED STATE (Preloaded for immediate offline & online zero-glitch UI)
// =====================================================================


export const INITIAL_MATERIAL_PRICES: MaterialPrice[] = [
  { id: 'p1', material_name: 'Copper Wire (Bright Clean 99%)', category: 'Metals', price_per_kg: 720.00, msp_price_per_kg: 700.00, unit: 'kg', city: 'Bangalore', district: 'Bangalore Urban', price_trend: 'up', change_percentage: 4.5, is_active: true, last_updated: 'Just now' },
  { id: 'p2', material_name: 'Aluminium Extrusions & Utensils', category: 'Metals', price_per_kg: 185.00, msp_price_per_kg: 175.00, unit: 'kg', city: 'Bangalore', district: 'Bangalore Urban', price_trend: 'up', change_percentage: 2.1, is_active: true, last_updated: '10 mins ago' },
  { id: 'p3', material_name: 'Brass Honey / Valve Scrap', category: 'Metals', price_per_kg: 460.00, msp_price_per_kg: 440.00, unit: 'kg', city: 'Bangalore', district: 'Bangalore Urban', price_trend: 'stable', change_percentage: 0.0, is_active: true, last_updated: '25 mins ago' },
  { id: 'p4', material_name: 'Heavy Steel & Construction Rebar', category: 'Metals', price_per_kg: 42.00, msp_price_per_kg: 40.00, unit: 'kg', city: 'Bangalore', district: 'Bangalore Urban', price_trend: 'up', change_percentage: 1.8, is_active: true, last_updated: '1 hour ago' },
  { id: 'p5', material_name: 'Cast Iron Machinery Parts', category: 'Metals', price_per_kg: 34.00, msp_price_per_kg: 32.00, unit: 'kg', city: 'Bangalore', district: 'Bangalore Urban', price_trend: 'down', change_percentage: -1.2, is_active: true, last_updated: '2 hours ago' },
  { id: 'p6', material_name: 'PET Plastic Bottles (Baled/Clean)', category: 'Plastics', price_per_kg: 38.00, msp_price_per_kg: 35.00, unit: 'kg', city: 'Bangalore', district: 'Bangalore Urban', price_trend: 'up', change_percentage: 5.0, is_active: true, last_updated: '15 mins ago' },
  { id: 'p7', material_name: 'HDPE Drums, Crates & Containers', category: 'Plastics', price_per_kg: 46.00, msp_price_per_kg: 42.00, unit: 'kg', city: 'Bangalore', district: 'Bangalore Urban', price_trend: 'up', change_percentage: 3.2, is_active: true, last_updated: '40 mins ago' },
  { id: 'p8', material_name: 'Corrugated Cardboard (OCC Bales)', category: 'Paper & Cardboard', price_per_kg: 16.50, msp_price_per_kg: 15.00, unit: 'kg', city: 'Bangalore', district: 'Bangalore Urban', price_trend: 'stable', change_percentage: 0.5, is_active: true, last_updated: 'Just now' },
  { id: 'p9', material_name: 'White Office Paper (Sorted)', category: 'Paper & Cardboard', price_per_kg: 22.00, msp_price_per_kg: 20.00, unit: 'kg', city: 'Bangalore', district: 'Bangalore Urban', price_trend: 'up', change_percentage: 2.0, is_active: true, last_updated: '3 hours ago' },
  { id: 'p10', material_name: 'Printed Circuit Boards (Motherboards/PCB)', category: 'E-Waste', price_per_kg: 280.00, msp_price_per_kg: 250.00, unit: 'kg', city: 'Bangalore', district: 'Bangalore Urban', price_trend: 'up', change_percentage: 8.2, is_active: true, last_updated: '5 mins ago' },
  { id: 'p11', material_name: 'Old Scrap Laptops & Desktops', category: 'E-Waste', price_per_kg: 450.00, msp_price_per_kg: 400.00, unit: 'piece', city: 'Bangalore', district: 'Bangalore Urban', price_trend: 'up', change_percentage: 6.0, is_active: true, last_updated: '30 mins ago' },
  { id: 'p12', material_name: 'Lead-Acid Battery (Automotive/Inverter)', category: 'Batteries', price_per_kg: 98.00, msp_price_per_kg: 92.00, unit: 'kg', city: 'Bangalore', district: 'Bangalore Urban', price_trend: 'up', change_percentage: 3.5, is_active: true, last_updated: '20 mins ago' },
  { id: 'p13', material_name: 'Glass Bottles (Sorted by Color)', category: 'Glass', price_per_kg: 4.50, msp_price_per_kg: 4.00, unit: 'kg', city: 'Bangalore', district: 'Bangalore Urban', price_trend: 'stable', change_percentage: 0.0, is_active: true, last_updated: '4 hours ago' },
  // Raichur Rural Hub Pricing
  { id: 'p14', material_name: 'Copper Wire (Bright Clean)', category: 'Metals', price_per_kg: 710.00, msp_price_per_kg: 690.00, unit: 'kg', city: 'Raichur', district: 'Raichur', price_trend: 'up', change_percentage: 3.8, is_active: true, last_updated: 'Just now' },
  { id: 'p15', material_name: 'Aluminium Cans & Utensils', category: 'Metals', price_per_kg: 180.00, msp_price_per_kg: 170.00, unit: 'kg', city: 'Raichur', district: 'Raichur', price_trend: 'up', change_percentage: 1.5, is_active: true, last_updated: '1 hour ago' },
  { id: 'p16', material_name: 'PET Plastic Bottles', category: 'Plastics', price_per_kg: 36.00, msp_price_per_kg: 33.00, unit: 'kg', city: 'Raichur', district: 'Raichur', price_trend: 'up', change_percentage: 4.2, is_active: true, last_updated: '2 hours ago' },
  { id: 'p17', material_name: 'HDPE Plastic Drums', category: 'Plastics', price_per_kg: 44.00, msp_price_per_kg: 40.00, unit: 'kg', city: 'Raichur', district: 'Raichur', price_trend: 'stable', change_percentage: 0.0, is_active: true, last_updated: '3 hours ago' },
  { id: 'p18', material_name: 'Corrugated Cardboard', category: 'Paper & Cardboard', price_per_kg: 15.00, msp_price_per_kg: 14.00, unit: 'kg', city: 'Raichur', district: 'Raichur', price_trend: 'stable', change_percentage: 0.0, is_active: true, last_updated: '5 hours ago' },
  { id: 'p19', material_name: 'Lead Acid Battery', category: 'Batteries', price_per_kg: 95.00, msp_price_per_kg: 90.00, unit: 'kg', city: 'Raichur', district: 'Raichur', price_trend: 'up', change_percentage: 2.5, is_active: true, last_updated: '1 hour ago' }
];

export const INITIAL_COLLECTORS: Collector[] = [
  {
    id: 'b1010000-0000-0000-0000-000000000001',
    full_name: 'Ramesh Kumar Nayak',
    phone: '+91 98450 12345',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    collector_code: 'KC-COL-0492',
    qr_identity: 'KC-QR-RAMESH-884',
    village: 'Indiranagar Ward 82',
    district: 'Bangalore Urban',
    state: 'Karnataka',
    pincode: '560038',
    trust_score: 4.95,
    is_verified: true,
    gov_id_type: 'Aadhaar / e-Shram No. 9841-XXXX-4012',
    total_collected_kg: 4850.50,
    total_earnings: 184500.00,
    trees_saved_count: 82.5,
    co2_saved_kg: 3420.0,
    active_status: 'active',
    created_at: '2026-01-10T08:00:00Z'
  },
  {
    id: 'b1010000-0000-0000-0000-000000000002',
    full_name: 'Basavaraj Patil',
    phone: '+91 97410 56789',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    collector_code: 'KC-COL-0831',
    qr_identity: 'KC-QR-BASAVA-412',
    village: 'Sindhanur Rural Hub',
    district: 'Raichur',
    state: 'Karnataka',
    pincode: '584128',
    trust_score: 4.88,
    is_verified: true,
    gov_id_type: 'Aadhaar / e-Shram No. 7632-XXXX-9104',
    total_collected_kg: 6120.00,
    total_earnings: 219800.00,
    trees_saved_count: 104.0,
    co2_saved_kg: 4350.0,
    active_status: 'active',
    created_at: '2026-01-15T09:30:00Z'
  },
  {
    id: 'b1010000-0000-0000-0000-000000000003',
    full_name: 'Sunil Shinde',
    phone: '+91 94220 98765',
    photo_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
    collector_code: 'KC-COL-1104',
    qr_identity: 'KC-QR-SUNIL-709',
    village: 'Dharavi Sector 4',
    district: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400017',
    trust_score: 4.92,
    is_verified: true,
    gov_id_type: 'Aadhaar / e-Shram No. 4410-XXXX-5521',
    total_collected_kg: 8950.00,
    total_earnings: 342100.00,
    trees_saved_count: 152.0,
    co2_saved_kg: 6280.0,
    active_status: 'active',
    created_at: '2026-01-05T11:00:00Z'
  }
];

export const INITIAL_CITIZENS: Citizen[] = [
  {
    id: 'c1010000-0000-0000-0000-000000000001',
    full_name: 'Ananya Sharma',
    phone: '+91 98800 11223',
    email: 'ananya.sharma@example.com',
    address: 'Flat 402, Green Glen Heights, Bellandur',
    village: 'Bellandur Ward 150',
    district: 'Bangalore Urban',
    state: 'Karnataka',
    pincode: '560103',
    total_waste_diverted_kg: 145.50,
    green_credits: 450
  },
  {
    id: 'c1010000-0000-0000-0000-000000000002',
    full_name: 'Mallikarjun G',
    phone: '+91 94801 33445',
    email: 'mallikarjun.g@example.com',
    address: 'House No. 12, APMC Road, Sindhanur',
    village: 'Sindhanur Town',
    district: 'Raichur',
    state: 'Karnataka',
    pincode: '584128',
    total_waste_diverted_kg: 85.00,
    green_credits: 260
  }
];

export const INITIAL_AGGREGATORS: Aggregator[] = [
  {
    id: 'a1010000-0000-0000-0000-000000000001',
    hub_name: 'Raichur Central Aggregation & Baling Center',
    operator_name: 'Mahantesh Kulkarni',
    phone: '+91 94480 77889',
    email: 'raichur.hub@kabadiwalaconnect.in',
    address: 'Plot 45, Industrial Area, Hyderabad Road',
    village: 'Raichur Hub',
    district: 'Raichur',
    state: 'Karnataka',
    storage_capacity_kg: 60000.00,
    current_stock_kg: 1850.00,
    dispatch_threshold_kg: 2000.00
  },
  {
    id: 'a1010000-0000-0000-0000-000000000002',
    hub_name: 'Bengaluru East Green Consolidation Yard',
    operator_name: 'Suresh Babu',
    phone: '+91 98455 66778',
    email: 'blr.east@kabadiwalaconnect.in',
    address: 'Whitefield Industrial Estate, Kadugodi',
    village: 'Kadugodi',
    district: 'Bangalore Urban',
    state: 'Karnataka',
    storage_capacity_kg: 80000.00,
    current_stock_kg: 4200.00,
    dispatch_threshold_kg: 3000.00
  }
];

export const INITIAL_RECYCLERS: Recycler[] = [
  {
    id: 'r1010000-0000-0000-0000-000000000001',
    facility_name: 'EcoMetals Smelting & Refining Corp',
    registration_no: 'KSPCB/EPR/2026/MET-091',
    contact_person: 'Dr. Arvind Rao',
    phone: '+91 99000 88776',
    email: 'contact@ecometals.in',
    address: 'Peenya 2nd Stage, Industrial Zone',
    district: 'Bangalore Urban',
    state: 'Karnataka',
    authorized_materials: ['Copper', 'Aluminium', 'Brass', 'Steel', 'Iron'],
    epr_credit_balance: 45200.00,
    is_authorized: true
  },
  {
    id: 'r1010000-0000-0000-0000-000000000002',
    facility_name: 'GreenPolymer Flakes & Pellets Ltd',
    registration_no: 'KSPCB/EPR/2026/PLS-402',
    contact_person: 'Vikramaditya Hegde',
    phone: '+91 98860 44332',
    email: 'operations@greenpolymer.in',
    address: 'Doddaballapur Plastic Park',
    district: 'Bangalore Rural',
    state: 'Karnataka',
    authorized_materials: ['PET Plastic', 'HDPE Plastic', 'PP Plastic'],
    epr_credit_balance: 38000.00,
    is_authorized: true
  }
];

export const INITIAL_PICKUP_REQUESTS: PickupRequest[] = [
  {
    id: 'req-101',
    citizen_id: 'c1010000-0000-0000-0000-000000000001',
    citizen_name: 'Ananya Sharma',
    citizen_phone: '+91 98800 11223',
    collector_id: 'b1010000-0000-0000-0000-000000000001',
    collector_name: 'Ramesh Kumar Nayak',
    material_category: 'Metals',
    material_details: 'Old Copper pipes, Aluminium window frames, and brass fittings',
    estimated_weight_kg: 18.5,
    actual_weight_kg: 19.2,
    rate_per_kg: 420.00,
    total_amount: 8064.00,
    status: 'paid',
    address: 'Flat 402, Green Glen Heights, Bellandur',
    village: 'Bellandur Ward 150',
    district: 'Bangalore Urban',
    latitude: 12.9260,
    longitude: 77.6762,
    photo_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
    preferred_date: '2026-09-17',
    preferred_time_slot: '10:00 AM - 12:00 PM',
    notes: 'Please call security before entering the main gate.',
    qr_code_id: 'KC-QR-TRACE-BLR-00101',
    created_at: '2026-09-17T09:15:00Z',
    updated_at: '2026-09-17T11:45:00Z'
  },
  {
    id: 'req-102',
    citizen_id: 'c1010000-0000-0000-0000-000000000002',
    citizen_name: 'Mallikarjun G',
    citizen_phone: '+91 94801 33445',
    collector_id: 'b1010000-0000-0000-0000-000000000002',
    collector_name: 'Basavaraj Patil',
    material_category: 'Plastics',
    material_details: 'Bulk PET beverage bottles and discarded HDPE pesticide containers',
    estimated_weight_kg: 45.0,
    actual_weight_kg: 48.0,
    rate_per_kg: 36.00,
    total_amount: 1728.00,
    status: 'aggregator_received',
    address: 'House No. 12, APMC Road, Sindhanur',
    village: 'Sindhanur Town',
    district: 'Raichur',
    latitude: 15.7667,
    longitude: 76.7583,
    preferred_date: '2026-09-17',
    preferred_time_slot: '02:00 PM - 04:00 PM',
    notes: 'Rural consolidation pickup. Stored in dry shed.',
    qr_code_id: 'KC-QR-TRACE-RCR-00102',
    created_at: '2026-09-17T13:00:00Z',
    updated_at: '2026-09-17T15:30:00Z'
  },
  {
    id: 'req-103',
    citizen_id: 'c1010000-0000-0000-0000-000000000001',
    citizen_name: 'Priya Sundaram',
    citizen_phone: '+91 98451 99887',
    material_category: 'E-Waste',
    material_details: '2 Broken Laptops, 4 Mobile phones, 1 CRT monitor, and PC motherboard',
    estimated_weight_kg: 12.0,
    status: 'requested',
    address: 'Plot 88, 12th Main, HAL 2nd Stage, Indiranagar',
    village: 'Indiranagar Ward 82',
    district: 'Bangalore Urban',
    latitude: 12.9716,
    longitude: 77.6412,
    preferred_date: '2026-09-18',
    preferred_time_slot: '04:00 PM - 06:00 PM',
    notes: 'Batteries already safely removed and kept in sealed box.',
    created_at: '2026-09-17T18:20:00Z'
  }
];

export const INITIAL_TRACEABILITY_LOGS: TraceabilityLog[] = [
  {
    id: 't-log-1',
    pickup_id: 'req-101',
    qr_code_id: 'KC-QR-TRACE-BLR-00101',
    current_stage: 'Requested',
    stage_title: 'Doorstep Pickup Requested by Citizen',
    actor_type: 'Citizen',
    actor_name: 'Ananya Sharma',
    location_name: 'Bellandur, Bangalore Urban',
    notes: 'Request initiated for 18.5kg mixed metal recyclables with GPS verification.',
    carbon_offset_kg: 0.0,
    timestamp: '2026-09-17T09:15:00Z'
  },
  {
    id: 't-log-2',
    pickup_id: 'req-101',
    qr_code_id: 'KC-QR-TRACE-BLR-00101',
    current_stage: 'Accepted',
    stage_title: 'Assigned to Verified Collector',
    actor_type: 'Collector',
    actor_id: 'b1010000-0000-0000-0000-000000000001',
    actor_name: 'Ramesh Kumar Nayak (KC-COL-0492)',
    location_name: 'Indiranagar Dispatch Node',
    notes: 'Collector accepted route with calibrated digital scale.',
    carbon_offset_kg: 0.0,
    timestamp: '2026-09-17T09:25:00Z'
  },
  {
    id: 't-log-3',
    pickup_id: 'req-101',
    qr_code_id: 'KC-QR-TRACE-BLR-00101',
    current_stage: 'Collected',
    stage_title: 'Doorstep Precision Weighing & Purity Check',
    actor_type: 'Collector',
    actor_id: 'b1010000-0000-0000-0000-000000000001',
    actor_name: 'Ramesh Kumar Nayak',
    location_name: 'Bellandur Ward 150',
    notes: 'Digital weight confirmed: 19.20 kg. Zero contamination verified.',
    carbon_offset_kg: 15.4,
    timestamp: '2026-09-17T11:30:00Z'
  },
  {
    id: 't-log-4',
    pickup_id: 'req-101',
    qr_code_id: 'KC-QR-TRACE-BLR-00101',
    current_stage: 'Paid',
    stage_title: 'Direct Digital Payout via UPI',
    actor_type: 'Collector',
    actor_id: 'b1010000-0000-0000-0000-000000000001',
    actor_name: 'Ramesh Kumar Nayak',
    location_name: 'Bellandur Ward 150',
    notes: 'Instant settlement of ₹8,064.00 transferred to Citizen UPI ID. Traceability QR generated.',
    carbon_offset_kg: 32.8,
    timestamp: '2026-09-17T11:45:00Z'
  },
  // Raichur Aggregation Log
  {
    id: 't-log-5',
    pickup_id: 'req-102',
    qr_code_id: 'KC-QR-TRACE-RCR-00102',
    current_stage: 'Aggregator Received',
    stage_title: 'Rural Aggregator Hub Intake & Baling',
    actor_type: 'Aggregator',
    actor_id: 'a1010000-0000-0000-0000-000000000001',
    actor_name: 'Raichur Central Aggregation Hub',
    location_name: 'Industrial Area, Hyderabad Road, Raichur',
    notes: '48.0kg PET/HDPE consolidated into rural batch #RCR-PL-2026-088. Awaiting threshold dispatch to smelter.',
    carbon_offset_kg: 64.2,
    timestamp: '2026-09-17T15:30:00Z'
  }
];

export const INITIAL_AGGREGATOR_INVENTORY: AggregatorInventory[] = [
  {
    id: 'inv-1',
    aggregator_id: 'a1010000-0000-0000-0000-000000000001',
    collector_id: 'b1010000-0000-0000-0000-000000000002',
    collector_name: 'Basavaraj Patil',
    pickup_id: 'req-102',
    material_name: 'PET Plastic Bottles (Sorted)',
    category: 'Plastics',
    weight_kg: 48.0,
    batch_id: 'RCR-PL-2026-088',
    status: 'in_hub',
    created_at: '2026-09-17T15:30:00Z'
  },
  {
    id: 'inv-2',
    aggregator_id: 'a1010000-0000-0000-0000-000000000001',
    collector_id: 'b1010000-0000-0000-0000-000000000002',
    collector_name: 'Basavaraj Patil',
    material_name: 'High-Grade Copper Scrap',
    category: 'Metals',
    weight_kg: 320.0,
    batch_id: 'RCR-MET-2026-014',
    status: 'in_hub',
    created_at: '2026-09-16T12:00:00Z'
  },
  {
    id: 'inv-3',
    aggregator_id: 'a1010000-0000-0000-0000-000000000001',
    collector_name: 'Mahadev Gowda',
    material_name: 'Corrugated Cardboard (Baled OCC)',
    category: 'Paper & Cardboard',
    weight_kg: 1482.0,
    batch_id: 'RCR-PPR-2026-033',
    status: 'threshold_reached',
    created_at: '2026-09-15T18:00:00Z'
  }
];
