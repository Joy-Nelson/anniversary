import React from 'react';

export const VolumetricFog: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-ktm-orange/10 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute top-1/2 -right-40 w-[30rem] h-[30rem] bg-gold/10 rounded-full blur-[140px] animate-float-slow" />
      <div className="absolute -bottom-40 left-1/3 w-[35rem] h-[35rem] bg-orange-600/5 rounded-full blur-[160px]" />
    </div>
  );
};
