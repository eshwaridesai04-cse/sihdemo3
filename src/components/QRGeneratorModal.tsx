import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, ShieldCheck, CheckCircle2, Share2 } from 'lucide-react';

interface QRGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrValue: string;
  title: string;
  subtitle?: string;
  details?: { label: string; value: string }[];
}

export const QRGeneratorModal: React.FC<QRGeneratorModalProps> = ({
  isOpen,
  onClose,
  qrValue,
  title,
  subtitle,
  details = []
}) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    const svg = document.getElementById('generated-qr-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `${qrValue}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl bg-[#121F1A] border border-emerald-700/60 shadow-2xl p-6 text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-emerald-950/80 text-slate-400 hover:text-white hover:bg-emerald-900/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Verifiable Circular Chain Token</span>
          </div>
          <h3 className="text-xl font-bold text-slate-100">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-white/95 text-slate-900 shadow-inner mb-6">
          <QRCodeSVG
            id="generated-qr-svg"
            value={qrValue}
            size={200}
            level="H"
            includeMargin={true}
            imageSettings={{
              src: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23059669'><path d='M12 2L2 7l10 5 10-5-10-5z'/></svg>",
              x: undefined,
              y: undefined,
              height: 28,
              width: 28,
              excavate: true,
            }}
          />
          <span className="font-mono text-xs font-bold tracking-wider text-slate-800 mt-2 bg-slate-100 px-3 py-1 rounded-md border border-slate-300">
            {qrValue}
          </span>
        </div>

        {/* Key-Value Details */}
        {details.length > 0 && (
          <div className="space-y-2 mb-6 bg-emerald-950/40 rounded-xl p-3 border border-emerald-900/50 text-xs">
            {details.map((d, i) => (
              <div key={i} className="flex items-center justify-between py-1 border-b border-emerald-900/30 last:border-0">
                <span className="text-slate-400">{d.label}</span>
                <span className="font-semibold text-emerald-300">{d.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDownload}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download QR</span>
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title, text: `Track Recyclable QR: ${qrValue}`, url: window.location.href });
              } else {
                navigator.clipboard.writeText(qrValue);
                alert('QR Token copied to clipboard!');
              }
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-950 hover:bg-emerald-900/60 border border-emerald-800 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Token</span>
          </button>
        </div>
      </div>
    </div>
  );
};
