import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const NotificationToast: React.FC = () => {
  const { notification, setNotification } = useApp();

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-20 right-4 z-50 max-w-md w-full p-4 rounded-xl bg-[#121F1A]/95 border border-emerald-500/50 shadow-2xl backdrop-blur-xl text-slate-100 flex items-start gap-3"
        >
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
            <Bell className="w-4 h-4 animate-bounce" />
          </div>
          <div className="flex-1 pr-2">
            <p className="text-xs font-bold text-emerald-400">Live Network Update</p>
            <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">{notification}</p>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
