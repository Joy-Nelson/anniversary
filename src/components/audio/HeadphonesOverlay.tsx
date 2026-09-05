import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, Sparkles } from 'lucide-react';
import { useJourney } from '../../context/JourneyContext';
import { useAudio } from '../../hooks/useAudio';

import configData from '../../data/config.json';

export const HeadphonesOverlay: React.FC = () => {
  const { audioUnlocked, setAudioUnlocked, setSoundMuted } = useJourney();
  const { unlockAudio, playClick } = useAudio();

  if (!configData.audio.enableHeadphonesPrompt) return null;

  const handleStart = () => {
    unlockAudio();
    playClick();
    setSoundMuted(false);
    setAudioUnlocked(true);
  };

  return (
    <AnimatePresence>
      {!audioUnlocked && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080808] px-6 text-center"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-gradient-radial from-[#FF6600]/10 via-transparent to-transparent pointer-events-none" />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="max-w-md w-full glass-panel p-8 rounded-2xl border border-white/10 relative z-10 flex flex-col items-center shadow-2xl"
          >
            <div className="w-16 h-16 rounded-full bg-ktm-orange/10 border border-ktm-orange/30 flex items-center justify-center mb-6 text-ktm-orange animate-pulse">
              <Headphones className="w-8 h-8" />
            </div>

            <h1 className="font-heading text-2xl md:text-3xl text-white font-bold tracking-wider mb-3">
              RECOMMENDED AUDIO EXPERIENCE
            </h1>

            <p className="font-emotional text-lg md:text-xl text-silver/80 mb-8 leading-relaxed">
              "Wear headphones for the best cinematic journey."
            </p>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(255, 102, 0, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-ktm-orange to-orange-600 text-white font-heading font-semibold tracking-widest text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all duration-300"
            >
              <Sparkles className="w-4 h-4" />
              BEGIN EXPERIENCE
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
