export type Role = 'citizen' | 'collector' | 'aggregator' | 'recycler' | 'admin';

export type Language = 'en' | 'kn' | 'hi' | 'te' | 'mr';

export type MaterialCategory = 'Metals' | 'Plastics' | 'Paper & Cardboard' | 'E-Waste' | 'Glass' | 'Batteries';

export type PickupStatus = 
  | 'requested'
  | 'accepted'
  | 'in_progress'
  | 'collected'
  | 'paid'
  | 'aggregator_received'
  | 'recycler_dispatched'
  | 'recycled'
  | 'cancelled';

export type PaymentMode = 'UPI' | 'Razorpay' | 'Cash';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Citizen {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  address: string;
  village: string;
  district: string;
  state?: string;
  pincode: string;
  total_waste_diverted_kg: number;
  green_credits: number;
  created_at?: string;
}

export interface Collector {
  id: string;
  full_name: string;
  phone: string;
  photo_url?: string;
  collector_code: string;
  qr_identity: string;
  village: string;
  district: string;
  state?: string;
  pincode: string;
  trust_score: number;
  is_verified: boolean;
  gov_id_type?: string;
  total_collected_kg: number;
  total_earnings: number;
  trees_saved_count: number;
  co2_saved_kg: number;
  active_status: 'active' | 'busy' | 'offline';
  created_at?: string;
}

export interface MaterialPrice {
  id: string;
  material_name: string;
  category: MaterialCategory;
  price_per_kg: number;
  msp_price_per_kg: number;
  unit: string;
  city: string;
  district: string;
  price_trend: 'up' | 'down' | 'stable';
  change_percentage: number;
  is_active: boolean;
  last_updated: string;
}

export interface PickupRequest {
  id: string;
  citizen_id: string;
  collector_id?: string;
  citizen_name?: string;
  citizen_phone?: string;
  collector_name?: string;
  material_category: string;
  material_details?: string;
  estimated_weight_kg: number;
  actual_weight_kg?: number;
  rate_per_kg?: number;
  total_amount?: number;
  status: PickupStatus;
  address: string;
  village: string;
  district: string;
  latitude?: number;
  longitude?: number;
  photo_url?: string;
  preferred_date: string;
  preferred_time_slot: string;
  notes?: string;
  qr_code_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface Transaction {
  id: string;
  pickup_id: string;
  citizen_id: string;
  collector_id: string;
  material_name: string;
  category: string;
  weight_kg: number;
  price_per_kg: number;
  total_amount: number;
  payment_mode: PaymentMode;
  created_at: string;
}

export interface Payment {
  id: string;
  transaction_id?: string;
  pickup_id: string;
  payer_id: string;
  payee_id: string;
  amount: number;
  payment_mode: PaymentMode;
  payment_status: PaymentStatus;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  upi_ref_id?: string;
  notes?: string;
  created_at: string;
}

export interface Earning {
  id: string;
  collector_id: string;
  date: string;
  daily_amount: number;
  weekly_amount: number;
  monthly_amount: number;
  transactions_count: number;
  total_weight_kg: number;
  updated_at: string;
}

export interface AIScanResult {
  id?: string;
  user_id?: string;
  image_url?: string;
  detected_material: string;
  material_name?: string;
  category: string;
  confidence_score: number;
  confidence?: number;
  is_recyclable: boolean;
  recyclable?: boolean;
  refurbishable?: boolean;
  recyclable_status?: 'Recyclable' | 'Refurbishable' | 'Non-Recyclable';
  estimated_price: number;
  safety_tips: string;
  safety_instructions?: string;
  outside_scope: boolean;
  scope_message?: string;
  raw_response?: any;
  created_at?: string;
}

export interface Aggregator {
  id: string;
  hub_name: string;
  operator_name: string;
  phone: string;
  email?: string;
  address: string;
  village: string;
  district: string;
  state?: string;
  storage_capacity_kg: number;
  current_stock_kg: number;
  dispatch_threshold_kg: number;
  created_at?: string;
}

export interface AggregatorInventory {
  id: string;
  aggregator_id: string;
  collector_id?: string;
  collector_name?: string;
  pickup_id?: string;
  material_name: string;
  category: string;
  weight_kg: number;
  batch_id: string;
  status: 'in_hub' | 'threshold_reached' | 'dispatched_to_recycler' | 'received_by_recycler';
  created_at: string;
}

export interface Recycler {
  id: string;
  facility_name: string;
  registration_no: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  state: string;
  authorized_materials: string[];
  epr_credit_balance: number;
  is_authorized: boolean;
  created_at?: string;
}

export interface TraceabilityLog {
  id: string;
  pickup_id: string;
  qr_code_id: string;
  current_stage: 
    | 'Requested'
    | 'Accepted'
    | 'Collected'
    | 'Paid'
    | 'Aggregator Received'
    | 'Recycler Pickup'
    | 'Recycler Received'
    | 'Recycled';
  stage_title: string;
  actor_type: 'Citizen' | 'Collector' | 'Aggregator' | 'Recycler' | 'System';
  actor_id?: string;
  actor_name: string;
  location_name: string;
  notes?: string;
  proof_image_url?: string;
  carbon_offset_kg?: number;
  timestamp: string;
}
