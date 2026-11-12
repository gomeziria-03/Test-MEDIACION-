import React, { useEffect } from 'react';
import { LABEL_PAIRS } from '../data/questions';
import { Question } from '../types';
import { ChevronLeft, ChevronRight, Check, Sparkles } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
  value: number; // 0 to 100
  onChange: (val: number) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  total,
  value,
  onChange,
  onNext,
  onPrev,
  isFirst,
  isLast
}) => {
  const labelPair = LABEL_PAIRS[question.labelType];

  // 5 discrete steps matching standard IDRlabs assessment scales
  const tickPoints = [
    { percent: 0, label: '0%', text: 'Nada' },
    { percent: 25, label: '25%', text: 'Poco' },
    { percent: 50, label: '50%', text: 'Medio' },
    { percent: 75, label: '75%', text: 'Bastante' },
    { percent: 100, label: '100%', text: 'Total' }
  ];

  // Dynamic humor reaction for Gen Z / young adults (15-25 years old)
  const getHumorReaction = (v: number) => {
    if (v <= 10) return { emoji: '💀', text: 'Literalmente nunca jamás', vibe: 'Cero identificado/a' };
    if (v <= 30) return { emoji: '🧊', text: 'Casi nunca, no es mi rollo', vibe: 'Raro que me pase' };
    if (v <= 45) return { emoji: '🤨', text: 'A veces, pero poco', vibe: 'Solo en días raros' };
    if (v <= 55) return { emoji: '⚖️', text: '50/50, depende de si he comido o dormido', vibe: 'Equilibrio o puro azar' };
    if (v <= 70) return { emoji: '🫣', text: 'Bastante a menudo, no voy a mentir', vibe: 'Con frecuencia' };
    if (v <= 89) return { emoji: '📈', text: 'Muy yo, me pasa casi siempre', vibe: 'Definitivamente sí' };
    return { emoji: '🎯', text: '100% culpable, soy literalmente ese/a', vibe: 'Me describe en el DNI' };
  };

  const reaction = getHumorReaction(value);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        onChange(Math.max(0, value - 25));
      } else if (e.key === 'ArrowRight') {
        onChange(Math.min(100, value + 25));
      } else if (e.key === 'Enter') {
        onNext();
      } else if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const stepMap: Record<string, number> = {
          '1': 0,
          '2': 25,
          '3': 50,
          '4': 75,
          '5': 100
        };
        onChange(stepMap[e.key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [value, onChange, onNext]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
      {/* Top indicator: progress & meme energy tracker */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-3 font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
          <span className="font-bold text-indigo-600 font-outfit uppercase tracking-wider">
            Situación {index + 1} de {total}
          </span>
        </div>
        <span className="tabular-nums font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
          {Math.round(((index + 1) / total) * 100)}%
        </span>
      </div>

      {/* Modern gradient progress line */}
      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-6 p-0.5 shadow-inner">
        <div
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-300 shadow-sm"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      {/* Main question card with neo-modern aesthetic */}
      <div className="bg-white rounded-3xl p-6 sm:p-9 border-2 border-slate-900/10 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06),0_8px_10px_-6px_rgba(0,0,0,0.04)] relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />

        {/* Statement text: styled in quotes with punchy typography */}
        <div className="min-h-[110px] flex items-center justify-center text-center mb-6 px-2">
          <p className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug font-outfit max-w-xl">
            "{question.text}"
          </p>
        </div>

        {/* Live dynamic humor reaction badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl shadow-sm transition-all duration-150 transform hover:scale-105">
            <span className="text-xl select-none">{reaction.emoji}</span>
            <div className="text-left">
              <span className="text-xs sm:text-sm font-extrabold text-indigo-900 block leading-tight font-outfit">
                {reaction.text}
              </span>
              <span className="text-[10px] text-indigo-600 font-medium">
                {reaction.vibe} · {value}%
              </span>
            </div>
          </div>
        </div>

        {/* IDRlabs Slider Section */}
        <div className="bg-slate-50/90 rounded-2xl p-5 sm:p-6 border border-slate-200 mb-8">
          {/* Label anchors */}
          <div className="flex items-center justify-between gap-4 mb-3 text-xs sm:text-sm font-extrabold font-outfit">
            <span className="text-slate-600 max-w-[45%] text-left">
              ← {labelPair.left}
            </span>
            <span className="text-indigo-600 max-w-[45%] text-right">
              {labelPair.right} →
            </span>
          </div>

          {/* Slider input */}
          <div className="relative py-4 px-1">
            {/* Custom styled track */}
            <div className="relative w-full h-4 bg-slate-200 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-slate-400 via-indigo-500 to-pink-500 rounded-full transition-all duration-150"
                style={{ width: `${value}%` }}
              />
            </div>

            {/* Native slider overlaid */}
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              aria-label={`Respuesta para afirmación ${index + 1}`}
            />

            {/* Thumb indicator representation */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white border-3 border-indigo-600 rounded-full shadow-lg pointer-events-none transition-all duration-75 flex items-center justify-center z-10 hover:scale-110"
              style={{ left: `${value}%` }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-indigo-600 to-pink-500" />
            </div>

            {/* 5 Tick marks / fast clickable anchor buttons */}
            <div className="flex justify-between items-center mt-4 pt-1">
              {tickPoints.map((tp) => {
                const isActive = Math.abs(value - tp.percent) <= 12;
                return (
                  <button
                    key={tp.percent}
                    type="button"
                    onClick={() => onChange(tp.percent)}
                    className={`flex flex-col items-center transition-all cursor-pointer px-2 py-1 rounded-xl ${
                      isActive
                        ? 'bg-indigo-600 text-white font-extrabold shadow-sm scale-110'
                        : 'text-slate-400 hover:text-slate-800 hover:bg-slate-200/60'
                    }`}
                  >
                    <span className="text-[11px] font-mono leading-none">{tp.label}</span>
                    <span className="text-[9px] font-semibold opacity-90 hidden sm:block mt-0.5">{tp.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Helper caption */}
          <div className="text-center mt-3">
            <span className="text-[11px] text-slate-400 font-medium">
              💡 Desliza la barra o pulsa los botones de porcentaje (también teclas 1 a 5)
            </span>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onPrev}
            disabled={isFirst}
            className={`py-3 px-5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isFirst
                ? 'opacity-30 cursor-not-allowed text-slate-400 bg-slate-100'
                : 'text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            className="py-3 px-7 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-300/40 hover:shadow-lg active:scale-95 transition-all flex items-center gap-2 cursor-pointer font-outfit"
          >
            <span>{isLast ? 'Ver Mis Resultados 🏆' : 'Siguiente'}</span>
            {isLast ? <Check className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
