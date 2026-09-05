# PROJECT_TRACKER.md — Cinematic Interactive Love Journey Website

> **IMPORTANT**: This file is the absolute single source of truth for the project. Every AI assistant working on this repository must read this file first and update it after completing any task.

---

## Project Overview
A premium, cinematic, interactive React web application that tells the 3-year relationship story of a couple as an emotional short film rather than a traditional website. 
The journey follows one emotional arc: **Together → Distance → Choosing Each Other Again** ("Some journeys are measured in kilometres. Ours is measured in memories.").

## Goals
- Deliver a 10–15 minute immersive interactive documentary experience.
- Maintain high emotional resonance: No explicit anniversary/duration mentions until the final act reveal (6 Sept 2023 → 6 Sept 2026).
- High visual aesthetics: OLED dark theme, film grain, floating dust, Duke 390 dashboard, leather passport journal, envelope with breaking wax seal.
- Data-Driven Architecture: All text, quiz questions, memories, boarding passes, audio paths, and letter content stored in JSON files so non-devs can edit easily.

---

## Approved Tech Stack
- **Frontend Framework**: React 18 + Vite (TypeScript)
- **Styling**: Tailwind CSS + Custom CSS (OLED dark `#080808`, KTM Orange `#FF6600`, Gold `#D4AF37`, Glassmorphism, Luxury typography)
- **Typography**: Cinzel (Headings), Poppins (Body), Cormorant Garamond (Emotional text)
- **Animations & Camera Motion**: Framer Motion + GSAP ScrollTrigger & MotionPath
- **Icons**: Lucide React
- **Audio Engine**: Custom Web Audio API / HTML5 Audio Manager (`soundEngine.ts`) with chapter spatial cross-fading & sound FX
- **State Management**: React Context (`JourneyContext`)
- **Deployment Platform**: GitHub Pages automated static deployment (via `.github/workflows/deploy.yml`)
- **Asset Paths**: Relative paths configured in `vite.config.ts` (`base: './'`) to guarantee 100% asset loading reliability on GitHub Pages.

---

## Architecture Decisions
1. **AudioContext User Gesture**: Unlocked via an elegant initial "Headphones Recommended / Enter Experience" overlay and reinforced by the Scene 3 "START ENGINE" button.
2. **Dynamic Progress Bar**: Winding SVG road with a mini Duke 390 motorcycle driven by GSAP MotionPath & ScrollTrigger, morphing into an airplane vector during flight chapters.
3. **Non-Punishing ECU Quiz**: Scene 2 Duke 390 ECU dashboard allows 5 MCQs. Wrong answers trigger playful ECU logs, alternate memory paths, hidden achievements, and hints after 3 attempts.
4. **Data Isolation**: All dynamic content is separated into `src/data/*.json`.

---

## Folder Structure
```
cinematic-love-journey/  (Location: C:\Users\joyne\Projects\cinematic-love-journey)
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   └── assets/
│       ├── audio/
│       └── images/
├── src/
│   ├── components/
│   │   ├── audio/
│   │   │   ├── AudioToggle.tsx
│   │   │   └── HeadphonesOverlay.tsx
│   │   ├── cinematic/
│   │   │   ├── FilmGrain.tsx
│   │   │   ├── FloatingParticles.tsx
│   │   │   └── VolumetricFog.tsx
│   │   ├── journey/
│   │   │   └── JourneyProgressBar.tsx
│   │   ├── passport/
│   │   │   └── PassportJournal.tsx
│   │   └── scenes/
│   │       ├── BootScene.tsx
│   │       ├── ChapterOne.tsx
│   │       ├── ChapterTwo.tsx
│   │       ├── ChapterThree.tsx
│   │       ├── FinalRevealScene.tsx
│   │       ├── IgnitionScene.tsx
│   │       ├── SecretLetterScene.tsx
│   │       └── VerificationScene.tsx
│   ├── context/
│   │   └── JourneyContext.tsx
│   ├── data/
│   │   ├── config.json
│   │   ├── quiz.json
│   │   ├── chapters.json
│   │   ├── journal.json
│   │   └── letter.json
│   ├── hooks/
│   │   └── useAudio.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── soundEngine.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
└── PROJECT_TRACKER.md
```

---

## Feature Roadmap & Milestones

- [x] **Milestone 1: Foundation & Data Infrastructure** (Phase 1)
- [x] **Milestone 2: Atmospheric & Audio Engine System** (Phase 2)
- [x] **Milestone 3: Scene 1 (Boot) & Scene 2 (Duke 390 ECU Quiz)** (Phase 3)
- [x] **Milestone 4: Scene 3 (Ignition) & Winding Progress Bar** (Phase 4)
- [x] **Milestone 5: Chapters 1, 2, & 3 Continuous Narrative** (Phase 5)
- [x] **Milestone 6: Leather Passport Journal & Final 3-Year Reveal** (Phase 6)
- [x] **Milestone 7: Secret Final Letter & Wax Seal** (Phase 7)
- [x] **Milestone 8: Polish, Asset Loading & Final Verification** (Phase 8)

---

## Master TODO List

### Milestone 1: Foundation & Data Infrastructure
- [x] Setup React + Vite + TypeScript application configuration files (`package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`).
- [x] Install dependencies (`framer-motion`, `gsap`, `lucide-react`, `tailwindcss`, `autoprefixer`, `postcss`, `canvas-confetti`).
- [x] Setup `tailwind.config.js` with OLED dark theme, KTM Orange `#FF6600`, Gold `#D4AF37`.
- [x] Create TypeScript type definitions (`src/types/index.ts`).
- [x] Create JSON data files (`config.json`, `quiz.json`, `chapters.json`, `journal.json`, `letter.json`).
- [x] Build global `JourneyContext.tsx`.

### Milestone 2: Audio & Atmosphere
- [x] Build `HeadphonesOverlay.tsx`.
- [x] Build `soundEngine.ts` and `useAudio.ts` with cross-fading soundscapes.
- [x] Build `AudioToggle.tsx`.
- [x] Build `FilmGrain.tsx`, `VolumetricFog.tsx`, `FloatingParticles.tsx`.

### Milestone 3: Memory Boot & ECU Verification
- [x] Build `BootScene.tsx` (Terminal text, memory counts, asset preloader 0-100%).
- [x] Build `VerificationScene.tsx` (Duke 390 ECU dashboard, 5 MCQs, playful error logs, hints, achievements).

### Milestone 4: Ignition & Winding Road Progress Bar
- [x] Build `IgnitionScene.tsx` (START ENGINE button, engine rev, screen shake, headlight glow).
- [x] Build `JourneyProgressBar.tsx` (SVG road path, leaning Duke 390, plane morph).

### Milestone 5: Chapters 1, 2, 3 Narrative
- [x] Build `ChapterOne.tsx` (Mountain to city roads, Kochi Airport departures, helmet removal).
- [x] Build `ChapterTwo.tsx` (Runway takeoff, flight to Udaipur, film-scratch memory cards).
- [x] Build `ChapterThree.tsx` (Long-distance calls, traditions, inside jokes).

### Milestone 6: Passport Journal & Final Reveal
- [x] Build `PassportJournal.tsx` (3D leather passport, stamps, boarding passes, notes).
- [x] Build `FinalRevealScene.tsx` (Helmets resting, plane sky, 1 ride → 6 Sept 2023–2026 reveal).

### Milestone 7: Secret Letter
- [x] Build `SecretLetterScene.tsx` (Airport departure board, wax seal breaking, unfolding paper letter, piano music).

---

## Current Status
- **Current Status**: Implemented Dynamic Extra Memory Pages with Image & Video Upload Support.
- **Current Task**: Build & dynamic extra page feature verified cleanly.
- **Completed Tasks**: 
  - Removed quick upload buttons from default spreads and Lightbox modal, keeping default album spreads clean and authentic.
  - Added **"+ Add Extra Memory Page 📷"** button on the final spread and bottom navigation controls.
  - Dynamically appends extra spreads allowing users to upload **Images OR Videos** (`.mp4`, `.webm`, `.mov`, `.jpg`, `.png`).
  - Integrated HTML5 video player (`<video controls />`) for video media uploads and lightbox image viewer for photos.
  - Included editable handwritten captions & notes and page deletion (`Trash2`).
  - Saved all dynamic extra pages in `localStorage` (`album_extra_pages`).
  - Verified `tsc && vite build` passes cleanly.
- **Recently Completed Work**: Built full React Vite application with Web Audio API sound engine, leather passport journal, secret letter, college drone reel, squad photo/video gallery, and automated GitHub Pages workflow.
- **Known Issues**: None.
- **Next Recommended Task**: Deploy project to GitHub repository to trigger automated live site deployment.

---

## Project Logs & File Registry
### Newly Created Files
- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `tsconfig.node.json`
- `tailwind.config.js`
- `postcss.config.js`
- `index.html`
- `src/index.css`
- `src/main.tsx`
- `src/App.tsx`
- `src/types/index.ts`
- `src/context/JourneyContext.tsx`
- `src/utils/soundEngine.ts`
- `src/hooks/useAudio.ts`
- `src/data/config.json`
- `src/data/quiz.json`
- `src/data/chapters.json`
- `src/data/journal.json`
- `src/data/letter.json`
- `src/components/audio/HeadphonesOverlay.tsx`
- `src/components/audio/AudioToggle.tsx`
- `src/components/cinematic/FilmGrain.tsx`
- `src/components/cinematic/VolumetricFog.tsx`
- `src/components/cinematic/FloatingParticles.tsx`
- `src/components/scenes/BootScene.tsx`
- `src/components/scenes/VerificationScene.tsx`
- `src/components/scenes/IgnitionScene.tsx`
- `src/components/journey/JourneyProgressBar.tsx`
- `src/components/scenes/ChapterOne.tsx`
- `src/components/scenes/ChapterTwo.tsx`
- `src/components/scenes/ChapterThree.tsx`
- `src/components/passport/PassportJournal.tsx`
- `src/components/scenes/FinalRevealScene.tsx`
- `src/components/scenes/SecretLetterScene.tsx`
- `src/data/album.json`
- `src/components/album/ScrapbookAlbum.tsx`
- `.github/workflows/deploy.yml`
- `PROJECT_TRACKER.md`
