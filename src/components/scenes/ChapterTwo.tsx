import React from 'react';
import { motion } from 'framer-motion';
import { Plane, MapPin } from 'lucide-react';
import chaptersData from '../../data/chapters.json';
import journalData from '../../data/journal.json';
import { ArchivalFilmFrame } from '../cinematic/ArchivalFilmFrame';

export const ChapterTwo: React.FC = () => {
  const chapter = chaptersData.chapters[1];
  const memory2 = journalData.memories[1];

  return (
    <section className="min-h-screen w-full py-24 px-6 md:px-12 flex flex-col items-center justify-center relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl w-full text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 text-gold text-xs font-mono tracking-widest uppercase mb-4">
          <Plane className="w-3.5 h-3.5" />
          {chapter.number}
        </div>

        <h1 className="font-heading text-4xl md:text-6xl text-white font-extrabold tracking-wider mb-4">
          {chapter.title}
        </h1>

        <p className="font-emotional text-xl md:text-2xl text-silver/80 mb-12 italic">
          "{chapter.subtitle}"
        </p>

        {/* Airport Departure Runway Sign */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          className="w-full bg-[#181409] p-6 rounded-2xl border-4 border-gold shadow-[0_0_30px_rgba(212,175,55,0.3)] mb-12 flex flex-col items-center font-mono text-gold"
        >
          <div className="text-[10px] tracking-widest uppercase mb-1 text-gold/70">DEPARTURE GATE G01</div>
          <div className="font-heading text-xl md:text-2xl font-bold tracking-wider text-white">FLIGHT COK ➔ UDR // BOARDING COMPLETE</div>
          <div className="text-xs text-gold/80 mt-2">DISTANCE: 1,850 KM ✈️</div>
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
              className="glass-panel-gold p-8 rounded-3xl text-left relative overflow-hidden"
            >
              <div className="flex items-center gap-2 text-xs font-mono text-gold mb-3">
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
        {memory2 && <ArchivalFilmFrame memory={memory2} index={1} />}
      </motion.div>
    </section>
  );
};
