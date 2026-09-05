import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Play } from 'lucide-react';
import { MemoryCardItem } from '../../types';

interface ArchivalFilmFrameProps {
  memory: MemoryCardItem;
  index: number;
}

export const ArchivalFilmFrame: React.FC<ArchivalFilmFrameProps> = ({ memory, index }) => {
  const isVideo = memory.image.endsWith('.mp4') || memory.image.endsWith('.webm');

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.8, delay: index * 0.15 }}
      className="w-full max-w-2xl mx-auto my-12 group"
    >
      {/* 35mm Vintage Film Reel Frame Container */}
      <div className="bg-[#121212] p-4 md:p-6 rounded-2xl border-2 border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative overflow-hidden">
        {/* Film Sprocket Perforations Top & Bottom */}
        <div className="flex justify-between items-center mb-3 px-2">
          <div className="flex gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-3 h-2 rounded-xs bg-[#050505] border border-white/10" />
            ))}
          </div>
          <div className="font-mono text-[10px] text-ktm-orange/80 tracking-widest uppercase">
            35MM FILM REEL // FRAME #{index + 1}
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-3 h-2 rounded-xs bg-[#050505] border border-white/10" />
            ))}
          </div>
        </div>

        {/* Media Canvas Box (Ken Burns Zoom / Video Player) */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-[#080808] border border-white/10 group-hover:border-ktm-orange/40 transition-colors">
          {/* Light Leak Flare Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-ktm-orange/15 via-transparent to-gold/15 pointer-events-none z-10 mix-blend-screen" />

          {/* Film Grain & Scratches Texture */}
          <div className="absolute inset-0 pointer-events-none z-10 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />

          {isVideo ? (
            <video
              src={memory.image}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <motion.img
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.8 }}
              src={memory.image}
              alt={memory.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // High-aesthetic SVG fallback if personal photo is not uploaded yet
                (e.target as HTMLImageElement).src =
                  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><rect width="800" height="450" fill="%23121212"/><circle cx="400" cy="225" r="120" fill="%23FF6600" opacity="0.15"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="%23D4AF37" font-family="Cinzel" font-size="28">' +
                  encodeURIComponent(memory.title) +
                  '</text><text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" fill="%23BDBDBD" font-family="Poppins" font-size="16">' +
                  encodeURIComponent(memory.location) +
                  '</text></svg>';
              }}
            />
          )}

          {/* Play Icon Badge if Video */}
          {isVideo && (
            <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-mono flex items-center gap-1.5">
              <Play className="w-3 h-3 fill-white" /> LIVE VIDEO
            </div>
          )}

          {/* Location Badge */}
          <div className="absolute bottom-4 left-4 z-20 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-gold text-xs font-mono flex items-center gap-1.5">
            <Camera className="w-3 h-3" /> {memory.location}
          </div>
        </div>

        {/* Caption & Timestamp Footer */}
        <div className="mt-4 flex flex-col text-left px-1">
          <div className="flex items-center justify-between text-xs font-mono text-silver/60 mb-1">
            <span>{memory.date}</span>
            <span className="text-ktm-orange">{memory.title}</span>
          </div>
          <p className="font-emotional text-base md:text-lg text-white/90 italic leading-relaxed">
            "{memory.description}"
          </p>
        </div>
      </div>
    </motion.div>
  );
};
