import React, { useEffect } from 'react';
import { JourneyProvider, useJourney } from './context/JourneyContext';
import { HeadphonesOverlay } from './components/audio/HeadphonesOverlay';
import { AudioToggle } from './components/audio/AudioToggle';
import { FilmGrain } from './components/cinematic/FilmGrain';
import { VolumetricFog } from './components/cinematic/VolumetricFog';
import { FloatingParticles } from './components/cinematic/FloatingParticles';

import { BootScene } from './components/scenes/BootScene';
import { VerificationScene } from './components/scenes/VerificationScene';

import { JourneyProgressBar } from './components/journey/JourneyProgressBar';
import { CollegeOriginScene } from './components/scenes/CollegeOriginScene';
import { FriendsGroupScene } from './components/scenes/FriendsGroupScene';
import { RelationshipTimerScene } from './components/scenes/RelationshipTimerScene';
import { ScrapbookAlbum } from './components/album/ScrapbookAlbum';
import { FinalRevealScene } from './components/scenes/FinalRevealScene';
import { SecretLetterScene } from './components/scenes/SecretLetterScene';
import { useAudio } from './hooks/useAudio';

const MainJourney: React.FC = () => {
  const { engineStarted, setScrollProgress, setCurrentChapterId } = useJourney();
  const { playAmbient } = useAudio();

  useEffect(() => {
    if (!engineStarted) return;

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(1, Math.max(0, window.scrollY / totalHeight));
        setScrollProgress(progress);

        // Calculate Chapter thresholds for progress bar bike-to-plane morphing & soundscapes
        if (progress < 0.33) {
          setCurrentChapterId('ch0');
        } else if (progress < 0.66) {
          setCurrentChapterId('ch0_5');
        } else if (progress < 0.85) {
          setCurrentChapterId('ch_timer');
        } else {
          setCurrentChapterId('ch_final');
          playAmbient('piano');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [engineStarted, setScrollProgress, setCurrentChapterId, playAmbient]);

  return (
    <div className="relative min-h-screen bg-[#080808] text-[#BDBDBD] overflow-x-hidden selection:bg-ktm-orange/30 selection:text-white">
      {/* Background Cinematic Atmosphere */}
      <FilmGrain />
      <VolumetricFog />
      <FloatingParticles />

      {/* Floating Audio Control */}
      <AudioToggle />

      {/* Audio Unlock Gesture Screen */}
      <HeadphonesOverlay />

      {/* Scene 1: Memory System Boot */}
      <BootScene />

      {/* Scene 2: Duke 390 Passenger ECU Verification */}
      <VerificationScene />

      {/* Main Continuous Journey Narrative (Unlocks after Engine Ignition & Verification) */}
      {engineStarted && (
        <main className="relative z-10 flex flex-col items-center w-full">
          <JourneyProgressBar />

          {/* Prologue Quote */}
          <section className="min-h-screen w-full flex flex-col items-center justify-center px-6 text-center">
            <h1 className="font-heading text-3xl md:text-5xl text-white font-extrabold tracking-widest max-w-2xl leading-tight mb-6">
              SOME JOURNEYS ARE MEASURED IN KILOMETRES.
            </h1>
            <p className="font-emotional text-2xl md:text-3xl text-ktm-orange italic">
              "Ours is measured in memories."
            </p>
            <div className="mt-16 animate-bounce text-xs font-mono text-silver/50 tracking-widest uppercase">
              ↓ SCROLL TO DISCOVER WHERE IT ALL STARTED
            </div>
          </section>

          {/* Chapter 00: Kristu Jyoti College Changanassery (The Origin) */}
          <div id="chapter-0" className="w-full">
            <CollegeOriginScene />
          </div>

          {/* Chapter 0.5: The Squad & Friends Group Travel */}
          <div id="chapter-0-5" className="w-full">
            <FriendsGroupScene />
          </div>

          {/* Live Relationship Counter: 6 Sept 2023 ➔ Forever (After Friends Section) */}
          <div id="relationship-timer" className="w-full">
            <RelationshipTimerScene />
          </div>

          {/* Chapter 1: Our Little Book of Memories Scrapbook Album */}
          <div id="memory-album" className="w-full">
            <ScrapbookAlbum />
          </div>

          <FinalRevealScene />
          <SecretLetterScene />

          {/* Footer */}
          <footer className="w-full py-12 px-6 text-center text-xs font-mono text-silver/40 border-t border-white/5">
            KRISTU JYOTI COLLEGE ➔ THE SQUAD ➔ DUKE 390 ➔ FOREVER // 2023 - 2026 // MADE WITH ❤️
          </footer>
        </main>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <JourneyProvider>
      <MainJourney />
    </JourneyProvider>
  );
};

export default App;
