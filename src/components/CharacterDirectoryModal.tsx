import React, { useState } from 'react';
import { CHARACTERS } from '../data/characters';
import { Character, CommunicationStyle } from '../types';
import { CharacterAvatar } from './CharacterAvatar';
import { X, Search, Sparkles } from 'lucide-react';

interface CharacterDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CharacterDirectoryModal: React.FC<CharacterDirectoryModalProps> = ({
  isOpen,
  onClose
}) => {
  const [search, setSearch] = useState('');
  const [styleFilter, setStyleFilter] = useState<'all' | CommunicationStyle>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | 'masculino' | 'femenino'>('all');

  if (!isOpen) return null;

  const filtered = CHARACTERS.filter((char) => {
    const matchesSearch =
      char.name.toLowerCase().includes(search.toLowerCase()) ||
      (char.universe && char.universe.toLowerCase().includes(search.toLowerCase())) ||
      char.trait.toLowerCase().includes(search.toLowerCase());

    const matchesStyle = styleFilter === 'all' || char.style === styleFilter;
    const matchesGender = genderFilter === 'all' || char.gender === genderFilter;

    return matchesSearch && matchesStyle && matchesGender;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-outfit">
              Catálogo de Personajes (Semana de la Salud)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              56 personajes de anime, videojuegos, cine y series clasificados por estilo comunicativo
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-wrap gap-3 items-center justify-between bg-white">
          {/* Search box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por nombre, universo o rasgo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Style tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setStyleFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                styleFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setStyleFilter('asertivo')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                styleFilter === 'asertivo' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🟢 Asertivos
            </button>
            <button
              onClick={() => setStyleFilter('pasivo')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                styleFilter === 'pasivo' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🟡 Pasivos
            </button>
            <button
              onClick={() => setStyleFilter('agresivo')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                styleFilter === 'agresivo' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔴 Agresivos
            </button>
          </div>

          {/* Gender filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setGenderFilter('all')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                genderFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setGenderFilter('masculino')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                genderFilter === 'masculino' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Masculinos
            </button>
            <button
              onClick={() => setGenderFilter('femenino')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                genderFilter === 'femenino' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Femeninos
            </button>
          </div>
        </div>

        {/* Character Grid */}
        <div className="overflow-y-auto p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((char) => {
            const badge =
              char.style === 'asertivo'
                ? { emoji: '🟢', text: 'Asertivo', color: 'text-emerald-700' }
                : char.style === 'pasivo'
                ? { emoji: '🟡', text: 'Pasivo', color: 'text-amber-700' }
                : { emoji: '🔴', text: 'Agresivo', color: 'text-rose-700' };

            return (
              <div
                key={char.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-3 mb-3">
                    <CharacterAvatar character={char} size="md" showBadge />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-bold text-slate-900 text-sm font-outfit truncate">
                          {char.name}
                        </h3>
                        <span className={`text-[10px] font-bold ${badge.color}`}>
                          {badge.emoji} {badge.text}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {char.universe}
                      </div>
                      <div className="text-xs font-semibold text-indigo-600 mt-0.5">
                        {char.trait}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-3 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    "{char.humorExplanation}"
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Lid: {char.stats.liderazgo}%</span>
                  <span>Emp: {char.stats.empatia}%</span>
                  <span>Ctrl: {char.stats.autocontrol}%</span>
                  <span>Seg: {char.stats.seguridad}%</span>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 text-sm">
              No se han encontrado personajes con ese filtro.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
