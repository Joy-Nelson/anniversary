import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Sparkles, Mountain, Laugh, Heart, Camera, Video, Volume2, VolumeX, Play, Pause, Maximize2, X } from 'lucide-react';
import journalData from '../../data/journal.json';

export const FriendsGroupScene: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [activeModalPhoto, setActiveModalPhoto] = useState<typeof journalData.squadPhotos[0] | null>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState<Record<string, boolean>>({});

  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const togglePlayVideo = (id: string) => {
    const video = videoRefs.current[id];
    if (video) {
      if (playingVideoId === id && !video.paused) {
        video.pause();
        setPlayingVideoId(null);
      } else {
        // Pause all other videos
        Object.keys(videoRefs.current).forEach((vId) => {
          if (vId !== id && videoRefs.current[vId]) {
            videoRefs.current[vId]?.pause();
          }
        });
        video.play().catch(() => {});
        setPlayingVideoId(id);
      }
    }
  };

  const toggleVideoMute = (id: string) => {
    const video = videoRefs.current[id];
    if (video) {
      const nextMute = !video.muted;
      video.muted = nextMute;
      setIsAudioMuted((prev) => ({ ...prev, [id]: nextMute }));
    }
  };

  return (
    <section className="min-h-screen w-full py-24 px-6 md:px-12 flex flex-col items-center justify-center relative select-none">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full text-center"
      >
        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/40 bg-gold/10 text-gold text-xs font-mono tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
          <Users className="w-3.5 h-3.5 text-gold" />
          CHAPTER 0.5 // THE SQUAD & GROUP BONDING
        </div>

        <h1 className="font-heading text-3xl md:text-5xl text-white font-extrabold tracking-wider mb-4">
          FRIENDS, ROAD TRIPS & UNFORGETTABLE BONDING
        </h1>

        <p className="font-emotional text-xl md:text-2xl text-silver/80 mb-10 italic max-w-2xl mx-auto">
          "Before it was just the two of us... we were part of a tribe that turned ordinary college days into extraordinary adventures."
        </p>

        {/* Squad Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-10 text-left">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col">
            <div className="w-9 h-9 rounded-full bg-ktm-orange/10 border border-ktm-orange/30 flex items-center justify-center text-ktm-orange mb-2">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-heading text-base font-bold text-white mb-1">Unplanned Trips</h3>
            <p className="text-xs text-silver/80 leading-relaxed font-sans">
              No itinerary needed. Just bikes lined up, music blasting, and the whole squad leading the way.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col">
            <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-2">
              <Mountain className="w-4 h-4" />
            </div>
            <h3 className="font-heading text-base font-bold text-white mb-1">Mountain Escapes</h3>
            <p className="text-xs text-silver/80 leading-relaxed font-sans">
              Chasing misty mountain peaks with the squad, cold winds, breathtaking viewpoints, and endless laughter.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col">
            <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2">
              <Laugh className="w-4 h-4" />
            </div>
            <h3 className="font-heading text-base font-bold text-white mb-1">Inside Jokes</h3>
            <p className="text-xs text-silver/80 leading-relaxed font-sans">
              The kind of raw laughter that stays with you forever, bridging college life to the road ahead.
            </p>
          </div>
        </div>

        {/* Dedicated Gallery Selector Tabs (Photos All-In-One vs Videos All-In-One) */}
        <div className="flex items-center justify-center gap-3 mb-10 w-full font-heading font-bold text-xs">
          <button
            onClick={() => setActiveTab('photos')}
            className={`py-3 px-6 rounded-full border transition-all duration-300 cursor-pointer flex items-center gap-2 ${
              activeTab === 'photos'
                ? 'bg-gold border-gold text-black shadow-[0_0_25px_rgba(212,175,55,0.4)]'
                : 'glass-panel border-white/10 text-silver/70 hover:border-gold/50 hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>PHOTO MEMORIES ({journalData.squadPhotos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`py-3 px-6 rounded-full border transition-all duration-300 cursor-pointer flex items-center gap-2 ${
              activeTab === 'videos'
                ? 'bg-ktm-orange border-ktm-orange text-white shadow-[0_0_25px_rgba(255,102,0,0.4)]'
                : 'glass-panel border-white/10 text-silver/70 hover:border-ktm-orange/50 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>LIVE VIDEO CLIPS ({journalData.squadVideos.length})</span>
          </button>
        </div>

        {/* TAB 1: ALL PHOTO MEMORIES GALLERY GRID */}
        {activeTab === 'photos' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left"
          >
            {journalData.squadPhotos.map((photo, idx) => (
              <motion.div
                key={photo.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setActiveModalPhoto(photo)}
                className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-gold/40 transition-all cursor-pointer group relative overflow-hidden"
              >
                {/* 35mm Perforations Header */}
                <div className="flex justify-between items-center mb-3 text-[10px] font-mono text-gold/70">
                  <span>SQUAD PHOTO #{idx + 1}</span>
                  <span>{photo.date}</span>
                </div>

                <div className="aspect-video w-full rounded-xl overflow-hidden relative bg-black/60 mb-3">
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur-md text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                <h4 className="font-heading text-base font-bold text-white mb-1">{photo.title}</h4>
                <p className="font-sans text-xs text-silver/80 leading-relaxed">{photo.description}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* TAB 2: ALL LIVE VIDEO CLIPS GALLERY WITH ORIGINAL AUDIO CONTROLS */}
        {activeTab === 'videos' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left"
          >
            {journalData.squadVideos.map((video, idx) => {
              const isPlaying = playingVideoId === video.id;
              const isMuted = isAudioMuted[video.id] ?? false;

              return (
                <div
                  key={video.id}
                  className="glass-panel p-4 rounded-2xl border border-ktm-orange/30 bg-black/40 flex flex-col relative overflow-hidden group"
                >
                  <div className="flex justify-between items-center mb-3 text-[10px] font-mono text-ktm-orange">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Video className="w-3.5 h-3.5" /> REEL #{idx + 1} WITH ORIGINAL AUDIO
                    </span>
                    <span>{video.date}</span>
                  </div>

                  {/* Video Player Canvas */}
                  <div className="aspect-video w-full rounded-xl overflow-hidden relative bg-black border border-white/10 mb-3">
                    <video
                      ref={(el) => { videoRefs.current[video.id] = el; }}
                      src={video.videoUrl}
                      poster={video.fallbackImage}
                      playsInline
                      className="w-full h-full object-cover"
                    />

                    {/* Overlay Play/Pause Big Center Button */}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <button
                        onClick={() => togglePlayVideo(video.id)}
                        className="w-14 h-14 rounded-full bg-ktm-orange/90 text-white flex items-center justify-center shadow-[0_0_25px_rgba(255,102,0,0.6)] hover:scale-110 transition-transform cursor-pointer"
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                      </button>
                    </div>

                    {/* Original Audio Volume Control Button */}
                    <button
                      onClick={() => toggleVideoMute(video.id)}
                      className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white text-xs font-mono flex items-center gap-1.5 hover:text-ktm-orange transition-colors cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                      <span>{isMuted ? 'MUTED' : 'ORIGINAL AUDIO ON'}</span>
                    </button>
                  </div>

                  <h4 className="font-heading text-base font-bold text-white mb-1">{video.title}</h4>
                  <p className="font-sans text-xs text-silver/80 leading-relaxed">{video.description}</p>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Squad Heart Quote */}
        <div className="mt-12 flex items-center justify-center gap-2 text-xs font-mono text-gold/80 bg-black/60 px-6 py-3 rounded-full border border-gold/30">
          <Heart className="w-4 h-4 text-ktm-orange fill-ktm-orange" />
          <span>FRIENDSHIP: THE FOUNDATION OF OUR JOURNEY</span>
        </div>
      </motion.div>

      {/* Fullscreen Photo Lightbox Modal */}
      <AnimatePresence>
        {activeModalPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-4 md:p-8"
          >
            <div className="max-w-4xl w-full bg-[#121212] p-6 rounded-3xl border border-gold/40 shadow-2xl relative text-left flex flex-col">
              <button
                onClick={() => setActiveModalPhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-video w-full rounded-2xl overflow-hidden mb-4 bg-black">
                <img src={activeModalPhoto.image} alt={activeModalPhoto.title} className="w-full h-full object-contain" />
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-gold mb-2">
                <span>{activeModalPhoto.location}</span>
                <span>{activeModalPhoto.date}</span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-white mb-2">{activeModalPhoto.title}</h3>
              <p className="font-emotional text-base text-silver/90 italic">{activeModalPhoto.description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
