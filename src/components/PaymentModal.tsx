import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { PaymentMode } from '../types';
import { triggerRazorpayCheckout, generateUPIString } from '../lib/payments';
import { X, CheckCircle2, QrCode, CreditCard, Banknote, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (mode: PaymentMode, txnId: string) => void;
  amount: number;
  citizenName: string;
  collectorName: string;
  weightKg: number;
  materialName: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  amount,
  citizenName,
  collectorName,
  weightKg,
  materialName
}) => {
  const [selectedMode, setSelectedMode] = useState<PaymentMode>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [txnDetails, setTxnDetails] = useState<{ id: string; mode: PaymentMode } | null>(null);

  if (!isOpen) return null;

  const upiString = generateUPIString(
    'citizen.recycler@upi',
    citizenName,
    amount,
    `Kabadiwala payout for ${weightKg}kg ${materialName}`
  );

  const handleExecutePayment = async () => {
    setIsProcessing(true);
    if (selectedMode === 'Razorpay') {
      const result = await triggerRazorpayCheckout(amount, citizenName, collectorName);
      setIsProcessing(false);
      if (result.success) {
        setIsCompleted(true);
        setTxnDetails({ id: result.transactionId, mode: 'Razorpay' });
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        setTimeout(() => {
          onPaymentSuccess('Razorpay', result.transactionId);
        }, 1800);
      }
    } else {
      // UPI / Cash instant settlement
      setTimeout(() => {
        const txnId = selectedMode === 'UPI' 
          ? `UPI-REF-${Math.floor(100000000000 + Math.random() * 900000000000)}` 
          : `CASH-REC-${Date.now().toString().slice(-6)}`;
        setIsProcessing(false);
        setIsCompleted(true);
        setTxnDetails({ id: txnId, mode: selectedMode });
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        setTimeout(() => {
          onPaymentSuccess(selectedMode, txnId);
        }, 1800);
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#121F1A] border border-emerald-700/60 shadow-2xl p-6 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-emerald-950/80 text-slate-400 hover:text-white hover:bg-emerald-900/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isCompleted ? (
          <div>
            <div className="text-center mb-6">
              <span className="badge-verified mb-2">Escrow-Backed Realtime Settlement</span>
              <h3 className="text-2xl font-bold text-slate-100">Pay Citizen Payout</h3>
              <p className="text-xs text-slate-400 mt-1">
                Settling payout for {weightKg} kg of {materialName}
              </p>
              <div className="mt-4 p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/60">
                <span className="text-xs text-emerald-400 block font-medium">Total Payable Amount</span>
                <span className="text-3xl font-extrabold text-emerald-300">
                  ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setSelectedMode('UPI')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  selectedMode === 'UPI'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-glow-green'
                    : 'bg-emerald-950/40 border-emerald-900/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <QrCode className="w-5 h-5" />
                <span className="text-xs font-bold">UPI QR</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMode('Razorpay')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  selectedMode === 'Razorpay'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-glow-green'
                    : 'bg-emerald-950/40 border-emerald-900/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs font-bold">Razorpay</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMode('Cash')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  selectedMode === 'Cash'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-glow-green'
                    : 'bg-emerald-950/40 border-emerald-900/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Banknote className="w-5 h-5" />
                <span className="text-xs font-bold">Cash Receipt</span>
              </button>
            </div>

            {/* UPI Dynamic QR Display */}
            {selectedMode === 'UPI' && (
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/95 text-slate-900 mb-6">
                <p className="text-[11px] font-bold text-emerald-800 mb-2 uppercase tracking-wide">
                  Scan with GPay / PhonePe / Paytm / BHIM
                </p>
                <QRCodeSVG value={upiString} size={150} level="M" />
                <span className="text-[10px] text-slate-500 font-mono mt-2 truncate max-w-xs">
                  Payee: {citizenName} ({amount} INR)
                </span>
              </div>
            )}

            {/* Razorpay Gateway Info */}
            {selectedMode === 'Razorpay' && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-900/50 mb-6 text-xs text-slate-300 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Razorpay Safe Escrow Gateway</span>
                </div>
                <p>
                  Direct bank transfer via IMPS/NEFT with verified webhook settlement and GST invoice receipt.
                </p>
              </div>
            )}

            {/* Cash Mode Info */}
            {selectedMode === 'Cash' && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-900/50 mb-6 text-xs text-slate-300 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-semibold">
                  <Banknote className="w-4 h-4" />
                  <span>Physical Cash Settlement Handover</span>
                </div>
                <p>
                  Collector hands over exact physical cash of ₹{amount}. A digital receipt with QR traceability token will be issued.
                </p>
              </div>
            )}

            {/* Action Trigger */}
            <button
              onClick={handleExecutePayment}
              disabled={isProcessing}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-glow-green transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Transaction with Bank...</span>
                </>
              ) : (
                <>
                  <span>Confirm Settlement (₹{amount})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        ) : (
          /* Payment Success State */
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-100">Payment Completed!</h3>
            <p className="text-xs text-slate-400 mt-1">
              ₹{amount.toLocaleString('en-IN')} successfully settled to {citizenName}
            </p>
            <div className="mt-4 p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-xs font-mono text-emerald-300">
              Txn ID: {txnDetails?.id} ({txnDetails?.mode})
            </div>
            <p className="text-[11px] text-slate-400 mt-3">
              Generating Chain-of-Custody Traceability QR Code...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
