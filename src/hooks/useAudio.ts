import { useEffect } from 'react';
import { useJourney } from '../context/JourneyContext';
import { soundEngine } from '../utils/soundEngine';

export const useAudio = () => {
  const { soundMuted, volume, audioUnlocked } = useJourney();

  useEffect(() => {
    soundEngine.setMuted(soundMuted);
  }, [soundMuted]);

  useEffect(() => {
    soundEngine.setVolume(volume);
  }, [volume]);

  const unlockAudio = () => {
    soundEngine.init();
  };

  const playClick = () => {
    if (audioUnlocked) soundEngine.playClick();
  };

  const playEngineRev = () => {
    if (audioUnlocked) soundEngine.playEngineRev();
  };

  const playPianoChime = () => {
    if (audioUnlocked) soundEngine.playPianoChime();
  };

  const playAmbient = (type: 'road' | 'airport' | 'flight' | 'piano') => {
    if (audioUnlocked) soundEngine.playAmbientDrone(type);
  };

  const stopAudio = () => {
    soundEngine.stopAllAmbience();
  };

  return {
    unlockAudio,
    playClick,
    playEngineRev,
    playPianoChime,
    playAmbient,
    stopAudio,
  };
};
