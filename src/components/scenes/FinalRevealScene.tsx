import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Calendar } from 'lucide-react';
import configData from '../../data/config.json';

export const FinalRevealScene: React.FC = () => {
  const [showFullReveal, setShowFullReveal] = useState(false);

  return (
    <section className="min-h-screen w-full py-24 px-6 md:px-12 flex flex-col items-center justify-center relative text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl w-full flex flex-col items-center"
      >
        <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center text-gold mb-8 animate-pulse shadow-[0_0_30px_rgba(212,175,55,0.3)]">
          <Heart className="w-8 h-8 fill-gold text-gold" />
        </div>

        <h2 className="font-heading text-3xl md:text-5xl text-white font-extrabold tracking-wider mb-6">
          THE JOURNEY CONTINUES
        </h2>

        <div className="font-emotional text-xl md:text-2xl text-silver/90 italic mb-12 flex flex-col gap-3">
          <p>"Every road we travelled..."</p>
          <p>"Every flight we boarded..."</p>
          <p>"Every goodbye we survived..."</p>
          <p className="text-gold font-semibold">"Led us here."</p>
        </div>

        {/* Incremental Memory Count Ticker */}
        <div className="w-full glass-panel-gold p-8 rounded-3xl mb-12 flex flex-col items-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-8 text-center font-mono">
            <div className="p-4 rounded-2xl bg-black/40 border border-gold/20">
              <div className="text-2xl text-gold font-bold">{configData.stats.ridesCount}</div>
              <div className="text-[11px] text-silver/60 uppercase tracking-widest mt-1">Rides</div>
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-gold/20">
              <div className="text-2xl text-gold font-bold">{configData.stats.teaStopsCount}</div>
              <div className="text-[11px] text-silver/60 uppercase tracking-widest mt-1">Tea Stops</div>
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-gold/20">
              <div className="text-2xl text-gold font-bold">{configData.stats.flightsCount}</div>
              <div className="text-[11px] text-silver/60 uppercase tracking-widest mt-1">Flights</div>
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-gold/20">
              <div className="text-2xl text-gold font-bold">{configData.stats.daysCount}+</div>
              <div className="text-[11px] text-silver/60 uppercase tracking-widest mt-1">Days</div>
            </div>
          </div>

          {!showFullReveal ? (
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(212,175,55,0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFullReveal(true)}
              className="py-4 px-8 rounded-2xl bg-gradient-to-r from-gold via-yellow-500 to-amber-600 text-black font-heading font-extrabold tracking-widest text-sm cursor-pointer shadow-xl flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              REVEAL OUR STORY
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center text-center mt-2"
            >
              <div className="font-heading text-2xl md:text-4xl text-gold font-extrabold tracking-widest mb-3">
                {configData.couple.partner1} & {configData.couple.partner2}
              </div>

              <div className="flex items-center gap-3 text-sm font-mono text-silver/80 mb-6 bg-black/60 px-6 py-2 rounded-full border border-gold/30">
                <Calendar className="w-4 h-4 text-gold" />
                <span>6 SEPTEMBER 2023 ➔ 6 SEPTEMBER 2026</span>
              </div>

              <div className="font-emotional text-2xl md:text-3xl text-gold italic font-bold">
                "{configData.couple.yearsTag}"
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
};
