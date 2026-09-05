import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Bike } from 'lucide-react';
import chaptersData from '../../data/chapters.json';
import journalData from '../../data/journal.json';
import { ArchivalFilmFrame } from '../cinematic/ArchivalFilmFrame';

export const ChapterOne: React.FC = () => {
  const chapter = chaptersData.chapters[0];
  const memory1 = journalData.memories[0];

  return (
    <section className="min-h-screen w-full py-24 px-6 md:px-12 flex flex-col items-center justify-center relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl w-full text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-ktm-orange/30 bg-ktm-orange/5 text-ktm-orange text-xs font-mono tracking-widest uppercase mb-4">
          <Bike className="w-3.5 h-3.5" />
          {chapter.number}
        </div>

        <h1 className="font-heading text-4xl md:text-6xl text-white font-extrabold tracking-wider mb-4">
          {chapter.title}
        </h1>

        <p className="font-emotional text-xl md:text-2xl text-silver/80 mb-12 italic">
          "{chapter.subtitle}"
        </p>

        {/* Glowing Neon Highway Road Sign */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          className="w-full bg-[#0a150d] p-6 rounded-2xl border-4 border-emerald-600 shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-12 flex flex-col items-center font-mono text-emerald-400"
        >
          <div className="text-[10px] tracking-widest uppercase mb-1 text-emerald-500/80">NATIONAL HIGHWAY 66</div>
          <div className="font-heading text-xl md:text-2xl font-bold tracking-wider text-white">KOCHI AIRPORT DEPARTURES // 5 KM</div>
          <div className="text-xs text-emerald-400/80 mt-2">SPEED LIMIT: MEMORIES ONLY ➔</div>
        </motion.div>

        {/* Scene Cards */}
        <div className="flex flex-col gap-12 w-full mb-12">
          {chapter.scenes.map((scene) => (
            <motion.div
              key={scene.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 0.7 }}
              className="glass-panel p-8 rounded-3xl border border-white/10 text-left relative overflow-hidden"
            >
              <div className="flex items-center gap-2 text-xs font-mono text-ktm-orange mb-3">
                <MapPin className="w-4 h-4" />
                <span>{scene.location}</span>
              </div>

              <h3 className="font-heading text-2xl text-white font-semibold mb-4">
                {scene.title}
              </h3>

              <div className="flex flex-col gap-3 font-sans text-base text-silver/90 leading-relaxed">
                {scene.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Archival Film Frame Memory */}
        {memory1 && <ArchivalFilmFrame memory={memory1} index={0} />}
      </motion.div>
    </section>
  );
};
