import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Compass, Plane, Bike, MessageSquare } from 'lucide-react';
import { useJourney } from '../../context/JourneyContext';
import { useAudio } from '../../hooks/useAudio';
import configData from '../../data/config.json';

export const BootScene: React.FC = () => {
  const { bootCompleted, setBootCompleted } = useJourney();
  const { playClick } = useAudio();

  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: 'Initializing Memory System...', icon: Compass },
    { label: 'Searching: Roads & Mountain Passes...', icon: Bike },
    { label: 'Searching: Flights & Airway Corridors...', icon: Plane },
    { label: 'Searching: Laughs & Late-Night Calls...', icon: MessageSquare },
  ];

  useEffect(() => {
    if (bootCompleted) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        playClick();
        return prev + 2;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [bootCompleted]);

  useEffect(() => {
    if (progress < 30) setCurrentStep(0);
    else if (progress < 60) setCurrentStep(1);
    else if (progress < 85) setCurrentStep(2);
    else setCurrentStep(3);
  }, [progress]);

  const StepIcon = steps[currentStep].icon;

  if (bootCompleted) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#080808] px-6 text-center select-none"
    >
      <div className="max-w-xl w-full flex flex-col items-center">
        {/* Terminal Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-8 text-xs font-mono text-ktm-orange/80 tracking-widest uppercase border border-ktm-orange/30 px-4 py-1.5 rounded-full bg-ktm-orange/5"
        >
          <span className="w-2 h-2 rounded-full bg-ktm-orange animate-ping" />
          SYSTEM DIAGNOSTIC // BOOT SEQUENCE
        </motion.div>

        {/* Dynamic Icon */}
        <motion.div
          key={currentStep}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 rounded-2xl glass-panel-orange flex items-center justify-center text-ktm-orange mb-8 shadow-[0_0_30px_rgba(255,102,0,0.2)]"
        >
          <StepIcon className="w-10 h-10 animate-pulse" />
        </motion.div>

        {/* Loading Step Label */}
        <p className="font-mono text-sm md:text-base text-silver/80 mb-6 h-8 flex items-center justify-center">
          {steps[currentStep].label}
        </p>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mb-4 relative">
          <motion.div
            className="h-full bg-gradient-to-r from-ktm-orange to-orange-400 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage Counter */}
        <div className="font-digital text-2xl text-ktm-orange mb-10">
          {progress}%
        </div>

        {/* System Memory Stat Reveal after 100% */}
        {progress >= 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="glass-panel p-6 rounded-2xl border border-white/10 w-full mt-4 flex flex-col items-center"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-6 text-center">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="font-heading text-xl text-white font-bold">{configData.stats.daysCount}+</div>
                <div className="text-xs text-silver/60 uppercase tracking-wider">Days Found</div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="font-heading text-xl text-white font-bold">{configData.stats.motorcyclesCount}</div>
                <div className="text-xs text-silver/60 uppercase tracking-wider">Motorcycle</div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="font-heading text-xl text-white font-bold">{configData.stats.flightsCount}</div>
                <div className="text-xs text-silver/60 uppercase tracking-wider">Flights</div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="font-heading text-xl text-white font-bold flex items-center justify-center gap-1 text-ktm-orange">
                  <span>Too Many</span> <Heart className="w-3.5 h-3.5 fill-ktm-orange" />
                </div>
                <div className="text-xs text-silver/60 uppercase tracking-wider">Memories</div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setBootCompleted(true)}
              className="w-full py-3.5 px-6 rounded-xl bg-ktm-orange text-white font-heading font-semibold text-sm tracking-widest cursor-pointer shadow-lg shadow-ktm-orange/20"
            >
              PROCEED TO VERIFICATION
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
