import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useJourney } from '../../context/JourneyContext';
import { useAudio } from '../../hooks/useAudio';

export const AudioToggle: React.FC = () => {
  const { soundMuted, toggleMute, audioUnlocked } = useJourney();
  const { playClick } = useAudio();

  if (!audioUnlocked) return null;

  const handleClick = () => {
    playClick();
    toggleMute();
  };

  return (
    <button
      onClick={handleClick}
      aria-label={soundMuted ? 'Play Music' : 'Mute Music'}
      className={`fixed top-6 right-6 z-40 px-3.5 py-2.5 rounded-full border transition-all duration-300 shadow-2xl cursor-pointer flex items-center gap-2 text-xs font-mono font-bold ${
        soundMuted
          ? 'glass-panel border-white/10 text-silver/70 hover:text-white hover:border-ktm-orange/40'
          : 'bg-black/80 border-ktm-orange text-ktm-orange shadow-[0_0_25px_rgba(255,102,0,0.5)] animate-pulse'
      }`}
    >
      {soundMuted ? (
        <>
          <VolumeX className="w-4 h-4 text-silver/50" />
          <span className="hidden sm:inline">PLAY MUSIC</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-ktm-orange" />
          <span className="hidden sm:inline">MUSIC PLAYING</span>
        </>
      )}
    </button>
  );
};
