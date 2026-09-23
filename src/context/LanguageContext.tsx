import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  voiceCode: string;
}

export const AVAILABLE_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇮🇳', voiceCode: 'en-IN' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🟡🔴', voiceCode: 'kn-IN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', voiceCode: 'hi-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', voiceCode: 'te-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', voiceCode: 'mr-IN' },
];

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Brand & Taglines
    'app.title': 'Kabadiwala Connect',
    'app.subtitle': 'Bringing the Informal Collector into the Formal Recycling Chain',
    'app.sih_tag': 'SIH 2026 Problem Statement SIH26229 • Ministry of Environment & Circular Economy',
    'app.tagline': 'Empowering waste pickers, enabling verified recycling, and protecting our planet.',

    // Navigation
    'nav.home': 'Home',
    'nav.scanner': 'AI Scanner',
    'nav.prices': 'Live Prices',
    'nav.request': 'Request Pickup',
    'nav.track': 'Track Pickup',
    'nav.citizen_dashboard': 'Citizen Portal',
    'nav.collector_dashboard': 'Collector Portal',
    'nav.aggregator_dashboard': 'Aggregator Hub',
    'nav.recycler_dashboard': 'Recycler Portal',
    'nav.earnings': 'Earnings',
    'nav.traceability': 'QR Traceability',
    'nav.passport': 'Digital Passport',
    'nav.help': 'Help & Safety',
    'nav.settings': 'Settings',
    'nav.switch_role': 'Switch Persona',

    // Hero Section
    'hero.badge': '🌱 Swachh Bharat & Digital India Mission 2026',
    'hero.title_p1': 'Formalizing India’s',
    'hero.title_p2': 'Informal Recycling Backbone',
    'hero.description': 'Connect directly with certified local kabadiwalas, scan materials instantly with Gemini AI, track waste from doorstep to industrial smelter with tamper-proof QR logs, and receive instant digital payments.',
    'hero.cta_pickup': 'Schedule Doorstep Pickup',
    'hero.cta_scan': 'AI Material Scanner',
    'hero.cta_prices': 'View Live Scrap Rates',
    'hero.stat_diverted': 'Waste Diverted',
    'hero.stat_co2': 'CO₂ Offset',
    'hero.stat_collectors': 'Formalized Workers',
    'hero.stat_payouts': 'Paid to Collectors',

    // Quick Actions
    'quick.ai_scan_title': 'AI Material Vision',
    'quick.ai_scan_desc': 'Scan metal, plastic, or e-waste to identify grade and live market price.',
    'quick.request_title': 'Request Waste Pickup',
    'quick.request_desc': 'Book verified doorstep pickup with GPS precision & live tracking.',
    'quick.prices_title': 'Realtime Price Board',
    'quick.prices_desc': 'Transparent daily MSP scrap rates across Bangalore, Raichur & beyond.',
    'quick.trace_title': 'Chain of Custody',
    'quick.trace_desc': 'Track your recyclable journey from doorstep to certified recycler.',
    'quick.passport_title': 'Collector Digital ID',
    'quick.passport_desc': 'Government-backed digital waste-worker identity & trust credentials.',

    // AI Scanner Page
    'scanner.title': 'Gemini Vision Recyclable Material Scanner',
    'scanner.subtitle': 'Point your camera or upload a photo to identify materials, get instant pricing, and check safety instructions.',
    'scanner.mode_camera': 'Use Live Camera',
    'scanner.mode_upload': 'Upload Image File',
    'scanner.snap_btn': 'Capture & Analyze',
    'scanner.upload_prompt': 'Drag and drop an image here or click to browse',
    'scanner.analyzing': 'Gemini AI is analyzing material composition...',
    'scanner.sample_prompts': 'Try Sample Materials:',
    'scanner.result_heading': 'AI Inspection Analysis',
    'scanner.confidence': 'AI Confidence',
    'scanner.category': 'Material Category',
    'scanner.recyclable_status': 'Recyclability Status',
    'scanner.estimated_val': 'Estimated Market Rate',
    'scanner.safety_title': 'Safety & Handling SOP',
    'scanner.outside_scope_alert': '⚠️ Outside Recyclable Scope Notice',
    'scanner.outside_scope_msg': 'Outside Kabadiwala Connect recyclable scope. Please direct biological/food/medical waste to municipal composting.',
    'scanner.request_for_this': 'Schedule Pickup for This Material',
    'scanner.fix_copper_notice': 'Verified: Multi-spectrum recognition active (Detects 16 recyclable grades accurately).',

    // Live Prices Page
    'prices.title': 'Realtime Material Scrap Prices',
    'prices.subtitle': 'Mandated Minimum Support Pricing (MSP) to prevent worker exploitation and ensure fair circular returns.',
    'prices.filter_city': 'Select City / District Hub',
    'prices.filter_cat': 'All Categories',
    'prices.material_col': 'Material Grade',
    'prices.cat_col': 'Category',
    'prices.price_col': 'Current Rate (per kg)',
    'prices.msp_col': 'Govt Fair MSP',
    'prices.trend_col': '24h Trend',
    'prices.speak_btn': 'Read Today’s Prices Aloud',
    'prices.last_sync': 'Live Streamed via Supabase Realtime',

    // Request Pickup Page
    'request.title': 'Schedule Doorstep Recyclable Pickup',
    'request.subtitle': 'Directly dispatches the closest verified Kabadiwala with transparent digital weighing scales.',
    'request.name_lbl': 'Citizen Full Name',
    'request.phone_lbl': 'Contact Phone Number',
    'request.address_lbl': 'Doorstep Address / Landmark',
    'request.village_lbl': 'Ward / Village',
    'request.district_lbl': 'District',
    'request.gps_btn': 'Auto-Detect My GPS Location',
    'request.gps_detected': 'GPS Coordinates Acquired',
    'request.cat_lbl': 'Primary Material Category',
    'request.weight_lbl': 'Estimated Weight (in kg)',
    'request.date_lbl': 'Preferred Pickup Date',
    'request.slot_lbl': 'Preferred Time Slot',
    'request.notes_lbl': 'Special Instructions (e.g., Gate code, Heavy items)',
    'request.submit_btn': 'Dispatch Certified Collector',
    'request.success_alert': 'Pickup Request Broadcasted! Nearest verified collector alerted.',

    // Track Pickup
    'track.title': 'Live Pickup Tracking',
    'track.subtitle': 'Monitor your assigned collector in realtime with GPS routing and live stage progress.',
    'track.assigned_collector': 'Assigned Certified Collector',
    'track.trust_rating': 'Trust Rating',
    'track.call_collector': 'Call Collector',
    'track.status_requested': 'Pickup Broadcasted',
    'track.status_accepted': 'Collector Assigned',
    'track.status_in_progress': 'Collector En Route',
    'track.status_collected': 'Weighed & Collected',
    'track.status_paid': 'Payment Settled',
    'track.status_recycled': 'Formally Recycled',

    // Dashboards
    'dashboard.citizen_title': 'Citizen Green Dashboard',
    'dashboard.citizen_subtitle': 'Track your personal carbon offset, landfill diversion, and rewards.',
    'dashboard.collector_title': 'Collector Operations Terminal',
    'dashboard.collector_subtitle': 'Live job queue, GPS navigation, instant digital settlement, and QR badge generator.',
    'dashboard.aggregator_title': 'District Aggregator Hub (Raichur / Urban Nodes)',
    'dashboard.aggregator_subtitle': 'Consolidate rural waste batches, monitor dispatch thresholds, and route bulk lots to industrial smelters.',
    'dashboard.recycler_title': 'Authorized Recycler ERP Portal',
    'dashboard.recycler_subtitle': 'Verify incoming bulk material batches, validate QR tokens, and issue Extended Producer Responsibility (EPR) certificates.',

    // Collector Specific
    'collector.accept_job': 'Accept Pickup Request',
    'collector.reject_job': 'Decline',
    'collector.navigate_btn': 'Open Google Maps Navigation',
    'collector.weigh_title': 'Step 2: Enter Certified Digital Weight',
    'collector.weigh_input': 'Actual Weighed Weight (kg)',
    'collector.rate_input': 'Applied Rate per kg (₹)',
    'collector.calc_total': 'Total Payout Amount',
    'collector.pay_citizen': 'Initiate Instant Settlement',
    'collector.gen_qr': 'Generate Tamper-Proof QR Token',

    // Traceability
    'trace.title': 'Chain of Custody & Traceability Ledger',
    'trace.subtitle': 'Cryptographically verifiable, zero-leakage tracking from citizen doorstep to end-life recycling facility.',
    'trace.verify_input': 'Enter QR Token or Scan Barcode',
    'trace.btn_verify': 'Inspect Lifecycle Log',
    'trace.current_stage': 'Current Custody Stage',
    'trace.carbon_title': 'Total Environmental Impact',

    // Digital Passport
    'passport.title': 'National Waste Worker Digital Passport',
    'passport.subtitle': 'Official recognition & formal identity for informal recyclers under Swachh Bharat Mission.',
    'passport.gov_badge': 'Ministry of Housing and Urban Affairs (MoHUA) Verified',
    'passport.trust_score': 'Collector Trust Score',
    'passport.total_waste': 'Lifetime Material Collected',
    'passport.co2_saved': 'CO₂ Emissions Prevented',
    'passport.trees_saved': 'Equivalent Trees Planted',
    'passport.benefits_title': 'Social Security & Scheme Entitlements',
    'passport.eshram_link': 'Linked with e-Shram & PM-JAY Ayushman Bharat',
    'passport.print_btn': 'Download / Print Physical ID Card',

    // Voice & General
    'voice.speaking': 'Voice Assistant is speaking...',
    'voice.stop': 'Stop Voice',
    'voice.listen': 'Voice Guide',
    'common.kg': 'kg',
    'common.inr': '₹',
    'common.save': 'Save Changes',
    'common.cancel': 'Cancel',
    'common.status': 'Status',
    'common.date': 'Date',
    'common.actions': 'Actions',
    'common.loading': 'Loading realtime data...',
    'common.no_data': 'No records found',
    'footer.copyright': '© 2026 Kabadiwala Connect. Smart India Hackathon Winning Architecture (SIH26229).'
  },

  kn: {
    // Brand & Taglines
    'app.title': 'ಕಬಾಡಿವಾಲ ಕನೆಕ್ಟ್',
    'app.subtitle': 'ಅಸಂಘಟಿತ ತ್ಯಾಜ್ಯ ಸಂಗ್ರಾಹಕರನ್ನು ಅಧಿಕೃತ ಮರುಬಳಕೆ ಜಾಲಕ್ಕೆ ಜೋಡಿಸುವುದು',
    'app.sih_tag': 'ಸ್ಮಾರ್ಟ್ ಇಂಡಿಯಾ ಹ್ಯಾಕಥಾನ್ 2026 • SIH26229 ಪರಿಸರ ಸಚಿವಾಲಯ',
    'app.tagline': 'ತ್ಯಾಜ್ಯ ಸಂಗ್ರಾಹಕರ ಸಬಲೀಕರಣ, ನೈಜ ಮರುಬಳಕೆ ಮತ್ತು ಪರಿಸರ ಸಂರಕ್ಷಣೆ.',

    // Navigation
    'nav.home': 'ಮುಖಪುಟ',
    'nav.scanner': 'AI ಸ್ಕ್ಯಾನರ್',
    'nav.prices': 'ನೇರ ದರಪಟ್ಟಿ',
    'nav.request': 'ಪಿಕಪ್ ವಿನಂತಿ',
    'nav.track': 'ಪಿಕಪ್ ಟ್ರ್ಯಾಕಿಂಗ್',
    'nav.citizen_dashboard': 'ನಾಗರಿಕ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    'nav.collector_dashboard': 'ಸಂಗ್ರಾಹಕರ ಪೋರ್ಟಲ್',
    'nav.aggregator_dashboard': 'ಕೇಂದ್ರ ಸಂಗ್ರಹಾಗಾರ',
    'nav.recycler_dashboard': 'ರೀಸೈಕ್ಲರ್ ಪೋರ್ಟಲ್',
    'nav.earnings': 'ಗಳಿಕೆ ವಿವರ',
    'nav.traceability': 'QR ಪಾರದರ್ಶಕತೆ',
    'nav.passport': 'ಡಿಜಿಟಲ್ ಪಾಸ್‌ಪೋರ್ಟ್',
    'nav.help': 'ಸಹಾಯ ಮತ್ತು ಸುರಕ್ಷತೆ',
    'nav.settings': 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    'nav.switch_role': 'ಪಾತ್ರ ಬದಲಾಯಿಸಿ',

    // Hero Section
    'hero.badge': '🌱 ಸ್ವಚ್ಛ ಭಾರತ & ಡಿಜಿಟಲ್ ಇಂಡಿಯಾ ಮಿಷನ್ 2026',
    'hero.title_p1': 'ಭಾರತದ ಅಸಂಘಟಿತ',
    'hero.title_p2': 'ಮರುಬಳಕೆ ಜಾಲದ ಸಬಲೀಕರಣ',
    'hero.description': 'ಸ್ಥಳೀಯ ಪರಿಶೀಲಿಸಿದ ಕಬಾಡಿವಾಲಾರೊಂದಿಗೆ ನೇರವಾಗಿ ಸಂಪರ್ಕ ಸಾಧಿಸಿ, ಜೆಮಿನಿ AI ಮೂಲಕ ವಸ್ತುಗಳನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ, QR ತಂತ್ರಜ್ಞಾನದಿಂದ ಕಾರ್ಖಾನೆಯವರೆಗೂ ತ್ಯಾಜ್ಯವನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ ತಕ್ಷಣ ಯುಪಿಐ ಪಾವತಿ ಪಡೆಯಿರಿ.',
    'hero.cta_pickup': 'ಮನೆಬಾಗಿಲ ಪಿಕಪ್ ಕಾಯ್ದಿರಿಸಿ',
    'hero.cta_scan': 'AI ವಸ್ತು ಸ್ಕ್ಯಾನರ್',
    'hero.cta_prices': 'ನೇರ ರದ್ದಿ ದರಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    'hero.stat_diverted': 'ಮರುಬಳಕೆಯಾದ ತ್ಯಾಜ್ಯ',
    'hero.stat_co2': 'ಉಳಿಸಿದ ಇಂಗಾಲ (CO₂)',
    'hero.stat_collectors': 'ನೋಂದಾಯಿತ ಕಾರ್ಮಿಕರು',
    'hero.stat_payouts': 'ಪಾವತಿಸಿದ ಮೊತ್ತ',

    // Quick Actions
    'quick.ai_scan_title': 'AI ವಸ್ತು ಗುರುತಿಸುವಿಕೆ',
    'quick.ai_scan_desc': 'ಲೋಹ, ಪ್ಲಾಸ್ಟಿಕ್ ಅಥವಾ ಇ-ತ್ಯಾಜ್ಯವನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ತಕ್ಷಣ ಮಾರುಕಟ್ಟೆ ದರ ತಿಳಿಯಿರಿ.',
    'quick.request_title': 'ತ್ಯಾಜ್ಯ ಪಿಕಪ್ ವಿನಂತಿ',
    'quick.request_desc': 'ಜಿಪಿಎಸ್ ನಿಖರತೆಯೊಂದಿಗೆ ಪರಿಶೀಲಿಸಿದ ಕಬಾಡಿವಾಲಾರನ್ನು ಕರೆಸಿ.',
    'quick.prices_title': 'ದೈನಂದಿನ ರದ್ದಿ ದರಪಟ್ಟಿ',
    'quick.prices_desc': 'ಬೆಂಗಳೂರು, ರಾಯಚೂರು ಸೇರಿದಂತೆ ಪಾರದರ್ಶಕ ಕನಿಷ್ಠ ಬೆಂಬಲ ಬೆಲೆ (MSP).',
    'quick.trace_title': 'ತ್ಯಾಜ್ಯ ಸಂಚಾರ ದಾಖಲೆ',
    'quick.trace_desc': 'ನಿಮ್ಮ ತ್ಯಾಜ್ಯವು ಮರುಬಳಕೆ ಕಾರ್ಖಾನೆ ತಲುಪುವವರೆಗೆ QR ಮೂಲಕ ಪರಿಶೀಲಿಸಿ.',
    'quick.passport_title': 'ಕಾರ್ಮಿಕರ ಡಿಜಿಟಲ್ ಐಡಿ',
    'quick.passport_desc': 'ಸರ್ಕಾರದ ಮಾನ್ಯತೆ ಪಡೆದ ಡಿಜಿಟಲ್ ಗುರುತಿನ ಚೀಟಿ ಮತ್ತು ವಿಶ್ವಾಸಾರ್ಹತೆಯ ಅಂಕಗಳು.',

    // AI Scanner Page
    'scanner.title': 'ಜೆಮಿನಿ AI ಮರುಬಳಕೆ ವಸ್ತು ಸ್ಕ್ಯಾನರ್',
    'scanner.subtitle': 'ಕ್ಯಾಮೆರಾ ಮೂಲಕ ಅಥವಾ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ವಸ್ತುವಿನ ವಿಧ, ದರ ಮತ್ತು ಸುರಕ್ಷತಾ ನಿಯಮಗಳನ್ನು ತಿಳಿಯಿರಿ.',
    'scanner.mode_camera': 'ಲೈವ್ ಕ್ಯಾಮೆರಾ ಬಳಸಿ',
    'scanner.mode_upload': 'ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    'scanner.snap_btn': 'ಫೋಟೋ ತೆಗೆದು ಪರಿಶೀಲಿಸಿ',
    'scanner.upload_prompt': 'ಫೋಟೋವನ್ನು ಇಲ್ಲಿ ಎಳೆಯಿರಿ ಅಥವಾ ಕ್ಲಿಕ್ ಮಾಡಿ',
    'scanner.analyzing': 'AI ವಸ್ತುವಿನ ಸಂಯೋಜನೆಯನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...',
    'scanner.sample_prompts': 'ಮಾದರಿ ವಸ್ತುಗಳನ್ನು ಪ್ರಯತ್ನಿಸಿ:',
    'scanner.result_heading': 'AI ಪರಿಶೀಲನಾ ವರದಿ',
    'scanner.confidence': 'AI ನಿಖರತೆ',
    'scanner.category': 'ವಸ್ತುವಿನ ವರ್ಗ',
    'scanner.recyclable_status': 'ಮರುಬಳಕೆ ಸ್ಥಿತಿ',
    'scanner.estimated_val': 'ಅಂದಾಜು ಮಾರುಕಟ್ಟೆ ಬೆಲೆ',
    'scanner.safety_title': 'ಸುರಕ್ಷತಾ ಮಾರ್ಗಸೂಚಿಗಳು',
    'scanner.outside_scope_alert': '⚠️ ಮರುಬಳಕೆ ವ್ಯಾಪ್ತಿಗೆ ಮೀರಿದ ವಸ್ತು',
    'scanner.outside_scope_msg': 'ಇದು ಕಬಾಡಿವಾಲಾ ಕನೆಕ್ಟ್ ಮರುಬಳಕೆ ವ್ಯಾಪ್ತಿಗೆ ಒಳಪಡುವುದಿಲ್ಲ. ದಯವಿಟ್ಟು ಆಹಾರ/ಹಸಿ ತ್ಯಾಜ್ಯವನ್ನು ಕಾಂಪೋಸ್ಟ್‌ಗೆ ನೀಡಿ.',
    'scanner.request_for_this': 'ಈ ವಸ್ತುವಿಗೆ ಪಿಕಪ್ ಕಾಯ್ದಿರಿಸಿ',
    'scanner.fix_copper_notice': 'ದೃಢೀಕರಿಸಲಾಗಿದೆ: 16 ವಿಧದ ಮರುಬಳಕೆ ವಸ್ತುಗಳನ್ನು ನಿಖರವಾಗಿ ಗುರುತಿಸುತ್ತದೆ.',

    // Live Prices Page
    'prices.title': 'ನೇರ ಮಾರುಕಟ್ಟೆ ರದ್ದಿ ದರಪಟ್ಟಿ',
    'prices.subtitle': 'ಕಾರ್ಮಿಕರ ಶೋಷಣೆ ತಡೆಗಟ್ಟಲು ಸರ್ಕಾರದ ನ್ಯಾಯಯುತ ಕನಿಷ್ಠ ಬೆಂಬಲ ಬೆಲೆ (MSP).',
    'prices.filter_city': 'ನಗರ / ಜಿಲ್ಲಾ ಕೇಂದ್ರ ಆಯ್ಕೆಮಾಡಿ',
    'prices.filter_cat': 'ಎಲ್ಲಾ ವರ್ಗಗಳು',
    'prices.material_col': 'ವಸ್ತುವಿನ ಹೆಸರು',
    'prices.cat_col': 'ವರ್ಗ',
    'prices.price_col': 'ಪ್ರಸ್ತುತ ದರ (ಪ್ರತಿ ಕೆ.ಜಿ)',
    'prices.msp_col': 'ಸರ್ಕಾರಿ MSP ಬೆಲೆ',
    'prices.trend_col': '24 ಗಂಟೆಗಳ ಬದಲಾವಣೆ',
    'prices.speak_btn': 'ದರಗಳನ್ನು ಧ್ವನಿ ಮೂಲಕ ಕೇಳಿ',
    'prices.last_sync': 'ಸುಪಾಬೇಸ್ ರಿಯಲ್‌ಟೈಮ್ ಮೂಲಕ ನವೀಕರಿಸಲಾಗಿದೆ',

    // Request Pickup Page
    'request.title': 'ಮನೆಬಾಗಿಲಿಗೆ ತ್ಯಾಜ್ಯ ಸಂಗ್ರಹ ವಿನಂತಿ',
    'request.subtitle': 'ನಿಖರ ಡಿಜಿಟಲ್ ತೂಕದ ಯಂತ್ರವಿರುವ ಹತ್ತಿರದ ಪ್ರಮಾಣೀಕೃತ ಕಬಾಡಿವಾಲಾರನ್ನು ಕರೆಸುತ್ತದೆ.',
    'request.name_lbl': 'ನಾಗರಿಕರ ಪೂರ್ಣ ಹೆಸರು',
    'request.phone_lbl': 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    'request.address_lbl': 'ವಿಳಾಸ / ಪ್ರಮುಖ ಸ್ಥಳ',
    'request.village_lbl': 'ವಾರ್ಡ್ / ಗ್ರಾಮ',
    'request.district_lbl': 'ಜಿಲ್ಲೆ',
    'request.gps_btn': 'ನನ್ನ ಜಿಪಿಎಸ್ ಸ್ಥಳ ಪತ್ತೆಹಚ್ಚಿ',
    'request.gps_detected': 'ಜಿಪಿಎಸ್ ಸ್ಥಳ ಗುರುತಿಸಲಾಗಿದೆ',
    'request.cat_lbl': 'ವಸ್ತುಗಳ ವರ್ಗ',
    'request.weight_lbl': 'ಅಂದಾಜು ತೂಕ (ಕೆ.ಜಿ.ಗಳಲ್ಲಿ)',
    'request.date_lbl': 'ಬಯಸಿದ ದಿನಾಂಕ',
    'request.slot_lbl': 'ಬಯಸಿದ ಸಮಯ',
    'request.notes_lbl': 'ವಿಶೇಷ ಸೂಚನೆಗಳು',
    'request.submit_btn': 'ಸಂಗ್ರಾಹಕರನ್ನು ಕಳುಹಿಸಿ',
    'request.success_alert': 'ವಿನಂತಿ ಕಳುಹಿಸಲಾಗಿದೆ! ಹತ್ತಿರದ ಸಂಗ್ರಾಹಕರಿಗೆ ಮಾಹಿತಿ ನೀಡಲಾಗಿದೆ.',

    // Track Pickup
    'track.title': 'ನೇರ ಪಿಕಪ್ ಟ್ರ್ಯಾಕಿಂಗ್',
    'track.subtitle': 'ನಿಮ್ಮ ಸಂಗ್ರಾಹಕರ ಜಿಪಿಎಸ್ ಚಲನೆ ಮತ್ತು ಹಂತಗಳನ್ನು ನೇರವಾಗಿ ವೀಕ್ಷಿಸಿ.',
    'track.assigned_collector': 'ನಿಯೋಜಿತ ಪ್ರಮಾಣೀಕೃತ ಸಂಗ್ರಾಹಕ',
    'track.trust_rating': 'ವಿಶ್ವಾಸಾರ್ಹತೆ ಅಂಕ',
    'track.call_collector': 'ಸಂಗ್ರಾಹಕರಿಗೆ ಕರೆ ಮಾಡಿ',
    'track.status_requested': 'ವಿನಂತಿ ಸಲ್ಲಿಕೆಯಾಗಿದೆ',
    'track.status_accepted': 'ಸಂಗ್ರಾಹಕರು ಒಪ್ಪಿದ್ದಾರೆ',
    'track.status_in_progress': 'ಸಂಗ್ರಾಹಕರು ಬರುತ್ತಿದ್ದಾರೆ',
    'track.status_collected': 'ತೂಕ ಮಾಡಿ ಸಂಗ್ರಹಿಸಲಾಗಿದೆ',
    'track.status_paid': 'ಹಣ ಪಾವತಿಸಲಾಗಿದೆ',
    'track.status_recycled': 'ಕಾರ್ಖಾನೆಯಲ್ಲಿ ಮರುಬಳಕೆಯಾಗಿದೆ',

    // Dashboards
    'dashboard.citizen_title': 'ನಾಗರಿಕ ಹಸಿರು ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    'dashboard.citizen_subtitle': 'ನಿಮ್ಮ ಪರಿಸರ ಉಳಿತಾಯ, ಆದಾಯ ಮತ್ತು ರಿವಾರ್ಡ್ ಅಂಕಗಳನ್ನು ನೋಡಿ.',
    'dashboard.collector_title': 'ಸಂಗ್ರಾಹಕರ ಕಾರ್ಯಾಚರಣೆ ಕೇಂದ್ರ',
    'dashboard.collector_subtitle': 'ಹೊಸ ವಿನಂತಿಗಳು, ಜಿಪಿಎಸ್ ದಾರಿ, ಯುಪಿಐ ಪಾವತಿ ಮತ್ತು QR ರಶೀದಿ ರಚಿಸಿ.',
    'dashboard.aggregator_title': 'ಜಿಲ್ಲಾ ಕೇಂದ್ರ ಸಂಗ್ರಹಾಗಾರ (ರಾಯಚೂರು / ನಗರ ಕೇಂದ್ರ)',
    'dashboard.aggregator_subtitle': 'ಗ್ರಾಮೀಣ ಸಂಗ್ರಹವನ್ನು ಒಟ್ಟುಗೂಡಿಸಿ, ಮಿತಿ ತಲುಪಿದಾಗ ಕಾರ್ಖಾನೆಗಳಿಗೆ ಕಳುಹಿಸಿ.',
    'dashboard.recycler_title': 'ಅಧಿಕೃತ ರೀಸೈಕ್ಲರ್ ಪೋರ್ಟಲ್',
    'dashboard.recycler_subtitle': 'ಬಂದ ಸರಕನ್ನು QR ಮೂಲಕ ಪರಿಶೀಲಿಸಿ ಮರುಬಳಕೆ ಪ್ರಮಾಣಪತ್ರ ನೀಡಿ.',

    // Collector Specific
    'collector.accept_job': 'ವಿನಂತಿ ಸ್ವೀಕರಿಸಿ',
    'collector.reject_job': 'ತಿರಸ್ಕರಿಸಿ',
    'collector.navigate_btn': 'ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್ ಮೂಲಕ ದಾರಿ ನೋಡಿ',
    'collector.weigh_title': 'ಹಂತ 2: ಡಿಜಿಟಲ್ ತೂಕ ದಾಖಲಿಸಿ',
    'collector.weigh_input': 'ನೈಜ ತೂಕ (ಕೆ.ಜಿ)',
    'collector.rate_input': 'ದರ ಪ್ರತಿ ಕೆ.ಜಿ (₹)',
    'collector.calc_total': 'ಒಟ್ಟು ಪಾವತಿಸಬೇಕಾದ ಮೊತ್ತ',
    'collector.pay_citizen': 'ತಕ್ಷಣ ಹಣ ಪಾವತಿಸಿ',
    'collector.gen_qr': 'ಸುರಕ್ಷಿತ QR ಕೋಡ್ ರಚಿಸಿ',

    // Traceability
    'trace.title': 'ತ್ಯಾಜ್ಯ ಪಾರದರ್ಶಕತೆ ಮತ್ತು ಸಂಚಾರ ದಾಖಲೆ',
    'trace.subtitle': 'ಮನೆಯ ಬಾಗಿಲಿನಿಂದ ಮರುಬಳಕೆ ಘಟಕದವರೆಗೆ 100% ಪಾರದರ್ಶಕ ಡಿಜಿಟಲ್ ದಾಖಲೆ.',
    'trace.verify_input': 'QR ಕೋಡ್ ನಮೂದಿಸಿ ಅಥವಾ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
    'trace.btn_verify': 'ದಾಖಲೆ ಪರಿಶೀಲಿಸಿ',
    'trace.current_stage': 'ಪ್ರಸ್ತುತ ಹಂತ',
    'trace.carbon_title': 'ಪರಿಸರಕ್ಕೆ ಆದ ಲಾಭ',

    // Digital Passport
    'passport.title': 'ರಾಷ್ಟ್ರೀಯ ತ್ಯಾಜ್ಯ ಕಾರ್ಮಿಕರ ಡಿಜಿಟಲ್ ಪಾಸ್‌ಪೋರ್ಟ್',
    'passport.subtitle': 'ಸ್ವಚ್ಛ ಭಾರತ ಮಿಷನ್ ಅಡಿಯಲ್ಲಿ ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಮಾನ್ಯತೆಯ ಗುರುತಿನ ಚೀಟಿ.',
    'passport.gov_badge': 'MoHUA ನಗರಾಭಿವೃದ್ಧಿ ಸಚಿವಾಲಯದಿಂದ ಪರಿಶೀಲಿಸಲ್ಪಟ್ಟಿದೆ',
    'passport.trust_score': 'ವಿಶ್ವಾಸಾರ್ಹತೆ ಅಂಕ',
    'passport.total_waste': 'ಒಟ್ಟು ಸಂಗ್ರಹಿಸಿದ ತ್ಯಾಜ್ಯ',
    'passport.co2_saved': 'ತಡೆದ ಇಂಗಾಲದ ಹೊರಸೂಸುವಿಕೆ',
    'passport.trees_saved': 'ಉಳಿಸಿದ ಮರಗಳ ಸಂಖ್ಯೆ',
    'passport.benefits_title': 'ಸರ್ಕಾರಿ ಯೋಜನೆ ಮತ್ತು ಸೌಲಭ್ಯಗಳು',
    'passport.eshram_link': 'ಇ-ಶ್ರಮ್ ಮತ್ತು ಆಯುಷ್ಮಾನ್ ಭಾರತ್ ಯೋಜನೆಗೆ ಜೋಡಿಸಲಾಗಿದೆ',
    'passport.print_btn': 'ಗುರುತಿನ ಚೀಟಿ ಡೌನ್‌ಲೋಡ್ / ಪ್ರಿಂಟ್ ಮಾಡಿ',

    // Voice & General
    'voice.speaking': 'ಧ್ವನಿ ಸಹಾಯಕ ಮಾತನಾಡುತ್ತಿದೆ...',
    'voice.stop': 'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ',
    'voice.listen': 'ಧ್ವನಿ ಮಾರ್ಗದರ್ಶಿ',
    'common.kg': 'ಕೆ.ಜಿ',
    'common.inr': '₹',
    'common.save': 'ಉಳಿಸಿ',
    'common.cancel': 'ರದ್ದುಮಾಡಿ',
    'common.status': 'ಸ್ಥಿತಿ',
    'common.date': 'ದಿನಾಂಕ',
    'common.actions': 'ಕ್ರಮಗಳು',
    'common.loading': 'ಮಾಹಿತಿ ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    'common.no_data': 'ಯಾವುದೇ ದಾಖಲೆಗಳಿಲ್ಲ',
    'footer.copyright': '© 2026 ಕಬಾಡಿವಾಲ ಕನೆಕ್ಟ್. ಸ್ಮಾರ್ಟ್ ಇಂಡಿಯಾ ಹ್ಯಾಕಥಾನ್ (SIH26229).'
  },

  hi: {
    // Brand & Taglines
    'app.title': 'कबाड़ीवाला कनेक्ट',
    'app.subtitle': 'अनौपचारिक कचरा बीनने वालों को औपचारिक रीसाइक्लिंग श्रृंखला से जोड़ना',
    'app.sih_tag': 'स्मार्ट इंडिया हैकाथॉन 2026 • समस्या विवरण SIH26229 • पर्यावरण मंत्रालय',
    'app.tagline': 'कचरा संग्राहकों का सशक्तिकरण, प्रमाणित रीसाइक्लिंग और पर्यावरण की सुरक्षा।',

    // Navigation
    'nav.home': 'होम',
    'nav.scanner': 'AI स्कैनर',
    'nav.prices': 'लाइव भाव',
    'nav.request': 'पिकअप अनुरोध',
    'nav.track': 'पिकअप ट्रैक करें',
    'nav.citizen_dashboard': 'नागरिक पोर्टल',
    'nav.collector_dashboard': 'कलेक्टर पोर्टल',
    'nav.aggregator_dashboard': 'एग्रीगेटर हब',
    'nav.recycler_dashboard': 'रीसाइक्लर पोर्टल',
    'nav.earnings': 'कमाई विवरण',
    'nav.traceability': 'QR ट्रैसबिलिटी',
    'nav.passport': 'डिजिटल पासपोर्ट',
    'nav.help': 'मदद और सुरक्षा',
    'nav.settings': 'सेटिंग्स',
    'nav.switch_role': 'भूमिका बदलें',

    // Hero Section
    'hero.badge': '🌱 स्वच्छ भारत एवं डिजिटल इंडिया मिशन 2026',
    'hero.title_p1': 'भारत की अनौपचारिक',
    'hero.title_p2': 'रीसाइक्लिंग रीढ़ का औपचारिकीकरण',
    'hero.description': 'सत्यापित स्थानीय कबाड़ीवालों से सीधे जुड़ें, जेमिनी AI से कचरा स्कैन करें, QR तकनीक से कारखाने तक ट्रैकिंग करें और तुरंत UPI भुगतान प्राप्त करें।',
    'hero.cta_pickup': 'डोरस्टेप पिकअप बुक करें',
    'hero.cta_scan': 'AI सामग्री स्कैनर',
    'hero.cta_prices': 'लाइव कबाड़ भाव देखें',
    'hero.stat_diverted': 'रीसायकल किया गया कचरा',
    'hero.stat_co2': 'CO₂ उत्सर्जन में कमी',
    'hero.stat_collectors': 'सत्यापित कामगार',
    'hero.stat_payouts': 'कुल भुगतान',

    // Quick Actions
    'quick.ai_scan_title': 'AI विजन पहचान',
    'quick.ai_scan_desc': 'धातु, प्लास्टिक या ई-कचरे को स्कैन कर सटीक भाव और श्रेणी जानें।',
    'quick.request_title': 'कचरा पिकअप अनुरोध',
    'quick.request_desc': 'जीपीएस लोकेशन और समय चुनकर कबाड़ीवाला बुलाएं।',
    'quick.prices_title': 'दैनिक कबाड़ रेट बोर्ड',
    'quick.prices_desc': 'पारदर्शी सरकारी न्यूनतम समर्थन मूल्य (MSP) की दरें।',
    'quick.trace_title': 'कचरा यात्रा प्रमाण (QR)',
    'quick.trace_desc': 'घर से रीसाइक्लिंग प्लांट तक संपूर्ण यात्रा की लाइव जांच।',
    'quick.passport_title': 'कलेक्टर डिजिटल आईडी',
    'quick.passport_desc': 'सरकारी मान्यता प्राप्त डिजिटल पहचान पत्र और विश्वसनीयता स्कोर।',

    // AI Scanner Page
    'scanner.title': 'जेमिनी AI रीसाइक्लेबल सामग्री स्कैनर',
    'scanner.subtitle': 'कैमरे से फोटो लें या अपलोड करें और सामग्री का प्रकार, दर और सुरक्षा नियम जानें।',
    'scanner.mode_camera': 'लाइव कैमरा उपयोग करें',
    'scanner.mode_upload': 'फोटो अपलोड करें',
    'scanner.snap_btn': 'फोटो खींचें और जांचें',
    'scanner.upload_prompt': 'फोटो यहां खींचें या क्लिक करें',
    'scanner.analyzing': 'AI सामग्री का विश्लेषण कर रहा है...',
    'scanner.sample_prompts': 'नमूना सामग्री आज़माएं:',
    'scanner.result_heading': 'AI निरीक्षण विश्लेषण',
    'scanner.confidence': 'AI सटीकता',
    'scanner.category': 'सामग्री श्रेणी',
    'scanner.recyclable_status': 'रीसाइक्लिंग स्थिति',
    'scanner.estimated_val': 'अनुमानित बाजार भाव',
    'scanner.safety_title': 'सुरक्षा और हैंडलिंग निर्देश',
    'scanner.outside_scope_alert': '⚠️ रीसाइक्लिंग दायरे से बाहर की सामग्री',
    'scanner.outside_scope_msg': 'यह कबाड़ीवाला कनेक्ट के रीसाइक्लिंग दायरे से बाहर है। कृपया जैविक/गीले कचरे को खाद बनाने हेतु दें।',
    'scanner.request_for_this': 'इस सामग्री के लिए पिकअप बुक करें',
    'scanner.fix_copper_notice': 'सत्यापित: 16 विभिन्न प्रकार की रीसाइक्लेबल सामग्री की सटीक पहचान।',

    // Live Prices Page
    'prices.title': 'लाइव स्क्रैप और कबाड़ मूल्य बोर्ड',
    'prices.subtitle': 'श्रमिकों के शोषण को रोकने के लिए निर्धारित सरकारी न्यूनतम समर्थन मूल्य (MSP)।',
    'prices.filter_city': 'शहर / जिला हब चुनें',
    'prices.filter_cat': 'सभी श्रेणियां',
    'prices.material_col': 'सामग्री का नाम',
    'prices.cat_col': 'श्रेणी',
    'prices.price_col': 'वर्तमान भाव (प्रति किग्रा)',
    'prices.msp_col': 'सरकारी MSP दर',
    'prices.trend_col': '24 घंटे का रुझान',
    'prices.speak_btn': 'आज के भाव बोलकर सुनाएं',
    'prices.last_sync': 'सुपाबेस रियल-टाइम से लाइव सिंक',

    // Request Pickup Page
    'request.title': 'डोरस्टेप रीसाइक्लेबल पिकअप शेड्यूल करें',
    'request.subtitle': 'प्रमाणित डिजिटल तराजू से लैस नजदीकी कबाड़ीवाले को सीधे बुलाएं।',
    'request.name_lbl': 'नागरिक का पूरा नाम',
    'request.phone_lbl': 'मोबाइल नंबर',
    'request.address_lbl': 'घर का पता / लैंडमार्क',
    'request.village_lbl': 'वार्ड / गांव',
    'request.district_lbl': 'जिला',
    'request.gps_btn': 'मेरा जीपीएस स्थान स्वतः पता करें',
    'request.gps_detected': 'जीपीएस लोकेशन प्राप्त हुई',
    'request.cat_lbl': 'मुख्य सामग्री श्रेणी',
    'request.weight_lbl': 'अनुमानित वजन (किग्रा में)',
    'request.date_lbl': 'पसंदीदा पिकअप तारीख',
    'request.slot_lbl': 'पसंदीदा समय',
    'request.notes_lbl': 'विशेष निर्देश',
    'request.submit_btn': 'प्रमाणित कलेक्टर भेजें',
    'request.success_alert': 'अनुरोध सफलतापूर्वक भेजा गया! नजदीकी कबाड़ीवाले को सूचित कर दिया गया है।',

    // Track Pickup
    'track.title': 'लाइव पिकअप ट्रैकिंग',
    'track.subtitle': 'अपने कलेक्टर की जीपीएस लोकेशन और पिकअप स्थिति की लाइव निगरानी करें।',
    'track.assigned_collector': 'नियुक्त प्रमाणित कलेक्टर',
    'track.trust_rating': 'विश्वास स्कोर',
    'track.call_collector': 'कलेक्टर को कॉल करें',
    'track.status_requested': 'अनुरोध प्राप्त हुआ',
    'track.status_accepted': 'कलेक्टर नियुक्त',
    'track.status_in_progress': 'कलेक्टर रास्ते में है',
    'track.status_collected': 'तौलकर एकत्रित किया गया',
    'track.status_paid': 'भुगतान संपन्न',
    'track.status_recycled': 'रीसायकल हो चुका है',

    // Dashboards
    'dashboard.citizen_title': 'नागरिक ग्रीन डैशबोर्ड',
    'dashboard.citizen_subtitle': 'अपने पर्यावरण योगदान, अर्जित राशि और रिवॉर्ड अंक देखें।',
    'dashboard.collector_title': 'कलेक्टर ऑपरेशंस टर्मिनल',
    'dashboard.collector_subtitle': 'नई मांगें, जीपीएस नेविगेशन, डिजिटल भुगतान और QR रसीद जनरेट करें।',
    'dashboard.aggregator_title': 'जिला एग्रीगेटर हब (रायचूर / शहरी नोड्स)',
    'dashboard.aggregator_subtitle': 'ग्रामीण लॉट एकत्र करें और सीमा पूरी होने पर रीसाइक्लर को भेजें।',
    'dashboard.recycler_title': 'अधिकृत रीसाइक्लर पोर्टल',
    'dashboard.recycler_subtitle': 'QR कोड से माल सत्यापित करें और EPR रीसाइक्लिंग सर्टिफिकेट जारी करें।',

    // Collector Specific
    'collector.accept_job': 'अनुरोध स्वीकार करें',
    'collector.reject_job': 'अस्वीकार करें',
    'collector.navigate_btn': 'गूगल मैप्स नेविगेशन खोलें',
    'collector.weigh_title': 'चरण 2: वास्तविक डिजिटल वजन दर्ज करें',
    'collector.weigh_input': 'वास्तविक वजन (किग्रा)',
    'collector.rate_input': 'लागू दर प्रति किग्रा (₹)',
    'collector.calc_total': 'कुल भुगतान राशि',
    'collector.pay_citizen': 'तुरंत भुगतान करें',
    'collector.gen_qr': 'सुरक्षित QR कोड बनाएं',

    // Traceability
    'trace.title': 'कचरा संचरण और संपूर्ण ट्रैसबिलिटी',
    'trace.subtitle': 'डोरस्टेप से रीसाइक्लिंग प्लांट तक 100% पारदर्शी डिजिटल रिकॉर्ड।',
    'trace.verify_input': 'QR टोकन दर्ज करें या स्कैन करें',
    'trace.btn_verify': 'रिकॉर्ड जांचें',
    'trace.current_stage': 'वर्तमान चरण',
    'trace.carbon_title': 'कुल पर्यावरण प्रभाव',

    // Digital Passport
    'passport.title': 'राष्ट्रीय कचरा कामगार डिजिटल पासपोर्ट',
    'passport.subtitle': 'स्वच्छ भारत मिशन के तहत कचरा बीनने वालों को आधिकारिक सरकारी पहचान।',
    'passport.gov_badge': 'MoHUA आवास एवं शहरी कार्य मंत्रालय द्वारा सत्यापित',
    'passport.trust_score': 'विश्वसनीयता स्कोर',
    'passport.total_waste': 'कुल एकत्रित कचरा',
    'passport.co2_saved': 'रोका गया CO₂ उत्सर्जन',
    'passport.trees_saved': 'बचाए गए पेड़ों की संख्या',
    'passport.benefits_title': 'सामाजिक सुरक्षा और सरकारी योजनाएं',
    'passport.eshram_link': 'ई-श्रम और आयुष्मान भारत से संबद्ध',
    'passport.print_btn': 'आईडी कार्ड डाउनलोड / प्रिंट करें',

    // Voice & General
    'voice.speaking': 'वॉइस असिस्टेंट बोल रहा है...',
    'voice.stop': 'आवाज बंद करें',
    'voice.listen': 'वॉइस गाइड',
    'common.kg': 'किग्रा',
    'common.inr': '₹',
    'common.save': 'सहेजें',
    'common.cancel': 'रद्द करें',
    'common.status': 'स्थिति',
    'common.date': 'तारीख',
    'common.actions': 'कार्रवाई',
    'common.loading': 'डेटा लोड हो रहा है...',
    'common.no_data': 'कोई रिकॉर्ड नहीं मिला',
    'footer.copyright': '© 2026 कबाड़ीवाला कनेक्ट. स्मार्ट इंडिया हैकाथॉन (SIH26229).'
  },

  te: {
    // Telugu
    'app.title': 'కబాడీవాలా కనెక్ట్',
    'app.subtitle': 'అసంఘటిత వ్యర్థాల సేకరణదారులను అధికారిక రీసైక్లింగ్ శ్రేణికి అనుసంధానించడం',
    'app.sih_tag': 'స్మార్ట్ ఇండియా హ్యాకథాన్ 2026 • SIH26229 • పర్యావరణ మంత్రిత్వ శాఖ',
    'app.tagline': 'వ్యర్థాల సేకరణదారుల సాధికారత, ధృవీకరించబడిన రీసైక్లింగ్ మరియు పర్యావరణ పరిరక్షణ.',

    // Navigation
    'nav.home': 'హోమ్',
    'nav.scanner': 'AI స్కానర్',
    'nav.prices': 'లైవ్ ధరలు',
    'nav.request': 'పికప్ అభ్యర్థన',
    'nav.track': 'పికప్ ట్రాకింగ్',
    'nav.citizen_dashboard': 'పౌరుల పోర్టల్',
    'nav.collector_dashboard': 'కలెక్టర్ పోర్టల్',
    'nav.aggregator_dashboard': 'అగ్రిగేటర్ హబ్',
    'nav.recycler_dashboard': 'రీసైక్లర్ పోర్టల్',
    'nav.earnings': 'ఆదాయ వివరాలు',
    'nav.traceability': 'QR పారదర్శకత',
    'nav.passport': 'డిజిటల్ పాస్‌పోర్ట్',
    'nav.help': 'సహాయం & భద్రత',
    'nav.settings': 'సెట్టింగులు',
    'nav.switch_role': 'పాత్ర మార్చండి',

    // Hero Section
    'hero.badge': '🌱 స్వచ్ఛ భారత్ & డిజిటల్ ఇండియా మిషన్ 2026',
    'hero.title_p1': 'భారతదేశ అసంఘటిత',
    'hero.title_p2': 'రీసైక్లింగ్ రంగాన్ని అధికారికం చేయడం',
    'hero.description': 'ధృవీకరించబడిన స్థానిక కబాడీవాలాలతో నేరుగా కనెక్ట్ అవ్వండి, జెమిని AI తో వ్యర్థాలను స్కాన్ చేయండి, QR ద్వారా పర్యవేక్షించి తక్షణ UPI చెల్లింపు పొందండి.',
    'hero.cta_pickup': 'డోర్‌స్టెప్ పికప్ బుక్ చేయండి',
    'hero.cta_scan': 'AI మెటీరియల్ స్కానర్',
    'hero.cta_prices': 'లైవ్ స్క్రాప్ ధరలు చూడండి',
    'hero.stat_diverted': 'రీసైకిల్ చేసిన వ్యర్థాలు',
    'hero.stat_co2': 'ఆదా చేసిన CO₂',
    'hero.stat_collectors': 'నమోదిత కార్మికులు',
    'hero.stat_payouts': 'మొత్తం చెల్లింపులు',

    // Quick Actions
    'quick.ai_scan_title': 'AI మెటీరియల్ విజన్',
    'quick.ai_scan_desc': 'మెటల్, ప్లాస్టిక్ లేదా ఈ-వేస్ట్‌ను స్కాన్ చేసి మార్కెట్ ధరను తెలుసుకోండి.',
    'quick.request_title': 'వ్యర్థాల పికప్ అభ్యర్థన',
    'quick.request_desc': 'GPS లొకేషన్‌తో ధృవీకరించబడిన కబాడీవాలాను బుక్ చేయండి.',
    'quick.prices_title': 'రోజువారీ స్క్రాప్ రేట్లు',
    'quick.prices_desc': 'బెంగళూరు, రాయచూర్ మరియు ఇతర ప్రాంతాల కనీస మద్దతు ధరలు (MSP).',
    'quick.trace_title': 'QR వ్యర్థాల ట్రాకింగ్',
    'quick.trace_desc': 'ఇంటి నుండి రీసైక్లింగ్ ఫ్యాక్టరీ వరకు వ్యర్థాల ప్రయాణాన్ని ట్రాక్ చేయండి.',
    'quick.passport_title': 'కలెక్టర్ డిజిటల్ ఐడీ',
    'quick.passport_desc': 'ప్రభుత్వ గుర్తింపు పొందిన డిజిటల్ గుర్తింపు కార్డు మరియు ట్రస్ట్ స్కోర్.',

    // AI Scanner Page
    'scanner.title': 'జెమిని AI మెటీరియల్ స్కానర్',
    'scanner.subtitle': 'కెమెరాతో ఫోటో తీయండి లేదా అప్‌లోడ్ చేసి రకం, ధర మరియు భద్రతా నియమాలను తెలుసుకోండి.',
    'scanner.mode_camera': 'లైవ్ కెమెరా ఉపయోగించండి',
    'scanner.mode_upload': 'ఫోటో అప్‌లోడ్ చేయండి',
    'scanner.snap_btn': 'స్కాన్ చేసి విశ్లేషించండి',
    'scanner.upload_prompt': 'చిత్రాన్ని ఇక్కడ లాగండి లేదా క్లిక్ చేయండి',
    'scanner.analyzing': 'AI విశ్లేషిస్తోంది...',
    'scanner.sample_prompts': 'నమూనా వస్తువులను ప్రయత్నించండి:',
    'scanner.result_heading': 'AI తనిఖీ విశ్లేషణ',
    'scanner.confidence': 'AI ఖచ్చితత్వం',
    'scanner.category': 'వర్గం',
    'scanner.recyclable_status': 'రీసైక్లింగ్ స్థితి',
    'scanner.estimated_val': 'అంచనా మార్కెట్ ధర',
    'scanner.safety_title': 'భద్రతా సూచనలు',
    'scanner.outside_scope_alert': '⚠️ రీసైక్లింగ్ పరిధికి మించిన వ్యర్థం',
    'scanner.outside_scope_msg': 'ఇది కబాడీవాలా కనెక్ట్ రీసైక్లింగ్ పరిధిలోకి రాదు. దయచేసి తడి/ఆహార వ్యర్థాలను కంపోస్టింగ్‌కు పంపండి.',
    'scanner.request_for_this': 'ఈ వస్తువుకు పికప్ బుక్ చేయండి',
    'scanner.fix_copper_notice': 'ధృవీకరించబడింది: 16 రకాల రీసైక్లింగ్ వస్తువులను ఖచ్చితంగా గుర్తిస్తుంది.',

    // Live Prices Page
    'prices.title': 'లైవ్ మెటీరియల్ స్క్రాప్ ధరలు',
    'prices.subtitle': 'కార్మికుల శోషణను అరికట్టడానికి ప్రభుత్వ కనీస మద్దతు ధర (MSP).',
    'prices.filter_city': 'నగరం / జిల్లా ఎంచుకోండి',
    'prices.filter_cat': 'అన్ని వర్గాలు',
    'prices.material_col': 'వస్తువు పేరు',
    'prices.cat_col': 'వర్గం',
    'prices.price_col': 'ప్రస్తుత ధర (కేజీకి)',
    'prices.msp_col': 'ప్రభుత్వ MSP ధర',
    'prices.trend_col': '24 గంటల మార్పు',
    'prices.speak_btn': 'ధరలను వాయిస్ ద్వారా వినండి',
    'prices.last_sync': 'సుపాబేస్ రియల్‌టైమ్ లైవ్ అప్‌డేట్',

    // Request Pickup Page
    'request.title': 'డోర్‌స్టెప్ వ్యర్థాల పికప్ బుక్ చేయండి',
    'request.subtitle': 'డిజిటల్ స్కేల్స్ ఉన్న ధృవీకరించబడిన కబాడీవాలాను బుక్ చేయండి.',
    'request.name_lbl': 'పౌరుడి పూర్తి పేరు',
    'request.phone_lbl': 'మొబైల్ నంబర్',
    'request.address_lbl': 'చిరునామా / ల్యాండ్‌మార్క్',
    'request.village_lbl': 'వార్డు / గ్రామం',
    'request.district_lbl': 'జిల్లా',
    'request.gps_btn': 'నా GPS స్థానాన్ని గుర్తించండి',
    'request.gps_detected': 'GPS లొకేషన్ గుర్తించబడింది',
    'request.cat_lbl': 'ప్రధాన వర్గం',
    'request.weight_lbl': 'అంచనా బరువు (కేజీలలో)',
    'request.date_lbl': 'తేదీ',
    'request.slot_lbl': 'సమయం',
    'request.notes_lbl': 'ప్రత్యేక సూచనలు',
    'request.submit_btn': 'కలెక్టర్‌ను పంపండి',
    'request.success_alert': 'అభ్యర్థన పంపబడింది! సమీప కలెక్టర్‌కు సమాచారం అందింది.',

    // Track Pickup
    'track.title': 'లైవ్ పికప్ ట్రాకింగ్',
    'track.subtitle': 'మీ కలెక్టర్ కదలికలను మరియు పికప్ స్థితిని లైవ్‌గా ట్రాక్ చేయండి.',
    'track.assigned_collector': 'నియమించబడిన కలెక్టర్',
    'track.trust_rating': 'ట్రస్ట్ స్కోర్',
    'track.call_collector': 'కలెక్టర్‌కు కాల్ చేయండి',
    'track.status_requested': 'అభ్యర్థన అందింది',
    'track.status_accepted': 'కలెక్టర్ అంగీకరించారు',
    'track.status_in_progress': 'కలెక్టర్ వస్తున్నారు',
    'track.status_collected': 'తూకం వేసి సేకరించారు',
    'track.status_paid': 'చెల్లింపు పూర్తయింది',
    'track.status_recycled': 'రీసైకిల్ చేయబడింది',

    // Dashboards
    'dashboard.citizen_title': 'పౌరుల గ్రీన్ డ్యాష్‌బోర్డ్',
    'dashboard.citizen_subtitle': 'మీ పర్యావరణ పొదుపులు, సంపాదన మరియు రివార్డ్ పాయింట్లను చూడండి.',
    'dashboard.collector_title': 'కలెక్టర్ ఆపరేషన్స్ టెర్మినల్',
    'dashboard.collector_subtitle': 'కొత్త పికప్‌లు, GPS నావిగేషన్, UPI చెల్లింపు మరియు QR కోడ్ జనరేటర్.',
    'dashboard.aggregator_title': 'జిల్లా అగ్రిగేటర్ హబ్ (రాయచూర్ / అర్బన్)',
    'dashboard.aggregator_subtitle': 'గ్రామీణ వ్యర్థాల నిల్వను పర్యవేక్షించి రీసైక్లర్లకు పంపండి.',
    'dashboard.recycler_title': 'అధికారిక రీసైక్లర్ పోర్టల్',
    'dashboard.recycler_subtitle': 'QR కోడ్ ద్వారా ధృవీకరించి EPR రీసైక్లింగ్ సర్టిఫికేట్ జారీ చేయండి.',

    // Collector Specific
    'collector.accept_job': 'అభ్యర్థనను అంగీకరించండి',
    'collector.reject_job': 'తిరస్కరించండి',
    'collector.navigate_btn': 'గూగుల్ మ్యాప్స్ నావిగేషన్',
    'collector.weigh_title': 'దశ 2: డిజిటల్ బరువు నమోదు చేయండి',
    'collector.weigh_input': 'వాస్తవ బరువు (కేజీలు)',
    'collector.rate_input': 'ధర ప్రతి కేజీకి (₹)',
    'collector.calc_total': 'మొత్తం చెల్లింపు',
    'collector.pay_citizen': 'తక్షణ చెల్లింపు చేయండి',
    'collector.gen_qr': 'QR కోడ్ రూపొందించండి',

    // Traceability
    'trace.title': 'వ్యర్థాల ట్రాకింగ్ & లెడ్జర్',
    'trace.subtitle': 'డోర్‌స్టెప్ నుండి రీసైక్లింగ్ ప్లాంట్ వరకు 100% డిజిటల్ రికార్డు.',
    'trace.verify_input': 'QR కోడ్ నమోదు చేయండి లేదా స్కాన్ చేయండి',
    'trace.btn_verify': 'రికార్డును తనిఖీ చేయండి',
    'trace.current_stage': 'ప్రస్తుత దశ',
    'trace.carbon_title': 'మొత్తం పర్యావరణ ప్రభావం',

    // Digital Passport
    'passport.title': 'జాతీయ వ్యర్థ కార్మికుల డిజిటల్ పాస్‌పోర్ట్',
    'passport.subtitle': 'స్వచ్ఛ భారత్ మిషన్ కింద అధికారిక ప్రభుత్వ గుర్తింపు కార్డు.',
    'passport.gov_badge': 'MoHUA గృహ & పట్టణ వ్యవహారాల మంత్రిత్వ శాఖ ధృవీకరించింది',
    'passport.trust_score': 'ట్రస్ట్ స్కోర్',
    'passport.total_waste': 'మొత్తం సేకరించిన వ్యర్థాలు',
    'passport.co2_saved': 'నివారించిన CO₂ ఉద్గారాలు',
    'passport.trees_saved': 'కాపాడిన చెట్ల సంఖ్య',
    'passport.benefits_title': 'సామాజిక భద్రత మరియు ప్రభుత్వ పథకాలు',
    'passport.eshram_link': 'ఈ-శ్రమ్ మరియు ఆయుష్మాన్ భారత్ తో అనుసంధానించబడింది',
    'passport.print_btn': 'ఐడీ కార్డు డౌన్‌లోడ్ / ప్రింట్ చేయండి',

    // Voice & General
    'voice.speaking': 'వాయిస్ అసిస్టెంట్ మాట్లాడుతోంది...',
    'voice.stop': 'వాయిస్ ఆపండి',
    'voice.listen': 'వాయిస్ గైడ్',
    'common.kg': 'కేజీ',
    'common.inr': '₹',
    'common.save': 'సేవ్ చేయండి',
    'common.cancel': 'రద్దు చేయండి',
    'common.status': 'స్థితి',
    'common.date': 'తేదీ',
    'common.actions': 'చర్యలు',
    'common.loading': 'లోడ్ అవుతోంది...',
    'common.no_data': 'ఎలాంటి రికార్డులు లేవు',
    'footer.copyright': '© 2026 కబాడీవాలా కనెక్ట్. స్మార్ట్ ఇండియా హ్యాకథాన్ (SIH26229).'
  },

  mr: {
    // Marathi
    'app.title': 'कबाडीवाला कनेक्ट',
    'app.subtitle': 'अनौपचारिक कचरा गोळा करणाऱ्यांना औपचारिक पुनर्वापर साखळीशी जोडणे',
    'app.sih_tag': 'स्मार्ट इंडिया हॅकाथॉन 2026 • समस्या विधान SIH26229 • पर्यावरण मंत्रालय',
    'app.tagline': 'कचरा वेचकांचे सक्षमीकरण, प्रमाणित रीसायकलिंग आणि पर्यावरणाचे रक्षण.',

    // Navigation
    'nav.home': 'होम',
    'nav.scanner': 'AI स्कॅनर',
    'nav.prices': 'लाईव्ह दर',
    'nav.request': 'पिकअप विनंती',
    'nav.track': 'पिकअप ट्रॅक करा',
    'nav.citizen_dashboard': 'नागरिक पोर्टल',
    'nav.collector_dashboard': 'कलेक्टर पोर्टल',
    'nav.aggregator_dashboard': 'अॅग्रीगेटर हब',
    'nav.recycler_dashboard': 'रीसायकलर पोर्टल',
    'nav.earnings': 'कमाई तपशील',
    'nav.traceability': 'QR पारदर्शकता',
    'nav.passport': 'डिजिटल पासपोर्ट',
    'nav.help': 'मदत आणि सुरक्षा',
    'nav.settings': 'सेटिंग्ज',
    'nav.switch_role': 'भूमिका बदला',

    // Hero Section
    'hero.badge': '🌱 स्वच्छ भारत आणि डिजिटल इंडिया मिशन 2026',
    'hero.title_p1': 'भारताच्या अनौपचारिक',
    'hero.title_p2': 'पुनर्वापर क्षेत्राचे औपचारिकीकरण',
    'hero.description': 'स्थानिक प्रमाणित कबाडीवालांशी थेट संपर्क साधा, जेमिनी AI द्वारे भंगार स्कॅन करा, QR तंत्रज्ञानाने कारखान्यापर्यंत कचरा ट्रॅक करा आणि त्वरित UPI पेमेंट मिळवा.',
    'hero.cta_pickup': 'घरोघरी पिकअप बुक करा',
    'hero.cta_scan': 'AI मटेरियल स्कॅनर',
    'hero.cta_prices': 'लाईव्ह भंगार भाव पहा',
    'hero.stat_diverted': 'रीसायकल केलेला कचरा',
    'hero.stat_co2': 'वाचवलेला कार्बन (CO₂)',
    'hero.stat_collectors': 'प्रमाणित कामगार',
    'hero.stat_payouts': 'एकूण मोबदला',

    // Quick Actions
    'quick.ai_scan_title': 'AI मटेरियल ओळख',
    'quick.ai_scan_desc': 'धातू, प्लास्टिक किंवा ई-कचरा स्कॅन करून बाजारभाव त्वरित जाणून घ्या.',
    'quick.request_title': 'कचरा पिकअप विनंती',
    'quick.request_desc': 'GPS अचूकतेने प्रमाणित कबाडीवाला थेट घरी बोलवा.',
    'quick.prices_title': 'दैनंदिन भंगार दरपत्रक',
    'quick.prices_desc': 'मुंबई, बंगळुरू सह इतर शहरांचे पारदर्शक हमीभाव (MSP).',
    'quick.trace_title': 'कचरा प्रवास नोंद (QR)',
    'quick.trace_desc': 'घरापासून रीसायकलिंग प्लांटपर्यंत संपूर्ण प्रवासाची लाईव्ह तपासणी.',
    'quick.passport_title': 'कलेक्टर डिजिटल आयडी',
    'quick.passport_desc': 'शासकीय मान्यताप्राप्त डिजिटल ओळखपत्र आणि विश्वासार्हता स्कोअर.',

    // AI Scanner Page
    'scanner.title': 'जेमिनी AI रीसायकलेबल मटेरियल स्कॅनर',
    'scanner.subtitle': 'कॅमेऱ्याने फोटो घ्या किंवा अपलोड करा आणि प्रकार, भाव व सुरक्षा नियम जाणून घ्या.',
    'scanner.mode_camera': 'लाईव्ह कॅमेरा वापरा',
    'scanner.mode_upload': 'फोटो अपलोड करा',
    'scanner.snap_btn': 'फोटो काढून तपासा',
    'scanner.upload_prompt': 'फोटो येथे ड्रॅग करा किंवा क्लिक करा',
    'scanner.analyzing': 'AI मटेरियलचे विश्लेषण करत आहे...',
    'scanner.sample_prompts': 'नमुना वस्तू वापरून पहा:',
    'scanner.result_heading': 'AI तपासणी अहवाल',
    'scanner.confidence': 'AI अचूकता',
    'scanner.category': 'मटेरियल वर्ग',
    'scanner.recyclable_status': 'पुनर्वापर स्थिती',
    'scanner.estimated_val': 'अंदाजे बाजारभाव',
    'scanner.safety_title': 'सुरक्षा आणि हाताळणी सूचना',
    'scanner.outside_scope_alert': '⚠️ रीसायकलिंग व्याप्तीबाहेरील कचरा',
    'scanner.outside_scope_msg': 'हे कबाडीवाला कनेक्टच्या रीसायकलिंग व्याप्तीमध्ये येत नाही. कृपया ओला/अन्न कचरा खतनिर्मितीसाठी द्या.',
    'scanner.request_for_this': 'या मटेरियलसाठी पिकअप बुक करा',
    'scanner.fix_copper_notice': 'सत्यापित: 16 विविध प्रकारच्या पुनर्वापरयोग्य वस्तूंची अचूक ओळख.',

    // Live Prices Page
    'prices.title': 'लाईव्ह भंगार व स्क्रॅप दरपत्रक',
    'prices.subtitle': 'कामगारांच्या शोषणाला आळा घालण्यासाठी शासकीय किमान आधारभूत किंमत (MSP).',
    'prices.filter_city': 'शहर / जिल्हा केंद्र निवडा',
    'prices.filter_cat': 'सर्व प्रकार',
    'prices.material_col': 'वस्तूचे नाव',
    'prices.cat_col': 'प्रवर्ग',
    'prices.price_col': 'सध्याचा दर (प्रति किलो)',
    'prices.msp_col': 'शासकीय MSP दर',
    'prices.trend_col': '24 तासांतील बदल',
    'prices.speak_btn': 'आजचे दर आवाजात ऐका',
    'prices.last_sync': 'सुपाबेस रिअल-टाइम द्वारे अपडेटेड',

    // Request Pickup Page
    'request.title': 'घरोघरी पुनर्वापरयोग्य कचरा पिकअप बुक करा',
    'request.subtitle': 'डिजिटल वजनकाट्यासह प्रमाणित कबाडीवाला थेट तुमच्या पत्त्यावर बोलवा.',
    'request.name_lbl': 'नागरिकाचे पूर्ण नाव',
    'request.phone_lbl': 'मोबाईल नंबर',
    'request.address_lbl': 'घराचा पत्ता / लँडमार्क',
    'request.village_lbl': 'वॉर्ड / गाव',
    'request.district_lbl': 'जिल्हा',
    'request.gps_btn': 'माझे GPS लोकेशन शोधा',
    'request.gps_detected': 'GPS लोकेशन प्राप्त झाले',
    'request.cat_lbl': 'मुख्य प्रकार',
    'request.weight_lbl': 'अंदाजे वजन (किलोमध्ये)',
    'request.date_lbl': 'पसंतीची तारीख',
    'request.slot_lbl': 'पसंतीची वेळ',
    'request.notes_lbl': 'विशेष सूचना',
    'request.submit_btn': 'प्रमाणित कबाडीवाला पाठवा',
    'request.success_alert': 'विनंती पाठवली गेली! जवळच्या कबाडीवाल्याला सूचित करण्यात आले आहे.',

    // Track Pickup
    'track.title': 'लाईव्ह पिकअप ट्रॅकिंग',
    'track.subtitle': 'तुमच्या कबाडीवाल्याचे GPS स्थान आणि पिकअप स्थिती लाईव्ह पहा.',
    'track.assigned_collector': 'नियुक्त प्रमाणित कबाडीवाला',
    'track.trust_rating': 'विश्वासार्हता स्कोअर',
    'track.call_collector': 'कलेक्टरला फोन करा',
    'track.status_requested': 'विनंती प्राप्त झाली',
    'track.status_accepted': 'कलेक्टरने स्वीकारले',
    'track.status_in_progress': 'कलेक्टर येत आहेत',
    'track.status_collected': 'वजन करून गोळा केले',
    'track.status_paid': 'पैसे दिले',
    'track.status_recycled': 'रीसायकल झाले',

    // Dashboards
    'dashboard.citizen_title': 'नागरिक ग्रीन डॅशबोर्ड',
    'dashboard.citizen_subtitle': 'तुमचे पर्यावरण योगदान, मिळकत आणि रिवॉर्ड पॉईंट्स पहा.',
    'dashboard.collector_title': 'कलेक्टर ऑपरेशन्स टर्मिनल',
    'dashboard.collector_subtitle': 'नवीन ऑर्डर्स, GPS नेव्हिगेशन, UPI पेमेंट आणि QR पावती बनवा.',
    'dashboard.aggregator_title': 'जिल्हा अॅग्रीगेटर हब (रायचूर / शहरी नोड्स)',
    'dashboard.aggregator_subtitle': 'ग्रामीण साठा एकत्र करून मर्यादा गाठल्यावर रीसायकलर्सना पाठवा.',
    'dashboard.recycler_title': 'अधिकृत रीसायकलर पोर्टल',
    'dashboard.recycler_subtitle': 'QR कोडने माल तपासून EPR रीसायकलिंग प्रमाणपत्र जारी करा.',

    // Collector Specific
    'collector.accept_job': 'विनंती स्वीकारा',
    'collector.reject_job': 'नाकारा',
    'collector.navigate_btn': 'गुगल मॅप्स नेव्हिगेशन उघडा',
    'collector.weigh_title': 'टप्पा 2: प्रत्यक्ष डिजिटल वजन नोंदवा',
    'collector.weigh_input': 'प्रत्यक्ष वजन (किलो)',
    'collector.rate_input': 'लागू दर प्रति किलो (₹)',
    'collector.calc_total': 'एकूण देय रक्कम',
    'collector.pay_citizen': 'त्वरित पेमेंट करा',
    'collector.gen_qr': 'सुरक्षित QR कोड तयार करा',

    // Traceability
    'trace.title': 'कचरा संचरण आणि संपूर्ण ट्रॅसबिलिटी',
    'trace.subtitle': 'घरापासून रीसायकलिंग युनिटपर्यंत 100% पारदर्शक डिजिटल नोंद.',
    'trace.verify_input': 'QR टोकन टाका किंवा स्कॅन करा',
    'trace.btn_verify': 'नोंद तपासा',
    'trace.current_stage': 'सध्याचा टप्पा',
    'trace.carbon_title': 'पर्यावरणावर झालेला सकारात्मक परिणाम',

    // Digital Passport
    'passport.title': 'राष्ट्रीय कचरा कामगार डिजिटल पासपोर्ट',
    'passport.subtitle': 'स्वच्छ भारत मिशन अंतर्गत कचरा वेचकांना अधिकृत शासकीय ओळख.',
    'passport.gov_badge': 'MoHUA गृहनिर्माण व नागरी व्यवहार मंत्रालयाद्वारे सत्यापित',
    'passport.trust_score': 'विश्वासार्हता स्कोअर',
    'passport.total_waste': 'एकूण गोळा केलेला कचरा',
    'passport.co2_saved': 'वाचवलेले CO₂ उत्सर्जन',
    'passport.trees_saved': 'वाचवलेली झाडे',
    'passport.benefits_title': 'सामाजिक सुरक्षा व शासकीय योजना',
    'passport.eshram_link': 'ई-श्रम आणि आयुष्यमान भारत योजनेशी संलग्न',
    'passport.print_btn': 'ओळखपत्र डाऊनलोड / प्रिंट करा',

    // Voice & General
    'voice.speaking': 'व्हॉईस असिस्टंट बोलत आहे...',
    'voice.stop': 'आवाज थांबवा',
    'voice.listen': 'व्हॉईस गाईड',
    'common.kg': 'किलो',
    'common.inr': '₹',
    'common.save': 'जतन करा',
    'common.cancel': 'रद्द करा',
    'common.status': 'स्थिती',
    'common.date': 'तारीख',
    'common.actions': 'कृती',
    'common.loading': 'माहिती लोड होत आहे...',
    'common.no_data': 'कोणतीही नोंद नाही',
    'footer.copyright': '© 2026 कबाडीवाला कनेक्ट. स्मार्ट इंडिया हॅकाथॉन (SIH26229).'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  currentLangInfo: LanguageOption;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('kc_language') as Language;
    return saved && translations[saved] ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('kc_language', lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    const dict = translations[language] || translations.en;
    if (dict[key]) return dict[key];
    if (translations.en[key]) return translations.en[key];
    return fallback || key;
  };

  const currentLangInfo = AVAILABLE_LANGUAGES.find(l => l.code === language) || AVAILABLE_LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currentLangInfo }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
