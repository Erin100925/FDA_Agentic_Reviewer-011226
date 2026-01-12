import React, { useState, useEffect, useCallback } from 'react';
import { ArtStyle } from '../types';
import { ART_STYLES } from '../constants';

interface JackpotProps {
  currentStyle: ArtStyle;
  onStyleSelect: (style: ArtStyle) => void;
  label: string;
}

export const JackpotSelector: React.FC<JackpotProps> = ({ currentStyle, onStyleSelect, label }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(0);

  const spin = useCallback(() => {
    if (isSpinning) return;
    setIsSpinning(true);
    
    let speed = 50;
    let counter = 0;
    const maxSpins = 30 + Math.floor(Math.random() * 10); // Random spin duration
    
    const cycle = () => {
      setDisplayIndex(prev => (prev + 1) % ART_STYLES.length);
      counter++;
      
      if (counter < maxSpins) {
        // Decaying speed (getting slower)
        if (counter > maxSpins - 10) speed += 30;
        else if (counter > maxSpins - 5) speed += 60;
        
        setTimeout(cycle, speed);
      } else {
        // Stop
        const finalIndex = (displayIndex + 1) % ART_STYLES.length; // Capture the final one
        // Ideally we pick a random one to stop on, but here we just stop the visual cycle
        const randomFinal = Math.floor(Math.random() * ART_STYLES.length);
        setDisplayIndex(randomFinal);
        onStyleSelect(ART_STYLES[randomFinal]);
        setIsSpinning(false);
      }
    };
    
    cycle();
  }, [isSpinning, displayIndex, onStyleSelect]);

  return (
    <div className="flex flex-col items-center p-2 rounded-lg border border-opacity-20 border-white bg-opacity-10 bg-black backdrop-blur-sm">
      <div className="text-xs font-bold uppercase tracking-wider mb-2 opacity-80">{label}</div>
      <div className="flex gap-4 items-center">
        <div className="w-48 h-12 bg-white/20 rounded flex items-center justify-center overflow-hidden relative shadow-inner">
          <div className="text-center font-bold truncate px-2" style={{ fontFamily: ART_STYLES[displayIndex].palette.fontFamily }}>
            {ART_STYLES[displayIndex].name}
          </div>
        </div>
        <button 
          onClick={spin}
          disabled={isSpinning}
          className={`px-4 py-2 rounded font-bold transition-all shadow-lg active:scale-95
            ${isSpinning ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110'}
          `}
          style={{ 
            backgroundColor: currentStyle.palette.accent, 
            color: currentStyle.palette.background 
          }}
        >
          {isSpinning ? '...' : '🎰'}
        </button>
      </div>
      <div className="text-xs mt-1 italic opacity-70">{ART_STYLES[displayIndex].description}</div>
    </div>
  );
};

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { accentColor: string }> = ({ children, accentColor, className, ...props }) => (
  <button 
    {...props}
    className={`px-6 py-2 rounded shadow-md font-semibold transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    style={{ backgroundColor: accentColor, filter: 'brightness(1.1)' }}
  >
    {children}
  </button>
);

export const Card: React.FC<{ children: React.ReactNode; title?: string, style: ArtStyle }> = ({ children, title, style }) => (
  <div 
    className="p-6 rounded-xl shadow-xl transition-all duration-500"
    style={{ 
      backgroundColor: style.palette.background,
      color: style.palette.text,
      borderColor: style.palette.primary,
      borderWidth: '1px'
    }}
  >
    {title && (
      <h3 className="text-xl font-bold mb-4 border-b pb-2" style={{ borderColor: style.palette.secondary }}>
        {title}
      </h3>
    )}
    {children}
  </div>
);
