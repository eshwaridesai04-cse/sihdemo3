-- =====================================================================
-- KABADIWALA CONNECT - PRODUCTION DATABASE SCHEMA (SIH 2026 - SIH26229)
-- Bringing the Informal Collector into the Formal Recycling Chain
-- =====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================
-- 1. CITIZENS TABLE
-- =====================================================================
CREATE TABLE IF NOT EXISTS citizens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    email TEXT,
    address TEXT NOT NULL,
    village TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT DEFAULT 'Karnataka',
    pincode TEXT NOT NULL,
    total_waste_diverted_kg NUMERIC(10,2) DEFAULT 0.00,
    green_credits INTEGER DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================================
-- 2. COLLECTORS TABLE (Kabadiwalas & Door-to-Door Recyclers)
-- =====================================================================
CREATE TABLE IF NOT EXISTS collectors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    photo_url TEXT,
    collector_code TEXT NOT NULL UNIQUE,
    qr_identity TEXT NOT NULL UNIQUE,
    village TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT DEFAULT 'Karnataka',
    pincode TEXT NOT NULL,
    trust_score NUMERIC(3,2) DEFAULT 4.90,
    is_verified BOOLEAN DEFAULT true,
    gov_id_type TEXT DEFAULT 'Aadhaar / e-Shram',
    total_collected_kg NUMERIC(10,2) DEFAULT 0.00,
    total_earnings NUMERIC(12,2) DEFAULT 0.00,
    trees_saved_count NUMERIC(8,2) DEFAULT 0.00,
    co2_saved_kg NUMERIC(10,2) DEFAULT 0.00,
    active_status TEXT DEFAULT 'active' CHECK (active_status IN ('active', 'busy', 'offline')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================================
-- 3. MATERIAL PRICES TABLE (Live Board with City/District Benchmarks)
-- =====================================================================
CREATE TABLE IF NOT EXISTS material_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Metals', 'Plastics', 'Paper & Cardboard', 'E-Waste', 'Glass', 'Batteries')),
    price_per_kg NUMERIC(10,2) NOT NULL,
    msp_price_per_kg NUMERIC(10,2) NOT NULL, -- Minimum Support Price for Informal Workers
    unit TEXT DEFAULT 'kg' NOT NULL,
    city TEXT NOT NULL,
    district TEXT NOT NULL,
    price_trend TEXT DEFAULT 'up' CHECK (price_trend IN ('up', 'down', 'stable')),
    change_percentage NUMERIC(5,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================================
-- 4. PICKUP REQUESTS TABLE
-- =====================================================================
CREATE TABLE IF NOT EXISTS pickup_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_id UUID REFERENCES citizens(id) ON DELETE SET NULL,
    collector_id UUID REFERENCES collectors(id) ON DELETE SET NULL,
    material_category TEXT NOT NULL,
    material_details TEXT,
    estimated_weight_kg NUMERIC(8,2) NOT NULL,
    actual_weight_kg NUMERIC(8,2),
    rate_per_kg NUMERIC(10,2),
    total_amount NUMERIC(10,2),
    status TEXT DEFAULT 'requested' CHECK (status IN (
        'requested',
        'accepted',
        'in_progress',
        'collected',
        'paid',
        'aggregator_received',
        'recycler_dispatched',
        'recycled',
        'cancelled'
    )),
    address TEXT NOT NULL,
    village TEXT NOT NULL,
    district TEXT NOT NULL,
    latitude NUMERIC(10,7),
    longitude NUMERIC(10,7),
    photo_url TEXT,
    preferred_date DATE NOT NULL,
    preferred_time_slot TEXT NOT NULL,
    notes TEXT,
    qr_code_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================================
-- 5. TRANSACTIONS TABLE (Material Breakdown & Weigh-in Records)
-- =====================================================================
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pickup_id UUID REFERENCES pickup_requests(id) ON DELETE CASCADE,
    citizen_id UUID REFERENCES citizens(id) ON DELETE SET NULL,
    collector_id UUID REFERENCES collectors(id) ON DELETE SET NULL,
    material_name TEXT NOT NULL,
    category TEXT NOT NULL,
    weight_kg NUMERIC(8,2) NOT NULL,
    price_per_kg NUMERIC(10,2) NOT NULL,
    total_amount NUMERIC(10,2) NOT NULL,
    payment_mode TEXT DEFAULT 'UPI' CHECK (payment_mode IN ('UPI', 'Razorpay', 'Cash')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================================
-- 6. PAYMENTS TABLE (Realtime Payment & Escrow Settlement)
-- =====================================================================
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
    pickup_id UUID REFERENCES pickup_requests(id) ON DELETE CASCADE,
    payer_id UUID NOT NULL,
    payee_id UUID NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    payment_mode TEXT NOT NULL CHECK (payment_mode IN ('UPI', 'Razorpay', 'Cash')),
    payment_status TEXT DEFAULT 'completed' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed')),
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    upi_ref_id TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================================
-- 7. EARNINGS TABLE (Aggregated Collector Financials)
-- =====================================================================
CREATE TABLE IF NOT EXISTS earnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collector_id UUID REFERENCES collectors(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    daily_amount NUMERIC(10,2) DEFAULT 0.00,
    weekly_amount NUMERIC(10,2) DEFAULT 0.00,
    monthly_amount NUMERIC(10,2) DEFAULT 0.00,
    transactions_count INTEGER DEFAULT 0,
    total_weight_kg NUMERIC(10,2) DEFAULT 0.00,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(collector_id, date)
);

-- =====================================================================
-- 8. AI SCANS TABLE (Gemini Vision Auditing & Logging)
-- =====================================================================
CREATE TABLE IF NOT EXISTS ai_scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT,
    image_url TEXT,
    detected_material TEXT NOT NULL,
    category TEXT NOT NULL,
    confidence_score NUMERIC(5,2) NOT NULL,
    is_recyclable BOOLEAN DEFAULT true,
    estimated_price NUMERIC(10,2),
    safety_tips TEXT,
    outside_scope BOOLEAN DEFAULT false,
    scope_message TEXT,
    raw_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================================
-- 9. AGGREGATORS TABLE (Rural/District Consolidation Hubs e.g. Raichur)
-- =====================================================================
CREATE TABLE IF NOT EXISTS aggregators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hub_name TEXT NOT NULL,
    operator_name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    email TEXT,
    address TEXT NOT NULL,
    village TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT DEFAULT 'Karnataka',
    storage_capacity_kg NUMERIC(12,2) DEFAULT 50000.00,
    current_stock_kg NUMERIC(12,2) DEFAULT 0.00,
    dispatch_threshold_kg NUMERIC(10,2) DEFAULT 2000.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================================
-- 10. AGGREGATOR INVENTORY TABLE (Batches Received from Collectors)
-- =====================================================================
CREATE TABLE IF NOT EXISTS aggregator_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aggregator_id UUID REFERENCES aggregators(id) ON DELETE CASCADE,
    collector_id UUID REFERENCES collectors(id) ON DELETE SET NULL,
    pickup_id UUID REFERENCES pickup_requests(id) ON DELETE SET NULL,
    material_name TEXT NOT NULL,
    category TEXT NOT NULL,
    weight_kg NUMERIC(10,2) NOT NULL,
    batch_id TEXT NOT NULL,
    status TEXT DEFAULT 'in_hub' CHECK (status IN ('in_hub', 'threshold_reached', 'dispatched_to_recycler', 'received_by_recycler')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================================
-- 11. RECYCLERS TABLE (Formal Industrial Smelters & EPR Processors)
-- =====================================================================
CREATE TABLE IF NOT EXISTS recyclers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facility_name TEXT NOT NULL,
    registration_no TEXT NOT NULL UNIQUE,
    contact_person TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    address TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT DEFAULT 'Karnataka',
    authorized_materials TEXT[] DEFAULT ARRAY['Copper', 'Aluminium', 'PET Plastic', 'E-Waste', 'Batteries'],
    epr_credit_balance NUMERIC(12,2) DEFAULT 12500.00,
    is_authorized BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================================
-- 12. TRACEABILITY LOGS TABLE (Full Circular Provenance Timeline)
-- =====================================================================
CREATE TABLE IF NOT EXISTS traceability_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pickup_id UUID REFERENCES pickup_requests(id) ON DELETE CASCADE,
    qr_code_id TEXT NOT NULL,
    current_stage TEXT NOT NULL CHECK (current_stage IN (
        'Requested',
        'Accepted',
        'Collected',
        'Paid',
        'Aggregator Received',
        'Recycler Pickup',
        'Recycler Received',
        'Recycled'
    )),
    stage_title TEXT NOT NULL,
    actor_type TEXT NOT NULL CHECK (actor_type IN ('Citizen', 'Collector', 'Aggregator', 'Recycler', 'System')),
    actor_id TEXT,
    actor_name TEXT NOT NULL,
    location_name TEXT NOT NULL,
    notes TEXT,
    proof_image_url TEXT,
    carbon_offset_kg NUMERIC(8,2) DEFAULT 0.00,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- =====================================================================
CREATE INDEX IF NOT EXISTS idx_pickup_citizen ON pickup_requests(citizen_id);
CREATE INDEX IF NOT EXISTS idx_pickup_collector ON pickup_requests(collector_id);
CREATE INDEX IF NOT EXISTS idx_pickup_status ON pickup_requests(status);
CREATE INDEX IF NOT EXISTS idx_pickup_district ON pickup_requests(district);
CREATE INDEX IF NOT EXISTS idx_prices_district ON material_prices(district);
CREATE INDEX IF NOT EXISTS idx_prices_material ON material_prices(material_name);
CREATE INDEX IF NOT EXISTS idx_traceability_qr ON traceability_logs(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_traceability_pickup ON traceability_logs(pickup_id);
CREATE INDEX IF NOT EXISTS idx_agg_inventory ON aggregator_inventory(aggregator_id);

-- =====================================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================================
ALTER TABLE citizens ENABLE ROW LEVEL SECURITY;
ALTER TABLE collectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickup_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE aggregators ENABLE ROW LEVEL SECURITY;
ALTER TABLE aggregator_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE recyclers ENABLE ROW LEVEL SECURITY;
ALTER TABLE traceability_logs ENABLE ROW LEVEL SECURITY;

-- Production Public/Authenticated Policies for SIH Hackathon Demo
CREATE POLICY "Public Read Access on material_prices" ON material_prices FOR SELECT USING (true);
CREATE POLICY "Public Read Access on collectors" ON collectors FOR SELECT USING (true);
CREATE POLICY "Public Read Access on aggregators" ON aggregators FOR SELECT USING (true);
CREATE POLICY "Public Read Access on recyclers" ON recyclers FOR SELECT USING (true);
CREATE POLICY "Public Read Access on pickup_requests" ON pickup_requests FOR SELECT USING (true);
CREATE POLICY "Public Insert on pickup_requests" ON pickup_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update on pickup_requests" ON pickup_requests FOR UPDATE USING (true);
CREATE POLICY "Public Read/Write on ai_scans" ON ai_scans FOR ALL USING (true);
CREATE POLICY "Public Read/Write on transactions" ON transactions FOR ALL USING (true);
CREATE POLICY "Public Read/Write on payments" ON payments FOR ALL USING (true);
CREATE POLICY "Public Read/Write on earnings" ON earnings FOR ALL USING (true);
CREATE POLICY "Public Read/Write on traceability_logs" ON traceability_logs FOR ALL USING (true);
CREATE POLICY "Public Read/Write on aggregator_inventory" ON aggregator_inventory FOR ALL USING (true);
CREATE POLICY "Public Read/Write on citizens" ON citizens FOR ALL USING (true);

-- =====================================================================
-- SEED DATA (Comprehensive Baseline for Demo & Realistic Operation)
-- =====================================================================

-- 1. Material Prices (Bangalore & Raichur benchmarks)
INSERT INTO material_prices (material_name, category, price_per_kg, msp_price_per_kg, unit, city, district, price_trend, change_percentage) VALUES
('Copper Wire (Bright Clean)', 'Metals', 720.00, 700.00, 'kg', 'Bangalore', 'Bangalore Urban', 'up', 4.5),
('Aluminium Extrusion', 'Metals', 185.00, 175.00, 'kg', 'Bangalore', 'Bangalore Urban', 'up', 2.1),
('Brass Honey/Utensil', 'Metals', 460.00, 440.00, 'kg', 'Bangalore', 'Bangalore Urban', 'stable', 0.0),
('Heavy Steel & TMT', 'Metals', 42.00, 40.00, 'kg', 'Bangalore', 'Bangalore Urban', 'up', 1.8),
('Cast Iron', 'Metals', 34.00, 32.00, 'kg', 'Bangalore', 'Bangalore Urban', 'down', -1.2),
('PET Plastic Bottles (Clear)', 'Plastics', 38.00, 35.00, 'kg', 'Bangalore', 'Bangalore Urban', 'up', 5.0),
('HDPE Drums & Crates', 'Plastics', 46.00, 42.00, 'kg', 'Bangalore', 'Bangalore Urban', 'up', 3.2),
('Corrugated Cardboard (OCC)', 'Paper & Cardboard', 16.50, 15.00, 'kg', 'Bangalore', 'Bangalore Urban', 'stable', 0.5),
('White Office Paper (sorted)', 'Paper & Cardboard', 22.00, 20.00, 'kg', 'Bangalore', 'Bangalore Urban', 'up', 2.0),
('Printed Circuit Boards (PCB)', 'E-Waste', 280.00, 250.00, 'kg', 'Bangalore', 'Bangalore Urban', 'up', 8.2),
('Old Laptops (Working/Scrap)', 'E-Waste', 450.00, 400.00, 'piece', 'Bangalore', 'Bangalore Urban', 'up', 6.0),
('Lead Acid Battery (Scrap)', 'Batteries', 98.00, 92.00, 'kg', 'Bangalore', 'Bangalore Urban', 'up', 3.5),
('Glass Bottles (Beer/Liquor)', 'Glass', 4.50, 4.00, 'kg', 'Bangalore', 'Bangalore Urban', 'stable', 0.0),
-- Raichur District Hub Pricing
('Copper Wire (Bright Clean)', 'Metals', 710.00, 690.00, 'kg', 'Raichur', 'Raichur', 'up', 3.8),
('Aluminium Cans & Scrap', 'Metals', 180.00, 170.00, 'kg', 'Raichur', 'Raichur', 'up', 1.5),
('PET Plastic Bottles', 'Plastics', 36.00, 33.00, 'kg', 'Raichur', 'Raichur', 'up', 4.2),
('HDPE Plastic', 'Plastics', 44.00, 40.00, 'kg', 'Raichur', 'Raichur', 'stable', 0.0),
('Corrugated Cardboard', 'Paper & Cardboard', 15.00, 14.00, 'kg', 'Raichur', 'Raichur', 'stable', 0.0),
('Lead Acid Battery', 'Batteries', 95.00, 90.00, 'kg', 'Raichur', 'Raichur', 'up', 2.5)
ON CONFLICT DO NOTHING;

-- 2. Collectors Seed
INSERT INTO collectors (id, full_name, phone, photo_url, collector_code, qr_identity, village, district, state, pincode, trust_score, is_verified, total_collected_kg, total_earnings, trees_saved_count, co2_saved_kg, active_status) VALUES
('b1010000-0000-0000-0000-000000000001', 'Ramesh Kumar Nayak', '+91 98450 12345', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80', 'KC-COL-0492', 'KC-QR-RAMESH-884', 'Indiranagar Ward 82', 'Bangalore Urban', 'Karnataka', '560038', 4.95, true, 4850.50, 184500.00, 82.5, 3420.0, 'active'),
('b1010000-0000-0000-0000-000000000002', 'Basavaraj Patil', '+91 97410 56789', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80', 'KC-COL-0831', 'KC-QR-BASAVA-412', 'Sindhanur Rural Hub', 'Raichur', 'Karnataka', '584128', 4.88, true, 6120.00, 219800.00, 104.0, 4350.0, 'active'),
('b1010000-0000-0000-0000-000000000003', 'Sunil Shinde', '+91 94220 98765', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80', 'KC-COL-1104', 'KC-QR-SUNIL-709', 'Dharavi Sector 4', 'Mumbai', 'Maharashtra', '400017', 4.92, true, 8950.00, 342100.00, 152.0, 6280.0, 'active')
ON CONFLICT (phone) DO NOTHING;

-- 3. Citizens Seed
INSERT INTO citizens (id, full_name, phone, email, address, village, district, state, pincode, total_waste_diverted_kg, green_credits) VALUES
('c1010000-0000-0000-0000-000000000001', 'Ananya Sharma', '+91 98800 11223', 'ananya.sharma@example.com', 'Flat 402, Green Glen Heights, Bellandur', 'Bellandur Ward 150', 'Bangalore Urban', 'Karnataka', '560103', 145.50, 450),
('c1010000-0000-0000-0000-000000000002', 'Mallikarjun G', '+91 94801 33445', 'mallikarjun.g@example.com', 'House No. 12, APMC Road, Sindhanur', 'Sindhanur Town', 'Raichur', 'Karnataka', '584128', 85.00, 260)
ON CONFLICT (phone) DO NOTHING;

-- 4. Aggregators Seed (Rural Hub logic - Raichur & Bangalore East)
INSERT INTO aggregators (id, hub_name, operator_name, phone, email, address, village, district, state, storage_capacity_kg, current_stock_kg, dispatch_threshold_kg) VALUES
('a1010000-0000-0000-0000-000000000001', 'Raichur Central Aggregation & Baling Center', 'Mahantesh Kulkarni', '+91 94480 77889', 'raichur.hub@kabadiwalaconnect.in', 'Plot 45, Industrial Area, Hyderabad Road', 'Raichur Hub', 'Raichur', 'Karnataka', 60000.00, 1850.00, 2000.00),
('a1010000-0000-0000-0000-000000000002', 'Bengaluru East Green Consolidation Yard', 'Suresh Babu', '+91 98455 66778', 'blr.east@kabadiwalaconnect.in', 'Whitefield Industrial Estate, Kadugodi', 'Kadugodi', 'Bangalore Urban', 'Karnataka', 80000.00, 4200.00, 3000.00)
ON CONFLICT (phone) DO NOTHING;

-- 5. Recyclers Seed
INSERT INTO recyclers (id, facility_name, registration_no, contact_person, phone, email, address, district, state, authorized_materials, epr_credit_balance, is_authorized) VALUES
('r1010000-0000-0000-0000-000000000001', 'EcoMetals Smelting & Refining Corp', 'KSPCB/EPR/2026/MET-091', 'Dr. Arvind Rao', '+91 99000 88776', 'contact@ecometals.in', 'Peenya 2nd Stage, Industrial Zone', 'Bangalore Urban', 'Karnataka', ARRAY['Copper', 'Aluminium', 'Brass', 'Steel', 'Iron'], 45200.00, true),
('r1010000-0000-0000-0000-000000000002', 'GreenPolymer Flakes & Pellets Ltd', 'KSPCB/EPR/2026/PLS-402', 'Vikramaditya Hegde', '+91 98860 44332', 'operations@greenpolymer.in', 'Doddaballapur Plastic Park', 'Bangalore Rural', 'Karnataka', ARRAY['PET Plastic', 'HDPE Plastic', 'PP Plastic'], 38000.00, true)
ON CONFLICT (registration_no) DO NOTHING;
