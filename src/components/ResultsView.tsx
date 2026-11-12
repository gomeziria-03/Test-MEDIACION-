import React, { useEffect, useState } from 'react';
import { TestResult } from '../types';
import { CharacterAvatar } from './CharacterAvatar';
import confetti from 'canvas-confetti';
import {
  Share2,
  RotateCcw,
  QrCode,
  Users,
  Check,
  TrendingUp,
  BrainCircuit,
  ShieldCheck,
  Heart,
  Sliders,
  Sparkles,
  Instagram,
  Flame,
  MessageSquareQuote
} from 'lucide-react';

interface ResultsViewProps {
  result: TestResult;
  onReset: () => void;
  onOpenDirectory: () => void;
  onOpenQR: () => void;
  onOpenStoryModal: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  onReset,
  onOpenDirectory,
  onOpenQR,
  onOpenStoryModal
}) => {
  const [copied, setCopied] = useState(false);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }
  }, []);

  const { predominantStyle, percentages, topCharacters, userStats, explanation } = result;

  // Style metadata
  const styleConfig = {
    asertivo: {
      name: 'Comunicación Asertiva',
      iconEmoji: '🟢',
      color: 'emerald',
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      fillColor: '#10B981',
      summary: 'Expresas tus opiniones y sentimientos con firmeza, serenidad y respeto hacia los demás.',
      vibeHumor: 'Típico/a que sabe decir "no" con una sonrisa zen sin mandar a nadie al hospital. Tu energía es de adulto funcional que no se mete en peleas tontas en WhatsApp.'
    },
    pasivo: {
      name: 'Comunicación Pasiva',
      iconEmoji: '🟡',
      color: 'amber',
      textColor: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      fillColor: '#F59E0B',
      summary: 'Sueles callar o ceder para evitar conflictos o discusiones, a veces descuidando tus necesidades.',
      vibeHumor: 'Pides perdón hasta cuando alguien te pisa a ti en el metro. Si te traen un durum vegetal con falafel en vez de carne, te lo comes llorando por dentro con tal de no reclamar.'
    },
    agresivo: {
      name: 'Comunicación Agresiva',
      iconEmoji: '🔴',
      color: 'rose',
      textColor: 'text-rose-700',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      fillColor: '#F43F5E',
      summary: 'Defiendes tu postura con vehemencia, buscando ganar o imponer tu criterio sobre el resto.',
      vibeHumor: 'Llevas un petardo encendido en el bolsillo. Si te dejan en visto en medio de un debate o tardan 15 minutos en llegar, se desata el apocalipsis nuclear. Cero filtros.'
    }
  }[predominantStyle];

  // Copy shareable summary
  const handleCopyShare = async () => {
    const medals = ['🥇', '🥈', '🥉'];
    const charSummary = topCharacters
      .map((c, i) => `${medals[i]} ${c.character.name} — ${c.compatibility}%`)
      .join('\n');

    const shareText = `🎯 Mi estilo de comunicación en el Test de Mediación Escolar:\n🟢 Asertivo: ${percentages.asertivo}%\n🟡 Pasivo: ${percentages.pasivo}%\n🔴 Agresivo: ${percentages.agresivo}%\n\n👥 Mis personajes más afines:\n${charSummary}\n\n¡Haz el test de la Semana de la Salud y descubre tu estilo de resolución de conflictos!`;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } catch {
      // fallback
    }
  };

  // Circular / Doughnut SVG calculation
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 18;

  const asertivoStroke = (percentages.asertivo / 100) * circumference;
  const pasivoStroke = (percentages.pasivo / 100) * circumference;
  const agresivoStroke = (percentages.agresivo / 100) * circumference;

  const asertivoOffset = 0;
  const pasivoOffset = -asertivoStroke;
  const agresivoOffset = -(asertivoStroke + pasivoStroke);

  const medalEmojis = ['🥇', '🥈', '🥉'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* 1. Header: Predominant Style & Gen Z Humor Badge */}
      <div className="text-center mb-8">
        <span className="text-xs font-black text-indigo-600 uppercase tracking-widest block mb-2 font-outfit">
          Diagnóstico de la Semana de la Salud
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-outfit tracking-tight flex items-center justify-center gap-3">
          <span>{styleConfig.iconEmoji}</span>
          <span>{styleConfig.name}</span>
        </h1>
        <p className="mt-3 text-base text-slate-600 max-w-xl mx-auto font-medium">
          {styleConfig.summary}
        </p>

        {/* Humorous Vibe Callout (15-25 appeal) */}
        <div className="mt-5 max-w-xl mx-auto bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-4 rounded-2xl border-2 border-indigo-200/80 shadow-sm flex items-start gap-3 text-left">
          <span className="text-2xl select-none shrink-0 mt-0.5">🔥</span>
          <div>
            <div className="text-xs font-black uppercase text-indigo-950 font-outfit tracking-wide flex items-center gap-1.5 mb-1">
              <span>Diagnóstico sin filtros</span>
              <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-sans font-bold">100% Real</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-snug font-medium">
              "{styleConfig.vibeHumor}"
            </p>
          </div>
        </div>
      </div>

      {/* 2. IDRlabs-style Percentage Breakdown & Visual Donut Chart */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-900/10 shadow-md mb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left: IDRlabs Percentage Bars */}
          <div className="md:col-span-7 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 font-outfit">
              Desglose de estilos de comunicación (IDRlabs)
            </h2>

            {/* Asertivo bar */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors">
              <div className="flex justify-between items-center text-sm font-bold mb-1.5">
                <span className="flex items-center gap-2 text-slate-900 font-outfit">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-sm" />
                  Asertivo
                </span>
                <span className="text-emerald-700 font-mono font-bold tabular-nums text-base">
                  {percentages.asertivo}%
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${percentages.asertivo}%` }}
                />
              </div>
            </div>

            {/* Pasivo bar */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 hover:border-amber-200 transition-colors">
              <div className="flex justify-between items-center text-sm font-bold mb-1.5">
                <span className="flex items-center gap-2 text-slate-900 font-outfit">
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-sm" />
                  Pasivo
                </span>
                <span className="text-amber-700 font-mono font-bold tabular-nums text-base">
                  {percentages.pasivo}%
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${percentages.pasivo}%` }}
                />
              </div>
            </div>

            {/* Agresivo bar */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 hover:border-rose-200 transition-colors">
              <div className="flex justify-between items-center text-sm font-bold mb-1.5">
                <span className="flex items-center gap-2 text-slate-900 font-outfit">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block shadow-sm" />
                  Agresivo
                </span>
                <span className="text-rose-700 font-mono font-bold tabular-nums text-base">
                  {percentages.agresivo}%
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${percentages.agresivo}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right: SVG Donut Chart */}
          <div className="md:col-span-5 flex flex-col items-center justify-center pt-2">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                {/* Background ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#E2E8F0"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                {/* Asertivo segment (Emerald) */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#10B981"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={`${asertivoStroke} ${circumference}`}
                  strokeDashoffset={asertivoOffset}
                  strokeLinecap="round"
                />
                {/* Pasivo segment (Amber) */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#F59E0B"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={`${pasivoStroke} ${circumference}`}
                  strokeDashoffset={pasivoOffset}
                  strokeLinecap="round"
                />
                {/* Agresivo segment (Rose) */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#F43F5E"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={`${agresivoStroke} ${circumference}`}
                  strokeDashoffset={agresivoOffset}
                  strokeLinecap="round"
                />
              </svg>

              {/* Center legend */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-slate-900 font-outfit tabular-nums">
                  {percentages[predominantStyle]}%
                </span>
                <span className="text-[11px] font-bold text-slate-500 capitalize">
                  {predominantStyle}
                </span>
              </div>
            </div>

            <span className="text-[11px] text-slate-400 mt-2 font-medium">
              Rueda de estilo de comunicación
            </span>
          </div>
        </div>
      </div>

      {/* 3. Subrasgos Ocultos (Empatía, Seguridad, Autocontrol, Liderazgo) */}
      <div className="bg-slate-50 rounded-3xl p-6 sm:p-7 border border-slate-200 mb-10">
        <div className="flex items-center gap-2 mb-4">
          <BrainCircuit className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900 font-outfit">
            Rasgos de Personalidad en Conflicto
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="text-[11px] font-medium text-slate-500 mb-1">Empatía</div>
            <div className="text-xl font-extrabold text-slate-900 font-outfit tabular-nums mb-1">
              {userStats.empatia}%
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full"
                style={{ width: `${userStats.empatia}%` }}
              />
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="text-[11px] font-medium text-slate-500 mb-1">Seguridad personal</div>
            <div className="text-xl font-extrabold text-slate-900 font-outfit tabular-nums mb-1">
              {userStats.seguridad}%
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full"
                style={{ width: `${userStats.seguridad}%` }}
              />
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="text-[11px] font-medium text-slate-500 mb-1">Autocontrol</div>
            <div className="text-xl font-extrabold text-slate-900 font-outfit tabular-nums mb-1">
              {userStats.autocontrol}%
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{ width: `${userStats.autocontrol}%` }}
              />
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="text-[11px] font-medium text-slate-500 mb-1">Liderazgo / Iniciativa</div>
            <div className="text-xl font-extrabold text-slate-900 font-outfit tabular-nums mb-1">
              {userStats.liderazgo}%
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-violet-500 h-full rounded-full"
                style={{ width: `${userStats.liderazgo}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Tus personajes más parecidos (Top 3) */}
      <div className="mb-10">
        <div className="text-center mb-6">
          <span className="text-xs font-black text-indigo-600 uppercase tracking-widest block mb-1 font-outfit">
            Afinidad de personajes
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit">
            Tus personajes más parecidos
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Basado en tu estilo comunicativo y tu balance de empatía, liderazgo, seguridad y autocontrol
          </p>
        </div>

        {/* 3 Character Cards with photos & speech bubbles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {topCharacters.map((match, idx) => {
            const char = match.character;
            const medal = medalEmojis[idx];

            return (
              <div
                key={char.id}
                className="bg-white rounded-3xl p-6 border-2 border-slate-900/10 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between relative overflow-hidden group"
              >
                {/* Top card section with large character photo and rank */}
                <div>
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="relative mb-3">
                      <CharacterAvatar character={char} size="xl" showBadge />
                      <span className="absolute -top-2 -left-2 text-2xl drop-shadow filter" title={`Puesto ${match.rank}`}>
                        {medal}
                      </span>
                    </div>
                    <div className="inline-block px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 font-black text-xs sm:text-sm rounded-full tabular-nums mb-2 font-mono">
                      {match.compatibility}% de afinidad
                    </div>
                    <h3 className="font-outfit font-black text-slate-900 text-xl leading-tight">
                      {char.name}
                    </h3>
                    <div className="text-xs text-slate-500 font-medium">
                      {char.universe}
                    </div>
                    <div className="text-xs font-bold text-indigo-600 mt-1">
                      Cualidad: {char.trait}
                    </div>
                  </div>

                  {/* Humorous explanation styled as comic speech bubble */}
                  <div className="bg-slate-50 rounded-2xl p-3.5 text-xs text-slate-700 leading-relaxed mb-4 border border-slate-200 relative">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase mb-1">
                      <MessageSquareQuote className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Modo de acción:</span>
                    </div>
                    <p className="italic font-medium">"{char.humorExplanation}"</p>
                  </div>

                  {/* Psychological justification from PDF */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    <strong className="text-slate-900">Justificación:</strong> {char.justification}
                  </p>
                </div>

                {/* Substats mini tags */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Lid: {char.stats.liderazgo}%</span>
                  <span>·</span>
                  <span>Emp: {char.stats.empatia}%</span>
                  <span>·</span>
                  <span>Ctrl: {char.stats.autocontrol}%</span>
                  <span>·</span>
                  <span>Seg: {char.stats.seguridad}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Explicación Final: ¿Por qué te han salido estos personajes? (80-120 palabras) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-900/10 shadow-md mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-outfit mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <span>¿Por qué te han salido estos personajes?</span>
        </h2>

        {/* 80-120 word explanation paragraph */}
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-6 font-medium">
          {explanation.text}
        </p>

        {/* Strengths & Improvements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200">
            <div className="text-xs font-black text-emerald-800 uppercase tracking-wide mb-1 flex items-center gap-1.5 font-outfit">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tus fortalezas</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {explanation.strengths}
            </p>
          </div>

          <div className="bg-indigo-50/70 rounded-2xl p-4 border border-indigo-200">
            <div className="text-xs font-black text-indigo-800 uppercase tracking-wide mb-1 flex items-center gap-1.5 font-outfit">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
              <span>Clave de mejora</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {explanation.improvements}
            </p>
          </div>
        </div>
      </div>

      {/* 6. MENSAJE FINAL OBLIGATORIO (Exact text from PDF) */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-10 relative overflow-hidden border-2 border-indigo-500/20">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2 font-outfit">
            <ShieldCheck className="w-4 h-4" />
            <span>Mensaje del Equipo de Mediación Escolar</span>
          </div>
          <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-medium">
            "Todos utilizamos comportamientos pasivos, agresivos y asertivos en distintos momentos de nuestra vida. Este resultado refleja únicamente tu tendencia predominante. La comunicación asertiva suele favorecer relaciones más sanas, una mejor convivencia y una resolución más eficaz de los conflictos."
          </p>
        </div>
      </div>

      {/* 7. Action Bar with Viral Story Sharing */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* Instagram/TikTok Story Button */}
        <button
          type="button"
          onClick={onOpenStoryModal}
          className="py-3 px-5 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:opacity-95 text-white rounded-2xl text-xs sm:text-sm font-extrabold shadow-md shadow-purple-300/40 transition-all flex items-center gap-2 cursor-pointer font-outfit hover:scale-105"
        >
          <Instagram className="w-4 h-4" />
          <span>Compartir en Story (IG / TikTok)</span>
        </button>

        <button
          type="button"
          onClick={handleCopyShare}
          className="py-3 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
          <span>{copied ? '¡Copiado!' : 'Copiar para WhatsApp'}</span>
        </button>

        <button
          type="button"
          onClick={onOpenDirectory}
          className="py-3 px-5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <Users className="w-4 h-4 text-slate-500" />
          <span>Ver los 56 personajes</span>
        </button>

        <button
          type="button"
          onClick={onOpenQR}
          className="py-3 px-5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <QrCode className="w-4 h-4 text-slate-500" />
          <span>Proyectar QR</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>Repetir el Test</span>
        </button>
      </div>
    </div>
  );
};
