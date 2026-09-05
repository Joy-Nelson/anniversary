import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Mail, Heart, Lock, X, RefreshCw, Camera } from 'lucide-react';
import { useAudio } from '../../hooks/useAudio';
import letterData from '../../data/letter.json';

export const SecretLetterScene: React.FC = () => {
  const { playClick, playPianoChime } = useAudio();
  const [isOpen, setIsOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isBreakingSeal, setIsBreakingSeal] = useState(false);

  const handleOpenLetter = () => {
    playClick();
    setIsBreakingSeal(true);
    setTimeout(() => {
      playPianoChime();
      setIsBreakingSeal(false);
      setIsOpen(true);
    }, 1200);
  };

  return (
    <section className="min-h-screen w-full py-24 px-6 md:px-12 flex flex-col items-center justify-center relative text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full flex flex-col items-center"
      >
        {/* Airport Departure Board Style Card */}
        <div className="w-full glass-panel-gold p-8 rounded-3xl border border-gold/40 flex flex-col items-center shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-2 text-xs font-mono text-gold uppercase tracking-widest mb-4">
            <Plane className="w-4 h-4" />
            {letterData.departureBoard.title}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full bg-[#0d0905] p-4 rounded-2xl border border-gold/20 font-mono text-xs text-left mb-8">
            <div>
              <span className="text-silver/50 block">DESTINATION</span>
              <span className="text-gold font-bold text-sm">{letterData.departureBoard.destination}</span>
            </div>
            <div>
              <span className="text-silver/50 block">GATE</span>
              <span className="text-gold font-bold text-sm">{letterData.departureBoard.gate}</span>
            </div>
            <div className="col-span-2 md:col-span-1">
              <span className="text-silver/50 block">STATUS</span>
              <span className="text-emerald-400 font-bold text-sm">{letterData.departureBoard.status}</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 35px rgba(212,175,55,0.5)' }}
            whileTap={{ scale: 0.95 }}
            disabled={isBreakingSeal}
            onClick={handleOpenLetter}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-gold via-amber-500 to-yellow-600 text-black font-heading font-extrabold text-sm tracking-widest flex items-center justify-center gap-3 shadow-xl cursor-pointer"
          >
            <Mail className="w-5 h-5 fill-black" />
            {isBreakingSeal ? 'BREAKING WAX SEAL...' : 'ONE LAST STOP...'}
          </motion.button>
        </div>
      </motion.div>

      {/* Unfolded Handwritten Letter Modal with 3D Card Flip */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 md:p-8 overflow-y-auto select-none"
          >
            <div className="max-w-xl w-full my-auto perspective-1000">
              <motion.div
                initial={{ scale: 0.8, y: 40, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-full relative"
              >
                {/* Close Modal Button */}
                <button
                  onClick={() => { setIsOpen(false); setIsFlipped(false); }}
                  className="absolute -top-12 right-0 p-2 rounded-full bg-black/60 border border-white/20 text-white hover:text-ktm-orange transition-colors cursor-pointer z-50"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* 3D Flippable Container */}
                <motion.div
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="w-full relative min-h-[480px]"
                >
                  {/* FRONT SIDE: Handwritten Letter */}
                  <div
                    className={`w-full bg-[#fdfbf7] text-[#2c221e] p-8 md:p-10 rounded-3xl border-4 border-gold shadow-[0_0_60px_rgba(212,175,55,0.4)] flex flex-col justify-between transition-opacity duration-300 ${
                      isFlipped ? 'pointer-events-none opacity-0 absolute inset-0' : 'opacity-100 relative'
                    }`}
                  >
                    {/* Wax Seal Stamp Header */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#2c221e]/15">
                      <div className="flex items-center gap-2 font-mono text-xs text-[#2c221e]/60 tracking-widest uppercase">
                        <Lock className="w-3.5 h-3.5 text-amber-700" />
                        PRIVATE LETTER // FOR MY FAVOURITE CO-RIDER
                      </div>
                      <div className="w-8 h-8 rounded-full bg-amber-800 text-white flex items-center justify-center font-bold text-xs shadow-md">
                        <Heart className="w-4 h-4 fill-white" />
                      </div>
                    </div>

                    {/* Letter Paragraphs */}
                    <div className="font-emotional text-lg md:text-xl leading-relaxed flex flex-col gap-4 text-[#1a120e] italic mb-6">
                      {letterData.letterText.map((paragraph, idx) => (
                        <p key={idx}>"{paragraph}"</p>
                      ))}
                    </div>

                    {/* Closing & Signature + Flip Button */}
                    <div className="pt-4 border-t border-[#2c221e]/15 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                      <div className="flex flex-col text-left">
                        <div className="font-emotional text-base text-[#2c221e]/80 italic mb-0.5">
                          {letterData.closingLine}
                        </div>
                        <div className="font-heading text-lg font-bold text-amber-800 tracking-wider">
                          {letterData.signature}
                        </div>
                      </div>

                      <button
                        onClick={() => { playClick(); setIsFlipped(true); }}
                        className="py-2.5 px-4 rounded-full bg-amber-800 text-white font-mono text-xs font-bold tracking-wider hover:bg-amber-900 transition-all cursor-pointer flex items-center gap-2 shadow-md shrink-0"
                      >
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
                        <span>FLIP TO SEE PHOTO ➔</span>
                      </button>
                    </div>
                  </div>

                  {/* BACK SIDE: Special Memory Photo Frame */}
                  <div
                    style={{ transform: 'rotateY(180deg)' }}
                    className={`w-full bg-[#18120c] text-white p-6 md:p-8 rounded-3xl border-4 border-gold shadow-[0_0_60px_rgba(212,175,55,0.4)] flex flex-col items-center text-center transition-opacity duration-300 ${
                      !isFlipped ? 'pointer-events-none opacity-0 absolute inset-0' : 'opacity-100 relative'
                    }`}
                  >
                    {/* Header Badge */}
                    <div className="flex items-center gap-2 text-xs font-mono text-gold uppercase tracking-widest mb-4">
                      <Camera className="w-4 h-4 text-gold" />
                      <span>OUR SPECIAL MEMORY PHOTO</span>
                    </div>

                    {/* Polaroid Photo Frame */}
                    <div className="w-full aspect-[4/3] rounded-2xl bg-black border-2 border-gold/40 p-2 shadow-2xl relative overflow-hidden mb-5 group">
                      <img
                        src="./assets/images/letter_photo.jpg"
                        alt="Special Memory Letter Photo"
                        onError={(e) => {
                          // Fallback if user hasn't dropped letter_photo.jpg yet
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1600&q=80';
                        }}
                        className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>

                    <p className="font-emotional text-lg md:text-xl text-gold italic mb-6">
                      "Some memories are captured in photos, but lived in the heart forever."
                    </p>

                    {/* Flip Back Button */}
                    <button
                      onClick={() => { playClick(); setIsFlipped(false); }}
                      className="py-2.5 px-6 rounded-full bg-gold text-black font-mono text-xs font-bold tracking-wider hover:bg-yellow-400 transition-all cursor-pointer flex items-center gap-2 shadow-lg"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>← FLIP BACK TO LETTER</span>
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
