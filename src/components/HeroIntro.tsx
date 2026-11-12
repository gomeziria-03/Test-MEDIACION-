import React from 'react';
import { Gender } from '../types';
import { Clock, Shield, Sparkles, Users, Award, Flame, HeartHandshake } from 'lucide-react';

interface HeroIntroProps {
  gender: Gender;
  onSelectGender: (g: Gender) => void;
  onStart: () => void;
  onOpenDirectory: () => void;
}

export const HeroIntro: React.FC<HeroIntroProps> = ({
  gender,
  onSelectGender,
  onStart,
  onOpenDirectory
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Editorial context header with youth humor badge */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-black text-indigo-700 tracking-wide uppercase mb-3 bg-indigo-50 border border-indigo-200/80 px-3 py-1 rounded-full shadow-xs">
          <Shield className="w-3.5 h-3.5 text-indigo-600" />
          <span>Semana de la Salud · Equipo de Mediación Escolar</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-outfit tracking-tight leading-tight max-w-2xl mx-auto">
          ¿Cómo te comunicas cuando surge un conflicto?
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed font-medium">
          Descubre en menos de 3 minutos cuál es tu estilo predominante de comunicación y resolución de conflictos.
        </p>

        {/* Humorous youth subtitle */}
        <p className="mt-2 text-xs sm:text-sm text-indigo-600 max-w-lg mx-auto font-semibold italic">
          "¿Eres de los que montan el pollo por WhatsApp, de los que se tragan la rabia comiéndose un durum frío, o de los que hablan las cosas con calma?"
        </p>

        {/* Character faces preview strip */}
        <div className="flex items-center justify-center -space-x-3 mt-6 mb-2">
          {[
            { name: 'Hermione', img: '/characters-clean/hermione-granger.jpg' },
            { name: 'Peter Parker', img: '/characters-clean/peter-parker.jpg' },
            { name: 'Vegeta', img: '/characters-clean/vegeta.jpg' },
            { name: 'Lisa Simpson', img: '/characters-clean/lisa-simpson.jpg' },
            { name: 'Shaggy', img: '/characters-clean/shaggy.jpg' },
            { name: 'Mario', img: '/characters-clean/mario.jpg' }
          ].map((item) => (
            <div
              key={item.name}
              className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-md bg-slate-900 relative group transition-transform hover:scale-110 hover:z-20 cursor-pointer"
              title={item.name}
              onClick={onOpenDirectory}
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-full object-cover object-top"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={onOpenDirectory}
            className="w-12 h-12 rounded-full border-2 border-white bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center text-xs font-black shadow-md z-10 transition-transform hover:scale-105 cursor-pointer font-outfit"
            title="Ver los 56 personajes disponibles"
          >
            +50
          </button>
        </div>
        <div className="text-[11px] text-slate-400 font-medium">
          56 personajes de anime, cine, videojuegos y series
        </div>
      </div>

      {/* 3 Styles Preview Grid (IDRlabs Inspiration with Humorous Taglines) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-white rounded-3xl p-5 border-2 border-emerald-200/90 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shrink-0 shadow-sm" />
              <h2 className="text-base font-extrabold text-slate-900 font-outfit">Comunicación Asertiva</h2>
            </div>
          </div>
          <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl mb-2 inline-block">
            Modo Monje Zen 🧘
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Dices lo que piensas y sientes de forma clara, serena y sin pisar los derechos de los demás. Cero dramas innecesarios.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border-2 border-amber-200/90 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-500 shrink-0 shadow-sm" />
              <h2 className="text-base font-extrabold text-slate-900 font-outfit">Comunicación Pasiva</h2>
            </div>
          </div>
          <div className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl mb-2 inline-block">
            Modo "No pasa nada" 🙈
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Te callas para evitar líos, dices que todo bien mientras te reconcomes por dentro y acabas haciendo tú todo el trabajo.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border-2 border-rose-200/90 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shrink-0 shadow-sm" />
              <h2 className="text-base font-extrabold text-slate-900 font-outfit">Comunicación Agresiva</h2>
            </div>
          </div>
          <div className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-xl mb-2 inline-block">
            Modo Mecha Corta 🧨
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Impones tu postura a gritos, sarcasmos o petando a mensajes. Sacas cosas de hace 6 meses para ganar la discusión.
          </p>
        </div>
      </div>

      {/* Gender Selection & Launch Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-900/10 shadow-xl shadow-slate-200/60 max-w-xl mx-auto">
        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-900 mb-1.5 flex items-center justify-between font-outfit">
            <span>¿Con qué género te identificas?</span>
            <span className="text-xs font-normal text-slate-400 font-sans">Paso previo</span>
          </label>
          <p className="text-xs text-slate-500 mb-4 font-medium">
            Esta respuesta servirá únicamente para la personalización de personajes afines (anime, videojuegos, cine y series).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => onSelectGender('hombre')}
              className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all border-2 text-center cursor-pointer font-outfit ${
                gender === 'hombre'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-300/40 scale-[1.02]'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              Hombre
            </button>

            <button
              type="button"
              onClick={() => onSelectGender('mujer')}
              className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all border-2 text-center cursor-pointer font-outfit ${
                gender === 'mujer'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-300/40 scale-[1.02]'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              Mujer
            </button>

            <button
              type="button"
              onClick={() => onSelectGender('otro')}
              className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all border-2 text-center cursor-pointer font-outfit ${
                gender === 'otro'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-300/40 scale-[1.02]'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              Otro / No indicar
            </button>
          </div>
        </div>

        {/* Quick test specs metadata */}
        <div className="flex items-center justify-center gap-4 text-xs text-slate-500 mb-6 py-2 border-y border-slate-100 font-medium">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>3 minutos</span>
          </div>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-indigo-500" />
            <span>18 situaciones reales</span>
          </div>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>56 personajes</span>
          </div>
        </div>

        {/* Primary CTA with electric youth styling */}
        <button
          type="button"
          onClick={onStart}
          className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-black rounded-2xl text-base shadow-lg shadow-purple-300/50 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer font-outfit"
        >
          <span>Empezar el Test</span>
          <span aria-hidden="true" className="text-lg">⚡</span>
        </button>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onOpenDirectory}
            className="text-xs text-slate-500 hover:text-indigo-600 transition-colors inline-flex items-center gap-1 cursor-pointer font-medium"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Ver el catálogo con los 56 personajes</span>
          </button>
        </div>
      </div>

      {/* School health week trust note */}
      <div className="mt-8 text-center text-xs text-slate-400 max-w-md mx-auto">
        <p>
          Iniciativa para la convivencia del centro escolar. Responde con total sinceridad: ¡aquí no hay notas ni respuestas malas! ✌️
        </p>
      </div>
    </div>
  );
};
