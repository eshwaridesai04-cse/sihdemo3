import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, getDashboardPathForRole } from '../context/AuthContext';
import { Role } from '../types';
import { Recycle, ShieldCheck, Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-glow-green">
            <Recycle className="w-8 h-8 text-emerald-400 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <div className="absolute -inset-2 bg-emerald-500/20 rounded-3xl blur-xl animate-pulse pointer-events-none" />
        </div>
        <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold tracking-wide">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
          <span>Verifying Secure Supabase Session...</span>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Connecting to National Circular Recycling Network
        </p>
      </div>
    );
  }

  // If unauthenticated, redirect to /login preserving current route in state
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles required and user's role is known but not permitted
  if (allowedRoles && allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
    const targetPath = getDashboardPathForRole(userRole);
    return <Navigate to={targetPath} replace />;
  }

  return children ? <>{children}</> : null;
};
