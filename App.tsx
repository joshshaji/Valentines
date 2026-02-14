
import React, { useState, useCallback, useRef, useEffect } from 'react';
import FloatingHearts from './components/FloatingHearts';
import DisneyAvatar from './components/DisneyAvatar';
import { AppState } from './types';
import { generateDisneyAvatar } from './services/geminiService';
import confetti from 'https://cdn.skypack.dev/canvas-confetti';

const NO_MESSAGES = [
  "No",
  "¿En serio? 🥺",
  "¡Piénsalo bien! 🧐",
  "¡Ese botón no! ❌",
  "¡Ave María! 😢",
  "¿Estás bromeando? 😂",
  "¡Por fis! 🌹",
  "¡Dale otra pensadita! 💭",
  "¡Si somos muy lindos! 👩‍❤️‍👨",
  "¡Error fatal! ⚠️",
  "Me voy a poner triste... 😿",
  "¡Dale al SÍ! 💖",
  "¡Tan malita! 😜",
  "¡Ya pues! Haha ✋",
  "¡El rojo es el tuyo! ☝️",
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.START);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [isEscaping, setIsEscaping] = useState(false);
  const [noIndex, setNoIndex] = useState(0);
  const [yesScale, setYesScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    generateDisneyAvatar('boyfriend');
    generateDisneyAvatar('girlfriend');
  }, []);

  const handleYes = () => {
    setState(AppState.SUCCESS);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fcd116', '#003893', '#ce1126', '#ffffff'], // Colombian flag colors + white
      shapes: ['circle', 'square'],
      ticks: 200
    });
  };

  const moveNoButton = useCallback(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current.getBoundingClientRect();
    
    const newX = (Math.random() - 0.5) * (container.width * 0.85);
    const newY = (Math.random() - 0.5) * (container.height * 0.7);
    
    setNoButtonPos({ x: newX, y: newY });
    setIsEscaping(true);
    setNoIndex((prev) => (prev + 1) % NO_MESSAGES.length);
    setYesScale((prev) => Math.min(prev + 0.15, 3.0));
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-gradient-to-br from-pink-100 via-white to-red-100 overflow-hidden px-4">
      <FloatingHearts />

      <div 
        ref={containerRef}
        className="z-10 bg-white/60 backdrop-blur-lg p-8 md:p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(255,182,193,0.4)] border-4 border-white/80 text-center max-w-2xl w-full relative transition-all duration-700 min-h-[550px] flex flex-col justify-center overflow-visible"
      >
        {state === AppState.START && (
          <div className="space-y-10 animate-in fade-in zoom-in duration-1000">
            <div className="text-6xl mb-4 animate-bounce">💌</div>
            <h1 className="text-6xl md:text-8xl font-romantic text-red-500 drop-shadow-sm leading-tight">Mi Amor...</h1>
            <p className="text-xl md:text-3xl font-elegant text-gray-700 italic tracking-wide">
              Tengo un secretito que quiero contarte.
            </p>
            <button 
              onClick={() => setState(AppState.ASKING)}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-5 px-12 rounded-full text-2xl shadow-xl transform hover:scale-110 transition-all active:scale-95 flex items-center gap-3 mx-auto group ring-4 ring-pink-100"
            >
              Descubre la Magia
              <span className="group-hover:rotate-12 transition-transform">✨</span>
            </button>
          </div>
        )}

        {state === AppState.ASKING && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-1000">
            <div className="flex justify-center items-end gap-[-20px] mb-4">
               <DisneyAvatar type="boyfriend" className="w-32 h-32 md:w-44 md:h-44 z-10 -mr-6 ring-4 ring-white" />
               <DisneyAvatar type="girlfriend" className="w-32 h-32 md:w-44 md:h-44 z-20 ring-4 ring-white" />
            </div>
            
            <h2 className="text-4xl md:text-7xl font-romantic text-red-600 leading-tight drop-shadow-sm px-4">
              ¿Quieres ser mi Valentín?
            </h2>
            
            <div className="flex flex-col items-center justify-center gap-12 pt-8 min-h-[220px] relative">
              <button 
                onClick={handleYes}
                style={{ transform: `scale(${yesScale})` }}
                className="bg-gradient-to-r from-red-600 to-pink-500 hover:from-red-700 hover:to-pink-600 text-white font-bold py-5 px-14 rounded-full text-3xl shadow-[0_10px_30px_rgba(239,68,68,0.4)] transition-all active:scale-90 animate-pulse z-30 whitespace-nowrap ring-4 ring-red-100"
              >
                ¡SÍ! ❤️
              </button>

              <button 
                onMouseEnter={moveNoButton}
                onClick={moveNoButton}
                style={{
                  transform: `translate(${noButtonPos.x}px, ${noButtonPos.y}px)`,
                  transition: isEscaping ? 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none',
                  position: isEscaping ? 'absolute' : 'relative'
                }}
                className="bg-white/80 backdrop-blur-sm text-gray-500 font-bold py-4 px-8 rounded-full text-xl shadow-lg cursor-default pointer-events-auto whitespace-nowrap border-2 border-pink-100 hover:text-red-400 transition-all z-20"
              >
                {NO_MESSAGES[noIndex]}
              </button>
            </div>
          </div>
        )}

        {state === AppState.SUCCESS && (
          <div className="space-y-10 animate-in zoom-in duration-1000">
            <div className="flex justify-center relative">
               <div className="absolute -top-12 -left-12 text-7xl animate-bounce">💖</div>
               <div className="absolute -top-12 -right-12 text-7xl animate-bounce delay-300">🎀</div>
               <DisneyAvatar type="boyfriend" isHappy className="w-56 h-56 md:w-80 md:h-80 z-10 shadow-[0_0_60px_rgba(255,105,180,0.5)]" />
            </div>
            
            <h2 className="text-6xl md:text-8xl font-romantic text-red-600 drop-shadow-md leading-tight">
              ¡Un Sí de Cuento!
            </h2>
            
            <p className="text-2xl md:text-3xl font-elegant text-gray-800 italic max-w-md mx-auto leading-relaxed">
              "Sabía que nuestra historia estaba escrita en las estrellas."
            </p>
            
            <div className="flex justify-center gap-4 text-4xl">
              {['✨', '☕', '🌹', '💃', '🇨🇴'].map((emoji, i) => (
                <span key={i} className="animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}>
                  {emoji}
                </span>
              ))}
            </div>

            <div className="pt-6 border-t border-pink-100 text-pink-400 font-romantic text-2xl animate-pulse">
              Por siempre y para siempre tuyo
            </div>
          </div>
        )}
      </div>

      {/* Aesthetic Accents */}
      <div className="fixed top-20 left-20 text-pink-200 text-9xl opacity-20 hidden xl:block font-romantic -rotate-12 pointer-events-none">Amor</div>
      <div className="fixed bottom-20 right-20 text-pink-200 text-9xl opacity-20 hidden xl:block font-romantic rotate-12 pointer-events-none">Pasión</div>
      <div className="fixed top-1/2 left-10 text-pink-300 text-4xl opacity-30 hidden lg:block animate-pulse">☁️</div>
      <div className="fixed top-1/3 right-10 text-pink-300 text-4xl opacity-30 hidden lg:block animate-pulse delay-700">☁️</div>
    </div>
  );
};

export default App;
