import React, { createContext, useContext, useState } from 'react';
import { JourneyState } from '../types';

interface JourneyContextType extends JourneyState {
  setAudioUnlocked: (unlocked: boolean) => void;
  setSoundMuted: (muted: boolean) => void;
  toggleMute: () => void;
  setVolume: (vol: number) => void;
  setBootCompleted: (completed: boolean) => void;
  setEcuVerified: (verified: boolean) => void;
  setEngineStarted: (started: boolean) => void;
  setCurrentChapterId: (chapterId: string) => void;
  setScrollProgress: (progress: number) => void;
  incrementWrongAttempts: () => void;
  unlockAchievement: (achievementId: string) => void;
  setActiveModal: (modal: string | null) => void;
}

const defaultState: JourneyState = {
  audioUnlocked: false,
  soundMuted: true,
  volume: 0.8,
  bootCompleted: false,
  ecuVerified: false,
  engineStarted: false,
  currentChapterId: 'ch1',
  scrollProgress: 0,
  wrongAttemptsCount: 0,
  unlockedAchievements: [],
  unlockedMemories: ['m1', 'm2', 'm3'],
  activeModal: null,
};

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export const JourneyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<JourneyState>(defaultState);

  const setAudioUnlocked = (audioUnlocked: boolean) => setState((prev) => ({ ...prev, audioUnlocked }));
  const setSoundMuted = (soundMuted: boolean) => setState((prev) => ({ ...prev, soundMuted }));
  const toggleMute = () => setState((prev) => ({ ...prev, soundMuted: !prev.soundMuted }));
  const setVolume = (volume: number) => setState((prev) => ({ ...prev, volume }));
  const setBootCompleted = (bootCompleted: boolean) => setState((prev) => ({ ...prev, bootCompleted }));
  const setEcuVerified = (ecuVerified: boolean) => setState((prev) => ({ ...prev, ecuVerified }));
  const setEngineStarted = (engineStarted: boolean) => setState((prev) => ({ ...prev, engineStarted }));
  const setCurrentChapterId = (currentChapterId: string) => setState((prev) => ({ ...prev, currentChapterId }));
  const setScrollProgress = (scrollProgress: number) => setState((prev) => ({ ...prev, scrollProgress }));
  
  const incrementWrongAttempts = () => {
    setState((prev) => {
      const nextCount = prev.wrongAttemptsCount + 1;
      const achievements = [...prev.unlockedAchievements];
      if (nextCount >= 3 && !achievements.includes('scenic_route')) {
        achievements.push('scenic_route');
      }
      if (nextCount >= 5 && !achievements.includes('memory_inventor')) {
        achievements.push('memory_inventor');
      }
      return {
        ...prev,
        wrongAttemptsCount: nextCount,
        unlockedAchievements: achievements,
      };
    });
  };

  const unlockAchievement = (achievementId: string) => {
    setState((prev) => {
      if (prev.unlockedAchievements.includes(achievementId)) return prev;
      return {
        ...prev,
        unlockedAchievements: [...prev.unlockedAchievements, achievementId],
      };
    });
  };

  const setActiveModal = (activeModal: string | null) => setState((prev) => ({ ...prev, activeModal }));

  return (
    <JourneyContext.Provider
      value={{
        ...state,
        setAudioUnlocked,
        setSoundMuted,
        toggleMute,
        setVolume,
        setBootCompleted,
        setEcuVerified,
        setEngineStarted,
        setCurrentChapterId,
        setScrollProgress,
        incrementWrongAttempts,
        unlockAchievement,
        setActiveModal,
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
};

export const useJourney = () => {
  const context = useContext(JourneyContext);
  if (!context) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
};
