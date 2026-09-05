import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, CheckCircle2, Sparkles, Lightbulb } from 'lucide-react';
import { useJourney } from '../../context/JourneyContext';
import { useAudio } from '../../hooks/useAudio';
import quizData from '../../data/quiz.json';
import { QuizOption } from '../../types';

export const VerificationScene: React.FC = () => {
  const { bootCompleted, ecuVerified, setEcuVerified, setEngineStarted, incrementWrongAttempts, wrongAttemptsCount, unlockAchievement } = useJourney();
  const { playClick, playPianoChime } = useAudio();

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<QuizOption | null>(null);
  const [textInputValue, setTextInputValue] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isCompletedSuccess, setIsCompletedSuccess] = useState(false);

  if (!bootCompleted || ecuVerified) return null;

  const currentQuestion = quizData.questions[currentQIndex];

  const handleOptionClick = (option: QuizOption) => {
    playClick();
    setSelectedOption(option);

    if (option.isCorrect) {
      setTimeout(() => {
        if (currentQIndex + 1 < quizData.questions.length) {
          setCurrentQIndex((prev) => prev + 1);
          setSelectedOption(null);
          setTextInputValue('');
          setShowHint(false);
        } else {
          // All questions complete! Show sleek success seal
          playPianoChime();
          setIsCompletedSuccess(true);
          if (wrongAttemptsCount === 0) {
            unlockAchievement('perfect_memory');
          }
          setTimeout(() => {
            setEcuVerified(true);
            setEngineStarted(true);
          }, 1800);
        }
      }, 800);
    } else {
      incrementWrongAttempts();
    }
  };

  const handleTextSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!textInputValue.trim()) return;

    playClick();
    const trimmed = textInputValue.trim().toLowerCase();
    // Accepted answers (case-insensitive): "rohini", "me"
    const isCorrect = trimmed === 'rohini' || trimmed === 'me';

    const option: QuizOption = {
      id: `text_ans_${trimmed}`,
      text: textInputValue,
      isCorrect,
      playfulResponse: isCorrect
        ? "Passenger Verified! Still my favourite co-rider ❤️"
        : "Hmm... Incorrect passenger name detected. Try again ❤️",
      ecuLog: isCorrect
        ? "[ECU LOG 0x07]: Passenger Rohini/Me verified."
        : "[ECU WARNING]: Unverified passenger name."
    };

    setSelectedOption(option);

    if (isCorrect) {
      setTimeout(() => {
        if (currentQIndex + 1 < quizData.questions.length) {
          setCurrentQIndex((prev) => prev + 1);
          setSelectedOption(null);
          setTextInputValue('');
          setShowHint(false);
        } else {
          playPianoChime();
          setIsCompletedSuccess(true);
          if (wrongAttemptsCount === 0) {
            unlockAchievement('perfect_memory');
          }
          setTimeout(() => {
            setEcuVerified(true);
            setEngineStarted(true);
          }, 1800);
        }
      }, 800);
    } else {
      incrementWrongAttempts();
    }
  };

  const handleBypass = () => {
    playClick();
    playPianoChime();
    setIsCompletedSuccess(true);
    unlockAchievement('scenic_route');
    setTimeout(() => {
      setEcuVerified(true);
      setEngineStarted(true);
    }, 1600);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#050505] px-4 md:px-6 py-8 overflow-y-auto select-none"
    >
      {/* Soft Volumetric Background Glow */}
      <div className="absolute inset-0 bg-gradient-radial from-ktm-orange/15 via-gold/5 to-transparent pointer-events-none" />

      <div className="max-w-xl w-full flex flex-col items-center my-auto relative z-10">

        {/* Completion Success Seal View */}
        <AnimatePresence mode="wait">
          {isCompletedSuccess ? (
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.05, opacity: 0 }}
              className="glass-panel p-10 rounded-3xl border border-gold/40 flex flex-col items-center text-center shadow-[0_0_60px_rgba(212,175,55,0.3)] w-full"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-gold to-yellow-400 text-black flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(212,175,55,0.6)]">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="font-heading text-2xl md:text-3xl text-gold font-bold tracking-widest uppercase mb-2">
                PASSENGER VERIFIED ❤️
              </h2>
              <p className="font-emotional text-lg text-white/90 italic mb-4">
                "Memories synchronized. Unlocking Duke 390 ignition..."
              </p>
              <div className="text-xs font-mono text-gold/70 flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>PREPARING HEADLIGHT FLASH & ENGINE START...</span>
              </div>
            </motion.div>
          ) : (
            /* Minimal Luxury Q&A Card */
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full glass-panel p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center relative overflow-hidden"
            >
              {/* Subtle 5-Step LED Indicator */}
              <div className="w-full flex items-center justify-between mb-6 pb-4 border-b border-white/10 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  {quizData.questions.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 rounded-full transition-all duration-500 ${
                        idx < currentQIndex
                          ? 'w-6 bg-emerald-400 shadow-[0_0_10px_#34d399]'
                          : idx === currentQIndex
                          ? 'w-6 bg-ktm-orange shadow-[0_0_10px_#FF6600]'
                          : 'w-2 bg-white/20'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-silver/60 uppercase font-bold tracking-widest text-[11px]">
                  PASSENGER CHECK {currentQIndex + 1} / {quizData.questions.length}
                </div>
              </div>

              {/* Question Title & Prompt */}
              <div className="text-left w-full mb-6">
                <span className="text-xs font-mono text-ktm-orange uppercase tracking-wider block mb-1">
                  {currentQuestion.title}
                </span>
                <h2 className="font-heading text-lg md:text-xl text-white font-semibold leading-relaxed">
                  {currentQuestion.prompt}
                </h2>
              </div>

              {/* Options or Text Input */}
              {(currentQuestion as any).type === 'textInput' ? (
                <form onSubmit={handleTextSubmit} className="w-full flex flex-col gap-3 mb-6">
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={textInputValue}
                      onChange={(e) => setTextInputValue(e.target.value)}
                      placeholder={(currentQuestion as any).placeholder || "Type passenger name..."}
                      autoFocus
                      className="w-full p-4 rounded-2xl bg-white/5 border border-white/20 text-white placeholder-silver/40 font-sans text-sm md:text-base focus:outline-none focus:border-ktm-orange focus:ring-1 focus:ring-ktm-orange transition-all"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full p-4 rounded-2xl bg-gradient-to-r from-ktm-orange to-amber-500 text-black font-bold font-sans text-sm md:text-base shadow-lg shadow-ktm-orange/30 hover:shadow-ktm-orange/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>VERIFY SEAT PASSENGER ❤️</span>
                  </motion.button>
                </form>
              ) : (
                <div className="w-full flex flex-col gap-3 mb-6">
                  {currentQuestion.options.map((option) => {
                    const isSelected = selectedOption?.id === option.id;
                    const showWrong = isSelected && !option.isCorrect;
                    const showRight = isSelected && option.isCorrect;

                    return (
                      <motion.button
                        key={option.id}
                        whileHover={{ scale: 1.01, x: 4 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleOptionClick(option)}
                        className={`w-full p-4 rounded-2xl text-left font-sans text-sm md:text-base flex items-center justify-between border transition-all duration-300 cursor-pointer shadow-lg ${
                          showRight
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                            : showWrong
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                            : 'glass-panel border-white/10 text-silver hover:border-ktm-orange/50 hover:text-white'
                        }`}
                      >
                        <span className="flex-1 pr-4">{option.text}</span>
                        {showRight && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* Playful Response Banner */}
              <AnimatePresence mode="wait">
                {selectedOption && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`w-full p-3 rounded-xl text-xs font-mono mb-4 text-center border ${
                      selectedOption.isCorrect
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    }`}
                  >
                    ✨ {selectedOption.playfulResponse}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer Hint & Skip Options */}
              <div className="w-full flex items-center justify-between pt-4 border-t border-white/10 text-xs text-silver/60">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-1.5 hover:text-gold transition-colors cursor-pointer"
                >
                  <Lightbulb className="w-4 h-4 text-gold" />
                  <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
                </button>

                {wrongAttemptsCount >= 2 && (
                  <button
                    onClick={handleBypass}
                    className="flex items-center gap-1 text-ktm-orange hover:underline cursor-pointer"
                  >
                    <Heart className="w-4 h-4 fill-ktm-orange" />
                    <span>Skip to Ignition ❤️</span>
                  </button>
                )}
              </div>

              {/* Hint Dropdown */}
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="w-full mt-3 p-3 rounded-xl bg-gold/10 border border-gold/30 text-gold text-xs text-left"
                >
                  💡 {currentQuestion.hint}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Text */}
        <div className="mt-6 flex items-center gap-2 text-xs font-mono text-silver/50">
          <Heart className="w-3.5 h-3.5 text-ktm-orange fill-ktm-orange" />
          <span>STILL MY FAVOURITE CO-RIDER</span>
        </div>
      </div>
    </motion.div>
  );
};
