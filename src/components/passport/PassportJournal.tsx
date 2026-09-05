import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, MapPin, Plane, Award, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useJourney } from '../../context/JourneyContext';
import { useAudio } from '../../hooks/useAudio';
import journalData from '../../data/journal.json';
import quizData from '../../data/quiz.json';

export const PassportJournal: React.FC = () => {
  const { activeModal, setActiveModal, unlockedAchievements } = useJourney();
  const { playClick, playPianoChime } = useAudio();
  const [activeTab, setActiveTab] = useState<'stamps' | 'passes' | 'memories' | 'achievements'>('stamps');

  const isOpen = activeModal === 'passport';

  const handleOpen = () => {
    playPianoChime();
    setActiveModal('passport');
  };

  const handleClose = () => {
    playClick();
    setActiveModal(null);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-40 px-5 py-3 rounded-full glass-panel-gold border border-gold/40 text-gold hover:scale-105 transition-all duration-300 shadow-[0_0_25px_rgba(212,175,55,0.3)] flex items-center gap-2 cursor-pointer text-xs font-heading font-bold tracking-widest uppercase"
      >
        <BookOpen className="w-4 h-4 text-gold" />
        JOURNAL PASSPORT
      </button>

      {/* Modal Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-8 overflow-y-auto select-none"
          >
            {/* Passport Container */}
            <motion.div
              initial={{ scale: 0.9, rotateY: -15, opacity: 0 }}
              animate={{ scale: 1, rotateY: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="max-w-3xl w-full bg-[#18120c] rounded-3xl border-2 border-gold/40 shadow-[0_0_50px_rgba(212,175,55,0.2)] overflow-hidden relative flex flex-col my-auto max-h-[85vh]"
            >
              {/* Embossed Leather Header */}
              <div className="bg-gradient-to-r from-[#2a1d12] via-[#1e150d] to-[#2a1d12] p-6 border-b border-gold/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-gold/50 bg-gold/10 flex items-center justify-center text-gold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h2 className="font-heading text-lg md:text-xl text-gold font-extrabold tracking-widest uppercase">
                      OFFICIAL MEMORY PASSPORT
                    </h2>
                    <p className="text-xs font-mono text-gold/60">
                      NO: {journalData.passportNumber} // PASSENGER: {journalData.passengerName}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-white/10 text-gold/70 hover:text-gold transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-gold/20 bg-[#120d09] px-6 text-xs font-heading font-semibold tracking-wider text-gold/70">
                <button
                  onClick={() => { playClick(); setActiveTab('stamps'); }}
                  className={`py-3.5 px-4 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                    activeTab === 'stamps' ? 'border-gold text-gold font-bold' : 'border-transparent hover:text-gold'
                  }`}
                >
                  <MapPin className="w-4 h-4" /> STAMPS
                </button>
                <button
                  onClick={() => { playClick(); setActiveTab('passes'); }}
                  className={`py-3.5 px-4 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                    activeTab === 'passes' ? 'border-gold text-gold font-bold' : 'border-transparent hover:text-gold'
                  }`}
                >
                  <Plane className="w-4 h-4" /> BOARDING PASSES
                </button>
                <button
                  onClick={() => { playClick(); setActiveTab('memories'); }}
                  className={`py-3.5 px-4 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                    activeTab === 'memories' ? 'border-gold text-gold font-bold' : 'border-transparent hover:text-gold'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" /> MEMORIES
                </button>
                <button
                  onClick={() => { playClick(); setActiveTab('achievements'); }}
                  className={`py-3.5 px-4 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                    activeTab === 'achievements' ? 'border-gold text-gold font-bold' : 'border-transparent hover:text-gold'
                  }`}
                >
                  <Award className="w-4 h-4" /> ACHIEVEMENTS
                </button>
              </div>

              {/* Passport Content Body */}
              <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-[#150f0a] text-silver/90 text-left">
                {activeTab === 'stamps' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {journalData.stamps.map((stamp) => (
                      <div
                        key={stamp.id}
                        className="p-4 rounded-2xl border border-gold/30 bg-gold/5 flex flex-col items-center text-center relative overflow-hidden group hover:border-gold transition-colors"
                      >
                        <div className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center text-gold mb-2">
                          <MapPin className="w-6 h-6" />
                        </div>
                        <span className="font-heading text-xs font-bold text-gold tracking-widest">{stamp.location}</span>
                        <span className="text-[10px] font-mono text-gold/60 mt-1">{stamp.date}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'passes' && (
                  <div className="flex flex-col gap-4">
                    {journalData.boardingPasses.map((pass) => (
                      <div
                        key={pass.id}
                        className="p-5 rounded-2xl border border-gold/40 bg-gradient-to-r from-[#24180f] to-[#1a110a] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden"
                      >
                        <div>
                          <div className="text-[10px] font-mono text-gold/60 uppercase">BOARDING PASS // {pass.flightNo}</div>
                          <div className="font-heading text-lg font-bold text-gold">{pass.from} ➔ {pass.to}</div>
                          <div className="text-xs text-silver/70 mt-1">PASSENGER: {pass.passengerName}</div>
                        </div>
                        <div className="text-right font-mono text-xs text-gold/80 border-t md:border-t-0 md:border-l border-gold/20 pt-2 md:pt-0 md:pl-6">
                          <div>DATE: {pass.date}</div>
                          <div>SEAT: {pass.seat}</div>
                          <div>GATE: {pass.gate}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'memories' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {journalData.memories.map((mem) => (
                      <div
                        key={mem.id}
                        className="p-5 rounded-2xl border border-white/10 bg-black/40 flex flex-col text-left"
                      >
                        <span className="text-xs font-mono text-gold mb-1">{mem.date} // {mem.location}</span>
                        <h4 className="font-heading text-base font-bold text-white mb-2">{mem.title}</h4>
                        <p className="font-sans text-xs text-silver/80 leading-relaxed">{mem.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'achievements' && (
                  <div className="flex flex-col gap-3">
                    {quizData.achievements.map((ach) => {
                      const isUnlocked = unlockedAchievements.includes(ach.id) || unlockedAchievements.length > 0;
                      return (
                        <div
                          key={ach.id}
                          className={`p-4 rounded-xl border flex items-center gap-4 ${
                            isUnlocked
                              ? 'border-gold/50 bg-gold/10 text-gold'
                              : 'border-white/10 bg-white/5 text-silver/50'
                          }`}
                        >
                          <Award className="w-8 h-8 shrink-0 text-gold" />
                          <div>
                            <h4 className="font-heading text-sm font-bold">{ach.title}</h4>
                            <p className="text-xs text-silver/80 mt-0.5">{ach.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
