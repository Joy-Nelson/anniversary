import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Video, Play, Pause } from 'lucide-react';

export const CollegeOriginScene: React.FC = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);

  const collegeVideo = {
    title: 'KRISTU JYOTI COLLEGE CAMPUS REEL',
    subtitle: 'Kristu Jyoti College of Management and Technology',
    location: 'Chethipuzha, Changanassery, Kerala',
    description: 'The iconic campus where our paths first crossed and everyday campus walks slowly turned into a lifetime together.',
    localImage: './assets/images/kristu_jyoti_college.jpg',
    droneVideo: './assets/images/kristu_jyoti_college_drone.mp4'
  };

  return (
    <section className="min-h-screen w-full py-24 px-6 md:px-12 flex flex-col items-center justify-center relative select-none">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl w-full text-center"
      >
        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-ktm-orange/40 bg-ktm-orange/10 text-ktm-orange text-xs font-mono tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(255,102,0,0.2)]">
          <Compass className="w-3.5 h-3.5" />
          CHAPTER 00 // THE ORIGIN
        </div>

        <h1 className="font-heading text-3xl md:text-5xl text-white font-extrabold tracking-wider mb-4">
          KRISTU JYOTI COLLEGE OF MANAGEMENT & TECHNOLOGY
        </h1>

        <p className="font-emotional text-xl md:text-2xl text-silver/80 mb-10 italic max-w-2xl mx-auto">
          "Chethipuzha, Changanassery — where everyday campus walks slowly turned into a lifetime together."
        </p>

        {/* Main Drone Flight Reel Display Canvas */}
        <div className="glass-panel p-4 md:p-6 rounded-3xl border border-ktm-orange/30 shadow-2xl relative overflow-hidden text-left mb-8">
          
          <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden relative bg-black border border-white/10 group">
            {/* Real User Drone Video Slot */}
            <video
              src={collegeVideo.droneVideo}
              poster={collegeVideo.localImage}
              autoPlay={isVideoPlaying}
              loop
              muted
              playsInline
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />

            {/* Video Play / Pause Toggle Button */}
            <button
              onClick={() => setIsVideoPlaying(!isVideoPlaying)}
              className="absolute bottom-4 right-4 p-3 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/20 hover:text-ktm-orange transition-colors cursor-pointer"
            >
              {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            {/* Telemetry HUD Overlay */}
            <div className="absolute top-4 left-4 flex flex-col gap-1 text-[11px] font-mono text-ktm-orange bg-black/80 backdrop-blur-md px-3 py-2 rounded-xl border border-ktm-orange/30">
              <span className="font-bold tracking-widest flex items-center gap-1">
                <Video className="w-3.5 h-3.5" /> DRONE REEL // ACTIVE
              </span>
              <span className="text-white">{collegeVideo.subtitle}</span>
            </div>

            <div className="absolute bottom-4 left-4 text-[11px] font-mono text-silver/80 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
              📍 {collegeVideo.location}
            </div>
          </div>

          {/* Description */}
          <div className="mt-5 px-2">
            <h3 className="font-heading text-lg font-bold text-white mb-1">{collegeVideo.title}</h3>
            <p className="font-sans text-xs text-silver/80 leading-relaxed">{collegeVideo.description}</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
