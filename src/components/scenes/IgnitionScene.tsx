import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Sparkles } from 'lucide-react';
import { useJourney } from '../../context/JourneyContext';
import { useAudio } from '../../hooks/useAudio';
import { soundEngine } from '../../utils/soundEngine';

export const IgnitionScene: React.FC = () => {
  const { ecuVerified, engineStarted, setEngineStarted } = useJourney();
  const { playEngineRev, playAmbient } = useAudio();

  const [isIgniting, setIsIgniting] = useState(false);
  const [headlightState, setHeadlightState] = useState<'off' | 'drl' | 'full'>('off');

  if (!ecuVerified || engineStarted) return null;

  const handleIgnition = () => {
    setIsIgniting(true);
    soundEngine.init();

    // Step 1: Headlight DRL Flash + Relay Click Sound
    setTimeout(() => {
      setHeadlightState('drl');
      soundEngine.playHeadlightFlashSound();
    }, 300);

    // Step 2: Main LED Projector Flash & Engine Rev Sound
    setTimeout(() => {
      setHeadlightState('full');
      playEngineRev();
    }, 700);

    // Step 3: Complete Ignition & Reveal Narrative
    setTimeout(() => {
      playAmbient('road');
      setEngineStarted(true);
    }, 2800);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          x: isIgniting ? [0, -8, 8, -6, 6, -3, 3, 0] : 0,
          y: isIgniting ? [0, 5, -5, 3, -3, 0] : 0,
        }}
        transition={{ duration: 0.5, repeat: isIgniting ? 5 : 0 }}
        className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#050505] px-4 md:px-6 text-center select-none overflow-hidden"
      >
        {/* Pitch Black Darkness Overlay */}
        <div className="absolute inset-0 bg-[#050505] pointer-events-none z-0" />

        {/* Cinematic Volumetric Headlight Light Beams */}
        {headlightState === 'full' && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0.1 }}
            animate={{ opacity: [0, 1, 0.85], scaleY: [0.1, 1.5, 1] }}
            transition={{ duration: 0.9 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[140vw] h-[140vh] bg-gradient-to-b from-white via-ktm-orange/50 to-transparent pointer-events-none z-10 mix-blend-screen opacity-90"
            style={{
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            }}
          />
        )}

        {/* Floating Ignition Card */}
        <div className="max-w-md w-full glass-panel-orange p-8 md:p-10 rounded-3xl border-2 border-ktm-orange/50 flex flex-col items-center shadow-[0_0_60px_rgba(255,102,0,0.35)] relative z-20 my-auto">
          
          {/* Detailed Duke 390 Split-LED Headlight Graphic */}
          <div className="relative w-48 h-36 mb-6 flex flex-col items-center justify-center">
            <svg viewBox="0 0 200 140" className="w-full h-full drop-shadow-[0_0_30px_rgba(255,102,0,0.8)]">
              {/* Outer Mask */}
              <path
                d="M20 20 L180 20 L160 115 L100 135 L40 115 Z"
                fill="#121212"
                stroke="#FF6600"
                strokeWidth="3.5"
              />

              {/* DRL Split Blades */}
              <path
                d="M32 30 L85 30 L75 90 L48 80 Z"
                fill={
                  headlightState === 'full' || headlightState === 'drl'
                    ? '#FFFFFF'
                    : '#222222'
                }
                style={{
                  filter: headlightState !== 'off' ? 'drop-shadow(0 0 15px #FFFFFF)' : 'none',
                }}
              />
              <path
                d="M168 30 L115 30 L125 90 L152 80 Z"
                fill={
                  headlightState === 'full' || headlightState === 'drl'
                    ? '#FFFFFF'
                    : '#222222'
                }
                style={{
                  filter: headlightState !== 'off' ? 'drop-shadow(0 0 15px #FFFFFF)' : 'none',
                }}
              />

              {/* Main Dual Stacked Projector LED Bulbs */}
              <circle
                cx="100"
                cy="50"
                r="16"
                fill={headlightState === 'full' ? '#FFFFFF' : '#FF6600'}
                opacity={headlightState === 'full' ? 1 : 0.3}
                style={{
                  filter: headlightState === 'full' ? 'drop-shadow(0 0 30px #FF6600)' : 'none',
                }}
              />
              <circle
                cx="100"
                cy="90"
                r="16"
                fill={headlightState === 'full' ? '#FFFFFF' : '#FF6600'}
                opacity={headlightState === 'full' ? 1 : 0.3}
                style={{
                  filter: headlightState === 'full' ? 'drop-shadow(0 0 30px #FF6600)' : 'none',
                }}
              />

              {/* Tag */}
              <text x="100" y="125" textAnchor="middle" fill="#FF6600" fontSize="9" fontWeight="extrabold" fontFamily="Cinzel">
                KTM DUKE 390
              </text>
            </svg>
          </div>

          <h2 className="font-heading text-2xl md:text-3xl text-white font-extrabold tracking-widest mb-2 uppercase">
            DUKE 390 IGNITION
          </h2>

          <p className="font-emotional text-base text-gold/90 italic mb-8">
            "Passenger verified. Flash lights & start journey..."
          </p>

          {/* Start Engine & Headlights Button */}
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: '0 0 45px rgba(255,102,0,0.8)' }}
            whileTap={{ scale: 0.96 }}
            disabled={isIgniting}
            onClick={handleIgnition}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-ktm-orange via-orange-500 to-yellow-500 text-white font-heading font-extrabold text-sm md:text-base tracking-widest flex items-center justify-center gap-3 shadow-xl cursor-pointer transition-all duration-300 disabled:opacity-80"
          >
            {isIgniting ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>IGNITING ENGINE...</span>
              </>
            ) : (
              <>
                <Flame className="w-5 h-5 fill-white animate-bounce" />
                <span>START ENGINE & LIGHTS</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
