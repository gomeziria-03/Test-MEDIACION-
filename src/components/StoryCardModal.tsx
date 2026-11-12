import React, { useState } from 'react';
import { TestResult } from '../types';
import { CharacterAvatar } from './CharacterAvatar';
import { X, Copy, Check, Instagram, Sparkles, Shield } from 'lucide-react';

interface StoryCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: TestResult;
}

export const StoryCardModal: React.FC<StoryCardModalProps> = ({
  isOpen,
  onClose,
  result
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const { predominantStyle, percentages, topCharacters } = result;

  const vibeHeadline = {
    asertivo: 'Modo Zen: Hablo las cosas sin montar un pollo 🧘✨',
    pasivo: 'Trago más que una aspiradora: Aprendiendo a decir "NO" 🐸☕',
    agresivo: 'Mecha corta: Te miro mal y ya hay juicio sumarísimo 🧨💥'
  }[predominantStyle];

  const styleBadge = {
    asertivo: { label: 'Asertivo', emoji: '🟢', bg: 'bg-emerald-500' },
    pasivo: { label: 'Pasivo', emoji: '🟡', bg: 'bg-amber-500' },
    agresivo: { label: 'Agresivo', emoji: '🔴', bg: 'bg-rose-500' }
  }[predominantStyle];

  const handleCopyStoryText = async () => {
    const text = `🔥 Mi resultado en el Test de Mediación Escolar:\n${styleBadge.emoji} Soy ${percentages[predominantStyle]}% ${styleBadge.label.toUpperCase()} (${vibeHeadline})\n\n👥 Mis personajes más parecidos:\n🥇 ${topCharacters[0]?.character.name} (${topCharacters[0]?.compatibility}%)\n🥈 ${topCharacters[1]?.character.name} (${topCharacters[1]?.compatibility}%)\n🥉 ${topCharacters[2]?.character.name} (${topCharacters[2]?.compatibility}%)\n\n¿Y tú cómo resuelves los conflictos? #SemanaDeLaSalud #TestDeMediacion`;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-sm sm:max-w-md overflow-hidden shadow-2xl border-2 border-slate-900/10 flex flex-col max-h-[95vh]">
        {/* Modal Top Bar */}
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 font-outfit uppercase">
            <Instagram className="w-4 h-4 text-pink-500" />
            <span>Formato Story (Instagram / TikTok)</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Story Preview Frame */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 bg-slate-100 flex justify-center">
          {/* Simulated 9:16 Mobile Story Card */}
          <div className="w-full max-w-[320px] bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-5 shadow-2xl border-4 border-indigo-500/30 relative flex flex-col justify-between overflow-hidden">
            {/* Background art glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

            {/* Top kicker */}
            <div className="relative z-10 text-center mb-3">
              <span className="text-[10px] font-extrabold tracking-widest text-indigo-300 uppercase block mb-1">
                Semana de la Salud · Mediación
              </span>
              <h2 className="text-base font-extrabold text-white font-outfit leading-tight">
                ¿Cómo resuelvo los conflictos? 🥑
              </h2>
            </div>

            {/* Predominant Style Badge & Vibe */}
            <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-center mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-extrabold text-white mb-1.5">
                <span>{styleBadge.emoji}</span>
                <span className="uppercase">{styleBadge.label}</span>
                <span className="font-mono tabular-nums">· {percentages[predominantStyle]}%</span>
              </div>
              <p className="text-[11px] font-semibold text-indigo-100 leading-snug">
                "{vibeHeadline}"
              </p>
            </div>

            {/* Top 3 Characters with Real Photos */}
            <div className="relative z-10 mb-4">
              <span className="text-[10px] font-extrabold text-indigo-300 uppercase tracking-wider block text-center mb-2">
                Mis gemelos de personalidad
              </span>
              <div className="space-y-2">
                {topCharacters.map((match, i) => (
                  <div
                    key={match.character.id}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/15 flex items-center justify-between gap-2.5"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <CharacterAvatar character={match.character} size="sm" />
                      <div className="min-w-0 text-left">
                        <div className="text-xs font-bold text-white font-outfit truncate">
                          {match.character.name}
                        </div>
                        <div className="text-[10px] text-indigo-200 truncate">
                          {match.character.trait}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-extrabold text-emerald-400 font-mono tabular-nums">
                        {match.compatibility}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom mini footer */}
            <div className="relative z-10 text-center pt-2 border-t border-white/15 text-[10px] text-indigo-300 font-medium">
              <span>Haz el test escaneando el QR del instituto 🚀</span>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleCopyStoryText}
            className="w-full py-3 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer font-outfit"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '¡Copiado para pegar en Instagram/TikTok!' : 'Copiar texto para Story / WhatsApp'}</span>
          </button>
          <span className="text-[10px] text-center text-slate-400">
            Haz una captura de pantalla a la tarjeta para subirla directamente a tus Stories 📸
          </span>
        </div>
      </div>
    </div>
  );
};
