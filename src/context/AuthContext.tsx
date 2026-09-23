import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getSupabase } from '../lib/supabase';
import { Role, Citizen, Collector, Aggregator, Recycler } from '../types';

export interface AuthUserProfile {
  id: string;
  full_name: string;
  phone?: string;
  email?: string;
  village?: string;
  district?: string;
  role: Role;
  rawProfile?: Citizen | Collector | Aggregator | Recycler | any;
}

export interface SignupData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: 'Citizen' | 'Collector' | 'Aggregator' | 'Recycler' | Role;
  village: string;
  district: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: Role | null;
  userProfile: AuthUserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; role?: Role; redirectPath?: string; error?: string }>;
  signUp: (data: SignupData) => Promise<{ success: boolean; role?: Role; redirectPath?: string; error?: string }>;
  signOut: () => Promise<void>;
  getDashboardPathForRole: (role: Role | string | null | undefined) => string;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const getDashboardPathForRole = (role: Role | string | null | undefined): string => {
  const normalized = (role || '').toLowerCase();
  switch (normalized) {
    case 'collector':
      return '/collector-dashboard';
    case 'aggregator':
      return '/aggregator-dashboard';
    case 'recycler':
      return '/recycler-dashboard';
    case 'citizen':
    default:
      return '/citizen-dashboard';
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<Role | null>(() => {
    return (localStorage.getItem('kc_auth_role') as Role) || null;
  });
  const [userProfile, setUserProfile] = useState<AuthUserProfile | null>(() => {
    const saved = localStorage.getItem('kc_auth_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Helper to query role tables for auth.user.id
  const lookupUserRoleAndProfile = useCallback(async (userId: string, fallbackMeta?: any): Promise<{ role: Role; profile: AuthUserProfile }> => {
    const supabase = getSupabase();

    try {
      // 1. Check citizens table
      const { data: citizenData } = await supabase
        .from('citizens')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (citizenData) {
        const profile: AuthUserProfile = {
          id: citizenData.id,
          full_name: citizenData.full_name || fallbackMeta?.full_name || 'Citizen User',
          phone: citizenData.phone || fallbackMeta?.phone,
          email: citizenData.email || fallbackMeta?.email,
          village: citizenData.village || fallbackMeta?.village,
          district: citizenData.district || fallbackMeta?.district,
          role: 'citizen',
          rawProfile: citizenData
        };
        return { role: 'citizen', profile };
      }

      // 2. Check collectors table
      const { data: collectorData } = await supabase
        .from('collectors')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (collectorData) {
        const profile: AuthUserProfile = {
          id: collectorData.id,
          full_name: collectorData.full_name || fallbackMeta?.full_name || 'Collector User',
          phone: collectorData.phone || fallbackMeta?.phone,
          email: fallbackMeta?.email,
          village: collectorData.village || fallbackMeta?.village,
          district: collectorData.district || fallbackMeta?.district,
          role: 'collector',
          rawProfile: collectorData
        };
        return { role: 'collector', profile };
      }

      // 3. Check aggregators table
      const { data: aggregatorData } = await supabase
        .from('aggregators')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (aggregatorData) {
        const profile: AuthUserProfile = {
          id: aggregatorData.id,
          full_name: aggregatorData.operator_name || aggregatorData.hub_name || fallbackMeta?.full_name || 'Aggregator Hub',
          phone: aggregatorData.phone || fallbackMeta?.phone,
          email: aggregatorData.email || fallbackMeta?.email,
          village: aggregatorData.village || fallbackMeta?.village,
          district: aggregatorData.district || fallbackMeta?.district,
          role: 'aggregator',
          rawProfile: aggregatorData
        };
        return { role: 'aggregator', profile };
      }

      // 4. Check recyclers table
      const { data: recyclerData } = await supabase
        .from('recyclers')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (recyclerData) {
        const profile: AuthUserProfile = {
          id: recyclerData.id,
          full_name: recyclerData.contact_person || recyclerData.facility_name || fallbackMeta?.full_name || 'Recycler Facility',
          phone: recyclerData.phone || fallbackMeta?.phone,
          email: recyclerData.email || fallbackMeta?.email,
          village: fallbackMeta?.village || '',
          district: recyclerData.district || fallbackMeta?.district,
          role: 'recycler',
          rawProfile: recyclerData
        };
        return { role: 'recycler', profile };
      }
    } catch (err) {
      console.warn('Error querying role tables for user:', err);
    }

    // Fallback: check metadata saved during signup or local storage
    const fallbackRole = ((fallbackMeta?.role || localStorage.getItem('kc_auth_role') || 'citizen') as string).toLowerCase() as Role;
    const fallbackProfile: AuthUserProfile = {
      id: userId,
      full_name: fallbackMeta?.full_name || 'Eco Warrior',
      phone: fallbackMeta?.phone || '',
      email: fallbackMeta?.email || '',
      village: fallbackMeta?.village || '',
      district: fallbackMeta?.district || '',
      role: fallbackRole,
      rawProfile: null
    };

    return { role: fallbackRole, profile: fallbackProfile };
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const { role, profile } = await lookupUserRoleAndProfile(user.id, user.user_metadata);
    setUserRole(role);
    setUserProfile(profile);
    localStorage.setItem('kc_auth_role', role);
    localStorage.setItem('kc_auth_profile', JSON.stringify(profile));
  }, [user, lookupUserRoleAndProfile]);

  // Initial Auth Check and Session Subscription
  useEffect(() => {
    let isMounted = true;
    const supabase = getSupabase();

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('Supabase getSession error:', error.message);
        }

        if (isMounted) {
          if (initialSession?.user) {
            setSession(initialSession);
            setUser(initialSession.user);
            const { role, profile } = await lookupUserRoleAndProfile(
              initialSession.user.id,
              initialSession.user.user_metadata
            );
            if (isMounted) {
              setUserRole(role);
              setUserProfile(profile);
              localStorage.setItem('kc_auth_role', role);
              localStorage.setItem('kc_auth_profile', JSON.stringify(profile));
            }
          } else {
            setSession(null);
            setUser(null);
            setUserRole(null);
            setUserProfile(null);
            localStorage.removeItem('kc_auth_role');
            localStorage.removeItem('kc_auth_profile');
          }
        }
      } catch (e) {
        console.error('Failed to initialize Supabase Auth:', e);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for real-time Auth State Changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;

      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        const { role, profile } = await lookupUserRoleAndProfile(
          newSession.user.id,
          newSession.user.user_metadata
        );
        if (isMounted) {
          setUserRole(role);
          setUserProfile(profile);
          localStorage.setItem('kc_auth_role', role);
          localStorage.setItem('kc_auth_profile', JSON.stringify(profile));
        }
      } else {
        setUserRole(null);
        setUserProfile(null);
        localStorage.removeItem('kc_auth_role');
        localStorage.removeItem('kc_auth_profile');
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [lookupUserRoleAndProfile]);

  // Sign Up Workflow
  const signUp = async (data: SignupData): Promise<{ success: boolean; role?: Role; redirectPath?: string; error?: string }> => {
    const supabase = getSupabase();
    const normalizedRole = (data.role.toLowerCase() as Role) || 'citizen';

    try {
      // 1. Create user using Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email.trim(),
        password: data.password,
        options: {
          data: {
            full_name: data.fullName.trim(),
            phone: data.phone.trim(),
            role: normalizedRole,
            village: data.village.trim(),
            district: data.district.trim()
          }
        }
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      const createdUser = authData.user;
      if (!createdUser) {
        return { success: false, error: 'Registration failed: User could not be created.' };
      }

      const userId = createdUser.id;
      const fullName = data.fullName.trim();
      const phone = data.phone.trim();
      const email = data.email.trim();
      const village = data.village.trim();
      const district = data.district.trim();

      // 2 & 3. Insert profile into the correct table with id = auth.user.id (with retry once)
      const insertProfileWithRetry = async (
        tableName: 'citizens' | 'collectors' | 'aggregators' | 'recyclers',
        payload: any
      ) => {
        let { error } = await supabase.from(tableName).insert([payload]);
        if (!error) return { success: true };

        console.warn(`Profile insertion attempt 1 failed for table ${tableName}: ${error.message}. Retrying once...`);

        let retryPayload = { ...payload };
        if (error.code === '23505' || error.message?.toLowerCase().includes('phone')) {
          retryPayload.phone = `${payload.phone}-${Math.floor(100 + Math.random() * 900)}`;
        }

        await new Promise((resolve) => setTimeout(resolve, 500));

        const { error: retryError } = await supabase.from(tableName).insert([retryPayload]);
        if (retryError) {
          console.warn(`Profile insertion attempt 2 failed for table ${tableName}: ${retryError.message}. Continuing...`);
          return { success: false, error: retryError };
        }

        console.log(`Profile insertion retry succeeded for table ${tableName}`);
        return { success: true };
      };

      if (normalizedRole === 'citizen') {
        await insertProfileWithRetry('citizens', {
          id: userId,
          full_name: fullName,
          phone: phone,
          email: email,
          address: `${village}, ${district}`,
          village: village,
          district: district,
          state: 'Karnataka',
          pincode: '560001',
          total_waste_diverted_kg: 0.0,
          green_credits: 50
        });
      } else if (normalizedRole === 'collector') {
        const collectorCode = `KC-COL-${Math.floor(1000 + Math.random() * 9000)}`;
        const qrIdentity = `KC-QR-${fullName.replace(/\s+/g, '').slice(0, 6).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
        await insertProfileWithRetry('collectors', {
          id: userId,
          full_name: fullName,
          phone: phone,
          collector_code: collectorCode,
          qr_identity: qrIdentity,
          village: village,
          district: district,
          state: 'Karnataka',
          pincode: '560001',
          trust_score: 4.90,
          is_verified: true,
          gov_id_type: 'Aadhaar / e-Shram Verified',
          total_collected_kg: 0.0,
          total_earnings: 0.0,
          trees_saved_count: 0.0,
          co2_saved_kg: 0.0,
          active_status: 'active'
        });
      } else if (normalizedRole === 'aggregator') {
        await insertProfileWithRetry('aggregators', {
          id: userId,
          hub_name: `${fullName} Aggregation Center`,
          operator_name: fullName,
          phone: phone,
          email: email,
          address: `${village}, ${district}`,
          village: village,
          district: district,
          state: 'Karnataka',
          storage_capacity_kg: 50000.0,
          current_stock_kg: 0.0,
          dispatch_threshold_kg: 2000.0
        });
      } else if (normalizedRole === 'recycler') {
        const regNo = `KSPCB/EPR/${new Date().getFullYear()}/REC-${Math.floor(100 + Math.random() * 900)}`;
        await insertProfileWithRetry('recyclers', {
          id: userId,
          facility_name: `${fullName} Recycling & Smelting`,
          registration_no: regNo,
          contact_person: fullName,
          phone: phone,
          email: email,
          address: `${village}, ${district}`,
          district: district,
          state: 'Karnataka',
          authorized_materials: ['Copper', 'Aluminium', 'PET Plastic', 'E-Waste', 'Batteries'],
          epr_credit_balance: 10000.0,
          is_authorized: true
        });
      }

      // Update local context
      const profile: AuthUserProfile = {
        id: userId,
        full_name: fullName,
        phone,
        email,
        village,
        district,
        role: normalizedRole
      };

      setUser(createdUser);
      setUserRole(normalizedRole);
      setUserProfile(profile);
      localStorage.setItem('kc_auth_role', normalizedRole);
      localStorage.setItem('kc_auth_profile', JSON.stringify(profile));

      const redirectPath = getDashboardPathForRole(normalizedRole);
      return { success: true, role: normalizedRole, redirectPath };
    } catch (err: any) {
      console.error('Signup exception:', err);
      return { success: false, error: err?.message || 'An unexpected error occurred during signup.' };
    }
  };

  // Sign In Workflow
  const signIn = async (email: string, password: string): Promise<{ success: boolean; role?: Role; redirectPath?: string; error?: string }> => {
    const supabase = getSupabase();

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      const signedInUser = authData.user;
      if (!signedInUser) {
        return { success: false, error: 'Login failed: User record not found.' };
      }

      setSession(authData.session);
      setUser(signedInUser);

      // Check which table contains auth.user.id
      const { role, profile } = await lookupUserRoleAndProfile(
        signedInUser.id,
        signedInUser.user_metadata
      );

      setUserRole(role);
      setUserProfile(profile);
      localStorage.setItem('kc_auth_role', role);
      localStorage.setItem('kc_auth_profile', JSON.stringify(profile));

      const redirectPath = getDashboardPathForRole(role);
      return { success: true, role, redirectPath };
    } catch (err: any) {
      console.error('Login exception:', err);
      return { success: false, error: err?.message || 'An unexpected error occurred during login.' };
    }
  };

  // Sign Out Workflow
  const signOut = async () => {
    const supabase = getSupabase();
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Sign out warning:', e);
    } finally {
      setUser(null);
      setSession(null);
      setUserRole(null);
      setUserProfile(null);
      localStorage.removeItem('kc_auth_role');
      localStorage.removeItem('kc_auth_profile');
      localStorage.removeItem('supabase.auth.token');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userRole,
        userProfile,
        loading,
        signIn,
        signUp,
        signOut,
        getDashboardPathForRole,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
