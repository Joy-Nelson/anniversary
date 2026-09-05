export interface AppConfig {
  couple: {
    partner1: string;
    partner2: string;
    startDate: string; // e.g. "2023-09-06"
    revealDate: string; // e.g. "2026-09-06"
    yearsTag: string; // e.g. "Three Years. One Extraordinary Journey."
  };
  audio: {
    enableHeadphonesPrompt: boolean;
    defaultVolume: number;
  };
  stats: {
    ridesCount: number;
    teaStopsCount: number;
    flightsCount: number;
    motorcyclesCount: number;
    daysCount: number;
  };
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  playfulResponse: string;
  ecuLog?: string;
}

export interface QuizQuestion {
  id: string;
  title: string;
  prompt: string;
  options: QuizOption[];
  hint: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAtAttempts?: number;
}

export interface QuizData {
  title: string;
  subtitle: string;
  questions: QuizQuestion[];
  achievements: Achievement[];
}

export interface ChapterScene {
  id: string;
  title: string;
  subtitle: string;
  content: string[];
  location?: string;
  audioKey?: string;
  image?: string;
}

export interface Chapter {
  id: string;
  number: string; // "Chapter One", "Chapter Two", "Chapter Three"
  title: string;
  subtitle: string;
  scenes: ChapterScene[];
}

export interface ChaptersData {
  chapters: Chapter[];
}

export interface PassportStamp {
  id: string;
  location: string;
  date: string;
  icon: string;
}

export interface BoardingPassItem {
  id: string;
  passengerName: string;
  from: string;
  to: string;
  flightNo: string;
  date: string;
  seat: string;
  gate: string;
}

export interface MemoryCardItem {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  audioKey?: string;
  isDetour?: boolean;
}

export interface JournalData {
  passportNumber: string;
  passengerName: string;
  stamps: PassportStamp[];
  boardingPasses: BoardingPassItem[];
  memories: MemoryCardItem[];
}

export interface LetterData {
  departureBoard: {
    title: string;
    destination: string;
    gate: string;
    status: string;
  };
  letterText: string[];
  closingLine: string;
  signature: string;
}

export interface JourneyState {
  audioUnlocked: boolean;
  soundMuted: boolean;
  volume: number;
  bootCompleted: boolean;
  ecuVerified: boolean;
  engineStarted: boolean;
  currentChapterId: string;
  scrollProgress: number; // 0 to 1
  wrongAttemptsCount: number;
  unlockedAchievements: string[];
  unlockedMemories: string[];
  activeModal: string | null;
}
