
import React, { useState } from 'react';
import { AvatarProps } from '../types';

const STATIC_IMAGES: Record<string, string> = {
  boyfriend: `${import.meta.env.BASE_URL}images/boyfriend.png`,
  girlfriend: `${import.meta.env.BASE_URL}images/girlfriend.png`,
};

const FALLBACK_EMOJI: Record<string, string> = {
  boyfriend: '🤴',
  girlfriend: '👸',
};

const DisneyAvatar: React.FC<AvatarProps> = ({ type, isHappy, className = "" }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`relative ${className} overflow-hidden rounded-full border-4 border-white shadow-xl transform transition-all duration-1000 ease-out hover:scale-105 ${isHappy ? 'scale-110 rotate-3 ring-4 ring-pink-300' : ''} animate-in fade-in zoom-in`}>
      {!imgError ? (
        <img
          src={STATIC_IMAGES[type]}
          alt={type === 'boyfriend' ? 'Novio' : 'Novia'}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
          onLoad={(e) => (e.currentTarget.style.opacity = '1')}
          style={{ opacity: 0, transition: 'opacity 0.5s ease-in-out' }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-200 to-pink-300 text-white">
          <span className="text-4xl md:text-5xl">{FALLBACK_EMOJI[type]}</span>
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/20 to-transparent mix-blend-overlay"></div>

      {isHappy && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-5xl animate-ping opacity-75">💖</div>
          <div className="absolute text-3xl animate-bounce delay-75">✨</div>
        </div>
      )}
    </div>
  );
};

export default DisneyAvatar;
