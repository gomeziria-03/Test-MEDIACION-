import React, { useState } from 'react';
import { Character } from '../types';

interface CharacterAvatarProps {
  character: Character;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showBadge?: boolean;
  className?: string;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  character,
  size = 'md',
  showBadge = false,
  className = ''
}) => {
  const [imgError, setImgError] = useState(false);

  // Extract initials for fallback
  const initials = character.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const sizeClasses = {
    sm: 'w-10 h-10 text-xs rounded-xl',
    md: 'w-14 h-14 text-sm rounded-2xl',
    lg: 'w-20 h-20 text-lg rounded-2xl',
    xl: 'w-28 h-28 text-2xl rounded-3xl',
    hero: 'w-36 h-36 sm:w-44 sm:h-44 text-3xl rounded-3xl'
  }[size];

  const getStyleIndicator = () => {
    switch (character.style) {
      case 'asertivo':
        return { bg: 'bg-emerald-500', text: 'text-emerald-700', label: 'Asertivo' };
      case 'pasivo':
        return { bg: 'bg-amber-500', text: 'text-amber-700', label: 'Pasivo' };
      case 'agresivo':
        return { bg: 'bg-rose-500', text: 'text-rose-700', label: 'Agresivo' };
    }
  };

  const indicator = getStyleIndicator();
  const imageSrc = character.image || `/characters-clean/${character.id}.jpg`;

  return (
    <div className={`relative inline-flex shrink-0 items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses} font-bold flex items-center justify-center text-white shadow-md transition-transform hover:scale-[1.03] overflow-hidden border-2 border-white/90 bg-slate-900 relative`}
        title={`${character.name} (${character.universe ?? ''})`}
      >
        {!imgError ? (
          <img
            src={imageSrc}
            alt={character.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-top"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center relative"
            style={{
              background: `linear-gradient(135deg, ${character.themeColor} 0%, #0F172A 100%)`
            }}
          >
            <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                <circle cx="20" cy="20" r="30" stroke="currentColor" strokeWidth="6" />
                <path d="M0 100 L100 0" stroke="currentColor" strokeWidth="3" />
              </svg>
            </div>
            <span className="relative z-10 tracking-wider font-extrabold font-outfit drop-shadow-sm">
              {initials}
            </span>
          </div>
        )}
      </div>

      {showBadge && (
        <span
          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${indicator.bg}`}
          title={`Estilo: ${indicator.label}`}
        />
      )}
    </div>
  );
};
