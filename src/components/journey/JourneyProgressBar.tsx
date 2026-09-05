import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bike, Plane } from 'lucide-react';
import { useJourney } from '../../context/JourneyContext';

export const JourneyProgressBar: React.FC = () => {
  const { engineStarted, scrollProgress, currentChapterId } = useJourney();

  if (!engineStarted) return null;

  // Flight chapters or final reveal section (> 70% scroll progress)
  const isFlightChapter = currentChapterId === 'ch2' || currentChapterId === 'ch3' || currentChapterId === 'ch_final' || scrollProgress > 0.70;

  return (
    <div className="fixed right-4 md:right-8 top-1/4 bottom-1/4 z-30 flex flex-col items-center pointer-events-none select-none">
      {/* Track Backdrop */}
      <div className="relative w-2 h-full bg-white/10 rounded-full overflow-hidden flex flex-col justify-end border border-white/5">
        <motion.div
          className={`w-full rounded-full transition-colors duration-700 ${
            isFlightChapter ? 'bg-gradient-to-t from-gold via-yellow-400 to-amber-300' : 'bg-gradient-to-t from-ktm-orange via-orange-500 to-yellow-400'
          }`}
          style={{ height: `${Math.min(100, Math.max(4, scrollProgress * 100))}%` }}
        />
      </div>

      {/* Dynamic Traveling Indicator (Duke 390 Bike → Airplane Morph) */}
      <motion.div
        className="absolute -translate-x-1/2 left-1/2"
        style={{ top: `${Math.min(94, Math.max(3, scrollProgress * 100))}%` }}
      >
        <div className="relative flex items-center">
          {/* Animated Glow Pill */}
          <motion.div
            layout
            transition={{ duration: 0.6, type: 'spring' }}
            className={`w-10 h-10 rounded-full flex items-center justify-center border shadow-xl backdrop-blur-md transition-all duration-500 ${
              isFlightChapter
                ? 'bg-gold/20 border-gold text-gold shadow-[0_0_20px_rgba(212,175,55,0.7)]'
                : 'bg-ktm-orange/20 border-ktm-orange text-ktm-orange shadow-[0_0_20px_rgba(255,102,0,0.7)]'
            }`}
          >
            <AnimatePresence mode="wait">
              {isFlightChapter ? (
                <motion.div
                  key="plane"
                  initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
                  animate={{ rotate: -45, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Plane className="w-5 h-5 text-gold" />
                </motion.div>
              ) : (
                <motion.div
                  key="bike"
                  initial={{ rotate: 90, scale: 0.4, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: -90, scale: 0.4, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Bike className="w-5 h-5 text-ktm-orange animate-pulse" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
