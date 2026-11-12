import React from 'react';

interface HeaderProps {
  onStartTest: () => void;
  onOpenDirectory: () => void;
  onOpenQR: () => void;
  onOpenAbout: () => void;
  isTestActive: boolean;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onStartTest,
  onOpenDirectory,
  onOpenQR,
  onOpenAbout,
  isTestActive,
  onReset
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element brand wordmark */}
        <button
          onClick={onReset}
          className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 font-outfit whitespace-nowrap shrink-0 text-left cursor-pointer hover:text-indigo-600 transition-colors"
        >
          Mediación Escolar
        </button>

        {/* Zone 2: 4 clean single-line nav links for students */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={onReset}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Inicio
          </button>
          <button
            onClick={onOpenDirectory}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Personajes
          </button>
          <button
            onClick={onOpenAbout}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Semana de la Salud
          </button>
          <button
            onClick={onOpenQR}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Código QR
          </button>
        </nav>

        {/* Zone 3: 1 primary action button */}
        <div className="flex items-center gap-3 shrink-0">
          {isTestActive ? (
            <button
              onClick={onReset}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Reiniciar Test
            </button>
          ) : (
            <button
              onClick={onStartTest}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Hacer el Test
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
