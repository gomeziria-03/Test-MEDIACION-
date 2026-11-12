import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Smartphone } from 'lucide-react';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRModal: React.FC<QRModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://mediacion-escolar.app';

  // Generate QR code URL using standard reliable Google Chart API or QR service
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    currentUrl
  )}&margin=10`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl border border-slate-200 text-center relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="inline-flex p-3 rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
          <Smartphone className="w-6 h-6" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-outfit mb-1">
          Código QR para Alumnos
        </h2>
        <p className="text-xs text-slate-500 mb-6 max-w-xs mx-auto">
          Escanea con la cámara del móvil o proyecta este código en la pizarra digital durante la Semana de la Salud.
        </p>

        {/* QR Code Container */}
        <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-indigo-200 inline-block mb-6 shadow-inner">
          <img
            src={qrImageUrl}
            alt="Código QR del test de resolución de conflictos"
            className="w-56 h-56 mx-auto rounded-lg"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* URL box with copy button */}
        <div className="bg-slate-50 rounded-xl p-2.5 flex items-center justify-between gap-2 border border-slate-200 mb-4 text-left">
          <span className="text-xs text-slate-600 truncate font-mono select-all">
            {currentUrl}
          </span>
          <button
            type="button"
            onClick={handleCopyLink}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1 cursor-pointer transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-200" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado' : 'Copiar'}</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-400">
          Diseñado para funcionar al instante en cualquier teléfono iOS o Android sin descargas.
        </p>
      </div>
    </div>
  );
};
