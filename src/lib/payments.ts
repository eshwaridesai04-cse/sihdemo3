import { PaymentMode } from '../types';

export interface PaymentInitiation {
  amount: number;
  payeeName: string;
  payeeUPI: string;
  notes: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  mode: PaymentMode;
  amount: number;
  timestamp: string;
}

/**
 * Generate UPI URI for standard Indian UPI QR codes (Google Pay, PhonePe, Paytm, BHIM)
 */
export const generateUPIString = (payeeVpa: string, payeeName: string, amount: number, note: string): string => {
  const cleanVpa = encodeURIComponent(payeeVpa || 'kabadiwala.collector@okhdfcbank');
  const cleanName = encodeURIComponent(payeeName || 'Kabadiwala Connect');
  const cleanNote = encodeURIComponent(note || 'Recyclable scrap doorstep settlement');
  return `upi://pay?pa=${cleanVpa}&pn=${cleanName}&am=${amount.toFixed(2)}&cu=INR&tn=${cleanNote}`;
};

/**
 * Razorpay Simulation or Live Checkout trigger
 */
export const triggerRazorpayCheckout = async (
  amount: number,
  citizenName: string,
  collectorName: string
): Promise<PaymentResult> => {
  return new Promise((resolve) => {
    // Check if live Razorpay script is in window
    const razorpayKey = localStorage.getItem('kc_razorpay_key') || import.meta.env.VITE_RAZORPAY_KEY;

    if (typeof window !== 'undefined' && (window as any).Razorpay && razorpayKey) {
      const options = {
        key: razorpayKey,
        amount: Math.round(amount * 100),
        currency: 'INR',
        name: 'Kabadiwala Connect',
        description: `Doorstep scrap payout to ${citizenName}`,
        image: 'https://cdn-icons-png.flaticon.com/512/3299/3299955.png',
        handler: function (response: any) {
          resolve({
            success: true,
            transactionId: response.razorpay_payment_id || `TXN-RZP-${Date.now().toString().slice(-6)}`,
            mode: 'Razorpay',
            amount,
            timestamp: new Date().toISOString()
          });
        },
        prefill: {
          name: citizenName,
          email: 'citizen@kabadiwalaconnect.in',
          contact: '9845012345'
        },
        theme: {
          color: '#10B981'
        }
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } else {
      // High-fidelity instant simulation for hackathon presentation
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `TXN-UPI-${Math.floor(100000000000 + Math.random() * 900000000000)}`,
          mode: 'UPI',
          amount,
          timestamp: new Date().toISOString()
        });
      }, 1000);
    }
  });
};
