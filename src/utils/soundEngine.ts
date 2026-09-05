// Pure Web Audio & MP3 Audio Engine
class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.8;
  private audioElements: Record<string, HTMLAudioElement> = {};
  private bgAudio: HTMLAudioElement | null = null;
  private isSynthSongPlaying: boolean = false;
  private synthTimer: number | null = null;

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAllAmbience();
      this.stopBackgroundSong();
    } else {
      this.playBackgroundSong();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    Object.values(this.audioElements).forEach((el) => {
      el.volume = this.volume;
    });
  }

  // Play custom MP3 file with Web Audio synthesized fallback
  public playAudioFile(key: string, src: string, loop: boolean = false) {
    if (this.isMuted) return;
    this.init();
    try {
      if (!this.audioElements[key]) {
        const audio = new Audio(src);
        audio.loop = loop;
        audio.volume = this.volume;
        this.audioElements[key] = audio;
      }
      this.audioElements[key].currentTime = 0;
      this.audioElements[key].play().catch(() => {
        // Silently fallback if MP3 file is not added yet
      });
    } catch {
      // Ignore
    }
  }

  // Headlight Flash Relay Click Sound (Pure Web Audio)
  public playHeadlightFlashSound() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Relay Click Pulse 1
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(1200, now);
    osc1.frequency.exponentialRampToValueAtTime(300, now + 0.05);

    gain1.gain.setValueAtTime(0.15 * this.volume, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.05);

    // Relay Click Pulse 2 (0.1s later)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(800, now + 0.1);
    osc2.frequency.exponentialRampToValueAtTime(200, now + 0.15);

    gain2.gain.setValueAtTime(0.2 * this.volume, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.15);
  }

  // Pure Piano Chord for Completion
  public playPianoChime() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const chordNotes = [261.63, 329.63, 392.00, 523.25];
    chordNotes.forEach((freq, i) => {
      if (!this.ctx) return;
      const now = this.ctx.currentTime + i * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08 * this.volume, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.8);
    });
  }

  public playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.03);

    gain.gain.setValueAtTime(0.04 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  }

  // Engine Rev Starter Sound (Plays custom MP3 if present, or low-frequency thumping rumble)
  public playEngineRev() {
    if (this.isMuted) return;
    this.init();

    // 1. Trigger custom MP3 file if placed in /assets/audio/duke390_start.mp3
    this.playAudioFile('engine_start', './assets/audio/duke390_start.mp3');

    // 2. Play Web Audio Low-frequency single-cylinder engine starter rumble
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Sub-bass thumping rumble
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(50, now);
    osc.frequency.linearRampToValueAtTime(180, now + 0.8);
    osc.frequency.exponentialRampToValueAtTime(75, now + 2.2);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.18 * this.volume, now + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 2.4);
  }

  public playAmbientDrone(type: 'road' | 'airport' | 'flight' | 'piano') {
    if (this.isMuted) return;
    this.stopAllAmbience();

    if (type === 'road') {
      this.playAudioFile('road_ambience', './assets/audio/road_motorcycle.mp3', true);
    } else if (type === 'airport') {
      this.playAudioFile('airport_ambience', './assets/audio/airport.mp3', true);
    } else if (type === 'flight') {
      this.playAudioFile('flight_ambience', './assets/audio/flight.mp3', true);
    } else if (type === 'piano') {
      this.playAudioFile('piano_ambience', './assets/audio/piano.mp3', true);
    }
  }

  public stopAllAmbience() {
    Object.values(this.audioElements).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  // Synthesized Romantic Song Loop (Web Audio API)
  public playSynthRomanticSong() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    this.isSynthSongPlaying = true;

    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 261.63, 329.63, 440.00], // Fmaj7
      [196.00, 293.66, 349.23, 440.00], // G11
    ];

    let chordIdx = 0;

    const playStep = () => {
      if (!this.isSynthSongPlaying || this.isMuted || !this.ctx) return;

      const notes = chords[chordIdx];
      const now = this.ctx.currentTime;

      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const noteTime = now + i * 0.35;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.001, noteTime);
        gain.gain.linearRampToValueAtTime(0.05 * this.volume, noteTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 2.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 2.8);
      });

      chordIdx = (chordIdx + 1) % chords.length;
      this.synthTimer = window.setTimeout(playStep, 2800);
    };

    playStep();
  }

  public stopSynthSong() {
    this.isSynthSongPlaying = false;
    if (this.synthTimer) {
      window.clearTimeout(this.synthTimer);
      this.synthTimer = null;
    }
  }

  public playBackgroundSong() {
    if (this.isMuted) return;
    this.init();

    if (!this.bgAudio) {
      this.bgAudio = new Audio('./assets/audio/background_song.mp3');
      this.bgAudio.loop = true;
      this.bgAudio.volume = this.volume;
    }

    this.bgAudio
      .play()
      .then(() => {
        this.stopSynthSong();
      })
      .catch(() => {
        if (this.bgAudio) {
          this.bgAudio.src = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3';
          this.bgAudio
            .play()
            .then(() => {
              this.stopSynthSong();
            })
            .catch(() => {
              this.playSynthRomanticSong();
            });
        }
      });
  }

  public stopBackgroundSong() {
    if (this.bgAudio) {
      this.bgAudio.pause();
    }
    this.stopSynthSong();
  }
}

export const soundEngine = new SoundEngine();
