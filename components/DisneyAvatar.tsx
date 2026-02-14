
import React, { useEffect, useState } from 'react';
import { generateDisneyAvatar } from '../services/geminiService';
import { AvatarProps } from '../types';

const LOADING_MESSAGES = [
  "Dibujando nuestro amor...",
  "Poniéndole sazón...",
  "Haciendo magia...",
  "Capturando tu brillo...",
  "Pintando un cuento..."
];

const DisneyAvatar: React.FC<AvatarProps> = ({ type, isHappy, className = "" }) => {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const fetchAvatar = async () => {
      const url = await generateDisneyAvatar(type);
      setImgUrl(url);
      setLoading(false);
    };
    fetchAvatar();

    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [type]);

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center bg-white/40 backdrop-blur-sm rounded-full border-2 border-pink-200 animate-pulse ${className}`}>
        <div className="relative">
          <span className="text-4xl animate-spin-slow inline-block">✨</span>
          <span className="absolute inset-0 flex items-center justify-center text-xl">🎨</span>
        </div>
        <p className="text-[10px] mt-2 font-romantic text-pink-500 animate-bounce">
          {LOADING_MESSAGES[msgIndex]}
        </p>
      </div>
    );
  }

  return (
    <div className={`relative ${className} overflow-hidden rounded-full border-4 border-white shadow-xl transform transition-all duration-1000 ease-out hover:scale-105 ${isHappy ? 'scale-110 rotate-3 ring-4 ring-pink-300' : ''} animate-in fade-in zoom-in`}>
      {imgUrl ? (
        <img 
          src={imgUrl} 
          alt={`${type} avatar`} 
          className="w-full h-full object-cover"
          onLoad={(e) => (e.currentTarget.style.opacity = '1')}
          style={{ opacity: 0, transition: 'opacity 1s ease-in-out' }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-pink-200 text-white">
          <span className="text-4xl">{type === 'boyfriend' ? '🤴' : '👸'}</span>
        </div>
      )}
      
      {/* Sparkle Overlay for loaded state */}
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
