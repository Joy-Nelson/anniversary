import React from 'react';

export const FilmGrain: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-30 opacity-[0.035] mix-blend-overlay overflow-hidden">
      <svg className="w-full h-full">
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
};
