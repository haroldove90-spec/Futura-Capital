import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        onFinish();
      }, 500);
    }, 1200);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-500 select-none ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center animate-fade-in p-6 text-center max-w-sm">
        {/* Splash Logo oficial sin encapsular */}
        <img
          src="https://appdesignproyectos.com/futuralogo.png"
          alt="Futura Logo"
          className="h-20 sm:h-24 w-auto object-contain mb-8"
        />

        {/* Barra de carga institucional */}
        <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-[#FD363D] rounded-full animate-[progress_1.2s_ease-in-out_infinite]" />
        </div>

        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          Invernadero Futura
        </p>
        <p className="text-[10px] text-gray-400 mt-1">Cargando sistema integral de lotes...</p>
      </div>
    </div>
  );
};
